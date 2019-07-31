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
