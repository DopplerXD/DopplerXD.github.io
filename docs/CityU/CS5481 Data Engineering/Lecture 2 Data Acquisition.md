# Lecture 2：数据获取

## 学习要点

数据获取（data acquisition）是从合适来源收集分析所需数据，并将其导入后续处理系统的过程。选择来源和采集方法时，应先明确问题、所需字段、数据量、时间范围和质量要求。

## 1. 数据来源与格式

| 来源 | 常见形式 | 获取方式 |
| --- | --- | --- |
| 关系型数据库 | 表、视图 | 使用结构化查询语言（Structured Query Language，SQL）筛选、排序和聚合 |
| 文件数据集 | CSV、XLSX、XML、JSON、PDF | 下载后解析；留意编码、分隔符、字段类型和模式 |
| 应用程序接口 | JSON、XML、文本或媒体 | 向指定端点发出请求，处理认证、分页和限流 |
| 数据流与传感器 | 事件、日志、设备读数 | 使用流平台持续接收与处理，例如 Kafka |
| 调查与观察 | 问卷、访谈、观察记录 | 按研究设计收集，并保存来源、时间和方法信息 |

结构化数据（structured data）通常有固定表结构；半结构化数据（semi-structured data）如 JSON、XML 通过标签或键值保留组织关系；非结构化数据（unstructured data）如邮件正文、图片和视频没有统一的行列模式。

常见交换格式包括逗号分隔值（Comma-Separated Values，CSV）、超文本标记语言（HyperText Markup Language，HTML）、可扩展标记语言（Extensible Markup Language，XML）、JavaScript 对象表示法（JavaScript Object Notation，JSON）和便携式文档格式（Portable Document Format，PDF）。

## 2. 网页抓取与爬取

网页抓取（web scraping）从页面中提取指定字段；网页爬取（web crawling）则沿页面链接访问一组页面，常用于索引、归档或为抓取发现目标。通常先获得超文本传输协议（Hypertext Transfer Protocol，HTTP）响应，再解析 HTML 文档对象树并提取所需内容。

### BeautifulSoup 单页抓取

安装依赖：

```bash
pip install requests beautifulsoup4
```

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com/articles"
headers = {"User-Agent": "CourseDataCollector/1.0 (contact: student@example.com)"}

response = requests.get(url, headers=headers, timeout=15)
response.raise_for_status()

soup = BeautifulSoup(response.text, "html.parser")
for card in soup.select("article"):
    title = card.select_one("h2")
    link = card.select_one("a[href]")
    if title and link:
        print({"title": title.get_text(" ", strip=True), "url": link["href"]})
```

`select()` 和 `select_one()` 使用 CSS 选择器定位元素；选择器应根据目标网页的 HTML 结构调整。若内容由浏览器端 JavaScript 动态生成，普通 HTTP 响应可能不包含最终数据，此时先检查网站是否提供 API 或静态数据源。

### 同站点的基础链接爬取

下面的广度优先遍历（breadth-first search，BFS）示例只访问同一主机，检查 `robots.txt`、限制页面数并在请求间隔留出时间。使用前应确认网站条款允许访问。

```python
from collections import deque
from time import sleep
from urllib.parse import urljoin, urldefrag, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

start_url = "https://example.com/"
host = urlparse(start_url).netloc
robots = RobotFileParser(urljoin(start_url, "/robots.txt"))
robots.read()

headers = {"User-Agent": "CourseCrawler/1.0 (contact: student@example.com)"}
session = requests.Session()
queue = deque([start_url])
visited = set()
max_pages = 20

while queue and len(visited) < max_pages:
    url = urldefrag(queue.popleft()).url
    if url in visited or urlparse(url).netloc != host:
        continue
    visited.add(url)
    if not robots.can_fetch(headers["User-Agent"], url):
        continue

    response = session.get(url, headers=headers, timeout=15)
    response.raise_for_status()
    if "text/html" not in response.headers.get("Content-Type", ""):
        continue

    soup = BeautifulSoup(response.text, "html.parser")
    print(url, soup.title.get_text(strip=True) if soup.title else "")
    for anchor in soup.select("a[href]"):
        target = urldefrag(urljoin(url, anchor["href"])).url
        if urlparse(target).netloc == host and target not in visited:
            queue.append(target)
    sleep(1)
```

实际项目还应处理请求失败、重定向、重复 URL、分页、文件类型、并发限制和结果持久化。尊重站点服务条款与访问频率；`robots.txt` 是爬虫访问规则的声明，不等同于数据使用许可。

## 3. 从抓取结果到数据仓库

采集流程可以概括为：

1. 明确问题、字段、目标来源和采集范围；
2. 确定数据量、时间窗口、更新频率与依赖风险；
3. 通过数据库查询、文件解析、API、网页抓取或流式接口获取数据；
4. 记录来源、采集时间、请求参数和数据版本；
5. 将结构化数据写入关系型数据库，将半结构化或非结构化数据放入适合的文件存储或 NoSQL 系统。

网页爬虫应具备健壮性（robustness）和礼貌性（politeness）：遵守明确的访问限制，控制频率，避免重复或无界遍历，并妥善处理错误页面和循环链接。
