MySQL 主要是通过：**锁、Redo Log 、Undo Log、MVCC** 来实现事务。

MySQL 利用**锁**（行锁、间隙锁等等）机制，使用数据并发修改的控制，满足事务的隔离性。

**Redo Log（重做日志）**，它会记录事务对数据库的所有修改，当 MySQL 发生宕机或崩溃时，通过重放 redolog 就可以恢复数据，用来满足事务的持久性。

**Undo Log（回滚日志）**，它会记录事务的反向操作，简单地说就是保存数据的历史版本，用于事务的回滚，使得事务执行失败之后可以恢复之前的样子。实现原子性和隔离性

**MVCC（多版本并发控制）**，满足了非锁定读的需求，提高了并发度，实现了读已提交和可重复读两种隔离级别，实现了事务的隔离性。

## 扩展知识

### binlog、redo log 和 undo log

- [106. MySQL 中的日志类型有哪些？binlog、redo log 和 undo log 的作用和区别是什么？](https://www.mianshiya.com/question/1772575207802904578)
- [1534.什么是 Write-Ahead Logging (WAL) 技术？它的优点是什么？MySQL 中是否用到了 WAL？](https://www.mianshiya.com/question/1805421201916108802)

### MySQL 锁

[609.MySQL 中有哪些锁类型？](https://www.mianshiya.com/question/1780933295500980225)

### Log buffer

[628. MySQL 中的 Log Buffer 是什么？它有什么作用？](https://www.mianshiya.com/question/1780933295563894785)

### Undo Log 和 MVCC

[604.MySQL 中的 MVCC 是什么？](https://www.mianshiya.com/question/1780933295484203009)