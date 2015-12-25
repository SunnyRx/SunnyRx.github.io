---
layout:     post
title:      "关于Cocos2d-x MenuItemFont设置字体和字号"
subtitle:   "Cocos2d-x MenuItemFont's font and size"
date:       2015-12-23
author:     "SunnyRx"
header-img: "img/post-bg-cocos2dx.jpg"
tags:
    - cocos2dx
    - 编程
---
Cocos2d-x存在MenuItemFont类，用于创建一个Label按钮，当要用文字而不是图片来制作菜单按钮时，MenuItemFont就很有用了。

当使用MenuItemFont需要设置字体和字号时，通常会习惯调用setFontName()和setFontSize()函数，实际上这两个函数是静态函数，分别修改全局字体名和全局字体大小，即改变默认的设置。如果是对象调用了这两个静态方法，那么只有下一次create MenuItemFont对象有效果。

使用MenuItemFont时如果需要设置字体和字号，应该调用setFontNameObj()和setFontSizeObj()函数。

以下代码，执行后button1为默认字体和默认字号，buuton2字体为黑体，字号为60。
```
auto button1 = MenuItemFont::create("Button I");
backButton->setFontName("黑体");
backButton->setFontSize(60);

auto button2 = MenuItemFont::create("Button II");
backButton->setFontName("微软雅黑");
backButton->setFontSize(36);
```

以下代码，执行后button1字体为黑体，字号为60，buuton2字体为微软雅黑，字号为36。
```
auto button1 = MenuItemFont::create("Button I");
backButton->setFontNameObj("黑体");
backButton->setFontSizeObj(60);

auto button2 = MenuItemFont::create("Button II");
backButton->setFontNameObj("微软雅黑");
backButton->setFontSizeObj(36);
```

以下代码将和上面代码一样，执行后button1字体为黑体，字号为60，buuton2字体为微软雅黑，字号为36。
```
MenuItemFont::setFontName("黑体");
MenuItemFont::setFontSize(60);
auto button1 = MenuItemFont::create("Button I");

MenuItemFont::setFontName("微软雅黑");
MenuItemFont::setFontSize(36);
auto button2 = MenuItemFont::create("Button II");
```