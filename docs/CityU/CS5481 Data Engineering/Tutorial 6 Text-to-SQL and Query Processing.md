# Tutorial 6：Text-to-SQL 与查询处理

本教程围绕自然语言到结构化查询语言（Structured Query Language，SQL）的转换（Text-to-SQL）和查询改写，使用 SQLite 执行模型生成的只读查询。示例通过开放人工智能（OpenAI）兼容的应用程序编程接口（application programming interface，API）调用 DeepSeek；模型端点和模型名称可按实际服务调整。

## 1. 环境与 API 密钥

安装依赖：

```bash
pip install openai pandas
```

把 API 密钥放在环境变量中，不要写入 notebook、代码仓库或文档：

```bash
export DEEPSEEK_API_KEY="你的 API 密钥"
```

在 Colab 中可使用 Secrets 管理密钥，避免把密钥写入共享单元格。

```python
import os
import sqlite3

import pandas as pd
from openai import OpenAI

api_key = os.environ.get("DEEPSEEK_API_KEY")
if not api_key:
    raise RuntimeError("请先设置 DEEPSEEK_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.deepseek.com",
)
model = "deepseek-chat"
```

## 2. 准备 SQLite 数据库

创建学生、课程和选课三张表。外键约束表达学生与课程之间的多对多关系，选课表还保存成绩。

```python
conn = sqlite3.connect(":memory:")
conn.execute("PRAGMA foreign_keys = ON")

conn.executescript("""
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    major TEXT NOT NULL
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    department TEXT NOT NULL
);

CREATE TABLE enrollments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade REAL NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
""")

conn.executemany(
    "INSERT INTO students VALUES (?, ?, ?)",
    [
        (1, "Alice", "DS"), (2, "Bob", "CS"),
        (3, "Carol", "DS"), (4, "David", "IS"), (5, "Eva", "CS"),
    ],
)
conn.executemany(
    "INSERT INTO courses VALUES (?, ?, ?)",
    [
        (101, "Database Systems", "CS"),
        (102, "Machine Learning", "CS"),
        (103, "Data Visualization", "DS"),
    ],
)
conn.executemany(
    "INSERT INTO enrollments VALUES (?, ?, ?)",
    [
        (1, 101, 88), (1, 102, 91), (2, 101, 78),
        (2, 103, 84), (3, 102, 95), (3, 103, 89),
        (4, 101, 82), (5, 102, 86),
    ],
)
conn.commit()
```

向模型提供必要的表结构和关系，避免模型猜测字段：

```python
schema = """
students(student_id, name, major)
courses(course_id, course_name, department)
enrollments(student_id, course_id, grade)
Relationships:
- enrollments.student_id references students.student_id
- enrollments.course_id references courses.course_id
"""
```

## 3. 请求模型生成 SQL

提示中明确方言、可用模式、只读限制和返回格式。示例限制为单条 `SELECT`，并要求只返回 SQL。

```python
def ask(prompt, system=None, temperature=0.0, max_tokens=500):
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content or ""


def clean_sql(text):
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    return text.strip().removesuffix(";").strip()


def text_to_sql(question):
    prompt = f"""Generate one SQLite SELECT query for the request below.
Use only the given schema. Do not modify data or database structure.
Return SQL only, without Markdown fences or explanation.

Schema:
{schema}

Request: {question}
"""
    return clean_sql(ask(prompt))
```

## 4. 检查並执行只读查询

下面的检查用于教学演示，不能作为生产环境的安全边界。正则表达式无法可靠解析任意 SQL，尤其是包含 CTE 或注释的语句。生产系统应使用只读数据库账户、数据库级只读模式、SQL 解析器、超时和资源限制。

```python
import re

conn.execute("PRAGMA query_only = ON")


def run_query(sql):
    normalized = sql.strip()
    if not re.match(r"^(SELECT|WITH)\b", normalized, flags=re.IGNORECASE):
        raise ValueError("只允许查询语句")
    if ";" in normalized:
        raise ValueError("每次只允许执行一条 SQL 语句")
    return pd.read_sql_query(normalized, conn)
```

SQLite 的 `query_only` 限制当前连接的写操作；仍应避免将不可信 SQL 用于具备更高权限的数据库连接。

## 5. Text-to-SQL 示例

### 5.1 条件筛选

问题：列出数据科学（DS）专业学生，并按姓名排序。生成的查询应包含 `WHERE` 和 `ORDER BY`。

```python
sql = text_to_sql("List the names of DS students in alphabetical order.")
print(sql)
run_query(sql)
```

也可先手写 SQL 验证预期结果：

```sql
SELECT name
FROM students
WHERE major = 'DS'
ORDER BY name;
```

### 5.2 分组聚合

问题：统计每个专业的学生人数。需要按 `major` 分组，并对学生记录计数。

```sql
SELECT major, COUNT(*) AS student_count
FROM students
GROUP BY major
ORDER BY major;
```

### 5.3 表连接

问题：列出 Alice 选修的课程和成绩。需要连接学生、选课和课程表。

```sql
SELECT c.course_name, e.grade
FROM students AS s
JOIN enrollments AS e ON e.student_id = s.student_id
JOIN courses AS c ON c.course_id = e.course_id
WHERE s.name = 'Alice'
ORDER BY c.course_name;
```

### 5.4 查询改写与语义等价

子查询可以改写为连接。例如，找出选修至少一门课程的学生姓名：

```sql
SELECT name
FROM students
WHERE student_id IN (
    SELECT student_id
    FROM enrollments
);
```

对应的连接写法需要 `DISTINCT`，因为同一学生可能选修多门课程：

```sql
SELECT DISTINCT s.name
FROM students AS s
JOIN enrollments AS e ON e.student_id = s.student_id;
```

可在同一数据库上比较两条查询的结果。查询改写不只要语法有效，还应保持重复值、空值和边界情况上的语义。

```python
query_a = """SELECT name FROM students
WHERE student_id IN (SELECT student_id FROM enrollments)"""
query_b = """SELECT DISTINCT s.name FROM students AS s
JOIN enrollments AS e ON e.student_id = s.student_id"""

result_a = run_query(query_a).sort_values("name").reset_index(drop=True)
result_b = run_query(query_b).sort_values("name").reset_index(drop=True)
assert result_a.equals(result_b)
```

## 6. 练习：按课程计算平均成绩

查询每门课程的平均成绩，只保留平均成绩不低于 85 的课程，结果包含课程名和平均成绩，并按平均成绩从高到低排序。

要求：

1. 写出自然语言问题并调用 `text_to_sql`；
2. 检查模型是否正确连接 `courses` 与 `enrollments`；
3. 使用 `GROUP BY` 和 `HAVING`，不要把分组条件误写为普通 `WHERE`；
4. 对照手写查询，核对数值、别名和排序。

```sql
SELECT c.course_name, AVG(e.grade) AS average_grade
FROM courses AS c
JOIN enrollments AS e ON e.course_id = c.course_id
GROUP BY c.course_id, c.course_name
HAVING AVG(e.grade) >= 85
ORDER BY average_grade DESC;
```

## 7. 小结

Text-to-SQL 的质量依赖准确的模式说明、明确的自然语言问题和执行后的结果检查。对于查询改写，应比较结果语义而不只是 SQL 文本；对于模型生成的查询，应在权限受限的环境中运行，并设置实际的数据库安全和资源边界。
