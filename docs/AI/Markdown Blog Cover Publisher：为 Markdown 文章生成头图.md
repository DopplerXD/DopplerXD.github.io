![Markdown Blog Cover Publisher 简介 cover](assets/Markdown-Blog-Cover-Publisher-简介-cover.png)

[Markdown Blog Cover Publisher](https://github.com/DopplerXD/markdown-blog-cover-publisher) 是一个面向本地静态博客的 Markdown 文章封面工作流工具。它会从新文章的标题、摘要、章节和技术关键词中提炼视觉主题，再为文章生成一张适合博客首页和缩略图展示的头图。

## 它解决什么问题

写完文章后，封面通常还需要单独构思、生成、保存和插入。这个工具把这些步骤串成一个可复用流程，同时保留人工确认环节，避免未经检查的图片直接进入博客仓库。

## 工作流程

1. 扫描 Git 仓库中的新增 Markdown 文件，并跳过已有封面的文章；
2. 读取文章的标题、摘要和结构，生成与主题相关的封面提示词；
3. 在仓库外生成候选图片，等待人工选择保存、重绘或取消；
4. 将获批图片复制到文章约定的 `assets/` 目录，并插入相对路径；
5. 检查图片引用、文件路径和 Markdown 差异；
6. 只有在明确要求发布时，才提交并推送 Git 变更。

## 使用方式

可以直接运行独立脚本，也可以把它作为 Codex 技能使用：

```bash
python3 blog_cover_workflow.py
```

长文章会先被压缩为有限长度的视觉摘要，图片模型不会直接接收整篇正文。工具也不会默认覆盖已有封面、修改无关文件或强制推送，适合在写作和发布之间增加一个可检查的封面制作环节。

支持自定义生图模型与文字理解模型。
