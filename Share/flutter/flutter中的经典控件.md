# flutter中的经典控价

## 文本控件

文本空间`Text`用来在视图中显示一段特定样式的字符串。类似于`h5`中的`p`标签。`Text`支持两种类型的文本展示，一个展示单一默认样式的文本`Text`，另一个是支持多张混合样式的富文本`Text.rich`。

```dart
Text(
	'flutter中的Text类似于h5中的p标签',
  textAlign: TextAlign.center, // 居中显示
  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.red)
);

// 在flutter中多种样式文字混排就类似于h5中在p标签内插入span，并给span不同的样式
Text.rich(
	TextSpan(
  	children: <TextSpan>[
      TextSpan(text: '文本控件Text类似于'， style: TextStyle(fontWeight: FontWeight.normal, fontSize: 20, color: Colors.black)),
      TextSpan(text: 'h5'， style: TextStyle(fontWeight: FontWeight.normal, fontSize: 20, color: Colors.black)),
      TextSpan(text: '中的'， style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.red)),
      TextSpan(text: 'p标签'， style: TextStyle(fontWeight: FontWeight.normal, fontSize: 20, color: Colors.black)),
    ]
  ),
  textAlign: TextAlign.center,
);
```

## 图片

我们可以使用`Image`控件向用户展示一张图片。针对不同来源图片，`flutter`提供了不同的方式来加载。

* `Image.asset('path/to/image');`加载本地资源图片
* `Image.file(new File('path/to/local/image/file');`加载本地（File文件）图片
* `Image.network('http://www.xxx.com/xxx.png');`加载网络图片

对于图片展示，如果需要实现网络加载图片时的占位图和加载动画等功能，可以用到`FadeInImage`组件。

```dart
FadeInImage.assetNetwork(
	placeholder: 'assets/loading.gif',
  image: 'https://xxx/xxx/xxx.jpg',
  fit: BoxFit.cover,
  width: 200,
  height: 200
);
```

还有更加强大的`CacheNetworkImage`组件：

```dart
CacheNetworkImage(
	imageUrl: 'http://xxx/xxx/xxx.jpg',
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error)
);
```

## 按钮

`flutter`提供了三种基本的按钮控件，`FloatingActionButton`、`FlatButton`、`RaisedButton`。这三种按钮使用方式类似，主要差别在与样式不同。

```dart
FloatingActionButton(child: Icon(Icons.add), onPressed: () => print('pressed'));
FlatButton(child: Text('Button'), onPressed: () => print('pressed'));
RaisedButton(child: Text('Button'), onPressed: () => print('pressed'));

FlatButton(
	color: Colors.yellow, // 背景颜色
  shape: BeveledRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
  colorBrightness: Brightness.light,
  onPressed: () {},
  child: Row(children: <Widget>[Icon(Icons.add), Text('add')],)
);
```

## ListView

在`flutter`中，`ListView`可以创建水平或垂直方向的列表。列表中元素作为子`Widget`的方式插入到`ListView`的`children`参数中。

```dart
ListView(
	children: <Widget>[
    ListTile(leading: Icon(Icons.map), title: Text('Map')),
    ListTile(leading: Icon(Icons.mail), title: Text('Mail')),
    ListTile(leading: Icon(Icons.message), title: Text('Message'))
  ]
);
```

使用`ListView`的问题比较明显：它会一次性将列表中的元素全部渲染出来，当列表中元素较多时会出现性能问题。通常我们用`ListView`来渲染数据量较小的列表。

当我们有渲染数据量较大的列表视图的需求时，我们可以使用`ListView`的另一个构造函数`ListView.builder`。

```dart
ListView.builder(
	itemCount: 100, // 元素个数
  itemBuilder: (BuildContext context, int index) => ListTile(title: Text('title'), subTitle: Text('$index')) // 列表项的创建方法
);
```

`ListView.builder`通过`itemBuilder`参数提供的方法在列表滚动到对于位置时，调用该方法动态创建元素，从而避免了一次渲染列表所有元素导致的性能问题。

`ListView`的另一个构造函数`ListView.separated`通过提供`separatorBuilder`参数，抽离了分割线的创建方法。

```dart
ListView.separated(
	itemCount: 100,
  separatorBuilder: (BuildContext context, int index) => index % 2 == 0 ? Divider(color: Colors.green) : Divider(color: Colors.red),
  itemBuilder: (BuildContext context, int index) => ListTile(title: Text('title'), subTitle: Text('$index'))
);
```

除了使用`ListView.separated`提供的`separatorBuilder`方法创建分割线，我们可以将分割线当做列表项的一部分在`itemBuilder`参数的列表项的创建方法中创建分割线。

## ScrollController和ScrollNotification

在某些开发场景下，我们可能需要获取滚动视图的滚动信息，并进行相应的控制。如，判断列表是否滑到顶（底），直接返回列表顶部，列表是否开始滚动或停止等。

对于列表的控制，我们可以使用`ScrollController`，对于列表信息的监控，我们则可以使用`ScrollNotification`。

```dart
class MyAppState extends State<MyApp> {
  ScrollController _controller;
  bool isToTop = false;
  
  @override
  void initState() {
    _controller = ScrollController();
    _controller.addListener(() {
      if (_controller.offset > 1000) {
        setState(() {isToTop = true;});
      }
      if (_controller.offset < 300) {
        setState(() {isToTop = false;});
      }
    });
    super.initState();
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  Widget build(BuildContext context) {
    return MaterialApp(
    	RaisedButton(
      	onPressed: () {
          if (isToTop) {
            _controller.animateTo(.0, duration: Duration(milliseconds: 200), curve: Curves.ease);
          }
        },
        child: Text('Top')
      ),
      ListView.builder(
      	controller: _controller,
        itemCount: 100,
        itemBuilder: (context, index) => ListTile(title: Text('index: $index')),
      ),
    );
  }
}
```

