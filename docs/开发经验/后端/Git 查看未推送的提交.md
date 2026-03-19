## git log

可以使用 `git log` + `origin/branch_name` 来比较本地分支与远程分支的差异，如：

```bash
git log origon/develop..develop
```

该命令会显示本地 `develop` 分支相对于远程 `develop` 分支尚未推送的提交。

## git cherry

可使用 `git cherry` 来查看尚未推送的提交，该命令会显示本地分支相对于远程分支上未能在远程仓库中找到的提交，如：

```bash
git cherry -v origin/develop
```

`-v` 选项用来显示每个提交的差异信息。

## 使用 Github Desktop 等图形化工具

通过图形化工具提供的可视化界面，可以方便查看提交/推送状态。