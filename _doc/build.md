# 本地开发与构建

本博客用 Grunt 编译主题样式和脚本，再用 Jekyll 生成页面。下面的说明供修改主题、维护依赖时使用；图片维护见 [images.md](images.md)。

## 安装与预览

需要 Node.js 20 或更高版本，以及 Ruby 和 Bundler。在仓库根目录执行：

```sh
bundle install
npm ci
npm run build
npm start
```

开发时可在另一个终端运行 `npm run watch`，自动编译 `less/` 和 `js/hux-blog.js` 的改动。

## 生成与提交

```sh
npm run build
bundle exec jekyll build --safe
```

`npm run build` 同步 jQuery，编译并压缩主题 CSS/JS。Jekyll 生成的完整网站位于 `_site/`。安全模式通过配置中的允许列表加载 GitHub Pages 支持的分页插件 `jekyll-paginate`。

GitHub Pages 直接构建仓库中的 Jekyll 源码，不执行 npm 构建。因此修改主题后，需要一并提交更新的 `css/hux-blog.css`、`css/hux-blog.min.css` 和 `js/hux-blog.min.js`。升级 jQuery 时也要更新 `js/jquery.js` 和 `js/jquery.min.js`。`_site/`、`node_modules/` 和本地测试报告无需提交。

## 检查

先完成上述构建，再安装测试浏览器并执行检查：

```sh
npx playwright install chromium
npm test
npm audit
```

`npm test` 依次检查站内链接和锚点、运行单元测试，再用浏览器检查搜索、手机布局、主题切换和离线访问等功能。也可分别运行 `npm run check:site`、`npm run test:unit`、`npm run test:browser`。

测试默认读取 `_site/`；其他构建目录可通过 `BLOG_SITE_DIR` 指定。已有 Microsoft Edge 时，可在 PowerShell 中使用：

```powershell
$env:BLOG_BROWSER_CHANNEL = 'msedge'
npm run test:browser
```

## 持续集成

`.github/workflows/ci.yml` 在推送到 `master` 和提交 Pull Request 时运行：

- `test`：按提交的 `Gemfile.lock` 安装依赖，执行 npm 构建、Jekyll 安全模式构建、完整测试和 `npm audit`。
- `pages-parity`：用 GitHub Pages 同款 `github-pages` 依赖集独立构建，并运行站内链接检查，提前发现本地与线上构建环境的差异。

`Gemfile.lock` 同时包含 Windows、Linux 和通用 Ruby 平台，供本地与 CI 复现依赖版本；新增或升级 gem 后应重新生成并提交。

Windows 本地直接安装 `github-pages` 依赖集可能因 OpenSSL 等原生扩展缺少开发库而失败，因此 Pages 环境验证放在 Ubuntu CI 的 `pages-parity` 任务中，不要求每位本地开发者安装两套 gem。

## 依赖维护

更新依赖后，提交 `package.json`、`package-lock.json` 和重新生成的浏览器资源，并检查默认构建及 JS/Less 文件修改能否触发 watch。

jQuery 使用固定版本的官方完整版，构建时从 npm 包原样复制。目录滚动依赖 `animate`，因此不能换成 slim 版。页面布局仍使用 Bootstrap 3.3.2 CSS；导航交互由站点自己的脚本实现，不加载 Bootstrap JS。

`package.json` 对 `globule` 的 `minimatch` 依赖设置了 `^3.1.5` 覆盖，以使用修复版本并保留兼容接口。上游依赖约束更新后，可以移除覆盖并重新验证构建和 watch。

修改离线页面依赖的 CSS/JS 时，还需检查 `sw.js` 的预缓存清单，并递增 `CACHE_VERSION`，使已有读者获得新的离线资源。

## jQuery MIT 许可证

以下内容来自官方 `jquery@4.0.0/LICENSE.txt`；供应商 JS 同时保留原始许可证头。

```text
Copyright OpenJS Foundation and other contributors, https://openjsf.org/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
