面对老旧大型项目，修 bug 时怎么让 AI 保证代码编写符合项目原有设计规范。
如何避免会降低每次新开会话时，通读一遍代码库带来的成本开销？
这些 AI Coding 技巧可以在哪学？

面对老旧大型项目，关键是把**项目约束沉淀成可复用上下文**，来避免每次都重新理解整个代码库，然后再让 AI 只读当前改动真正相关的那部分代码。

### 怎么让 AI 修 Bug 时符合原有设计规范

最有效的是给仓库加一层**持久化工程说明**，把“隐性规范”显式化。不同 Agent 工具对应的文件名不同：

- Codex：`AGENTS.md`
- Claude Code：`CLAUDE.md`
- GitHub Copilot：`.github/copilot-instructions.md`

这些文件会在任务开始时作为项目级上下文加载，用来告诉 AI 仓库结构、编码规范、构建测试方式、哪些目录不能动、已有设计模式等。官方称这类机制为 [repository-level persistent instructions - OpenAI Developers](https://developers.openai.com/codex/agent-configuration/agents-md?utm_source=chatgpt.com "Custom instructions with AGENTS. md | ChatGPT Learn"))。

老项目里建议至少写这些：

```text
项目分层：
controller -> application -> domain -> repository

约束：
- 不允许 controller 直接调用 mapper
- 所有数据库修改必须走 XxxService
- DTO/DO/VO 不允许混用
- 新增异常必须继承 BizException
- 不允许引入新的 ORM 框架
- 修改 SQL 后必须补对应 Mapper 测试

参考实现：
- 新增订单逻辑参考 OrderCreateService
- 分布式锁参考 InventoryLockService
- MQ 消费参考 PaymentConsumer
```

一个非常实用的提示词模式是：

> “先不要写代码。先找 2～3 个项目中和这个 Bug 最相似的现有实现，总结它们共同遵守的设计模式，再按同样模式修改。”

这样 AI 会**以仓库现有代码为规范来源**，而不是拿互联网最佳实践硬套老项目。

另外，尽量要求 AI 做**最小改动**，以降低对原有代码的影响：

```text
不要重构无关代码
不要升级依赖
不要改公共接口，除非确实必要
优先复用现有工具类和设计模式
修改后运行已有测试
```

### 怎么避免每个新会话都通读代码库

核心是做**分层上下文，而不是全量上下文**。

可以设计成：

```text
仓库级
AGENTS.md
│
├── 系统架构
├── 构建方式
├── 全局规范
└── 模块索引

模块级
order/AGENTS.md
payment/AGENTS.md
inventory/AGENTS.md

任务级
只检索本次 Bug 相关类和调用链
```

Codex 官方就支持这种层级化 `AGENTS.md`，项目级规则可以和目录级规则叠加；Copilot 也支持 repository-wide 和 path-specific instructions。

例如：

```text
AGENTS.md
  ↓
订单模块看 docs/order-architecture.md
支付模块看 docs/payment.md
缓存规范看 docs/cache.md
```

这样 AI 不需要每次扫描 50 万行代码，而是先读一份几 KB 的“地图”，然后针对当前任务做局部搜索。

也可以把经常重复的操作做成 **Skill**：

```text
fix-spring-bug
add-rest-api
modify-database-schema
add-mq-consumer
```

长期看，一个成熟方案会变成：

```text
                  AGENTS.md
                     ↓
              项目长期约束
                     ↓
Bug描述 → Code Search / RAG → 找相关模块
                     ↓
              读取局部调用链
                     ↓
             找类似历史实现
                     ↓
                  修改代码
                     ↓
          编译 + 测试 + 静态检查
                     ↓
                Diff Review
```

### 这些 AI Coding 技巧去哪学

- **OpenAI Codex 文档**：重点看 `AGENTS.md`、Skills、Best Practices、Exec Plans。官方明确建议把 `AGENTS.md` 当作给 Agent 的 repository README，并强调保持简洁、记录 repo layout、测试与工作方式。([OpenAI Developers](https://developers.openai.com/codex/learn/best-practices?utm_source=chatgpt.com "Best practices | ChatGPT Learn - OpenAI Developers"))
- **Claude Code 文档**：重点看 `CLAUDE.md`、Memory、Skills。它的项目级持久上下文和自动记忆机制特别适合研究“大仓库怎么减少重复理解成本”。([Claude Platform Docs](https://docs.anthropic.com/en/docs/claude-code/memory?utm_source=chatgpt.com "How Claude remembers your project - Claude Code Docs"))
- **GitHub Copilot 文档**：重点看 repository custom instructions、path-specific instructions、custom agents、code review customization。([GitHub Docs](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-copilot-overview?utm_source=chatgpt.com "Customize Copilot for your project"))
