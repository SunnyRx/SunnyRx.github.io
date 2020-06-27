---
layout:     post
title:      "Cocos2d-x 在Xcode的Undefined symbols for architecture x86_64错误"
subtitle:   "Cocos2d-x : About Undefined symbols for architecture x86_64 Error"
date:       2016-01-14
author:     "SunnyRx"
header-img: "img/post-bg-gray.webp"
tags:
    - Xcode
    - Mac
    - iOS
    - 编程
---

在Windows环境下用`cocos2d-x`完成了一个程序，搬到Mac后编译出错，出错信息如下。

```
Undefined symbols for architecture x86_64:
  "EasyButton::createEasyButton(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const&, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const&, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const&)", referenced from:
      SettingScene::init() in SettingScene.o
  "RadioButton::createRadioButton(EasyButton*, ...)", referenced from:
      SettingScene::init() in SettingScene.o
  "RadioButton::getSelectedNumber()", referenced from:
      SettingScene::test() in SettingScene.o
  "RadioButton::setSelectedNumber(int)", referenced from:
      SettingScene::init() in SettingScene.o
  "ScriptReader::jumpToSign(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const&)", referenced from:
      GameScene::showSelect(std::__1::map<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >, std::__1::less<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > >, std::__1::allocator<std::__1::pair<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > > > >&)::$_4::operator()(cocos2d::Ref*) const in GameScene.o
  "ScriptReader::jumpToSign(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const&, int)", referenced from:
      GameScene::reloadScene() in GameScene.o
  "ScriptReader::nextScript()", referenced from:
      GameScene::init() in GameScene.o
      GameScene::dialogClicked() in GameScene.o
      GameScene::autoPlay(float) in GameScene.o
  "ScriptReader::getInstance()", referenced from:
      GameScene::init() in GameScene.o
      GameScene::reloadScene() in GameScene.o
      GameScene::dialogClicked() in GameScene.o
      GameScene::autoPlay(float) in GameScene.o
      GameScene::createGameDate() in GameScene.o
      GameScene::showSelect(std::__1::map<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >, std::__1::less<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > >, std::__1::allocator<std::__1::pair<std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > const, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> > > > >&)::$_4::operator()(cocos2d::Ref*) const in GameScene.o
      GameSystem::saveGameSceneInfo(int) in GameSystem.o
      ...
  "ScriptReader::initWithStage(cocos2d::Node*)", referenced from:
      GameScene::init() in GameScene.o
  "ScriptReader::loadScriptFile(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >)", referenced from:
      GameScene::init() in GameScene.o
  "ScriptReader::getCurrentSignName()", referenced from:
      GameScene::createGameDate() in GameScene.o
      GameSystem::saveGameSceneInfo(int) in GameSystem.o
  "ScriptReader::getCurrentCommandIndex()", referenced from:
      GameScene::createGameDate() in GameScene.o
      GameSystem::saveGameSceneInfo(int) in GameSystem.o
  "CharactorManager::getInstance()", referenced from:
      GameScene::displayCharator(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >) in GameScene.o
      GameScene::unDisplayCharator(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >) in GameScene.o
      GameScene::reloadScene() in GameScene.o
  "CharactorManager::getCharactor(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >&)", referenced from:
      GameScene::displayCharator(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >) in GameScene.o
      GameScene::unDisplayCharator(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >) in GameScene.o
      GameScene::reloadScene() in GameScene.o
  "BackgroundManager::getInstance()", referenced from:
      GameScene::changeBackground(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >&) in GameScene.o
      GameScene::reloadScene() in GameScene.o
  "BackgroundManager::getBackground(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >)", referenced from:
      GameScene::changeBackground(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >&) in GameScene.o
      GameScene::reloadScene() in GameScene.o
  "BackgroundMusicManager::getInstance()", referenced from:
      GameScene::playBackgroundMusic(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >&) in GameScene.o
  "BackgroundMusicManager::getBackgroundMusic(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >)", referenced from:
      GameScene::playBackgroundMusic(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >&) in GameScene.o
  "Slidebar::createSlidebar(std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >, std::__1::basic_string<char, std::__1::char_traits<char>, std::__1::allocator<char> >)", referenced from:
      SettingScene::init() in SettingScene.o
  "Slidebar::getFloat()", referenced from:
      SettingScene::changeMusicVolume() in SettingScene.o
  "Slidebar::setFloat(float)", referenced from:
      SettingScene::init() in SettingScene.o
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

首先留意到的是第一句话：`Undefined symbols for architecture x86_64`
可能是不支持x86_64，在`Build Settings->Architectures->Architectures`和`Build Settings->Architectures->Valid Architectures`可以改变设置。根据搜索到的方法进行改变设置后在编译时会出现其他错误（可能是改变设置的方法不对，所以在这里不展示改变设置的方法），而在不改变设置的情况下编译HelloWorld程序成功并且正常运行，因此推断与是否支持x86_64无关。

大部分错误都涉及`std::map`。
可能`C++`编译设置有问题，在`Build Settings->Apple LLVM 7.0 - Language - C++`中对`C++ Language Dialect`和`C++ Standard Library`进行设置，分别设置为`C++11[-std=C++11]`和`libc++`或者两个都设置为`Compilder Default`。项目中默认已经设置为后者，同时单独写了一个调用`std::map`的方法，编译成功且正常运行，因此推断与设置无关。

所有错误表示，找到了方法的声明但找不到对应的实现。
检查了`Xcode`项目中的`Classes`文件夹，所有`.h`文件和`.cpp`均在其中。

而最终解决问题的方法是将Classes文件夹中的内容拖入Xcode目录中时，弹出的对话框`Choose options for adding these files:`中的`Added folders`选择`Create groups`，问题则解决。
![Choose options对话框](/img/in-post/post-XcodeError.webp)

尽管标题带有`Cocos2d-x`，实际上跟`Cocos2d-x`没有一点关系。
另外要注意，将`Resources`文件夹拖入`Xcode`目录时，应该选择`Create folder references`。