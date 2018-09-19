---
layout:     post
title:      "使用frp实现内网穿透"
subtitle:   "群晖NAS+frp发挥更大作用"
date:       2016-10-21
author:     "SunnyRx"
header-img: "img/post-bg-nas.jpg"
catalog:	true
tags:
    - NAS
    - 内网穿透
---

>该文章于2018年7月7日将frp版本从0.13.0更新到0.20.0，下文针对frp 0.20.0配置。

NAS没有公网IP是一件很不方便的事情，尤其是在国内的网络环境，学校和小区内的用户通常都没有公网IP。为了解决这个问题，则需要内网穿透，而内网穿透的方法有很多种，例如使用`花生壳`、`ngrok`等，该文章要介绍的是使用frp让群晖实现内网穿透。

**实际上frp有官方的[中文文档](https://github.com/fatedier/frp/blob/master/README_zh.md)，上面的内容已经非常详尽，对相关操作比较熟悉的人可以直接阅读官方的中文文档。**

### 什么是frp

>[frp](https://github.com/fatedier/frp) 是一个高性能的反向代理应用，可以帮助您轻松地进行内网穿透，对外网提供服务，支持 tcp, http, https 等协议类型，并且 web 服务支持根据域名进行路由转发。

### 准备

在使用frp之前，需要一台有公网IP的服务器（下文称外网主机），一台需要实现内网穿透的机器（下文称内网主机），SSH工具，以及一个域名（如果只是建立SSH反向代理则不需要域名）。

该文章中笔者所使用的服务器是[朋友](http://blog.ruterly.com/)推荐的`Vultr`服务器，虽然服务器是在国外，但胜在带宽够，有需要的朋友可以[注册一个](http://www.vultr.com/?ref=6967230)。而需要实现内网穿透的机器则是笔者用上网本搭建的黑群晖。SSH工具使用的是`Xshell 5`。而域名笔者则是使用自己个人网站的域名。

### 开始使用

根据机器的操作系统，在[Release](https://github.com/fatedier/frp/releases)页面中找到对应的frp程序，然后分别在外网主机和内网主机中下载它。

下面的所示范用的frp程序版本是以笔者的服务器为主的。

###### 外网主机

SSH连接上外网主机后，使用`wget`指令下载frp。

```
wget https://github.com/fatedier/frp/releases/download/v0.20.0/frp_0.20.0_linux_amd64.tar.gz
```

使用`tar`指令解压tar.gz文件

```
tar -zxvf frp_0.20.0_linux_amd64.tar.gz
```

使用`cd`指令进入解压出来的文件夹

```
cd frp_0.20.0_linux_amd64/
```

外网主机作为服务端，可以删掉不必要的客户端文件，使用`rm`指令删除文件。

```
rm -f frpc
rm -f frpc.ini
```

接下来要修改服务器配置文件，即`frps.ini`文件。使用`vi`指令对目标文件进行编辑。

```
vi frps.ini
```

打开`frps.ini`后可以看到默认已经有很多详细的配置和示范样例，该文章仅以达到内网穿透为目的，所以这里选择**删掉或注释掉里面的所有内容**，然后根据群晖的情况，按照官方的中文文档添加以下配置。（这里的操作都使用`vi`命令，关于`vi`命令的使用方式这里不作详细介绍，可以自行搜索相关使用方法。）

```
[common]
bind_port = 7000
vhost_http_port = 8080

```

`[common]`部分是必须有的配置，其中`bind_port`是自己设定的frp服务端端口，`vhost_http_port`是自己设定的http访问端口。

保存上面的配置后，使用以下指令启动frp服务端。（如果需要在后台运行，请往下翻阅关于后台运行的部分。）

```
./frps -c ./frps.ini
```

服务端的工作就到此结束了。

###### 客户端

客户端前面的操作和服务端是一模一样的，这里不一一解释。

```
wget https://github.com/fatedier/frp/releases/download/v0.20.0/frp_0.20.0_linux_amd64.tar.gz
tar -zxvf frp_0.20.0_linux_amd64.tar.gz
cd frp_0.20.0_linux_amd64
rm -f frps
rm -f frps.ini
vi frpc.ini
```

客户端的配置如下

```
[common]
server_addr = x.x.x.x
server_port = 7000

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000

[nas]
type = http
local_port = 5000
custom_domains = no1.sunnyrx.com

[web]
type = http
local_port = 80
custom_domains = no2.sunnyrx.com

```

上面的配置和服务端是对应的。

`[common]`中的`server_addr`填frp服务端的ip（也就是外网主机的IP），`server_port`填frp服务端的`bind_prot`。

`[ssh]`中的`local_port`填群晖的ssh端口。

`[nas]`中的`type`对应服务端配置。`local_port`填群晖的DSM端口。`custom_domains`为要映射的域名，记得域名的A记录要解析到外网主机的IP。

`[web]`同上，`local_port`填群晖的web端口。这里创建了两个http反向代理是为了分别映射群晖两个重要的端口，`5000`和`80`，前者用于登录群晖管理，后者用于群晖的`Web Station`和`DS Photo`。

保存配置，输入以下指令运行frp客户端。（同样如果需要在后台运行，请往下翻阅关于后台运行的部分。）

```
./frpc -c ./frpc.ini
```

此时在服务端会看到"start proxy sucess"字样，即连接成功。

现在可以用SSH通过`外网主机IP:6000`和群晖建立SSH连接。通过浏览器访问`no1.sunnyrx.com:8080`打开群晖nas的管理页面，访问`no2.sunnyrx.com:8080`打开群晖`Web Station`的网站，`DS Photo app`可以连接`no2.sunnyrx.com:8080`进入`DS Photo`管理。

### 让frp在后台运行

虽然现在frp运作起来了，内网穿透也实现了，但这还是不够的。此时如果断开与服务端或者客户端的SSH连接（比如关掉了Xshell）也就中止了frp的运行。

保持frp运行是关键是让服务端的frp和客户端的frp在后台运行，这里提两个方法供参考，一个是使用`screen`指令，另一个是使用`nohup`指令。由于群晖的系统默认是没有`screen`指令的，这里也不提供安装`screen`的方法，所以推荐群晖直接使用`nohup`。

###### 使用screen让frp在后台运行

下面的示范是运行服务端的frp，客户端就不示范了，前面提过群晖的系统没有`screen`指令。

首先使用`screen`指令创建一个会话。

```
screen -dmS frp
```

然后进入这个会话。

```
screen -r frp
```

最后使用运行frp的指令，在后面加上" &"。（如果之前断开了SSH连接，记得用`cd`指令进入frp的目录先。）

```
./frps -c ./frps.ini &
```

这样就让frp在后台运行了。

###### 使用nohup指令

nohup指令的使用方法相对简单，只需要在`nohup`后面加上frp的运行指令即可。下面示范的指令是运行frp客户端。（同样，如果之前断开了SSH连接，记得用`cd`指令进入frp的目录先。）

```
nohup ./frpc -c ./frpc.ini &
```

这样就成功让frp在后台运行了。

### 结语

frp的使用和配置相当简单，如有疑问或者想了解关于frp的其它功能可以查看官方的[中文文档](https://github.com/fatedier/frp/blob/master/README_zh.md)。