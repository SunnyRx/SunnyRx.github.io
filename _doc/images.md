# 图片与动画维护

文章照常使用 Markdown 插图。模板会根据 `_data/image_dimensions.json` 中的尺寸，为图片预留位置，减少加载时的页面跳动；正文第一张图片默认立即加载，后续图片按需加载。

## 新增或替换图片

尺寸维护工具需要 Python 3.10 或更高版本及 Pillow：

```sh
python -m pip install Pillow
```

修改文章或本地图片后，先生成页面，再更新尺寸清单并重新构建：

```sh
bundle exec jekyll build
python scripts/image_metadata.py --site _site
bundle exec jekyll build
python scripts/image_metadata.py --site _site --check
```

第一次使用新外链图片，或外链图片的尺寸发生变化时，在更新命令中加上 `--fetch-remote`。默认模式只读取本地图片和已有外链尺寸，不联网。

将更新后的 `_data/image_dimensions.json` 与文章、图片一起提交。GitHub Pages 构建直接读取这份清单，不需要安装 Python 或在线查询图片。

工具报告 `missing` 时应先修正缺失文件或无法读取的图片；出错时不会覆盖清单。`--check` 只检查，发现缺失或需要更新的尺寸会返回失败。尺寸按实际图片 URL 记录，外链 URL 保持原样。

## 模板行为

`post`、`page` 布局和 RSS 已接入 `_includes/responsive-images.html`。新增正文布局时，在输出已渲染内容的位置使用：

```liquid
{% include responsive-images.html content=content %}
```

模板处理标准小写 `<img>` 标签，保留原有 URL、替代文字和已设置的属性。手写标签如需自定义尺寸，应同时填写 `width` 和 `height`；设为 0 的隐藏图片保持不变。已有 `loading` 设置优先，也可传 `first_eager=false` 让正文首图使用按需加载。

图片通过尺寸属性预留比例，并由 CSS 随屏幕缩放。代码示例应放在 Markdown 代码块中，避免正文模板将未转义的 `<img>` 示例当作实际图片。

## 用视频展示动画

较大的 GIF 可转换为无声 MP4，搭配静态封面，并保留原 GIF 链接。文章中使用：

```liquid
{% include animation.html src="/img/in-post/post-FOM/03.mp4" poster="/img/in-post/post-FOM/03.webp" gif="/img/in-post/post-FOM/03.gif" width="630" height="474" alt="《回忆碎片》实际游戏画面" %}
```

读者点击后才加载和播放视频，可以暂停或循环播放。视频通过 `css/media.css` 适配屏幕；不支持视频的客户端和 RSS 阅读器可以使用封面或普通 GIF 链接。

转换时应保持原画幅、帧序列和播放节奏。`03.mp4` 为 96 帧、6.9 秒；原图高 473 像素，通过复制底行补到 474 像素，以适配 H.264 编码。对应命令为：

```sh
ffmpeg -i img/in-post/post-FOM/03.gif -vf "pad=630:474:0:0,fillborders=bottom=1:mode=smear" -c:v libx264 -preset slow -crf 23 -bf 0 -pix_fmt yuv420p -fps_mode vfr -video_track_timescale 1000 -movflags +faststart -an img/in-post/post-FOM/03.mp4
```

同目录的 `08.gif` 尾部存在解码错误，取得完整素材前继续使用原文件。原始 GIF 也用于兼容已有文章和外部链接，应保留。
