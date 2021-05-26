import request from '../common/axios.js';

export default {
	//查询商户当前周期
	getCurrentCycle(data) {
		return request({
			url: "/merchant/merchantSettlementRecord/mobile/queryCurrentCycle",
			method: "post",
			data
		})
	},
	getAppointCycle(data) {
		return request({
			url: "/merchant/merchantSettlementRecord/mobile/appointCycle",
			method: "post",
			data
		})
	},
	getMerchantInfo(data) {
		return request({
			url: "/merchant/merchantBillRecordH5/queryMerchantBillInfo",
			method: "post",
			data
		})
	},
	getCurrentBalance(data) {
		return request({
			url: "/merchant/merchantSettlementRecord/mobile/currentBalance",
			method: "post",
			data
		})
	},
	//查询所有账单信息
	getAllRecordBills(data) {
		return request({
			url: "/merchant/merchantSettlementRecord/mobile/allBills",
			method: "post",
			data
		})
	},
	//查询所有流水信息
	getAllBillRecord(data) {
		return request({
			url: "/merchant/merchantBillRecordH5/queryMerchantBillRecordList",
			method: "post",
			data
		})
	},
	//查询收/退信息
	getBillIncomeAndRefund(data) {
		return request({
			url: "/merchant/merchantBillRecordH5/queryMerchantBillCount",
			method: "post",
			data
		})
	},
	//登录
	login(data) {
		return request({
			url: "/auth/login",
			method: "post",
			data
		})
	},
	//登出
	logout(data) {
		return request({
			url: "/auth/logout",
			method: "delete",
			data
		})
	},
	//获取商家信息
	getInfo(params) {
		return request({
			url: "/merchant/user/getInfo",
			method: "get",
			params
		})
	},
	//获取商家信息2
	getStoreInfo(data) {
		return request({
			url: "/merchant/merchantMember/queryStoreInfo",
			method: "post",
			data
		})
	}
}
