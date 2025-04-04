import{_ as o,c as t,d as a,o as r}from"./app-9PoGKJ3k.js";const n={};function p(i,e){return r(),t("div",null,e[0]||(e[0]=[a('<p>MySQL 主要是通过：<strong>锁、Redo Log 、Undo Log、MVCC</strong> 来实现事务。</p><p>MySQL 利用<strong>锁</strong>（行锁、间隙锁等等）机制，使用数据并发修改的控制，满足事务的隔离性。</p><p><strong>Redo Log（重做日志）</strong>，它会记录事务对数据库的所有修改，当 MySQL 发生宕机或崩溃时，通过重放 redolog 就可以恢复数据，用来满足事务的持久性。</p><p><strong>Undo Log（回滚日志）</strong>，它会记录事务的反向操作，简单地说就是保存数据的历史版本，用于事务的回滚，使得事务执行失败之后可以恢复之前的样子。实现原子性和隔离性</p><p><strong>MVCC（多版本并发控制）</strong>，满足了非锁定读的需求，提高了并发度，实现了读已提交和可重复读两种隔离级别，实现了事务的隔离性。</p><h2 id="扩展知识" tabindex="-1"><a class="header-anchor" href="#扩展知识"><span>扩展知识</span></a></h2><h3 id="binlog、redo-log-和-undo-log" tabindex="-1"><a class="header-anchor" href="#binlog、redo-log-和-undo-log"><span>binlog、redo log 和 undo log</span></a></h3><ul><li><a href="https://www.mianshiya.com/question/1772575207802904578" target="_blank" rel="noopener noreferrer">106. MySQL 中的日志类型有哪些？binlog、redo log 和 undo log 的作用和区别是什么？</a></li><li><a href="https://www.mianshiya.com/question/1805421201916108802" target="_blank" rel="noopener noreferrer">1534.什么是 Write-Ahead Logging (WAL) 技术？它的优点是什么？MySQL 中是否用到了 WAL？</a></li></ul><h3 id="mysql-锁" tabindex="-1"><a class="header-anchor" href="#mysql-锁"><span>MySQL 锁</span></a></h3><p><a href="https://www.mianshiya.com/question/1780933295500980225" target="_blank" rel="noopener noreferrer">609.MySQL 中有哪些锁类型？</a></p><h3 id="log-buffer" tabindex="-1"><a class="header-anchor" href="#log-buffer"><span>Log buffer</span></a></h3><p><a href="https://www.mianshiya.com/question/1780933295563894785" target="_blank" rel="noopener noreferrer">628. MySQL 中的 Log Buffer 是什么？它有什么作用？</a></p><h3 id="undo-log-和-mvcc" tabindex="-1"><a class="header-anchor" href="#undo-log-和-mvcc"><span>Undo Log 和 MVCC</span></a></h3><p><a href="https://www.mianshiya.com/question/1780933295484203009" target="_blank" rel="noopener noreferrer">604.MySQL 中的 MVCC 是什么？</a></p>',14)]))}const l=o(n,[["render",p]]),d=JSON.parse(`{"path":"/interview/m68sohh7/","title":"MySQL 是如何实现事务的？","lang":"zh-CN","frontmatter":{"title":"MySQL 是如何实现事务的？","createTime":"2025/04/04 04:13:07","permalink":"/interview/m68sohh7/","description":"MySQL 主要是通过：锁、Redo Log 、Undo Log、MVCC 来实现事务。 MySQL 利用锁（行锁、间隙锁等等）机制，使用数据并发修改的控制，满足事务的隔离性。 Redo Log（重做日志），它会记录事务对数据库的所有修改，当 MySQL 发生宕机或崩溃时，通过重放 redolog 就可以恢复数据，用来满足事务的持久性。 Undo Lo...","head":[["meta",{"property":"og:url","content":"https://www.dopplerxd.top/interview/m68sohh7/"}],["meta",{"property":"og:site_name","content":"Doppler's Site"}],["meta",{"property":"og:title","content":"MySQL 是如何实现事务的？"}],["meta",{"property":"og:description","content":"MySQL 主要是通过：锁、Redo Log 、Undo Log、MVCC 来实现事务。 MySQL 利用锁（行锁、间隙锁等等）机制，使用数据并发修改的控制，满足事务的隔离性。 Redo Log（重做日志），它会记录事务对数据库的所有修改，当 MySQL 发生宕机或崩溃时，通过重放 redolog 就可以恢复数据，用来满足事务的持久性。 Undo Lo..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-03-27T02:51:17.000Z"}],["meta",{"property":"article:modified_time","content":"2025-03-27T02:51:17.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"MySQL 是如何实现事务的？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-03-27T02:51:17.000Z\\",\\"author\\":[]}"]]},"headers":[],"readingTime":{"minutes":1.15,"words":346},"git":{"updatedTime":1743043877000,"contributors":[{"name":"DopplerXD","username":"DopplerXD","email":"1509209607@qq.com","commits":3,"avatar":"https://avatars.githubusercontent.com/DopplerXD?v=4","url":"https://github.com/DopplerXD"}],"changelog":[{"hash":"2fb7a4ef1bef05304a13262a49bde9d9f5c91ba6","date":1742911356000,"email":"1509209607@qq.com","author":"DopplerXD","message":"vault backup: 2025-03-25 22:02:35 面试题整理","commitUrl":"https://github.com/DopplerXD/DopplerXD.github.io/commit/2fb7a4ef1bef05304a13262a49bde9d9f5c91ba6"},{"hash":"9d46b438030408609c52952cc8d2011a86fdf5bd","date":1742958355000,"email":"1509209607@qq.com","author":"DopplerXD","message":"修复notes配置","commitUrl":"https://github.com/DopplerXD/DopplerXD.github.io/commit/9d46b438030408609c52952cc8d2011a86fdf5bd"},{"hash":"3e4a553f852c9332ea4768b3802355e21a09426d","date":1743043877000,"email":"1509209607@qq.com","author":"DopplerXD","message":"重构leetcode-problems和interview-questions路径","commitUrl":"https://github.com/DopplerXD/DopplerXD.github.io/commit/3e4a553f852c9332ea4768b3802355e21a09426d"}]},"autoDesc":true,"filePathRelative":"notes/interview/questions-develop/MySQL 是如何实现事务的？.md"}`);export{l as comp,d as data};
