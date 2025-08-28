# @massong/wxwork 使用指南

## 🎉 简化导入方式（v1.0.4+）

现在可以直接导入 `wxwork` 实例，无需使用 `default` 关键字：

### 推荐方式（最简洁）

```javascript
const { wxwork } = require('@massong/wxwork');

// 配置企业微信信息
wxwork.setCorpid('your_corp_id');
wxwork.setCorpsecret('your_corp_secret');
wxwork.setAgentid('your_agent_id');

// 直接使用
const token = await wxwork.getAccessToken();
const departments = await wxwork.getDepartments();
```

## 导入方式

```javascript
const { wxwork } = require('@massong/wxwork');
```

## 📝 完整使用示例

```javascript
const { wxwork } = require('@massong/wxwork');

// 配置企业微信信息
wxwork.setCorpid('wxd7a075d383ba5643');
wxwork.setCorpsecret('your_corp_secret');
wxwork.setAgentid('your_agent_id');

async function main() {
    try {
        // 获取 AccessToken（自动缓存）
        const token = await wxwork.getAccessToken();
        console.log('AccessToken获取成功');
        
        // 获取部门列表
        const departments = await wxwork.getDepartments();
        console.log('部门数量:', departments.department?.length || 0);
        
        // 获取用户信息（需要有效的授权码）
        const userInfo = await wxwork.getUserInfo('authorization_code');
        console.log('用户信息:', userInfo);
        
    } catch (error) {
        console.error('操作失败:', error.message);
    }
}

main();
```

## ✨ 主要特性

- **零外部依赖**: 纯 Node.js 实现
- **自动缓存**: AccessToken 智能缓存管理
- **完善日志**: 内置日志记录功能
- **错误处理**: 详细的错误信息和处理
- **生产就绪**: 经过充分测试，可用于生产环境
- **简化导入**: 无需 `default` 关键字，直接导入使用

## 🔧 配置说明

| 方法 | 参数 | 说明 |
|------|------|------|
| `setCorpid(corpid)` | string | 企业ID |
| `setCorpsecret(secret)` | string | 应用密钥 |
| `setAgentid(agentid)` | string | 应用ID |

## 📚 API 方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `getAccessToken()` | Promise<string> | 获取访问令牌 |
| `getDepartments()` | Promise<Object> | 获取部门列表 |
| `getUserInfo(code)` | Promise<Object> | 根据授权码获取用户信息 |
| `getUserInfoByOpenid(openid)` | Promise<Object> | 根据OpenID获取用户信息 |

## 🚀 版本更新

### v1.0.4
- ✅ 新增直接导入 `wxwork` 实例的方式
- ✅ 移除对 `default` 关键字的依赖
- ✅ 保持向后兼容性
- ✅ 优化导入体验