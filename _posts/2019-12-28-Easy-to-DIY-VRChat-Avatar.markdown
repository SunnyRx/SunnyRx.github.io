---
layout: post
title: "轻松简单自己上传VRChat的Avatar"
subtitle: "有Unity就够了，不用Blender"
date: 2019-12-28
author: "SunnyRx"
header-img: "img/post-bg-gray.webp"
catalog:	true
tags:
    - VRChat
---

> 博文于2020年11月27日更新。时隔一年，主要有2个比较大的变动，第1是Unity版本发生了变化，多出了一些处理步骤，以下博文做了修正和简单说明。第2是VRChat分开SDK2和SDK3，分别对应Avatars2.0和Avatars3.0，以下博文针对SDK2撰写。

最近一段时间都在玩VRChat，开始自己研究如何打造一个属于自己的Avatar。

在这之前，首先得学会如何自己上传Avatar。

国内外已经有不少怎么自己上传Avatar的方法，大多数都是从网上下载模型，从Blender处理模型开始，例如对笔者起了启蒙作用的教程是[这一张帖子](https://forum.gamer.com.tw/C.php?bsn=33654&snA=61)。

而在这里笔者分享的方法省去使用Blender的部分，不会提到需要使用Blender处理的模型，所以会相对前面提到的教程会更加简单一些。

# 准备

需要的东西如下：

- [模型シャペル](https://booth.pm/zh-cn/items/1349366)
- [Unity 2018.4.20f1](https://download.unity3d.com/download_unity/008688490035/Windows64EditorInstaller/UnitySetup64.exe)
- [VRChat帐号](https://vrchat.com)
- [VRChat SDK2](https://vrchat.com/download/sdk)（本教程使用的SDK2）

> 如果想要让头发和裙子动起来，还需要[动态骨骼](https://assetstore.unity.com/packages/tools/animation/dynamic-bone-16743#description)，售价为20$。注意这不是必须的。

> 2020年11月27日更新：如果没有动态骨骼插件，会因为脚本缺失而无法上传Avatar，详看第五步的最后。

下面笔者会对这四个东西暂开详细说明。

### 模型シャペル

笔者看到部分教程推荐的模型大多数是来自一些并非面向VRChat的模型网站，从这些网站下载下来的模型通常需要自己做一些处理才能使用。

![シャペル](/img/in-post/post-VRChat-01/shapell.webp)

本教程使用的模型是从[BOOTH](https://booth.pm/zh-cn)找来的免费模型，基于[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.zh)的原创角色シャペル，感谢作者[ろーてく](https://twitter.com/lowteq_vr)。

笔者非常推荐在BOOTH寻找VRChat的模型，笔者在VRChat所使用的Avatar也是在该网站上购买的。不管是Avatar，还是小物件，还是Shader，搜索的时候加上“VRChat”关键字，能找到很多可以直接利用的素材。如果想要找免费的素材，只要[把价格设置为0](https://booth.pm/zh-cn/search/VRChat?max_price=0)就可以了。注意使用的时候要仔细确认使用规约，不过全是日语。

使用这些VRChat的模型一个好处就是不用自己做额外的处理，例如使用Blender做眼睛追踪、添加VRChat SDK的脚本等，基本上导入Unity项目后就可以直接上传到VRChat。

笔者整理了一些BOOTH上的免费模型，详情请参考[BOOTH免费VRChat资源整理](https://sunnyrx.com/2020/01/06/BOOTH-free-VRChat-assets/#avatar)一文。

### 着色器Arktoon-Shaders

[着色器（Shader）](https://zh.wikipedia.org/zh-hans/%E7%9D%80%E8%89%B2%E5%99%A8)对该教程简单的说，它决定模型实际显示的视觉效果。

在上一段落提到的BOOTH中，一般模型页面会提到该模型使用了什么Shader，为了正常地显示该模型原本的样子，应该导入指定Shader到Unity项目中（具体操作方法接下来会说明）。如果你没有导入对应的Shader，那么你导入模型后会发现整个模型是紫色的（Shader缺失的表现）。

![Arktoon Shaders](/img/in-post/post-VRChat-01/arktoon.webp)

本教程使用的Shader是シャペル的页面中说明的Arktoon Shaders，也是一个可以免费利用的Shader，感谢作者[synqark](https://twitter.com/synqark)。

> 2020年11月27日更新：少部分模型会在资源包里附上Shader，シャペル已经自带Arktoon Shaders，所以不用提前下载和导入Shader。但是要注意，这个版本的Arktoon Shaders相对较旧，导入シャペル后可以考虑再导入最新版的Arktoon Shaders。

如果有兴趣折腾，也可以尝试给模型替换不同的Shader，以表现出不一样的效果。

笔者也整理了一些BOOTH上的免费Shader，详情请参考[BOOTH免费VRChat资源整理](https://sunnyrx.com/2020/01/06/BOOTH-free-VRChat-assets/#shader)一文。

### Unity 2018.4.20f1

当前（2020年11月27日）VRChat官方推荐使用的Unity版本是2018.4.20，所以本次教程也是使用这个版本。

如何安装就不在本教程范围了，如果有疑问的话可以搜索一下相关教程。

如果你电脑有安装UnityHub，可以用下面的链接直接安装2018.4.20版本的Unity。

[unityhub://2018.4.20f1/008688490035](unityhub://2018.4.20f1/008688490035)

### VRChat SDK

无论是做VRChat的Avatar还是World，VRChat SDK都是必须的。

下载的时候要求在VRChat官网登录。

# 开始执行

### 第一步：新建一个Unity项目

![新建](/img/in-post/post-VRChat-01/01.webp)

打开Unity，点击New。

![填写项目属性](/img/in-post/post-VRChat-01/02.webp)

1. 填写项目名字，可以取自己喜欢的名字
2. 该项目的保存路径，可以自己选择一个方便整理的路径，新建的项目会在该路径下新建一个以项目名命名的文件夹
3. 关掉Unity统计

![Unity界面](/img/in-post/post-VRChat-01/03.webp)

然后就会进入到该项目的Unity界面了，也就表示成功创建好一个项目了。

此时看到的界面也许和以上所显示的有所不一样，因为笔者根据自己的喜好进行过调整，可以不用在意。

### 第二步：导入VRChat SDK

![VRChat SDK的unitypackage文件](/img/in-post/post-VRChat-01/04.webp)

下载好的VRChat SDK是一个unitypackage文件，应该长的如上图。

![导入VRChat SDK](/img/in-post/post-VRChat-01/05.webp)

双击该文件后，稍微等一下会看到如上图的窗口，点击右下角的Import就可以将里面的内容导入到Unity项目中。

![导入VRChat SDK后](/img/in-post/post-VRChat-01/06.webp)

导入后应该会看到Project中的Assets多了Plugins和VRCSDK两个文件夹。

### 第三步：导入Shader

下载好的Arktoon-Shaders是一个压缩包，解压后也是一个unitypackage文件，此时参照第二步的做法导入即可。

![导入Arktoon-Shaders后](/img/in-post/post-VRChat-01/07.webp)

导入后应该会看到Project中的Assets多了arktoon Shader的文件夹。

### 第四步：导入模型

> 如果要导入动态骨骼，请在这一步之前导入。这里不展开说明。

下载好后的模型也是一个压缩包，解压后也会看到一个unitypackage文件，一样参照第二步的做法导入即可。

![导入模型后](/img/in-post/post-VRChat-01/08.webp)

导入后应该会看到Project中的Assets多了Shapell的文件夹。

> 笔者在执行这一步的时候发现该模型的unitypackage中似乎已经包含了Arktoon Shaders，也就是说其实不用下载和导入Arktoon Shaders也可以。但是注意并不是所有下载下来的模型都会自带Shader，所以了解一下如何导入Shader也是必须的。

### 第五步：打开放好模型的Scene

通常面向VRChat的模型，导入Unity后，你能在该模型文件夹中找到xxx.unity的文件，它可能放在该模型文件夹的根目录中，也可能放在一个叫scene的文件夹中。

本教程使用的模型则是放在模型文件夹的根目录中。

![打开Scene](/img/in-post/post-VRChat-01/09.webp)

1. 点开Shapell文件夹
2. 找到.unity文件（shapellscene.unity，点击后可以在下面看到该文件夹的全名），双击打开

![打开Scene后](/img/in-post/post-VRChat-01/10.webp)

打开后能看到如上图的样子，左边是该Scene的内容。

> 2020年11月27日更新：如果没有动态骨骼插件，会因为脚本缺失而无法上传Avatar，需要编辑预制体(Prefab)，移除Script Missing的脚本后才能上传。

### 第六步：上传Avatar到VRChat

接下来首先打开VRChat SDK的控制面板。

![点开VRChat SDK的控制面板](/img/in-post/post-VRChat-01/14.webp)

1. 在Unity上方找到VRChat SDK，点击
2. 点击Show Control Panel

然后在弹出VRChat SDK的控制面板中，输入VRChat的帐号和密码，点击Sign In登录。

> 这里需要注意的是，你的VRChat帐号必须满足上传Avatar的资格才可以上传Avatar。通常新帐号是没有资格的，需要游玩一段时间。

接下来是选择上传Avatar。

> 2020年11月27日更新：在这一步可能会看到2和3之间有红色错误，点击Auto Fix即可。

![选择上传的Avatar](/img/in-post/post-VRChat-01/15.webp)

1. 点击Builder
2. 点击要上传的Avatar（shapell）
3. 点击Build & Publish

此时稍等片刻，在Game面板中会看到如下图的样子，接下来就是填写该Avatar的信息。

![填写Avatar信息](/img/in-post/post-VRChat-01/16.webp)

1. 该Avatar的名字，必填，这里可以填自己喜欢的名字
2. 该Avatar的描述，选填，可以填任意描述
3. 该Avatar的警告，也就是声明是否包含色情、血腥、暴力或其它让人不适的元素。该Avatar十分健康所以什么都不用勾选
4. 选择该Avatar是否公开。默认的Private是私有，这个情况下任何玩家无法在游戏中Clone该Avatar。
5. 勾选，表示确认上面信息准确无误。
6. 点击上传

![上传成功！](/img/in-post/post-VRChat-01/17.webp)

点击上传后，稍等片刻，看到上面这个窗口弹出，就可以登录游戏点开自己的Avatar确认了。

# 完成

![游戏中的样子](/img/in-post/post-VRChat-01/18.webp)

上图就是在游戏中的样子啦~