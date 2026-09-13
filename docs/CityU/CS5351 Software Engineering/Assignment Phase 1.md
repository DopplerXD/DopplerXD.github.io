# Assignment Phase 1: Agent Generation

## 1. 作业定位

Assignment 由 Phase 1 和 Phase 2 组成，共占课程作业成绩的 20%：

- Phase 1：10%；
- Phase 2：10%；
- Phase 1 在第 6 周截止，课程安排中的具体截止日期为 2026 年 10 月 7 日。

课程评估以 OpenCode 作为 AI coding agent。讲义特别提醒，使用其他 harness agent 可能得到不同的结果，并可能影响成绩。

## 2. Phase 1 任务

基于课程提供的 `demo.py`，改进一个用于 code-fix benchmark 的 Python repair agent。该 agent 是单个 `.py` 文件，负责调用模型、生成修复、运行测试并完成修复流程。

讲义描述的初始结构是一个 tool-calling loop，并包含独立的 fixer sub-agent：

```text
router: generate_fix -> run_test -> finalize
```

`demo_responses.py` 是 `demo.py` 的 Responses API 版本。Phase 1 的核心工作是理解给定 agent，使用 OpenCode 监督和改进它，使其在 benchmark 上满足功能和非功能目标。

## 3. 评估目标

- 课程会提供 benchmark result 作为比较基准；
- 达到 benchmark result：A；
- 超过 benchmark result：A+；
- 在不同程度上未达到目标：成绩范围为 F 至 A-；
- 目标是最多出现 2 次 failed fix；
- agent 应具备达到 100% pass rate 的能力，讲义中的教师版本达到了 100% pass rate。

这里的 `Pass` 由已有 harness 定义，不能通过修改测试语义来改变判定方式。

## 4. Phase 1 提交物

| 提交物 | 要求 |
| --- | --- |
| Agent source code | 单个 `.py` 文件 |
| Markdown report | Phase 1 报告，最多 3000 字 |
| Session transcript summary | 最多 1000 字，包含运行 agent 时的 session transcript 摘要、输出，以及与 benchmark result 的比较 |

课程安排中的 Phase 1 提交项目包括 Program、Markdown Report 和 Summary of Session Transcript，均在 2026 年 10 月 7 日 23:59 前提交。

## 5. 必须保持的接口和行为

### Harness

- `HumanEvalFix()` 必须保持可用；
- `_run_test()` 必须保持可用；
- 现有 harness 必须按原样工作；
- 不能改变测试语义，`Pass` 仍然由已有 harness 定义。

### 文件和统计逻辑

- 不要修改统计计算；
- 不要修改对 `./HumanEvalFix` 的目录访问；
- 输出结果应能继续与 benchmark result 进行比较。

## 6. 明确禁止的做法

- 不得为特定 benchmark entry 硬编码答案；
- 不得引入 OpenAI client 之外的额外 framework；
- agent 的新代码中不得加入用于检查、验证、确认或测试待修复代码的代码行；
- 不得加入用于检查或测试 buggy code 的测试代码；
- 不得调用 MCP。

允许重构 agent loop，也允许自由增加 agent 的组件，但必须遵守上述 harness、目录、统计和测试约束。

## 7. 建议的工作流程

### 第一步：理解给定 agent

先阅读 `demo.py`，确认 router 如何在 `generate_fix`、`run_test` 和 `finalize` 之间切换，理解独立 fixer sub-agent 的职责，以及 `HumanEvalFix()` 和 `_run_test()` 如何定义一次修复是否通过。

### 第二步：使用 OpenCode 进行改进

通过 OpenCode 修改单个 agent 文件。每次修改都应关注：

- 修复是否能够被现有 harness 正确判定；
- agent 是否仍能处理不同的 benchmark entries；
- 是否引入了重复尝试、脏修复或新的 bug；
- 是否保持原有统计计算和 `./HumanEvalFix` 访问方式。

### 第三步：运行并比较结果

运行 agent 后记录：

- pass / fail 结果；
- failed fix 的数量；
- agent 输出和最终修复结果；
- 与 benchmark result 的差异。

Session transcript summary 应从这些运行记录中整理，而不是只描述最终代码。

### 第四步：检查提交边界

提交前确认：

- agent 仍是单个 `.py` 文件；
- 没有硬编码特定答案；
- 没有新增禁止的测试、验证或 MCP 调用；
- `HumanEvalFix()` 和 `_run_test()` 未被破坏；
- Markdown report 不超过 3000 字；
- transcript summary 不超过 1000 字；
- 报告中的结果与实际运行输出一致。

## 8. 与 Phase 2 的衔接

讲义指出，在持续修改 `.py` 文件的过程中，AI agent 可能遗忘部分内容、引入 dirty fixes（technical debts）和新的 bug。因此，应保留这些问题的发现、修正和预防记录。Phase 2 报告要求回顾这段过程，并从 correctness、turnaround time、success rate、token consumption 及其权衡等方面进行说明。

## 9. 一页检查清单

- [ ] 使用给定的 `demo.py` 或对应的 `demo_responses.py` 版本
- [ ] agent 为单个 `.py` 文件
- [ ] 目标为最多 2 次 failed fix，并具备达到 100% pass rate 的能力
- [ ] 保留 `HumanEvalFix()` 和 `_run_test()` 的原有行为
- [ ] 不改变测试语义、统计计算和 `./HumanEvalFix` 目录访问
- [ ] 不硬编码特定 benchmark entry 的答案
- [ ] 不引入额外 framework
- [ ] 不在 agent 中加入检查、验证或测试待修复代码的代码
- [ ] 不调用 MCP
- [ ] 提交不超过 3000 字的 Markdown report
- [ ] 提交不超过 1000 字的 session transcript summary
- [ ] 将实际输出与 benchmark result 进行比较
