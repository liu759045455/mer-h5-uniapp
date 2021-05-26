import axios from 'axios';
// import { Notification, MessageBox, Message } from 'element-ui';
import store from '../store/index.js';
import {
	getToken
} from './auth.js';
import errorCode from './errorCode';
import {
	Encrypt,
	Decrypt
} from './aes'
import base_url from './config.js'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// 创建axios实例
const service = axios.create({
	// axios中请求配置有baseURL选项，表示请求URL公共部分
	baseURL: base_url,
	// 超时
	timeout: 10000
});

// 是否需要加密
const encryptionRequired = true;

// 不需要加密名单
const encryptWhite = [];

// 不需要解密名单
const decryptWhite = [];

// 文件上传
const formDataWhite = [];

// 大数据接口
const bigDataWhite = [];

// request拦截器
service.interceptors.request.use(
	config => {
		// 是否需要设置 token
		const isToken = (config.headers || {}).isToken === false;
		// if (getToken() && !isToken) {
		config.headers['Authorization'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
		config.headers['platform_type'] = '02';
		config.headers['mobile'] = 'mobile';
		// }
		// 如果是大数据导入接口
		if (bigDataWhite.includes(config.url)) {
			config.timeout = 600000;
		}
		// get请求映射params参数
		if (config.method === 'get' && config.params) {
			let url = config.url + '?';
			for (const propName of Object.keys(config.params)) {
				const value = config.params[propName];
				var part = encodeURIComponent(propName) + '=';
				if (value !== null && typeof value !== 'undefined') {
					if (typeof value === 'object') {
						for (const key of Object.keys(value)) {
							const params = propName + '[' + key + ']';
							var subPart = encodeURIComponent(params) + '=';
							url += subPart + encodeURIComponent(value[key]) + '&';
						}
					} else {
						url += part + encodeURIComponent(value) + '&';
					}
				}
			}
			url = url.slice(0, -1);
			config.params = {};
			config.url = url;
		}

		if (
			config.method === 'post' ||
			config.method === 'put' ||
			config.method === 'patch'
		) {
			let params = {};
			if (encryptionRequired && !formDataWhite.includes(config.url)) {
				if (!encryptWhite.includes(config.url)) {
					params.param = Encrypt(JSON.stringify(config.data));
				} else {
					params.param = JSON.stringify(config.data);
				}
			} else {
				params = config.data;
			}
			config.data = params;
		}
		return config;
	},
	error => {
		Promise.reject(error);
	}
);

// 响应拦截器
service.interceptors.response.use(
	res => {
		if (encryptionRequired) {
			if (!decryptWhite.includes(res.config.url.replace(base_url, ''))) {
				res.data = JSON.parse(Decrypt(res.data));
			}
		}

		// 未设置状态码则默认成功状态
		const code = res.data.code || 200;
		// 获取错误信息
		const msg = errorCode[code] || res.data.msg || errorCode['default'];
		if (code === 401) {
			console.log('1',1)
			// MessageBox.confirm(
			// 	'登录状态已过期，您可以继续留在该页面，或者重新登录',
			// 	'系统提示', {
			// 		confirmButtonText: '重新登录',
			// 		cancelButtonText: '取消',
			// 		type: 'warning'
			// 	}
			// ).then(() => {
			store.dispatch('handleLogout')
			return false
		} else if (code === 500) {
			return res.data;
		} else if (code !== 200) {
			// Notification.error({
			// 	title: msg
			// });
			return Promise.reject('error');
		} else {
			return res.data;
		}
	},
	error => {
		let {
			message
		} = error;
		if (message == 'Network Error') {
			message = '后端接口连接异常';
		} else if (message.includes('timeout')) {
			message = '系统接口请求超时';
		} else if (message.includes('Request failed with status code')) {
			message = '系统接口' + message.substr(message.length - 3) + '异常';
		}
		// Message({
		// 	message: message,
		// 	type: 'error',
		// 	duration: 5 * 1000
		// });
		return Promise.reject(error);
	}
);
export default service;
