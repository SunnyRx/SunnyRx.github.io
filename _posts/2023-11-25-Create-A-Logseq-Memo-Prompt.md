---
layout: post
title: "配合 AI 为自己创建 Logseq 的日语词汇笔记"
subtitle: "简单造个 ChatGPT Sidebar + Logseq 的 Workflow"
date: 2023-11-25
author: "SunnyRx"
header-img: "img/post-bg-gray.webp"
catalog:	false
tags:
    - 日语
    - AI
    - Logseq
---

最近笔者在思考还有什么适合笔者的方法，用于提升日语水平。

合适的方法不能仅是「有效」，还要考虑到实际执行时是否有什么阻力妨碍行动，要考虑自己的情绪状态，如果做得不开心的话很难投入精力在其中。

包括笔者最近开始尝试[用日文写博客](https://jp.sunnyrx.com)，也是因为主观觉得有趣才执行了起来，也许哪天觉得「低效」或「无趣」就会坚持不下去了。

笔者在日语上遇到的一大问题是词汇量不足，今天想到为了增加词汇量，笔者需要多点阅读日文文章，把经常遇到的不会的单词记下来。

虽然笔者已经在 Notion 有一个用来记录单词的笔记，但是自从 VRChat 上线的时间减少后，这个笔记更新的速度变慢了很多……

![Notion 的日语笔记](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231125203810.webp)

最近正好想体验一下 Logseq 的记忆卡片功能，想着可以趁这个机会，把之后想记的日语词汇都记录到 Logseq 中。

![Logseq 的记忆卡片](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231125214544.webp)

笔者正在使用的浏览器插件 ChatGPT Sidebar 中自己创建了一个提示词，专门用于帮助笔者在阅读文本时，快速查询一个单词怎么读。

![使用 ChatGPT Sidebar 查询一个词汇的读法](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231125215926.webp)

那么现在想到也许可以借助这个工具，快速让 ChatGPT 帮忙查询一个词汇的读法、意思，并且做成一个可以放进 Logseq 里当记忆卡片的笔记。

根据自己想要的记忆卡片格式，创建了下面的 prompt：
```
Please create notes for the vocabulary of "${selection}" I provide you in the following format:

${selection} #card #日本語
- 読み方： [If the vocabulary is in kanji, please provide the furigana here, otherwise leave it blank]
- 意味： [The corresponding meaning of this vocabulary in ${lang}]
- 簡易メモ：[Help me remember this vocabulary by providing any additional notes in ${lang}, such as the typical situations where this vocabulary is used]
```

这个 Prompt 还有优化的空间，还可以加点例句之类的。

实际效果如下：

![ChatGPT Slider 生成的 Logseq 日语词汇笔记](https://raw.githubusercontent.com/SunnyRx/images/main/img/a8f1fb001cb292e5e2b58c755400790.webp)

生成的结果复制到 Logseq 就完成了。

看看这样是否能帮助到笔者记忆多点日语词汇吧~