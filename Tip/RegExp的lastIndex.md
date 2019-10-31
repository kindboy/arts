# RegExp的lastIndex属性

> 我注意到这个属性是因为踩坑了。

首先来个例子：

```js
const re = /(hi)+/g;

console.log(re.test('hi')); // => true
console.log(re.test('hi')); // => false
```

肯定有同学和我第一次碰到时一样感到意外。查过`MDN`文档后发现了`RegExp`还有`lastIndex`这么个属性。

> `lastIndex`是正则表达式的一个可读可写的整型属性，用来指定下一次匹配的起始索引。
    只有正则表达式使用了表示全局检索的 "g" 标志时，该属性才会起作用。此时应用下面的规则：
    * 如果 lastIndex 大于字符串的长度，则 regexp.test 和 regexp.exec 将会匹配失败，然后 lastIndex 被设置为 0。
    * 如果 lastIndex 等于字符串的长度，且该正则表达式匹配空字符串，则该正则表达式匹配从 lastIndex 开始的字符串。（then the regular expression matches input starting at lastIndex.）
    * 如果 lastIndex 等于字符串的长度，且该正则表达式不匹配空字符串 ，则该正则表达式不匹配字符串，lastIndex 被设置为 0.。
    * 否则，lastIndex 被设置为紧随最近一次成功匹配的下一个位置。

描述一大堆，看个例子就明白了：

```javascript
const re = /(hi)+/g;

console.log(re.lastIndex); // => 0
console.log(re.test('hi')); // => true
console.log(re.lastIndex); // => 2
console.log(re.test('hi')); // => false
console.log(re.lastIndex); // => 0
```

在全局检索模式下，正则表达式的匹配都会从索引为`lastIndex`的位置开始。

知道了问题的原因，要避免也就很容易了，我们可以写个拷贝正则表达式的公用方法：

```javascript
const cloneRegExp = regExp => new RegExp(regExp.source, regExp.flags);

const re = /(hi)+/g;

// 用cloneRegExp(re)替换之前的re
console.log(cloneRegExp(re).test(('hi'))); // => true
console.log(cloneRegExp(re).test(('hi'))); // => true
```
