# flutter基础

## flutter构建建界面的基本单位widget

`widget`分为`StatelessWidget`和`StatefulWidget`两种类型。`StatelessWidget`用于渲染静态的，无状态的视图组件，而`StatefulWidget`则适用于有交互，需要动态变更组件状态的组件。这两种组件的区别类似于`React`中有状态组件于无状态组件的区别。

### StatelessWidget

在`flutter`中，有些`Widget`（比如`Text`、`Container`、`Row`、`Column`等）在创建时，除了构建时的配置参数外不依赖于任何其他信息，一旦创建成功，不在响应任何数据变化进行重绘，这种`Widget`被称为`StatelessWidget`（无状态组件）。

### StatefulWidget

在构建界面的过程，我们不仅需要静态的纯展示性组件，还需要能够处理用户交互或响应组件内部数据变化的有状态组件。

以下为`flutter`给出的`StatefulWidget`例子

```
class RandomWords extends StatefulWidget {
	@override
	RandomWordsState createState() => RandomWordsState();
}

class RandomWordsState extends State<RandomWords> {
	@override
	Widget build(BuildContext context) {
		// TODO
	}
}
```

### 生命周期

#### State生命周期

`State`的生命周期指的是与其相关联的`Widget`所经历的从创建显示更新到最后停止销毁的各个过程阶段。

| 方法名                | 功能                           | 调用时机                           |
| --------------------- | ------------------------------ | ---------------------------------- |
| 构造函数              | 接收父组件传递的初始化配置信息 | 创建State时                        |
| initState             | 与渲染相关的初始化工作         | State被插入视图树时                |
| didChangeDependencies | 处理State对象依赖关系变化      | State对象依赖关系变化时            |
| build                 | 构建视图                       | 组件需要根据State来渲染时          |
| setState              | 触发视图重建                   | UI界面需要根据状态变更刷新时       |
| didUpdateWidget       | Widget接收的配置信息变化       | 父组件setState触发子组件更新重建时 |
| deactivate            | 组件移除                       | 组件不可见                         |
| Dispose               | 组件销毁                       | 组件被永久移除                     |

#### App生命周期

