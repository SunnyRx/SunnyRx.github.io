#!/usr/bin/env python3
"""Maintain Jekyll's offline image dimensions from actual rendered src attributes.

Requires Pillow. The default mode is offline and reuses checked-in remote sizes.
Use --fetch-remote only when explicitly refreshing external image metadata.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
from html import unescape
from html.parser import HTMLParser
from io import BytesIO
import json
from pathlib import Path
import re
import ssl
import sys
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

from PIL import Image


ATTRIBUTE = re.compile(
    r"([^\s=<>/]+)\s*=\s*(?:\"([^\"]*)\"|'([^']*)'|([^\s>]+))"
)


class Images(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.sources = set()

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag != "img" or attrs.get("width") == "0" or attrs.get("height") == "0":
            return
        # Keep the exact serialized src as the Liquid lookup key. HTMLParser's
        # attribute values have already unescaped &amp; and numeric entities.
        for match in ATTRIBUTE.finditer(self.get_starttag_text()):
            if match[1].lower() == "src":
                self.sources.add(next(value for value in match.groups()[1:] if value is not None))
                break


def dimensions(data):
    try:
        with Image.open(BytesIO(data)) as image:
            width, height = image.size
            # HTML natural dimensions follow EXIF orientation.
            if image.getexif().get(274) in (5, 6, 7, 8):
                width, height = height, width
    except Exception as raster_error:
        try:
            svg = ET.fromstring(data)
            if svg.tag.rsplit("}", 1)[-1] != "svg":
                raise ValueError("not an SVG")
            width = float(svg.attrib.get("width", "").removesuffix("px"))
            height = float(svg.attrib.get("height", "").removesuffix("px"))
        except (ET.ParseError, ValueError):
            raise ValueError(f"Cannot read intrinsic image dimensions: {raster_error}") from raster_error
    if width <= 0 or height <= 0 or int(width) != width or int(height) != height:
        raise ValueError(f"Invalid intrinsic dimensions: {width} x {height}")
    return {"width": int(width), "height": int(height)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, default=Path("_site"), help="existing Jekyll build")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--manifest", type=Path, help="default: ROOT/_data/image_dimensions.json")
    parser.add_argument("--output", type=Path, help="write candidate elsewhere for review")
    parser.add_argument("--fetch-remote", action="store_true", help="explicitly allow network reads")
    parser.add_argument("--ca-bundle", type=Path, help="additional trusted CA PEM for remote refresh")
    parser.add_argument("--check", action="store_true", help="verify without writing; fail on changes")
    args = parser.parse_args()
    root, site = args.root.resolve(), args.site.resolve()
    manifest = args.manifest or root / "_data/image_dimensions.json"
    existing = json.loads(manifest.read_text(encoding="utf-8")) if manifest.exists() else {}
    html_files = sorted(site.rglob("*.html"))
    if not html_files:
        parser.error(f"No rendered HTML under {site}; build the site first")
    sources = {}
    for html in html_files:
        doc = Images()
        doc.feed(html.read_text(encoding="utf-8"))
        for source in doc.sources:
            sources.setdefault(source, set()).add(html.relative_to(site).as_posix())

    # Read the site's domain to recognize absolute URLs for local images.
    cname = root / "CNAME"
    local_host = cname.read_text(encoding="utf-8").strip().lower() if cname.exists() else ""
    cached = {unescape(key): value for key, value in existing.items()}
    tls = ssl.create_default_context()
    if args.ca_bundle:
        tls.load_verify_locations(str(args.ca_bundle))

    def measure(item):
        source, pages = item
        url = unescape(source).replace("\\", "/")
        parsed = urlsplit(url)
        remote = bool(parsed.netloc and parsed.netloc.lower() != local_host)
        try:
            if remote:
                if not args.fetch_remote:
                    size = cached.get(url)
                    if not size:
                        raise ValueError("remote dimensions missing; use --fetch-remote once")
                    return source, size, True, None
                request = Request("https:" + url if url.startswith("//") else url,
                                  headers={"User-Agent": "blog-image-metadata/1.0"})
                with urlopen(request, timeout=30, context=tls) as response:
                    data = response.read(25 * 1024 * 1024 + 1)
                if len(data) > 25 * 1024 * 1024:
                    raise ValueError("image exceeds 25 MiB download limit")
                return source, dimensions(data), True, None
            if parsed.scheme and parsed.scheme not in ("http", "https"):
                raise ValueError(f"unsupported image scheme: {parsed.scheme}")
            sizes = []
            for page in sorted(pages):
                resolved = unquote(urlsplit(urljoin("/" + page, url)).path)
                path = (root / resolved.lstrip("/")).resolve()
                if not path.is_relative_to(root):
                    raise ValueError("image path escapes repository")
                size = dimensions(path.read_bytes())
                if size not in sizes:
                    sizes.append(size)
            if len(sizes) != 1:
                raise ValueError("relative src has different dimensions on different pages")
            return source, sizes[0], False, None
        except Exception as error:
            return source, None, remote, str(error)

    with ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(measure, sorted(sources.items())))
    missing = {source: error for source, _, _, error in results if error}
    # Keep previously recorded assets (including the original GIF and URLs
    # outside the latest RSS window); a metadata refresh must not remove them.
    updated = dict(existing)
    updated.update({source: size for source, size, _, error in results if not error})
    changes = [source for source in updated if updated[source] != existing.get(source)]
    report = {
        "html_files": len(html_files), "referenced_sources": len(sources),
        "local_sources": sum(not remote for _, _, remote, _ in results),
        "remote_sources": sum(remote for _, _, remote, _ in results),
        "manifest_entries": len(updated), "changed_entries": len(changes), "missing": missing,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if missing:
        return 1
    if args.check:
        return int(bool(changes))
    output = args.output or manifest
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(updated, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
