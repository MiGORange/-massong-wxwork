const https = require('https');
const { URL } = require('url');

/**
 * 企业微信API封装类
 * 提供企业微信相关API的便捷调用方法
 * @class WxWork
 * @version 1.0.4
 */
class WxWork {
    /**
     * 构造函数
     * @constructor
     */
    constructor() {
        this.corpid = '';
        this.corpsecret = '';
        this.agentid = '';
        this.accessToken = null;
        this.tokenExpireTime = 0;
        this.baseURL = 'https://qyapi.weixin.qq.com/cgi-bin';
    }

    // ==================== 配置方法 ====================

    /**
     * 设置企业ID
     * @param {string} corpid 企业ID
     */
    setCorpid(corpid) {
        this.corpid = corpid;
    }

    /**
     * 设置应用凭证密钥
     * @param {string} corpsecret 应用凭证密钥
     */
    setCorpsecret(corpsecret) {
        this.corpsecret = corpsecret;
    }

    /**
     * 设置应用ID
     * @param {string} agentid 应用ID
     */
    setAgentid(agentid) {
        this.agentid = agentid;
    }

    /**
     * 批量设置配置信息
     * @param {Object} config 配置对象
     * @param {string} config.corpid 企业ID
     * @param {string} config.corpsecret 应用凭证密钥
     * @param {string} config.agentid 应用ID
     * @returns {WxWork} 返回当前实例，支持链式调用
     */
    setConfig(config) {
        if (config.corpid) this.corpid = config.corpid;
        if (config.corpsecret) this.corpsecret = config.corpsecret;
        if (config.agentid) this.agentid = config.agentid;
        return this;
    }

    /**
     * 获取当前配置信息
     * @returns {Object} 当前配置对象
     */
    getConfig() {
        return {
            corpid: this.corpid,
            corpsecret: this.corpsecret ? '***' : '',
            agentid: this.agentid,
            hasAccessToken: !!this.accessToken
        };
    }

    // ==================== 核心API方法 ====================

    /**
     * 验证配置是否完整
     * @private
     */
    _validateConfig() {
        if (!this.corpid || !this.corpsecret) {
            throw new Error('请先设置corpid和corpsecret');
        }
    }

    /**
     * 原生HTTP请求方法
     * @private
     * @param {string} method HTTP方法
     * @param {string} url 请求URL
     * @param {Object} data 请求数据
     * @returns {Promise<Object>} 响应数据
     */
    _request(method, url, data = null) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const postData = data ? JSON.stringify(data) : null;
            
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || 443,
                path: urlObj.pathname + urlObj.search,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'wxwork-sdk/1.0.0'
                }
            };

            if (postData) {
                options.headers['Content-Length'] = Buffer.byteLength(postData);
            }

            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        resolve({ data });
                    } catch (error) {
                        reject(new Error('响应数据解析失败: ' + error.message));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (postData) {
                req.write(postData);
            }
            req.end();
        });
    }

    /**
     * 记录日志
     * @private
     * @param {string} level 日志级别
     * @param {string} message 日志消息
     * @param {Object} data 附加数据
     */
    _log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        if (data) {
            console.log(logMessage, data);
        } else {
            console.log(logMessage);
        }
    }

    /**
     * 处理API错误
     * @private
     * @param {Error} error 错误对象
     * @param {string} operation 操作名称
     */
    _handleError(error, operation) {
        this._log('error', `${operation}失败`, {
            message: error.message,
            stack: error.stack
        });
        throw new Error(`${operation}失败: ${error.message}`);
    }

    /**
     * 获取企业微信AccessToken
     * @returns {Promise<string>} AccessToken
     * @warning 频繁请求AccessToken可能导致IP被禁用，建议进行持久化存储
     * @note AccessToken有效期为7200秒（2小时），过期后需重新获取
     */
    async getAccessToken() {
        try {
            this._validateConfig();

            this._log('warn', '⚠️  重要提醒：频繁请求AccessToken可能导致IP被禁用，强烈建议进行持久化存储！');
            this._log('info', '获取新的AccessToken');
            const url = `${this.baseURL}/gettoken?corpid=${this.corpid}&corpsecret=${this.corpsecret}`;
            const response = await this._request('GET', url);

            const data = response.data;
            if (data.errcode && data.errcode !== 0) {
                throw new Error(`获取AccessToken失败: ${data.errmsg}`);
            }

            this.accessToken = data.access_token;
            // 设置过期时间为7200秒（2小时）
            this.tokenExpireTime = Date.now() + 7200 * 1000;
            
            this._log('info', 'AccessToken获取成功，有效期：2小时（7200秒）');
            this._log('warn', '📝 建议：请将AccessToken进行持久化存储，避免频繁请求导致IP被禁用');
            return this.accessToken;
        } catch (error) {
            this._handleError(error, '获取AccessToken');
        }
    }

    // ==================== 用户相关API ====================

    /**
     * 通过授权码获取用户信息
     * @param {string} code 授权码
     * @returns {Promise<Object>} 用户信息
     */
    async getUserInfo(code) {
        try {
            const accessToken = await this.getAccessToken();
            
            this._log('info', '获取用户信息', { code });
            const url = `${this.baseURL}/auth/getuserinfo?access_token=${accessToken}&code=${code}`;
            const response = await this._request('GET', url);

            const data = response.data;
            if (data.errcode && data.errcode !== 0) {
                throw new Error(`获取用户信息失败: ${data.errmsg}`);
            }

            // 如果返回的是openid，需要转换为userid
            if (data.openid && !data.userid) {
                const userInfo = await this.getUserInfoByOpenid(data.openid);
                return userInfo;
            }

            this._log('info', '用户信息获取成功');
            return { userid: data.userid };
        } catch (error) {
            this._handleError(error, '获取用户信息');
        }
    }

    /**
     * 通过openid获取userid
     * @param {string} openid 用户openid
     * @returns {Promise<Object>} 用户信息
     */
    async getUserInfoByOpenid(openid) {
        try {
            const accessToken = await this.getAccessToken();
            
            this._log('info', '通过openid获取userid', { openid });
            const url = `${this.baseURL}/user/convert_to_userid?access_token=${accessToken}`;
            const response = await this._request('POST', url, { openid: openid });

            const data = response.data;
            if (data.errcode && data.errcode !== 0) {
                throw new Error(`通过openid获取userid失败: ${data.errmsg}`);
            }

            this._log('info', 'userid获取成功');
            return data;
        } catch (error) {
            this._handleError(error, '通过openid获取userid');
        }
    }

    /**
     * 获取用户详细信息
     * @param {string} userid 用户ID
     * @returns {Promise<Object>} 用户详细信息
     */
    async getUserDetail(userid) {
        try {
            const accessToken = await this.getAccessToken();
            
            this._log('info', '获取用户详细信息', { userid });
            const url = `${this.baseURL}/user/get?access_token=${accessToken}&userid=${userid}`;
            const response = await this._request('GET', url);

            const data = response.data;
            if (data.errcode && data.errcode !== 0) {
                throw new Error(`获取用户详细信息失败: ${data.errmsg}`);
            }

            this._log('info', '用户详细信息获取成功');
            return data;
        } catch (error) {
            this._handleError(error, '获取用户详细信息');
        }
    }

    // ==================== 消息相关API ====================

    /**
     * 发送消息
     * @param {Object} content 消息内容
     * @returns {Promise<Object>} 发送结果
     */
    async sendMessage(content) {
        try {
            const accessToken = await this.getAccessToken();
            
            this._log('info', '发送消息', { content });
            const url = `${this.baseURL}/message/send?access_token=${accessToken}`;
            const response = await this._request('POST', url, content);

            const data = response.data;
            if (data.errcode && data.errcode !== 0) {
                throw new Error(`发送消息失败: ${data.errmsg}`);
            }

            this._log('info', '消息发送成功', data);
            return data;
        } catch (error) {
            this._handleError(error, '发送消息');
        }
    }

    // ==================== 部门相关API ====================

    /**
     * 获取部门列表
     * @param {number} id 部门ID，默认为1（根部门）
     * @returns {Promise<Object>} 部门列表
     */
    async getDepartmentList(id = 1) {
        try {
            const accessToken = await this.getAccessToken();
            
            this._log('info', '获取部门列表', { id });
            const url = `${this.baseURL}/department/simplelist?access_token=${accessToken}&id=${id}`;
            const response = await this._request('GET', url);

            const data = response.data;
            if (data.errcode && data.errcode !== 0) {
                throw new Error(`获取部门列表失败: ${data.errmsg}`);
            }

            this._log('info', '部门列表获取成功');
            return data;
        } catch (error) {
            this._handleError(error, '获取部门列表');
        }
    }

    /**
     * 获取部门详细信息
     * @param {number} id 部门ID
     * @returns {Promise<Object>} 部门详细信息
     */
    async getDepartmentDetail(id) {
        try {
            const accessToken = await this.getAccessToken();
            
            this._log('info', '获取部门详细信息', { id });
            const url = `${this.baseURL}/department/list?access_token=${accessToken}&id=${id}`;
            const response = await this._request('GET', url);

            const data = response.data;
            if (data.errcode && data.errcode !== 0) {
                throw new Error(`获取部门详细信息失败: ${data.errmsg}`);
            }

            this._log('info', '部门详细信息获取成功');
            return data;
        } catch (error) {
            this._handleError(error, '获取部门详细信息');
        }
    }

    /**
     * 获取部门成员列表
     * @param {number} id 部门ID
     * @returns {Promise<Object>} 部门成员列表
     */
    async getDepartmentUserList(id) {
        try {
            const accessToken = await this.getAccessToken();
            
            this._log('info', '获取部门成员列表', { id });
            const url = `${this.baseURL}/user/simplelist?access_token=${accessToken}&department_id=${id}&fetch_child=1`;
            const response = await this._request('GET', url);

            const data = response.data;
            if (data.errcode && data.errcode !== 0) {
                throw new Error(`获取部门成员列表失败: ${data.errmsg}`);
            }

            this._log('info', '部门成员列表获取成功');
            return data;
        } catch (error) {
            this._handleError(error, '获取部门成员列表');
        }
    }

    /**
     * 获取根部门信息
     * @returns {Promise<Object>} 根部门信息
     */
    async getRootDepartment() {
        try {
            this._log('info', '获取根部门信息');
            const departmentList = await this.getDepartmentList(1);
            
            if (departmentList.department_list && departmentList.department_list.length > 0) {
                const rootDepartment = departmentList.department_list.find(dept => dept.parentid === 0);
                if (rootDepartment) {
                    this._log('info', '根部门信息获取成功');
                    return {
                        id: rootDepartment.id,
                        name: rootDepartment.name
                    };
                }
            }
            
            throw new Error('未找到根部门');
        } catch (error) {
            this._handleError(error, '获取根部门信息');
        }
    }
}

// ==================== 模块导出 ====================

/**
 * 创建默认实例
 * @type {WxWork}
 */
const wxwork = new WxWork();

// 导出方式说明：
// 1. 默认导出：require('@massong/wxwork') 或 require('@massong/wxwork').default
// 2. 命名导出：const { wxwork } = require('@massong/wxwork')
// 3. 类导出：const { WxWork } = require('@massong/wxwork')

module.exports = wxwork;              // 默认导出实例
module.exports.WxWork = WxWork;       // 导出类
module.exports.wxwork = wxwork;       // 命名导出实例
module.exports.default = wxwork;      // ES6 默认导出兼容