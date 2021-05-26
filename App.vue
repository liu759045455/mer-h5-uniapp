<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			// let userInfo = uni.getStorageSync('userInfo') || '';
			// if (userInfo.id) {
			// 	//更新登陆状态
			// 	uni.getStorage({
			// 		key: 'userInfo',
			// 		success: (res) => {
			// 			this.login(res.data);
			// 		}
			// 	});
			// }
			
			// 提示框 Object 或 String
			Vue.prototype.showToast = function(res) {
				let rep = {};
				if (res instanceof Object) {
					rep = res;
				} else {
					rep.title = res;
				}
				rep.icon = rep.icon || 'none'
				rep.duration = rep.duration || 2000
				uni.showToast(rep)
			}
			// 判断普通浏览器true,微信浏览器 false
			Vue.prototype.isH5 = function() {
				let ua = navigator.userAgent.toLowerCase()
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					// console.log('微信浏览器')
					return false
				} else {
					// console.log('普通浏览器')
					return true
				}
			}
			// 计算view高度穿class id
			Vue.prototype.createSelectorQuery = function(res, Callback) {
				let info = uni.createSelectorQuery().select(res)
				info.boundingClientRect(function(data) {
					//data - 各种参数
					data = data || {};
					Callback(data)
				}).exec()
			}

			// 判断非http或https
			Vue.prototype.judgeHttp = function(url) {
				//查看原文
				var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
				var objExp = new RegExp(Expression);
				if (objExp.test(url)) {
					return true
				} else {
					return false
				}
			}
			//分页加载请求
			Vue.prototype.$pagingRequest = function(url, params, state, routeParameter) { //url:请求地址 params:请求参数  state:请求状态 routeParameter:路由参数
				let self = this;
				if(state.loadStatus != 'nomore'||state.reload){
					state.loadStatus = 'loading' // 底部提示
				}
				params.pageNum = state.reload ? 1 : state.pageNum //分页
				params.pageSize = state.pageSize
				return new Promise((resolve, reject) => {
					self.$api[url](params, routeParameter).then(res => {
						state.loadStatus = 'loadmore'; // 底部提示
						uni.stopPullDownRefresh();
						if (res.code == 200) {
							if (state.reload) {
								state.reload = false; //下拉状态	
								state.pageNum = 1
								resolve({
									data: res,
									state: state
								});
								return;
							}
							//判断是否加载到底部
							if (res.total <= state.listLength) {
								state.loadStatus = 'nomore'; // 底部提示
							} else {
								state.pageNum++; // 分页
								resolve({
									data: res,
									state: state
								});
							}

						}
					})
				})
			}

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang='scss'>
	@import "@/src/plugins/uview-ui/index.scss";

	uni-app {
		background-color: #F8F8F8;
		min-height: 100vh;
		height: auto;
		overflow: hidden;
	}

	/*
		全局公共样式和字体图标
	*/
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}

	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
</style>
