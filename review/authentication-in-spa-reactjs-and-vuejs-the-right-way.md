# 在reactjs和vuejs中做认证系统的正确方式（译）

> 原文链接[Authentication in SPA (ReactJS and VueJS) the right way](https://medium.com/@jcbaey/authentication-in-spa-reactjs-and-vuejs-the-right-way-e4a9ac5cd9a3)

Cookie, session, token, JWT, 网络攻击, 何处存储token, 安全顾虑? 所有你需要知道的都在这里。

## TL;DR;

在单页应用中做权限认证有一些好的和坏的模式。这篇文章将会列举一些在做用户认证时需要知道和了解的重要概念，尤其是在以下这种通用架构中：

## 安全先决条件

### 加密传输（httpS)

* 当通过HTTP请求头来认证和交换高敏感度信息（密码，token，……）时，传输过程必须要加密进行，否则别人通过查看网络请求就可以抓取到这些信息。

### 不要使用URL的query参数来传输敏感信息

* URL和URL参数可能会被保存在服务器日志上，浏览器日志和浏览器历史记录上：别人可以在这些地方获取到我们的敏感信息并拿来重用。
* 没有经过训练的用户可能会复制粘贴一个携带有用户认证信息的URL导致一个预期情况外的session劫持。
* 你可能会遇到浏览器和服务器的URL长度限制。

### 防止暴力破解攻击

* 攻击者可能通过大量的尝试来推断密码，token和用户名。
* 你的后端服务器应该通过次数限制来限制尝试次数。
* 禁止或者延迟造成了太多次（300+，400+，500+）服务器错误的用户访问。
* 不要给出可以推理出你使用技术的线索，比如：删除请求头中告诉用户你使用那种服务的`X-Powered-By`。如果你使用ExpressJS的话可以采用Helmetjs。

### 定期更新你的依赖

* 更新你的NPM包避免使用有安全问题的依赖包。

```bash
# List security breaches 
npm audit
# Upgrade of minor and patch version following your version ranges in package.json
yarn outdated
yarn update
# Interactive upgrade of minor and patch version following your version ranges in package.json 
yarn upgrade-interactive
# List outdated dependencies including major version
yarn upgrade-interactive --latest
# Same with npm
npm outdated
npm update
# Tool for upgrading to major versions (with potential breaking changes)
npm install -g npm-check-updates
ncu
```

* 如果不是使用Paas，保证你的服务器处于最新状态。

### 增加监视器

增加监视器在事故发生前及时发现异常问题。

## 认证

现在有两种主流的认证方式在一个REST API中辨认一个客户端：

* Bearer Token

* Authentication Cookie

## Bearer Token

### 什么是Bearer Token?

Bearer Token 是一个保存在所有请求头Authentication中的值。它不会自动在任何地方存储，没有过期时间，也和域没有关系，只是个值。

```http
GET https://www.example.com/api/users
Authorization: Bearer my_bearer_token_value
```

为了创建一个无状态应用，我们可以用[JWT](https://jwt.io/introduction/?source=post_page---------------------------)来格式化我们的token。基本上，一个JWT包含三个部分：

* 头部
* 载荷（保存用户ID和用户角色） + 过期时间（可选）
* 签名

JWT是一种让无状态身份验证成为可能的加密信息的安全加密方法。签名通过对称或非对称签名证明载荷尚未被修改。头部包含格式化的公钥地址来验证签名。

基本上，客户端应用在用户名和密码验证通过的同事获取到一个JWT token。

感谢JAVASCRIPT，接下来他发送所有请求到服务器都会在HTTP请求头中携带JWT token。服务端验证签名和载荷是否对应，如果匹配成功，服务端就处理我们的载荷内容。

### 基本用例

* 保护浏览器端和对应服务端之间的的通信
* 保护手机应用，桌面应用和对应后端的通信
* 保护不同团队或一个团队的后端服务之间的通信

### 何处存储JWT?

我们需要手动在客户端（内存，local/session，cookie, local storage, etc...）存储JWT

不建议将JWT存储在浏览器的localstorage中：

* 在用户关闭浏览器后它依然会被保留知道jwt过期

* 你页面内的所有JavaScript代码都可以访问local storage：没有任何数据保护措施

* 不能被[web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers?source=post_page---------------------------)使用

在session cookie中存储jwt可能是解决这个问题，我们之后再说这个。

### 基本攻击手段

* [跨站脚本攻击](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)?source=post_page---------------------------)(XSS)是最常见的JavaScript处理的安全问题：攻击者可能会根据网站的JS依赖关系或者用户输入来注入恶意代码窃取受害者的JWT。然后攻击者利用它来冒充用户。

* 比如，在一个博客的评论中，用户可以在他的评论内容中加入JS代码来在页面上执行客户端JS：

```html
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```

跨站脚本攻击可以通过转义和控制用户输入来避免，但是检测和避免公共CDN服务提供的有害web依赖可能比较困难。

## cookie认证

cookie是存储在web服务器中有过期日期和相关域名的一个键值对。可以通过浏览器客户端的JavaScript来创建：

```javascript
document.cookie = ‘my_cookie_name=my_cookie_value’ // JavaScript
```

或者在服务端通过HTTP响应头来创建：

```http
Set-Cookie: my_cookie_name=my_cookie_value // HTTP Response Header
```

web浏览器根据cookie的域名在相关的每个请求中自动携带cookie信息：

```http
GET https://www.example.com/api/users
Cookie: my_cookie_name=my_cookie_value
```

在大多数（有状态）的使用场景中，cookie被用来存储session ID。session ID由服务端来控制（创建和过期）。我们谈论有状态是因为服务端需要管理服务端的状态然而JWT token是无状态的。

cookies分两种：

* 暂时性cookies：这种cookie在客户端关闭时删除因为它不具体申明一个过期时间或者是最大生命周期指令。然而，web浏览器可能或重新存储导致暂时性的cookie变成永久的就像浏览器永远不关闭一样。session的过期必须由服务端来控制。

* 永久性cookies：永久性cookie在一个特定的时间点（Expires）或者过了一个特定长度的时间（Max-Age）过期而不是在客户端关闭时过期。

服务端cookie可以通过一些配置项来配置：

* HttpOnly cookies: 浏览器端的javascript无法读取。

* Secure cookies： 浏览器只会在一个通过安全通道传输的HTTP请求中携带。

* SameSite cookies: cookie允许服务器要求不应该使用跨站点请求发送cookie以防止跨站点请求伪造攻击（CSRF）。 SameSite cookie仍处于试验阶段，尚未得到所有浏览器的支持。

### 基本用例

* 保护浏览器和特定后端服务的通信

* 不基于浏览器的应用很难使用你的API

### 在哪里存储cookies？

它们自动存储在浏览器中并带有一个可选的过期时间和相关域名。

### 基本的攻击手段

* 跨站脚本攻击（XSS) 如果cookies创建时没有HttpOnly选项：攻击者可以注入JavaScript代码窃取受害者的认证cookies。

* 跨站脚本伪造（CSRF）是一种常见的针对认证cookies的攻击手段。CORS（跨源资源共享）配置可以在服务器端完成，仅授权特定的主机名。但是，浏览器会在客户端检查CORS。更糟糕的是，CORS给出的相同原始策略仅适用于浏览器端编程语言。因此，如果您尝试使用JavaScript发布到与源服务器不同的服务器，则相同的源策略将起作用，但如果您直接从HTML表单发布，则该操作可以指向不同的服务器，如：

```html
<form action="http://someotherserver.com">
```

由于在发布表单时没有涉及javascript，因此相同的原始策略不适用，并且浏览器正在将cookie与表单数据一起发送。

CSRF的另一个例子：我们假设用户在登录facebook.com时访问bad.com上的页面。现在，bad.com属于攻击者，他在bad.com上编码了以下内容：

```html
<img src="https://facebook.com/postComment?userId=dupont_123&comment=I_VE_BEEN_HACKED>
```

为了减少XSS，必须在cookies上设置HttpOnly选项。

要缓解CSRF，必须在cookie上设置SameSite选项。并非所有浏览器都支持SameSite选项，因此它不会阻止所有CSRF攻击。可以使用其他一些缓解策略（可以组合使用）：

* 较短的session过期时间（金融相关域名过期时间是10分钟或者更短）。

* 关键操作应始终询问用户凭据（例如，在更改用户电子邮件地址的表单中询问用户密码）

* 双提交的cookie：当用户访问某个站点时，除了httpOnly身份验证cookie之外，该站点还应生成一个（加密强大的）伪随机值并将其设置为用户机器上的cookie（不含httpOnly标志，以便从JS获取） 。该网站应要求每个表单提交包括此伪随机值作为表单值以及cookie值。当POST请求发送到站点时，只有表单值和cookie值相同时才应认为该请求有效。当攻击者代表用户提交表单时，他只能修改表单的值。根据同源策略，攻击者无法读取从服务器发送的任何数据或修改cookie值。这意味着虽然攻击者可以使用表单发送他想要的任何值，但他将无法修改或读取存储在cookie中的值。由于cookie值和表单值必须相同，因此攻击者将无法成功提交表单，除非他能够猜测伪随机值（源）或从同时的XSS攻击中窃取该值。

## 我们可以结合这两者吗

让我们总结一下我们在服务器API上寻找认证机制的方法：

* 支持浏览器和M2M通话

* 尽量避免XSS和XSRF

* 无状态

将JWT放入cookie中以获得两全其美的效果如何？

我们的API应该支持来自请求头的JWT持票人令牌以及会话cookie中的JWT。如果我们想要授权javascript读取JWT有效负载，我们可以通过组合两种类型的cookie来使用两种cookie身份验证方法，以便XSS攻击面受到限制。

![示意图一](./img/1_tgOxvSwCLXv1vFowS_CVJQ.png)

JWT可以由服务器每个请求无缝的更新，因为新的请求将在cookie响应中并由浏览器自动存储。这样，可以后退JWT的到期日期。

为了限制CSRF，绝不应该使用GET查询进行突变，使用PUT或POST。具有高安全性问题的突变应该再次询问用户凭据，例如，更改电子邮件突变应该询问用户密码以验证更改。临时cookie还可以嵌入由JS读取的随机数，并在表单数据中提交隐藏表单字段。服务器必须检查cookie中的随机数是否与表单数据中的值匹配。

![示意图二](./img/1_QzXwoCIKLBfKdbGBu1BKdA.png)

## 总结

我们单页应用的认证流程如下：

* 第一步，我们的SPA应用程序检查是否存在具有JWT有效负载的cookie，如果是，则用户已经过身份验证，否则SPA将重定向到`/login`页面。如果您使用单个httpOnly cookie，SPA应该进行API调用，例如，`/backend/api/me`以了解当前用户是谁并且如果缺少身份验证cookie（包含JWT）则会收到未经授权的错误或无效。

* 第二步，选择一：前端的`/login`页面询问用户凭据（登录/密码），然后使用AJAX请求在后端API上发布它们。 AJAX响应将在内部设置JWT的身份验证cookie。

* 第三步，选择二：`/login`页面使用OAuth流提供OpenID身份验证。对于授权代码授权流程，`/login`应将整个浏览器窗口重定向到`/backend/auth/<provider>`。应该完成OAuth流程，后端应该在最后一个响应中使用JWT设置身份验证cookie。然后它会将浏览器重定向到前端。 SPA将再次启动，因此请再次执行步骤1。
