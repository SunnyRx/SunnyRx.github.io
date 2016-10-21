---
layout:     post
title:      "使用frp实现内网穿透"
subtitle:   "群晖NAS+frp发挥更大作用"
date:       2016-10-21
author:     "SunnyRx"
header-img: "img/post-bg-nas.jpg"
tags:
    - NAS
    - 内网穿透
---

NAS没有公网IP是一件很不方便的事情，尤其是在国内的网络环境，学校和小区内的用户通常都没有公网IP。为了解决这个问题，则需要内网穿透，而内网穿透的方法有很多种，例如使用`花生壳`、`ngrok`等，该文章要介绍的是使用frp让群晖实现内网穿透。

实际上frp有官方的[中文文档](https://github.com/fatedier/frp/blob/master/README_zh.md)，上面的内容已经非常详尽，对相关操作比较熟悉的人可以直接阅读官方的中文文档。

### 什么是frp

>[frp](https://github.com/fatedier/frp) 是一个高性能的反向代理应用，可以帮助您轻松地进行内网穿透，对外网提供服务，支持 tcp, http, https 等协议类型，并且 web 服务支持根据域名进行路由转发。

### 准备

在使用frp之前，需要一台有公网IP的服务器（下文称外网主机），一台需要实现内网穿透的机器（下文称内网主机），SSH工具，以及一个域名（如果只是建立SSH反向代理则不需要域名）。

该文章中笔者所使用的服务器是[朋友](http://ruter.sundaystart.net/)推荐的`Vultr`服务器，虽然服务器是在国外，但胜在带宽够，有需要的朋友可以[注册一个](http://www.vultr.com/?ref=6967230)。而需要实现内网穿透的机器则是笔者用上网本搭建的黑群晖。SSH工具使用的是`Xshell 5`。而域名笔者则是使用自己个人网站的域名。

### 开始使用

根据机器的操作系统，在[Release](https://github.com/fatedier/frp/releases)页面中找到对应的frp程序，然后分别在外网主机和内网主机中下载它。

下面的所示范用的frp程序版本是以笔者的服务器为主的。

###### 外网主机

SSH连接上外网主机后，使用`wget`指令下载frp。

```
wget https://github.com/fatedier/frp/releases/download/v0.8.1/frp_0.8.1_linux_amd64.tar.gz
```

使用`tar`指令解压tar.gz文件

```
tar -zxvf frp_0.8.1_linux_amd64.tar.gz
```

使用`cd`指令进入解压出来的文件夹

```
cd frp_0.8.1_linux_amd64
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

[ssh]
listen_port = 6000
auth_token = 123

[nas]
type = http
custom_domains = nas.sunnyrx.com
auth_token = 123

[web]
type = http
custom_domains = nasweb.sunnyrx.com
auto_token = 123
```

这里先简单解释一下上面的配置，结合下面的客户端配置更容易理解。

`[common]`部分是必须有的配置，其中`bind_port`是自己设定的frp服务端端口，`vhost_http_port`是自己设定的http访问端口。

`[ssh]`部分是ssh反向代理，`listen_port`是自己设定的ssh访问端口，`auth_token`用于身份认证（以下皆是）。（如果只需要建立ssh反向代理，那么服务端和客户端下面的http反向代理部分都可以删去。）

`[nas]`部分是http反向代理（这里[]里的内容可以自己设定，但是客户端和服务端必须要对应。）；`type`为服务类型，可以设为https；`custom_domains`为要映射的域名，记得域名的A记录要解析到外网主机的IP。

`[web]`部分同上，这里创建了两个http反向代理是为了分别映射群晖两个重要的端口，`5000`和`80`，前者用于登录群晖管理，后者用于群晖的`Web Station`和`DS Photo`。

保存上面的配置后，使用以下指令启动frp服务端。（如果需要在后台运行，可以在指令最后添加" &"。）

```
./frps -c ./frps.ini
```

服务端的工作就到此结束了。

###### 客户端

客户端前面的操作和服务端是一模一样的，这里不一一解释。

```
wget https://github.com/fatedier/frp/releases/download/v0.8.1/frp_0.8.1_linux_386.tar.gz
tar -zxvf frp_0.8.1_linux_386.tar.gz
cd frp_0.8.1_linux_386
rm -f frps
rm -f frps.ini
vi frpc.ini
```

客户端的配置如下

```
[common]
server_addr = x.x.x.x
server_port = 7000
auth_token = 123

[ssh]
local_port = 22

[nas]
type = http
local_port = 5000

[web]
type = http
local_port = 80
```

上面的配置和服务端是对应的。

`[common]`中的`server_addr`填frp服务端的ip（也就是外网主机的IP），`server_port`填frp服务端的`bind_prot`。

`[ssh]`中的`local_port`填群晖的ssh端口。

`[nas]`中的`type`对应服务端配置。`local_port`填群晖的DSM端口。

`[web]`同上，`local_port`填群晖的web端口。

保存配置，输入以下指令运行frp客户端。（同样如果需要在后台运行，可以在指令最后添加" &"。）

```
./frpc -c ./frpc.ini
```

此时在服务端会看到"start proxy sucess"字样，即连接成功。

现在可以用SSH通过`外网主机IP:6000`和群晖建立SSH连接。通过浏览器访问`nas.sunnyrx.com:8080`打开群晖nas的管理页面，访问`nasweb.sunnyrx.com:8080`打开群晖`Web Station`的网站，`DS Photo app`可以连接`nasweb.sunnyrx.com:8080`进入`DS Photo`管理。（不要尝试连接这里的示范，笔者实际在使用的不是8080端口。）

### 结语

frp的使用和配置相当简单，如有疑问或者想了解关于frp的其它功能可以查看官方的[中文文档](https://github.com/fatedier/frp/blob/master/README_zh.md)。