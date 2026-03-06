---
layout: post
title: "OpenClaw 的记忆困境与探索"
subtitle: "关于 AI 记忆的一些体验与思考"
date: 2026-03-06
author: "SunnyRx"
header-img: "img/post-bg-gray.webp"
catalog: true
tags:
    - AI
    - OpenClaw
    - 随笔
---

从一月底开始使用 OpenClaw 至今，已经过去了一个多月。这段时间里积累了不少使用心得，其中关于「记忆」这一点，或许是笔者最想分享的。

# 被夸大的记忆能力

很多公众号或自媒体在介绍 OpenClaw 时，都会强调她的「记忆」很厉害，什么能记住很多事情、能延续上下文、像真人一样有连续性……但笔者用了一段时间后发现，这些描述或多或少都有些夸大，或者说是带有误导性。

OpenClaw 确实能记住东西。她会把一些她认为重要的内容以文件形式记录下来，如果你要求她记下某些事情，她也会照做。这些功能都是真实存在的。

但问题在于，记忆的「准确性」和「时效性」大概和大家想象中的不一样。

# 一个案例

笔者用具体的例子来说明：

第一天，笔者告诉 OpenClaw：「我很想去做某件事情。」
第二天，笔者说：「这件事情我已经在做了。」
第三天，笔者告诉她：「这件事情已经完成了。」

过了几天再聊起这件事时，OpenClaw 的回应是：「这件事情是你一直想做的吧，记得要准备这些、这些和这些哦。」

她回忆起了「我想做」这件事，却没有提及「进行中」或「已完成」的状态。这不是遗忘，而是在这场对话中，她没有基于「已经完成」的事实来回应笔者。

为什么会这样？笔者推测，当聊到相关话题时，OpenClaw 会读取记忆中的文档片段。但由于权重分配或某种随机机制，生成的回复恰好落在了「很想做」这个点上，而忽略了后续的状态更新。

这种情况在聊一些重要事情时，确实会让人感到有些沮丧。

# 在 OpenClaw 上运用其它记忆系统

其实在接触 OpenClaw 之前，笔者正在开发自己的 [AI 助手](https://sunnyrx.com/2024/12/31/review-2024/#%E4%B8%80%E4%BA%9B-ai-%E4%BA%A7%E7%89%A9%E7%8E%A9%E5%85%B7)。当时研究了几个不同的记忆系统，包括 [Mem0](https://mem0.ai/)、[MemU](https://app.memu.so/) 和 [Zep](https://www.getzep.com/)。其中 Zep 给笔者留下了最深的印象。

Zep 的设计会把两个事物的关系用一个描述关联起来。比如「『我』想做『某件事』」，「我」和「某件事」会被关联起来，一条关系线表示我在什么时间想做这件事，当后续提到「正在进行」时，「我」和「某件事」会追加新的关系线，带时间的。这种设计能更好地维护信息的时效性。

笔者也想在 OpenClaw 中使用 Zep，不过这次想要本地部署。目前已经通过 [bicameral](https://github.com/yhl999/bicameral) 接入了 Zep 内核 Graphiti。接入过程有些复杂，好在有 OpenCode 帮忙搞定了。

目前还在使用中，效果如何还不好说。如果有什么新的发现，会再来分享。

如果有人对在 OpenClaw 中使用 Graphiti 感兴趣，除了 bicameral，也可以看看 [openclaw-memory-graphiti](https://github.com/Contextable/openclaw-memory-graphiti) 和 [openclaw-graphiti-plugin](https://github.com/RobertoGongora/openclaw-graphiti-plugin)。

最后顺便一提，Mem0 和 MEMU 都有官方对 OpenClaw 运用的支持，有兴趣的人也可以了解一下。