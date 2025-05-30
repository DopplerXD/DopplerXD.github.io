最近想让 AI 读取仓库里的提交记录，帮我分析整理业务流程和代码实现。但是有时候仓库是私有的不能公开，所以就想能不能导出两次提交的 diff 文件，让 AI 读 diff 来生成文档。

## 导出临近两个提交的 diff

可以使用 `git log` 查看提交记录，然后通过以下格式导出两次提交之间的 diff：

```git
git diff [old commit id] [new commit id] >> [导出的文件名称]
```

这样，将会保存两次提交的 diff 到指定文件。

## 导出本地修改的 diff

本地修改了文件，还没有进行 `git add`，可以通过以下方式导出：

```git
git diff [修改的文件或文件夹] >> [导出的文件名称]
```