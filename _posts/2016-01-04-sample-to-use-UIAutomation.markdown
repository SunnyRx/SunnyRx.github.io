---
layout:     post
title:      "UIAutomation的简单使用方法"
subtitle:   "Sample to use UIAutomation"
date:       2016-01-04
author:     "SunnyRx"
header-img: "img/post-bg-gray.jpg"
tags:
    - iOS
    - Xcode
    - UIAutomation
    - 自动化测试
---
UIAutomation是苹果公司发布的一个测试框架，主要用于自动化测试iOS和OS X应用的UI交互情况。它使用了使用灵活、易于扩展的JavaScript作为其主要的脚本语言，可以用使用者快速上手。

这是第一次接触自动化测试工具，实际上是为了完成课程作业，选择了UIAutomation是因为可以省去安装和配置的步骤。
本文参考了知平软件Dawson Liu的翻译文[《如何使用UIAutomation进行iOS 自动化测试（Part I）》](http://www.cnblogs.com/vowei/archive/2012/08/10/2631949.html)，原文地址是[http://blog.manbolo.com/2012/04/08/ios-automated-tests-with-uiautomation](http://blog.manbolo.com/2012/04/08/ios-automated-tests-with-uiautomation)。参考Dawson Liu的翻译文可以更全面了解怎么使用UIAutomation，因为原文是2012年的文章所以有点旧，这里节选其中的一部分内容使用新的Xcode做示范。

UIAutomation是Xcode中测试工具集Instruments中的一个测试工具，因为是内置在Xcode中的所以只要MAC安装了Xcode即可使用。

根据原文，首先下载实例应用程序[TestAutomation.xcodeproj](http://blog.manbolo.com/2012/04/08/TestAutomation.zip)，在manbolo的原文中可以找到下载链接是[http://blog.manbolo.com/2012/04/08/TestAutomation.zip](http://blog.manbolo.com/2012/04/08/TestAutomation.zip)。

打开`TestAutomation.xcodeproj`后，注意要到`Build Setting中`设置`ios deployment target`修改为iOS 4.2以上，如iOS 9.0否则开始编译时会出现以下错误。

```
ld: -pie can only be used when targeting iOS 4.2 or later 
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

![Build Setting](http://SunnyRx.github.io/img/in-post/post-UIAutomation-BuildSettings.png)

启动Instruments(Product->Profile)，或者按command+i，出现profiling template的选择画面，选择Automation，按Choose进行下一步。

![Create Profiling](http://SunnyRx.github.io/img/in-post/post-UIAutomation-createProfiling.png)

Instruments窗口出现后，按右边的齿轮图标可以看到脚本列表，默认有一个New Script在里面，选中后可以在左边的窗口编辑脚本，下面的按钮执行脚本。

![Instruments](http://SunnyRx.github.io/img/in-post/post-UIAutomation-Automation.png)

输入以下代码来完成第一个UIAutomation测试用例

```
var target = UIATarget.localTarget();
var app = target.frontMostApp();
var window = app.mainWindow();
target.logElementTree();
```

按下执行后，如无意外在Editor Log窗口中可以看到执行的日志信息。
![Run Script](http://SunnyRx.github.io/img/in-post/post-UIAutomation-runScript.png)

接下来，可以跟着原文学习更多UIAutomation的操作。
这里要提醒的是，原文有一段Test-1.js代码，如下

```
var testName = "Test 1";
var target = UIATarget.localTarget();
var app = target.frontMostApp();
var window = app.mainWindow();
UIALogger.logStart( testName );
app.logElementTree();
//-- select the elements
UIALogger.logMessage( "Select the first tab" );
var tabBar = app.tabBar();
var selectedTabName = tabBar.selectedButton().name();
if (selectedTabName != "First") {
    tabBar.buttons()["First"].tap();
}
//-- tap on the text fiels
UIALogger.logMessage( "Tap on the text field now" );
var recipeName = "Unusually Long Name for a Recipe";
window.textFields()[0].setValue(recipeName);
target.delay( 2 );
//-- tap on the text fiels
UIALogger.logMessage( "Dismiss the keyboard" );
app.logElementTree();
app.keyboard().buttons()["return"].tap();
var textValue = window.staticTexts()["RecipeName"].value();
if (textValue === recipeName){
    UIALogger.logPass( testName ); 
}
else{
    UIALogger.logFail( testName ); 
}
```

直接执行这段代码会返回issue（或error），提示`Cannot perform action on invalid element：UIAElementNil from  target.frontMostApp().keyboard().buttons()["return"]`。错误在

```
app.keyboard().buttons()["return"].tap();
```

这一句，根据在知乎中[王欣](https://www.zhihu.com/people/wang-xin-97-55)的[一个问题回答](https://www.zhihu.com/question/22178379/answer/24594521)
>通过app.logElementTree();这行可以看到所有的元素,"return"键的真正名称是"Return"
所以只要讲上面的代码改为下面的代码即可。

```
app.keyboard().buttons()["Return"].tap();
```