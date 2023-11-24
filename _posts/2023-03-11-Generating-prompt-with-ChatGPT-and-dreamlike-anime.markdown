---
layout: post
title: "使用 ChatGPT 生成 dreamlike-anime Prompt"
subtitle: "Generating prompt with ChatGPT and dreamlike-anime"
date: 2023-03-11
author: "SunnyRx"
header-img: "img/post-bg-gray.webp"
catalog:    false
tags:
    - 随笔
    - AI
---

现在不混合 NovelAI 还很好看的二次元模型很难找了，最近 [taron88 的推荐](https://twitter.com/taron32739087/status/1636757365310779394)下了解到了有这么一款 Stable Diffusion 模型叫 [Dreamlike-anime](https://huggingface.co/dreamlike-art/dreamlike-anime-1.0)，于是立刻尝试了。


同时刚好想着尝试一下用 ChatGPT 生成 prompt，于是就做了以下尝试。

# 使用 ChatGPT 生成 prompt

首先给 ChatGPT 指示，提示中提及这是什么，然后再给出 dreamlike 提供的例子，最后要求给出更多例子。

指示如下：

```
下面是一个优秀的 prompt，用于生成可爱的动漫风美少女，并适用于 text-to-image 模型 (Stable Diffusion, midjourney or Dalle2)的例子：

anime, masterpiece, high quality, 1girl, solo, long hair, looking at viewer, blush, smile, bangs, blue eyes, skirt, medium breasts, iridescent, gradient, colorful, besides a cottage, in the country

麻烦给我更多例子
```

ChatGPT 给我的回答：

![ChatGPT 的回答](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124215605.webp)


# 尝试生成图片

试着用 ChatGPT 提供的 prompt 例子，结合 dreamlike 给出的 negative_prompt：

```
simple background, duplicate, retro style, low quality, lowest quality, 1980s, 1990s, 2000s, 2005 2006 2007 2008 2009 2010 2011 2012 2013, bad anatomy, bad proportions, extra digits, lowres, username, artist name, error, duplicate, watermark, signature, text, extra digit, fewer digits, worst quality, jpeg artifacts, blurry
```

生成一些图像看看：

![](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124215731.webp)

![](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124215814.webp)

![](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124215917.webp)

![](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124215937.webp)

![](https://raw.githubusercontent.com/SunnyRx/images/main/img/20231124220002.webp)

给出的 5 个例子中，1、2、4的感觉都挺不错。

# 优化点

给 ChatGPT 的提示还能有优化的余地，例如：

1. 要求提供的例子都是以 `anime, masterpiece, high quality`开头。
2. 提供多几个优秀的 prompt 例子。

# 题外话

在尝试了多个不混合 NovelAI 的模型后，笔者认为「dreamlike-anime」是其中最出色的二次元模型。

更多不错的模型可以参考 taron88 的介绍文。