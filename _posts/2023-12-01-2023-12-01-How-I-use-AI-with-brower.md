---
layout: post
title: "使用 Sider 插件：优化浏览器中的 AI 体验"
subtitle: "顺手分享几个个性化提示词"
date: 2023-12-01
author: "SunnyRx"
header-img: "img/post-bg-gray.webp"
catalog:	false
tags:
    - AI
    - 生产力
---

本文分享了笔者如何在浏览器中使用 AI 插件 Slider。

平时主要使用 AI 帮助笔者快速检索信息和收集信息。例如遇到不知道怎么读的日语词汇，想知道它怎么读，或是没有概念的词汇，想了解它大概是什么东西。在像 ChatGPT 这样的通用 AI 出现之前，通常检索一个信息就是打开一个搜索页面进行搜索，看完后再关闭这个页面回到原来的地方，这个行为现在看来是挺繁琐的。

# Sider

笔者在浏览器中常用的 AI 插件之一是 [Sider](https://sider.ai/)。

Sider 最好用的一点是划词查询 AI。在浏览网页的时候，遇到想要发给 AI 的内容时，只要选中这个词或者这段内容，可以在弹出的智能菜单中选中预设好的提示词，连同提示词和选中的内容发给 AI，不用离开页面的情况下得到 AI 的答复，重要的是这个智能菜单中的提示词是可以根据自己的需要自己定制的。

![划词后出现的 Sider 智能菜单](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231201212925.webp)

除了划词查询 AI，还有一些其它实用的功能，例如 OCR 等。

现在使用 Sider 不好的是必须要注册和登陆账号才能使用，好是好在即使没有 OpenAI API Key 也能使用它，它本身也提供了多种使用方式：

- **Sider**
    
    > Sidebar 通过接入 ChatGPT 官方提供的**付费，稳定版API**。无需任何设置，为大家提供**无需科学上网，稳定，快速的服务**。为了让任何人都能使用AI，我们为所有人提供了每天30条免费查询额度。可升级到为高级会员以提升额度，同时支持我们 “**AI 普惠和平权**” 的使命。

- **ChatGPT 网络应用**
    
    > 由于OpenAI 的限制，这种方式需要时刻保持你的ChatGPT 账号处于登录状态。不稳定，可能需要经常刷新。

- **OpenAI API key**
    
    > OpenAI 给软件开发者的官方API 密钥，稳定，需付费给OpenAI。 按照指南获取 API 密钥。


# 提示词分享

Sider 的设置菜单中可以根据自己的需要配置提示词，下面笔者分享一些常用的提示词。

![Sider 提示词管理页面](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231201213539.webp)

## 解释

![使用 Sider 查询解释用例](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231201215548.webp)

```
Contents: "${selection}"  
Please create a explanation in ${lang} using one paragraph.
```

Sider 有自带一条用于解释的提示词，它向 AI 提供一段比较优秀的回答格式，但是回复内容实在太长，有时候里面有不少重复的废话在其中。

笔者通常只需要一小段非常简单的信息，使用上面这条提示词就恰倒刚好。

## 查询日语读音

![使用 Sider 查询日语发音例](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231201212156.webp)

```
読み方を教えて：
```

笔者在阅读日语文本的时候，经常会看到一些不知道怎么读的汉字词汇，用该提示词可以快速得到对应的读音。

## 外语表达

![使用 Sider 查询外语表达](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231201214542.webp)

```
我想表达下面的意思，用英语怎么说比较自然呢：
```

笔者有时候需要用一些外语短语与人交流，直接用翻译软件的话翻译出来的语句通常怪怪的，一眼机翻，用该提示词可以减少违和感。

这条提示词一般不会用在智能菜单中，而是打开侧边栏的提问工具使用。

笔者使用的时候通常会是会附上自己想的语句，顺便可以做外语练习。

现在 Sider 有自带的写作工具，它的功能更强大而且效果更好。

![Sider 的写作工具](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231201214114.webp)

## 创建 Logseq 用的卡片笔记

![ChatGPT Slider 生成的 Logseq 日语词汇笔记](https://raw.githubusercontent.com/SunnyRx/images/main/img/a8f1fb001cb292e5e2b58c755400790.webp)

```
Please create notes for the vocabulary of "${selection}" I provide you in the following format:

${selection} #card #日本語
- 読み方： [If the vocabulary is in kanji, please provide the furigana here, otherwise leave it blank]
- 意味： [The corresponding meaning of this vocabulary in ${lang}]
- 簡易メモ：[Help me remember this vocabulary by providing any additional notes in ${lang}, such as the typical situations where this vocabulary is used]
```

最近笔者用于制作 Logseq 记忆卡片用的提示词，详情可以查看笔者的另一篇[博文](https://sunnyrx.com/2023/11/25/2023-11-25-2023-11-25-Create-A-Logseq-Memo-Prompt/)。

根据这条提示词的思路，可以根据自己的需要创建提示词，让 AI 来帮忙把一些想要收集的信息，整理成指定的格式，方便存档。