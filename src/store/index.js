import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api/index.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
	},
	mutations: {

	},
	actions: {
		handleLogout({
			commit
		}) {
			api.logout().then(result => {
				if (result && result.code === 200) {
					sessionStorage.removeItem("token")
					uni.showToast({
						title: '登录状态已过期，即将重新登录',
						duration: 2000,
						icon:"none"
					});
					setTimeout(() => {
						uni.redirectTo({
							url: '/src/pages/login/index'
						})
					}, 2000)

				}
			})
		}

	}
})

export default store
