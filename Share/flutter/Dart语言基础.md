# Dart语言基础

## 一个栗子

这是官网给出的例子：

```dart
// Define a function.
printInteger(int aNumber) {
  print('The number is $aNumber.'); // Print to console.
}

// This is where the app starts executing.
main() {
  var number = 42; // Declare and initialize a variable.
  printInteger(number); // Call a function.
}
```

## 常见数据类型与变量

在Dart中我们可以用关键字`var`来声明变量，也可以用具体的类型来声明变量。用`var`声明的变量类型由编译器来推断决定。声明后未初始化的变量默认是`null`。

Dart是强类型语言。我们存储在变量中的所有值包括num、function和null等都是对象，所有对象都是继承自`Object`对象。

Dart内置了一些基本数据类型，如`num`、`bool`、`String`、`List`和`Map`。

### num、bool和String

Dart的数值类型分为双精度整型`int`和双精度浮点型`double`。

```dart
num number = 1;
int x = 1;
double y = 1.1;
```

Dart中bool类似的对象只有`true`和`false`两个。

```dart
num number = 1;
if (number != 0) {
    // todo
}
```

这里要注意Dart是类型安全的语言，我们不可以用`if(number)`这种可以在JavaScript中正常运行的代码，而应该显示的将`number`与`0`做比较。

Dart的`String`和`JavaScript` 一样，可以用单引号或双引号构造字符串字面量，在字符串中可以用`${express}`嵌入变量或者表达式，如果是一个标识符，可以省略`{}`。

```dart
String name = 'xiaoming';
String words = 'hello, $name';
```

对于多行表达式，可以用三个单引号或者三个双引号声明：

```dart
String str = '''
This is a
multi-line string
''';
```

### List和Map

`Dart`中的`List`和`Map`对应其他编程语言中的数组和字典。

```dart
var arr1 = ['Tom', 'Andy', 'Jack'];
var arr2 = List.of([1, 2, 3]);
arr2.add(4);
arr2.forEach((v) => print(v));

var map1 = {
  'name': 'Tom',
  'sex': 'male'
};
var map2 = Map();
map2['name'] = 'Tom';
map2['sex'] = 'male';
map2.forEach((k, v) => print('$k: $v'));
```

容器中的元素是需要有类型的，如上述代码中的`arr1`类型是`List<String>`,`arr2`类型是`List<int>`,`map1`和`map2`类型是`Map<String, String>`。所以如果我们向`arr2`中插入非`int`类型数据会导致编译器报错，如`arr2.add(1.1)`。我们在声明列表和字典时也可以显式的将类型声明出来。

### 常量

在`Dart`中我们可以在变量定义前加`final`或`const`关键字来声明一个不可变变量。

* `const`表示编译时可确定的常量；

* `final`表示运行时确定的值；

```dart
const x = 10;
var y = 5;
final z = y / 2;
```

## Dart中的函数与类

### 函数

在`Dart`中一切皆对象，函数也不例外，类型为`Function`。所以函数也可以当做变量或者定义为函数的参数。

```dart
bool isZero(int number) {
  return number == 0;
}

void printInfo(int number, Function checkFn) {
  print('$number is Zero: ${checkFn(number)}');
}

Function f = isZero;
int x = 10;
int y = 0;
printInfo(x, f);
printInfo(y, f);
```

当函数的函数体只有一行表达式时，函数可以简写为箭头函数的形式：

```dart
bool isZero(int number) => number == 0;

void printInfo(int number, Function checkFn) => print('...');
```

在传参时，`Dart`还提供了可选命名参数和可选参数的形式降低函数调用的成本。

* 可选命名函数：参数用`{}`包裹起来，以`key: value`的形式指定参数
* 可选参数：参数用`[]`包裹起来，这些参数是可以忽略的。

```dart
// 普通的参数定义
void enableFlags(bool bold, bool hidden) => print('$bold, $hidden');
// 函数调用
enableFlags(true, false); // true, false

// 可选命名参数的定义
void enableFlags({bool bold, bool hidden}) => print('$bold, $hidden');
// 函数调用
enableFlags(bold: true, hidden: false); // true, false
enableFlags(bold: true); // true, null
enableFlags(hidden: false); // null, false

// 可选参数的定义
void enableFlags(bool bold, [bool hidden]) => print('$bold, $hidden');
// 函数调用
enableFlags(true, false); // true, false
enableFlags(true); // true, null

// 可选命名函数还可以和普通函数组合使用
void enableFlags(bool bold, {bool hidden}) => print('$bold, $hidden');
// 函数调用
enableFlags(true, hidden: false); // true, false
```

在定义函数时，我们可以用`=`来定义参数的默认值，默认值只能是编译时常量

```dart
void enableFlags(bool bold = true, bool hidden = false) => print('$bold, $hidden');

void enableFlags(bool bold, [bool hidden = false]) => print('$bold, $hidden');

void enableFlags({bool bold = true, bool hidden = false) => print('$bold, $hidden');
```

### 类

`Dart`是面向对象的语言，每个对象都是一个类的实例，继承自顶级类型`Object`。

```dart
class Point {
  // 定义实例属性
	num x, y;
  // 定义静态属性
  static num factor = 0;
  // 构造函数
  Point(this.x, this.y);
  // 实例方法
  void printInfo() => print('($x, $y)');
  // 静态方法
  static void printZValue() => print('$factor');
}
```

#### Constructors

在类中定义一个和类名一样的方法就定义了一个构造函数，`Dart`还支持命名构造函数，为一个类实现多个构造函数。

```dart
class Point {
  num x;
  num y;
  Point(num x, num y) {
    this.x = x;
    this.y = y;
  }
  Point.fromJson(Map json) {
    x = json['x'];
    y = json['y'];
  }
}
```

由于构造函数参数赋值给实例变量的场景太常见了，我们可以用语法糖来简写这一操作：

```dart
class Point {
  num x;
  num y;
  Point(this.x, this.y);
  ...
}
```

`Dart`在构造函数执行之前还可以初始化列表，执行一些初始化操作，表达式之间用逗号分隔：

```dart
class Point {
  num x;
  num y;
  Point(this.x, this.y);
  Point.fromJson(Map json) : x = json['x'], y = json['y'] {
    print('($x, $y)');
  }
}
```

#### 代码复用

在`Dart`中提供了三种代码复用的方式：

* 继承，子类继承父类的方法和属性，可以在子类中重写父类方法；
* 接口实现，子类复用接口的属性及方法定义，需要在子类中重新声明和实现这些方法和属性；
* 混入，使用一个或多个类中的属性和方法

```dart
class Point {
  num x = 0;
  num y = 0;
  void printInfo() => print('($x, $y)');
}

// 继承Point
class Vector extends Point {
  num z = 0;
  
  @override
  void printInfo() => print('($x, $y, $z)');
}

// 对Point的接口实现
class Coordinate implements Point {
  // 需要重新声明接口中定义的成员变量
  num x = 0;
  num y = 0;
  // 成员方法也需要重新声明实现
  void printInfo() => print('($x, $y)');
}

Vector xxx = Vector();
xxx
  ..x = 1
  ..y = 2
  ..z = 3;
xxx.printInfo(); // (1, 2, 3)

Coordinate yyy = Coordinate();
yyy
  ..x = 1
  ..y = 2;
yyy.printInfo(); // (1, 2);

assert(yyy is Point);
assert(yyy is Coordinate);
```

在`Dart`中，继承只能继承一个父类，从而避免了其他面对对象语言中的常见的‘菱形问题’，当我们需要复用多个类的方法时，我们可以采用混入（Mixin）。

```dart
class Coordinate with Point {}

Coordinate yyy = Coordinate();
yyy.printInfo(); // (0, 0);

assert(yyy is Coordinate);
assert(yyy is Point);
```

当一个类有多个`mixin`时，多个`mixin`以逗号分隔，当多个`mixin`中定义了同名属性或方法时，后面的覆盖前面的。

#### 运算符

在`Dart`中，一切都是对象，即使运算符也是对象的成员方法的一部分。因此我们不仅可以复写对象的方法，也可以复写甚至自定义对象的运算符。

```dart
class Vector {
  num x;
  num y;
  
  Vecotr(this.x, this.y);
  // 自定义两个Vector对象执行相加操作时的处理
  Vector operator +(Vector vector) => Vector(x + vector.x, y + vector.y);
  // 覆写相等运算符
  bool operator ==(dynamic v) => x == v.x && y == v.y;
}

final x = Vector(1, 1);
final y = Vector(2, 2);
final z = Vector(3, 3);
print(z == (x + y)); // true
```
