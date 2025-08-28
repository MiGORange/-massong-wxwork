/**
 * 企业微信配置接口
 */
export interface WxWorkConfig {
  /** 企业ID */
  corpid: string;
  /** 应用凭证密钥 */
  corpsecret: string;
  /** 应用ID */
  agentid?: string;
}

/**
 * 配置信息返回接口
 */
export interface ConfigInfo {
  /** 企业ID */
  corpid: string;
  /** 应用凭证密钥（脱敏显示） */
  corpsecret: string;
  /** 应用ID */
  agentid: string;
  /** 是否有AccessToken */
  hasAccessToken: boolean;
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户ID */
  userid?: string;
  /** 用户openid */
  openid?: string;
}

/**
 * 用户详细信息接口
 */
export interface UserDetail {
  /** 错误码 */
  errcode: number;
  /** 错误信息 */
  errmsg: string;
  /** 用户ID */
  userid: string;
  /** 用户名称 */
  name: string;
  /** 用户别名 */
  alias?: string;
  /** 手机号 */
  mobile?: string;
  /** 部门列表 */
  department: number[];
  /** 职位信息 */
  position?: string;
  /** 性别 */
  gender: string;
  /** 邮箱 */
  email?: string;
  /** 头像URL */
  avatar?: string;
  /** 状态 */
  status: number;
  /** 是否启用 */
  enable: number;
}

/**
 * 部门信息接口
 */
export interface Department {
  /** 部门ID */
  id: number;
  /** 部门名称 */
  name: string;
  /** 父部门ID */
  parentid: number;
  /** 排序 */
  order?: number;
}

/**
 * 部门列表响应接口
 */
export interface DepartmentListResponse {
  /** 错误码 */
  errcode: number;
  /** 错误信息 */
  errmsg: string;
  /** 部门列表 */
  department_list: Department[];
}

/**
 * 部门详细信息响应接口
 */
export interface DepartmentDetailResponse {
  /** 错误码 */
  errcode: number;
  /** 错误信息 */
  errmsg: string;
  /** 部门列表 */
  department: Department[];
}

/**
 * 部门成员信息接口
 */
export interface DepartmentUser {
  /** 用户ID */
  userid: string;
  /** 用户名称 */
  name: string;
  /** 部门列表 */
  department: number[];
  /** 用户openid */
  open_userid?: string;
}

/**
 * 部门成员列表响应接口
 */
export interface DepartmentUserListResponse {
  /** 错误码 */
  errcode: number;
  /** 错误信息 */
  errmsg: string;
  /** 用户列表 */
  userlist: DepartmentUser[];
}

/**
 * 消息发送响应接口
 */
export interface SendMessageResponse {
  /** 错误码 */
  errcode: number;
  /** 错误信息 */
  errmsg: string;
  /** 无效用户列表 */
  invaliduser?: string;
  /** 无效部门列表 */
  invalidparty?: string;
  /** 无效标签列表 */
  invalidtag?: string;
  /** 消息ID */
  msgid?: string;
}

/**
 * 根部门信息接口
 */
export interface RootDepartment {
  /** 部门ID */
  id: number;
  /** 部门名称 */
  name: string;
}

/**
 * 企业微信API封装类
 */
export declare class WxWork {
  /** 企业ID */
  corpid: string;
  /** 应用凭证密钥 */
  corpsecret: string;
  /** 应用ID */
  agentid: string;

  /**
   * 构造函数
   */
  constructor();

  /**
   * 设置企业ID
   * @param corpid 企业ID
   */
  setCorpid(corpid: string): void;

  /**
   * 设置应用凭证密钥
   * @param corpsecret 应用凭证密钥
   */
  setCorpsecret(corpsecret: string): void;

  /**
   * 设置应用ID
   * @param agentid 应用ID
   */
  setAgentid(agentid: string): void;

  /**
   * 批量设置配置信息
   * @param config 配置对象
   * @returns 返回当前实例，支持链式调用
   */
  setConfig(config: WxWorkConfig): WxWork;

  /**
   * 获取当前配置信息
   * @returns 当前配置对象
   */
  getConfig(): ConfigInfo;

  /**
   * 获取AccessToken
   * @returns Promise<string> AccessToken
   */
  getAccessToken(): Promise<string>;

  /**
   * 通过授权码获取用户信息
   * @param code 授权码
   * @returns Promise<UserInfo> 用户信息
   */
  getUserInfo(code: string): Promise<UserInfo>;

  /**
   * 通过openid获取userid
   * @param openid 用户openid
   * @returns Promise<UserInfo> 用户信息
   */
  getUserInfoByOpenid(openid: string): Promise<UserInfo>;

  /**
   * 获取用户详细信息
   * @param userid 用户ID
   * @returns Promise<UserDetail> 用户详细信息
   */
  getUserDetail(userid: string): Promise<UserDetail>;

  /**
   * 发送消息
   * @param content 消息内容
   * @returns Promise<SendMessageResponse> 发送结果
   */
  sendMessage(content: any): Promise<SendMessageResponse>;

  /**
   * 获取部门列表
   * @param id 部门ID，默认为1（根部门）
   * @returns Promise<DepartmentListResponse> 部门列表
   */
  getDepartmentList(id?: number): Promise<DepartmentListResponse>;

  /**
   * 获取部门详细信息
   * @param id 部门ID
   * @returns Promise<DepartmentDetailResponse> 部门详细信息
   */
  getDepartmentDetail(id: number): Promise<DepartmentDetailResponse>;

  /**
   * 获取部门成员列表
   * @param id 部门ID
   * @returns Promise<DepartmentUserListResponse> 部门成员列表
   */
  getDepartmentUserList(id: number): Promise<DepartmentUserListResponse>;

  /**
   * 获取根部门信息
   * @returns Promise<RootDepartment> 根部门信息
   */
  getRootDepartment(): Promise<RootDepartment>;
}

/**
 * 默认导出的企业微信实例
 */
declare const wxwork: WxWork;

export default wxwork;
export { WxWork };

/**
 * CommonJS 兼容性导出
 */
export = wxwork;