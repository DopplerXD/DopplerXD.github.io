 > by ChatGPT，不保证内容完全准确。
### ✅ 1. 文本样式对比

|功能|Markdown|LaTeX|
|---|---|---|
|加粗|`**加粗**`|`\textbf{加粗}`|
|斜体|`*斜体*`|`\textit{斜体}`|
|下划线|🚫 不支持原生|`\underline{文本}`|
|删除线|`~~删除线~~`|`\sout{删除线}`（需 `ulem` 包）|
|行内代码|`` `code` ``|`\texttt{code}`|
|等宽字体|使用反引号|`\texttt{等宽}`|

---

### ✅ 2. 标题结构

|等级|Markdown|LaTeX（需 `\section{}` 等宏包）|
|---|---|---|
|一级标题|`# 标题1`|`\section{标题1}`|
|二级标题|`## 标题2`|`\subsection{标题2}`|
|三级标题|`### 标题3`|`\subsubsection{标题3}`|

---

### ✅ 3. 列表语法

| 类型   | Markdown     | LaTeX                                         |
| ---- | ------------ | --------------------------------------------- |
| 无序列表 | `-` 或 `*` 开头 | `\begin{itemize} \item ... \end{itemize}`     |
| 有序列表 | `1. 2. 3.`   | `\begin{enumerate} \item ... \end{enumerate}` |

---

### ✅ 4. 表格语法

|Markdown 表格|LaTeX 表格（需 `tabular`）|
|---|---|
|```markdown|列1|

---

### ✅ 5. 数学公式（⚠️ LaTeX 专有）

|功能|Markdown支持|LaTeX 示例|
|---|---|---|
|行内公式|✅ `$x^2$`|`$x^2$`|
|独立公式|✅ `$$x^2$$`|`\[ x^2 \]` 或 `$$x^2$$`|
|上标/下标|✅ `$x^2$, $a_i$`|`$x^2$, $a_i$`|
|分数|✅ `$ \frac{1}{2} $`|`$\frac{1}{2}$`|
|开根号|✅ `$ \sqrt{x} $`|`$\sqrt{x}$`|
|矩阵|🚫 不推荐用 Markdown|`\begin{bmatrix} a & b \\ c & d \end{bmatrix}`|
|求和|✅ `$ \sum_{i=1}^n x_i $`|同左|

---

### ✅ 6. 图片与链接

|类型|Markdown|LaTeX|
|---|---|---|
|图片|`![描述](图片路径)`|`\includegraphics{图片路径}`（需 `graphicx` 包）|
|链接|`[OpenAI](https://openai.com)`|`\href{https://openai.com}{OpenAI}`（需 `hyperref` 包）|

---

### ✅ 7. 引用与脚注

|功能|Markdown|LaTeX|
|---|---|---|
|引用块|`> 引用内容`|`\begin{quote}...\end{quote}`|
|脚注|`文本[^1]` 和 `[^1]: 内容`|`文本\footnote{内容}`|

---

### ✅ 8. 分隔线

|Markdown|LaTeX（用来分节）|
|---|---|
|`---` 或 `***`|`\hrulefill`|

---

## ✅ 总结建议

- Markdown 快速、轻量，适合撰写日常笔记和报告草稿；
- LaTeX 强大、精确，适合撰写正式论文或排版精美的 PDF；
- 如果你写实验报告，**推荐：Markdown + 行内 LaTeX**，兼顾效率与表达力。