---
layout: post
title: "关于用 Unity 更新 Android SDK 的问题"
subtitle: "Android SDK is missing required platform API"
date: 2023-06-27
author: "SunnyRx"
header-img: "img/post-bg-gray.webp"
catalog:	false
tags:
    - 编程
    - Unity
---
  
# 问题

当使用 Unity 做 Android 的 Build 时，如果 Target API Level 切换为比较高的版本再 Build，就会出现一个弹窗：

![](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124222429.webp)

> Android SDK is missing required platform API
Required API level 31.
Make sure Android SDK path is writable by the editor
> 

如果这个时候选择 Update Android SDK 以升级 Android SDK 的话，可能会弹出一个终端窗口，然后自动关闭后又重复弹该窗口，重复数次，最后还是不能成功升级 Android SDK。

线上搜的教程大部分都是叫下载 Android Studio，可是笔者只想用 Unity 进行做开发。

# 解决方法

导致 Unity 无法升级 Android SDK 的原因是没有同意 Android SDK 的相关协议，只要同意了就好。

为了相关协议，首先到该路径：

`[Unity Editor 文件夹]\Editor\Data\PlaybackEngines\AndroidPlayer\SDK\tools\bin`

然后在这打开终端

![](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124222457.webp)

执行

`.\sdkmanager --licenses`

![](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124222508.webp)

然后确认多份协议，输入 y 表示同意，最后看到 「All SDK package licenses accepted」时则同意了全部协议。

这个时候回到 Unity 中再遇到之前的弹窗时，按下 Update Android SDK 就能成功更新了。