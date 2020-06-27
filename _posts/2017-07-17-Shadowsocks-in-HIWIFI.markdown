---
layout:     post
title:      "在极路由上安装Shadowsocks插件"
subtitle:   "Shadowsocks in HIWIFI"
date:       2017-07-17
author:     "SunnyRx"
header-img: "img/post-bg-gray.webp"
tags:
    - HIWIFI
    - Shadowsocks
---

早期极路由有自带的官方插件，SSH，可以轻松通过该插件使用SSH梯子，后来SSH插件就下架了，仿佛极路由再也不能使用梯子了。

Shadowsocks的出现使其成为了新的梯子，聪明的极客们已经有方法可以在极路由上使用Shadowsocks了，网上亦能搜到很多相关的教程，但是看起来对一般人来说不是那么简单的事情，要开发者权限要root什么的，其实有更简单的方法可以使用上Shadowsocks插件，不需要开发者权限也不需要root。

所需要准备的东西就是一台极路由智能路由器，以及一个SS服务器。然后仅需要五步，即可安装好Shadowsocks插件。

### 第一步：打开极路由的插件管理，选择添加应用

![添加应用](/img/in-post/post-HIWIFI/img01.webp)

### 第二步：随便点开一个你没有安装的应用

![随便选择一个没有安装的应用](/img/in-post/post-HIWIFI/img02.webp)

### 第三步：修改地址

打开一个未安装的应用后，它的地址应该是长下面这样的：

`https://app.hiwifi.com/store.php?m=plugins&a=install&rid=rXXXXXXXXX&sid=XXXXXXXXX`

其中前面rid的XXXXXXXXX几位数字不用管，不要改动，主要是sid的数字，把它改为`163116535`，然后访问。

### 第四步：点击免费安装，确定安装

![点击免费安装](/img/in-post/post-HIWIFI/img03.webp)

![确定安装](/img/in-post/post-HIWIFI/img04.webp)

### 第五步：填写SS服务器信息

![填写SS服务器信息](/img/in-post/post-HIWIFI/img05.webp)

关于代理模式，笔者是只用白名单模式的，白名单域名列表可以搜GFWList或者在ShadowsocksR客户端中的pac文件中提取获得。当然也可以直接用白名单+国外IP模式，但是笔者没试过。

填好后按下一步，等待下载完成后会自动安装，并提醒安装成功。

![安装成功提示](/img/in-post/post-HIWIFI/img06.webp)

### 完成

![插件运行中](/img/in-post/post-HIWIFI/img07.webp)

见到插件运行中就搞定了，这个时候就可以自由浏览网站了。你可以随时点下暂停服务暂时停止使用SS服务，也可以随时在配置参数中修改服务器信息和增删白名单。