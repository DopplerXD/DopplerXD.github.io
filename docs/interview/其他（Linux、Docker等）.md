## Linux 用过哪些命令
`ls`（列出目录内容）、`cd`（切换目录）、`mkdir`（创建目录）、`rm`（删除文件或目录）、`cp`（复制文件或目录）、`mv`（移动或重命名文件或目录）；文件内容查看类有 `cat`（查看文件内容）、`more`（分屏查看文件内容）、`less`（与 `more` 类似，但功能更强大）、`grep`（在文件中查找特定字符串）；权限管理类有 `chmod`（修改文件或目录的权限）、`chown`（修改文件或目录的所有者）；系统信息查看类有 `uname`（显示系统信息）、`top`（实时显示系统中各个进程的资源占用情况）、`df`（显示磁盘使用情况）、`du`（显示文件和目录的磁盘使用情况）；网络相关类有 `ping`（测试网络连接）、`ifconfig`（查看和配置网络接口）、`netstat`（显示网络连接、路由表等信息）。

## 如何查看 Linux 某个磁盘容量
可以使用 `df` 命令查看磁盘容量。例如，要查看所有挂载磁盘的使用情况，可执行 `df -h` 命令，其中 `-h` 选项会以人类可读的格式（如 KB、MB、GB）显示磁盘容量信息。若要查看特定挂载点的磁盘使用情况，可在命令后加上挂载点路径，如 `df -h /mnt/data`。

### 如何查看 Linux 中的某个端口号
+ **`netstat` 命令**：可用于查看网络连接和端口监听情况。例如，要查看所有监听的 TCP 端口，可执行 `netstat -tulnp | grep :端口号`，其中 `-t` 表示 TCP 协议，`-u` 表示 UDP 协议，`-l` 表示只显示监听状态的连接，`-n` 表示以数字形式显示地址和端口号，`-p` 表示显示进程信息。
+ **`ss` 命令**：这是一个更高效的网络工具，能替代 `netstat`。例如，查看监听的 TCP 端口，可执行 `ss -tulnp | grep :端口号`。
+ **`lsof` 命令**：用于列出当前系统打开的文件，也能查看端口占用情况。例如，查看占用 8080 端口的进程，可执行 `lsof -i :8080`。

## Docker 相关
Docker 是用于开发、部署和运行应用程序的开源平台，以下是一些常用操作：

+ **镜像操作**：`docker pull` 用于从 Docker Hub 或其他镜像仓库拉取镜像，如 `docker pull nginx`；`docker images` 用于列出本地的镜像；`docker rmi` 用于删除本地镜像，如 `docker rmi nginx`。
+ **容器操作**：`docker run` 用于创建并启动一个新容器，如 `docker run -d -p 80:80 nginx`；`docker ps` 用于列出正在运行的容器，加上 `-a` 选项可列出所有容器；`docker stop` 和 `docker start` 分别用于停止和启动容器；`docker rm` 用于删除容器。
+ **构建镜像**：使用 `Dockerfile` 构建自定义镜像，通过 `docker build` 命令，如 `docker build -t myimage:1.0 .`。

## Linux top、chown、df 等命令
+ **`top` 命令**：实时显示系统中各个进程的资源占用情况，能帮助用户监控系统性能。启动 `top` 命令后，会显示一个动态的界面，包含 CPU、内存、进程等信息。按 `q` 键可退出该界面。
+ **`chown` 命令**：用于修改文件或目录的所有者和所属组。语法为 `chown [所有者][:所属组] 文件或目录`，例如 `chown user1:group1 test.txt` 会将 `test.txt` 文件的所有者改为 `user1`，所属组改为 `group1`。
+ **`df` 命令**：用于显示磁盘使用情况，如前面所述，`df -h` 可查看所有挂载磁盘的使用情况，以人类可读的格式输出。

## Linux 用什么命令修改配置文件
+ **`vi`** 或 **`vim` 编辑器**：这是 Linux 中最常用的文本编辑器，功能强大。例如，要编辑 `/etc/nginx/nginx.conf` 文件，可执行 `vim /etc/nginx/nginx.conf` 命令，进入编辑器后进行修改，按 `i` 键进入插入模式，修改完成后按 `Esc` 键退出插入模式，输入 `:wq` 保存并退出。
+ **`nano` 编辑器**：操作相对简单，适合初学者。例如，`nano /etc/hosts` 可打开 `/etc/hosts` 文件进行编辑，编辑完成后按 `Ctrl + X` 键，再按 `Y` 键确认保存，最后按 `Enter` 键退出。

## 异步任务超时的容错机制
+ **设置超时时间**：在代码中为异步任务设置一个合理的超时时间。例如，使用 Python 的 `asyncio` 库时，可通过 `asyncio.wait_for` 函数为协程设置超时时间。若任务在规定时间内未完成，会抛出 `asyncio.TimeoutError` 异常，可在异常处理中进行容错操作，如重试任务或返回默认值。
+ **重试机制**：当任务超时时，可进行多次重试。可以设置重试次数和重试间隔时间，例如使用指数退避算法，每次重试的间隔时间逐渐增加，以避免频繁重试对系统造成过大压力。
+ **降级处理**：若任务多次重试仍失败，可进行降级处理，如返回缓存数据或默认数据，以保证系统的基本可用性。

## 对字节码的了解
字节码是一种中间表示形式，介于高级编程语言和机器语言之间。在 Java、Python（如 CPython 中的 `.pyc` 文件）等编程语言中，源代码首先会被编译成字节码。以 Java 为例，Java 源代码（`.java` 文件）经过 `javac` 编译器编译后会生成字节码文件（`.class` 文件）。字节码不是直接在硬件上运行的机器码，而是在虚拟机（如 Java 虚拟机 JVM）上运行。虚拟机负责将字节码解释或编译成机器码并执行，这样做的好处是实现了平台无关性，即同一份字节码可以在不同的操作系统和硬件平台上运行，只要安装了相应的虚拟机。

## CPU 飙高的排查过程
+ **使用 `top` 命令**：查看系统中占用 CPU 资源较高的进程，记录下进程的 PID（进程 ID）。
+ **使用 `ps` 命令**：结合 PID 查看进程的详细信息，如 `ps -ef | grep PID`，可了解进程的启动时间、所属用户等。
+ **使用 `strace` 命令**：对进程进行系统调用跟踪，如 `strace -p PID`，可查看进程正在执行的系统调用，分析是否存在异常的系统调用导致 CPU 占用过高。
+ **使用 `gdb` 调试器**：若进程是可调试的，可使用 `gdb` 对其进行调试，查看进程的堆栈信息，找出可能导致 CPU 飙高的代码位置。
+ **检查程序代码**：查看相关程序的代码，分析是否存在死循环、高计算复杂度的算法等问题。

## 遇到 bug 怎么解决
+ **复现 bug**：尽可能详细地记录 bug 出现的环境和操作步骤，尝试复现 bug。只有能够复现的 bug 才能进行有效的排查和修复。
+ **收集信息**：收集相关的日志文件、错误信息、系统状态信息等，这些信息有助于定位问题所在。
+ **分析问题**：根据收集到的信息，分析 bug 可能产生的原因。可以使用调试工具（如 IDE 中的调试器）对代码进行单步调试，查看变量的值和程序的执行流程。
+ **制定解决方案**：根据分析结果，制定相应的解决方案。可以是修改代码、调整配置参数等。
+ **测试验证**：对修复后的代码进行测试，确保 bug 已经被解决，同时要进行回归测试，保证修复没有引入新的问题。

## 公司中的产品部的需求文档写的不清晰怎么处理
+ **主动沟通**：及时与产品部相关人员进行沟通，详细询问需求文档中不清晰的部分，要求他们提供更明确的解释和说明。可以组织面对面的会议或通过线上沟通工具进行交流。
+ **案例和示例**：要求产品部提供相关的案例或示例，以便更好地理解需求。例如，若需求是开发一个新的功能模块，可让他们提供类似功能的产品截图或操作流程。
+ **明确验收标准**：与产品部一起明确需求的验收标准，确保双方对最终的交付成果有一致的理解。
+ **会议纪要和文档更新**：在沟通后，整理会议纪要，记录达成的共识和明确的需求内容，并要求产品部更新需求文档，保证文档的准确性和完整性。

