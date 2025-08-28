# @massong/wxwork

[![npm version](https://badge.fury.io/js/%40massong%2Fwxwork.svg)](https://badge.fury.io/js/%40massong%2Fwxwork)
[![npm downloads](https://img.shields.io/npm/dm/@massong/wxwork.svg)](https://www.npmjs.com/package/@massong/wxwork)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/@massong/wxwork.svg)](https://nodejs.org/)

企业微信 API 封装库，提供简洁易用的企业微信接口调用方法。

## ✨ 特性

-   🚀 **零外部依赖** - 仅使用 Node.js 原生模块，无需 axios 等第三方库
-   📦 **多模块支持** - 同时支持 CommonJS 和 ES Module
-   🔧 **简单易用** - 直观的 API 设计，快速上手
-   🛡️ **TypeScript 支持** - 完整的类型定义，开发体验更佳
-   📝 **完善日志** - 详细的错误处理和操作日志
-   ⚡ **轻量高效** - 打包体积小，性能优异
-   🔄 **智能缓存** - 自动 token 管理和缓存机制
-   🌐 **功能完整** - 覆盖企业微信主要 API 功能

## 📦 安装

```bash
npm install @massong/wxwork
```

或使用 yarn：

```bash
yarn add @massong/wxwork
```

## 🚀 快速开始

### 导入

```javascript
const { wxwork } = require('@massong/wxwork');
```

### 基础配置

```javascript
const { wxwork } = require('@massong/wxwork');

// 方式1: 单独设置
wxwork.setCorpid('your_corp_id');
wxwork.setCorpsecret('your_corp_secret');
wxwork.setAgentid('your_agent_id');

// 方式2: 批量设置（支持链式调用）
wxwork.setConfig({
	corpid: 'your_corp_id',
	corpsecret: 'your_corp_secret',
	agentid: 'your_agent_id',
});

// 获取配置信息
const config = wxwork.getConfig();
console.log('当前配置:', config);
```

### 基础使用

```javascript
async function example() {
	try {
		// 获取AccessToken（自动缓存）
		const token = await wxwork.getAccessToken();
		console.log('AccessToken:', token);

		// 获取部门列表
		const departments = await wxwork.getDepartmentList();
		console.log('部门列表:', departments);
	} catch (error) {
		console.error('操作失败:', error.message);
	}
}

example();
```

### CommonJS 用法

```javascript
const { default: wxwork } = require('@massong/wxwork');

// 配置企业微信信息
wxwork.corpid = 'your_corpid';
wxwork.corpsecret = 'your_corpsecret';
wxwork.agentid = 'your_agentid';

// 或者使用批量配置
wxwork.setConfig({
	corpid: 'your_corpid',
	corpsecret: 'your_corpsecret',
	agentid: 'your_agentid',
});

// 获取AccessToken
wxwork.getAccessToken().then((token) => {
	console.log('AccessToken:', token);
});
```

### ES Module 用法

```javascript
import wxwork from '@massong/wxwork';

// 配置企业微信信息
wxwork.corpid = 'your_corpid';
wxwork.corpsecret = 'your_corpsecret';
wxwork.agentid = 'your_agentid';

// 使用async/await
async function main() {
	try {
		const token = await wxwork.getAccessToken();
		console.log('AccessToken:', token);
	} catch (error) {
		console.error('获取token失败:', error.message);
	}
}

main();
```

### 创建新实例

```javascript
// CommonJS
const { WxWork } = require('@massong/wxwork');
// 或者 ES Module
// import { WxWork } from '@massong/wxwork';

const wxworkInstance = new WxWork();
wxworkInstance.setConfig({
	corpid: 'your_corpid',
	corpsecret: 'your_corpsecret',
	agentid: 'your_agentid',
});

// 使用新实例
const token = await wxworkInstance.getAccessToken();
```

### TypeScript 用法

```typescript
import wxwork, { WxWorkConfig, UserDetail } from '@massong/wxwork';

// 配置信息
const config: WxWorkConfig = {
	corpid: 'your_corpid',
	corpsecret: 'your_corpsecret',
	agentid: 'your_agentid',
};

wxwork.setConfig(config);

// 获取用户详细信息
async function getUserInfo(userid: string): Promise<UserDetail> {
	return await wxwork.getUserDetail(userid);
}
```

## 📚 API 文档

### 配置方法

#### `setCorpid(corpid: string): void`

设置企业 ID

-   **参数**: `corpid` - 企业 ID
-   **返回**: 无

#### `setCorpsecret(corpsecret: string): void`

设置应用凭证密钥

-   **参数**: `corpsecret` - 应用凭证密钥
-   **返回**: 无

#### `setAgentid(agentid: string): void`

设置应用 ID

-   **参数**: `agentid` - 应用 ID
-   **返回**: 无

#### `setConfig(config: WxWorkConfig): WxWork`

批量设置配置信息，支持链式调用。

**参数：**

-   `config` (WxWorkConfig): 配置对象
    -   `corpid` (string): 企业 ID
    -   `corpsecret` (string): 应用凭证密钥
    -   `agentid` (string, 可选): 应用 ID

**返回值：** 当前实例，支持链式调用

**示例：**

```javascript
wxwork.setConfig({
	corpid: 'wxd7a075d383ba5643',
	corpsecret: 'your_secret_key',
	agentid: '1000078',
});
```

#### `getConfig(): ConfigInfo`

获取当前配置信息

-   **参数**: 无
-   **返回**: 配置信息对象（敏感信息已脱敏）

### 核心方法

#### `getAccessToken(): Promise<string>`
获取企业微信AccessToken
- **参数**: 无
- **返回**: Promise<string> - AccessToken
- **有效期**: 7200秒（2小时）
- **⚠️ 重要警告**: 频繁请求AccessToken可能导致IP被禁用
- **💡 强烈建议**: 进行持久化存储，避免重复请求

**示例：**
```javascript
const token = await wxwork.getAccessToken();
console.log('AccessToken:', token);
// 建议将token存储到数据库或缓存中，有效期2小时
```

### 用户相关 API

#### `getUserInfo(code: string): Promise<UserInfo>`

通过授权码获取用户信息

-   **参数**: `code` - 授权码
-   **返回**: Promise<UserInfo> - 用户信息对象
-   **说明**: 如果返回 openid 会自动转换为 userid

**示例：**

```javascript
const userInfo = await wxwork.getUserInfo('authorization_code');
console.log('用户信息:', userInfo);
```

#### `getUserInfoByOpenid(openid: string): Promise<UserInfo>`

通过 openid 获取用户信息

-   **参数**: `openid` - 用户 openid
-   **返回**: Promise<UserInfo> - 用户信息对象

#### `getUserDetail(userid: string): Promise<UserDetail>`

获取用户详细信息

-   **参数**: `userid` - 用户 ID
-   **返回**: Promise<UserDetail> - 用户详细信息对象

**示例：**

```javascript
const userDetail = await wxwork.getUserDetail('zhangsan');
console.log(userDetail.name, userDetail.mobile);
```

#### `sendMessage(message: MessageOptions): Promise<SendMessageResponse>`

发送应用消息

-   **参数**: `message` - 消息对象
    -   `touser` (string, 可选): 接收用户 ID，多个用|分隔
    -   `toparty` (string, 可选): 接收部门 ID，多个用|分隔
    -   `totag` (string, 可选): 接收标签 ID，多个用|分隔
    -   `msgtype` (string): 消息类型（text、image、voice、video、file、textcard、news、mpnews、markdown、miniprogram_notice、taskcard）
    -   其他字段根据消息类型而定
-   **返回**: Promise<SendMessageResponse> - 发送结果响应对象

**示例：**

```javascript
const result = await wxwork.sendMessage({
	touser: 'user1|user2',
	msgtype: 'text',
	text: {
		content: 'Hello, World!',
	},
});
console.log('发送结果:', result);
```

### 部门相关 API

#### `getDepartmentList(id?: number): Promise<DepartmentListResponse>`

获取部门列表

-   **参数**: `id` - 部门 ID，默认为 1（根部门）
-   **返回**: Promise<DepartmentListResponse> - 部门列表响应对象

**示例：**

```javascript
const departments = await wxwork.getDepartmentList();
console.log(departments.department_list);
```

#### `getDepartmentDetail(id: number): Promise<DepartmentDetailResponse>`

获取部门详细信息

-   **参数**: `id` - 部门 ID
-   **返回**: Promise<DepartmentDetailResponse> - 部门详细信息响应对象

#### `getDepartmentUserList(id: number): Promise<DepartmentUserListResponse>`

获取部门成员列表

-   **参数**: `id` - 部门 ID
-   **返回**: Promise<DepartmentUserListResponse> - 部门成员列表响应对象

**示例：**

```javascript
const users = await wxwork.getDepartmentUserList(1);
console.log(users.userlist);
```

#### `getRootDepartment(): Promise<RootDepartment>`

获取根部门信息

-   **参数**: 无
-   **返回**: Promise<RootDepartment> - 根部门信息对象

**示例：**

```javascript
const rootDept = await wxwork.getRootDepartment();
console.log(rootDept.name);
```

## 错误处理

所有 API 方法都会抛出详细的错误信息，建议使用 try-catch 进行错误处理：

```javascript
try {
	const token = await wxwork.getAccessToken();
	// 处理成功逻辑
} catch (error) {
	console.error('操作失败:', error.message);
	// 处理错误逻辑
}
```

## 日志记录

库内置了日志记录功能，会在控制台输出操作日志和错误信息，格式如下：

```
[2024-01-20T10:30:45.123Z] [INFO] 获取新的AccessToken
[2024-01-20T10:30:45.456Z] [INFO] AccessToken获取成功
[2024-01-20T10:30:46.789Z] [ERROR] 发送消息失败 { message: '...' }
```

## 在不同环境中使用

### Vue.js 项目

```javascript
// main.js
import wxwork from 'wxwork';

// 配置企业微信信息
wxwork.setConfig({
	corpid: process.env.VUE_APP_CORPID,
	corpsecret: process.env.VUE_APP_CORPSECRET,
	agentid: process.env.VUE_APP_AGENTID,
});

// 挂载到Vue原型上（Vue 2）
Vue.prototype.$wxwork = wxwork;

// 或者在组件中直接使用（Vue 3）
export default {
	setup() {
		const getUserInfo = async (code) => {
			return await wxwork.getUserInfo(code);
		};

		return { getUserInfo };
	},
};
```

### Node.js 项目

```javascript
const { wxwork } = require('@massong/wxwork');
const express = require('express');

const app = express();

// 配置企业微信
wxwork.setConfig({
	corpid: process.env.CORPID,
	corpsecret: process.env.CORPSECRET,
	agentid: process.env.AGENTID,
});

// API路由
app.get('/api/user/:userid', async (req, res) => {
	try {
		const userDetail = await wxwork.getUserDetail(req.params.userid);
		res.json(userDetail);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(3000);
```

## ⚠️ 注意事项

### AccessToken 重要提醒

1. **⚠️ IP禁用风险**：频繁请求AccessToken可能导致IP被企业微信服务器禁用
2. **💾 强烈建议持久化存储**：将获取到的AccessToken存储到数据库、Redis或文件中
3. **⏰ 有效期管理**：AccessToken有效期为7200秒（2小时），请合理安排刷新时间
4. **🔄 避免重复请求**：在有效期内重复使用同一个AccessToken，不要每次调用API都重新获取

### 其他注意事项

1. **安全性**：请不要在前端代码中直接暴露 `corpsecret`，建议通过后端 API 代理调用。

2. **Token 缓存**：库会自动缓存 AccessToken 并在过期前 5 分钟自动刷新，无需手动管理。

3. **错误处理**：所有 API 调用都应该包含错误处理逻辑，企业微信 API 可能返回各种错误码。

4. **频率限制**：请注意企业微信 API 的调用频率限制，避免过于频繁的请求。

## 🔧 类型定义

本包提供完整的 TypeScript 类型定义，主要接口包括：

```typescript
// 配置接口
interface WxWorkConfig {
	corpid: string;
	corpsecret: string;
	agentid?: string;
}

// 配置信息接口（脱敏）
interface ConfigInfo {
	corpid: string;
	corpsecret: string;
	agentid?: string;
	hasAccessToken: boolean;
}

// 用户信息接口
interface UserInfo {
	userid: string;
	name?: string;
	department?: number[];
	position?: string;
	mobile?: string;
	gender?: string;
	email?: string;
	avatar?: string;
	status?: number;
	enable?: number;
	isleader?: number;
	telephone?: string;
	english_name?: string;
	extattr?: any;
}

// 用户详细信息接口
interface UserDetail extends UserInfo {
	qr_code?: string;
	external_position?: string;
	address?: string;
	open_userid?: string;
	main_department?: number;
}
```

## 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 🔗 相关链接

-   [npm 包地址](https://www.npmjs.com/package/@massong/wxwork)
-   [企业微信 API 文档](https://developer.work.weixin.qq.com/document/)

## 📋 更新日志

### v1.0.1 (2025-08-28)

-   🚀 **重大更新**：完全移除 axios 依赖，实现零外部依赖
-   ⚡ 使用 Node.js 原生 https 和 url 模块重写 HTTP 请求
-   📦 发布到 npm 作为@massong/wxwork 包
-   🔧 修复模块导出问题，完善 CommonJS 和 ES Module 支持
-   ✅ 通过真实企业微信配置测试验证
-   📝 完善文档和使用示例

### v1.0.0

-   初始版本发布
-   支持基础的企业微信 API 功能
-   完整的 TypeScript 类型定义
-   支持 CommonJS 和 ES Module
