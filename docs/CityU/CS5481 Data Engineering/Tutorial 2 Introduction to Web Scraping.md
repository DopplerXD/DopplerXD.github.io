# Tutorial 2：网页抓取入门

本教程介绍 HTML 的基本结构，并用 `requests` 获取网页、用 BeautifulSoup 解析内容。单页抓取关注抽取字段；网页爬取则沿页面链接访问多页，更多访问规则见 [Lecture 2：数据获取](Lecture%202%20Data%20Acquisition.md)。

## 准备环境

安装 Python 库：

```bash
pip install requests beautifulsoup4
```

## 1. HTML 基础

超文本标记语言（HyperText Markup Language，HTML）用标签组织网页内容。标签可有属性，例如链接的 `href` 和元素的 `class`、`id`。

```html
<html>
  <head><title>Sample Page</title></head>
  <body>
    <h1>Welcome</h1>
    <p class="summary">A short introduction.</p>
    <a href="https://example.com/about">About</a>
  </body>
</html>
```

常见标签：`<title>` 表示网页标题，`<h1>` 至 `<h6>` 表示标题层级，`<p>` 表示段落，`<a>` 表示链接，`<img>` 表示图片。

## 2. 请求并解析网页

超文本传输协议（Hypertext Transfer Protocol，HTTP）请求网页，响应正文常包含 HTML。BeautifulSoup 将 HTML 解析成可查询的树形结构。

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com/"
headers = {"User-Agent": "CS5481Tutorial/1.0 (contact: student@example.com)"}

response = requests.get(url, headers=headers, timeout=15)
response.raise_for_status()

soup = BeautifulSoup(response.text, "html.parser")
print(soup.title.get_text(strip=True) if soup.title else "No title")
```

`raise_for_status()` 会在 HTTP 错误状态时抛出异常；`timeout` 避免请求无限等待。若网页编码显示异常，可根据响应头检查编码设置。

## 3. 定位和提取元素

BeautifulSoup 提供 `find()`、`find_all()` 以及支持 CSS 选择器的 `select()`、`select_one()`。提取文字时使用 `get_text(" ", strip=True)` 可合并多余空白。

```python
# 按标签查找
for link in soup.find_all("a", href=True):
    print(link.get_text(" ", strip=True), link["href"])

# 按 id 或 class 定位
navigation = soup.find(id="navigation")
summaries = soup.select("p.summary")
```

解析前先用浏览器开发者工具或打印 `soup.prettify()` 查看 HTML 结构，再按实际标签、属性或 CSS 选择器定位。网页结构可能变化，找不到元素时应检查 `None`，不要直接访问其属性。

## 4. 练习：抽取新闻页面

从课程示例新闻页提取标题、来源、编辑和正文段落。

??? question "Solution"
    ```python
    import requests
    from bs4 import BeautifulSoup

    url = "https://english.news.cn/20220904/b1955558af1c4179a355fab10b1ee28f/c.html"
    headers = {"User-Agent": "CS5481Tutorial/1.0 (contact: student@example.com)"}

    response = requests.get(url, headers=headers, timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, "html.parser")

    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    source_tag = soup.select_one("p.source")
    editor_tag = soup.select_one("p.editor")
    article = soup.select_one("#detailContent")

    paragraphs = article.find_all("p") if article else []
    full_text = "\\n".join(p.get_text(" ", strip=True) for p in paragraphs)

    print("Title:", title)
    print("Source:", source_tag.get_text(" ", strip=True) if source_tag else "")
    print("Editor:", editor_tag.get_text(" ", strip=True) if editor_tag else "")
    print("Full text:", full_text)
    ```

## 5. 抓取时的基本约定

- 查看网站服务条款与 `robots.txt`，确认允许访问目标页面。
- 设置清晰的 `User-Agent`，使用超时并控制请求频率。
- 只采集任务所需的数据，避免无界遍历、重复请求或绕过访问控制。
- 网页内容也可能通过 API 提供；若有官方 API，优先使用结构化接口。
