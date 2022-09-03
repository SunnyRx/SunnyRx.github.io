---
layout: post
title: "关于Unity的VR项目进入PlayMode耗时过长的问题"
subtitle: "About Unity's VR project slow to enter PlayMode"
date: 2022-09-03
author: "SunnyRx"
header-img: "img/post-bg-gray.webp"
catalog:	false
tags:
    - Unity
---

> 笔者最近遇到Unity进入PlayMode非常慢的问题，折腾一番后发现好像是Oculus更新后引起的问题……

如果你遇到该问题：

- Unity进入PlayMode耗时非常长（显示Hold on，停在Application.EnterPlayMode 至少6分钟）

![Hold on](/img/in-post/post-unity-vr-playmode/HoldOn.webp)

并且你满足以下的情况：

- Unity工程是VR项目
- 电脑上有装Oculus APP

那么该文可以提供参考。

请在【任务管理器】的【服务】中确认OVRService的状态。如果是【已停止】，则会有以上问题。

![OVRSerivce](/img/in-post/post-unity-vr-playmode/OVRService.webp)

解决方案：启动OVRService。或者说直接打开Oculus APP，在其运行的情况下进入PlayMode则不会有该问题。

该现象应该是Oculus APP在8月初更新后出现的，如果你和笔者一样有关闭OVRService服务的习惯（因为Oculus APP在VR设备长期连接着PC的情况下，可能会自动启动），就会遇到该问题。