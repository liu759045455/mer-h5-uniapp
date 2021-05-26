<template>
	<view class="login">
		<view class="login-header">
			<image src="../../static/image/login/bg-title.png" mode=""></image>
		</view>
		<view class="login-container">
			<view class="login-container-title">
				<image src="../../static/image/login/password-title.png" mode=""></image>
			</view>
			<view class="login-form">
				<form @submit="formSubmit">
					<view class="uni-form-item uni-column">
						<view class="title">手机号</view>
						<view class="line"></view>
						<input class="uni-input" name="phonenumber" v-model="phonenumber" placeholder="请输入账号或者手机号"
							maxlength="11" />
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">密码</view>
						<view class="line"></view>
						<input class="uni-input" name="password" v-model="password" placeholder="请输入账号密码"
							:password="isPass" maxlength="16">
						<view v-if="isPass" class="hidd_to image" @click="isPassClick">
						</view>
						<view v-else class="show_to image" @click="isPassClick">
						</view>
						</input>
					</view>
					<view class="login-btn">
						<button form-type="submit">登录</button>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		Encrypt,
		Decrypt
	} from "../../common/aes.js"
	export default {
		data() {
			return {
				isPass: true,
				phonenumber: '',
				password: ''
			};
		},
		onLoad() {

		},
		onPullDownRefresh() {

		},
		// 滚动页面底部
		onReachBottom() {

		},
		onPageScroll() { //监听页面滚动

		},
		created() {
			console.log('1111')
			console.log(this.$route)
		},
		methods: {
			isPassClick() {
				this.isPass = !this.isPass;
			},
			formSubmit() {
				let phonenumber = RegExp(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/).test(this.phonenumber);
				let password = RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/).test(this.password);
				console.log(password)
				if (!phonenumber || this.phonenumber == '') {
					uni.showToast({
						title: '请输入正确的手机号或手机号不能为空,请重新输入',
						icon: 'none',
						duration: 2000
					});
				} else if (this.password == '') {
					uni.showToast({
						title: '请输入正确的密码或密码不能为空,请重新输入',
						icon: 'none',
						duration: 2000
					});
				} else {
					console.log('登录请求')
					let params = {
						phonenumber: this.phonenumber,
						password: this.password
					};
					this.$api.login(params).then(res => {
						console.log(res.data, '---');
						if (res.code == 200) {
							//设置token或uuid 做登录验证
							// localStorage.setItem('token')
							sessionStorage.setItem('token', res.data.access_token);
							uni.showToast({
								title: '登录成功',
								duration: 2000
							});
							setTimeout(() => {
								uni.redirectTo({
									url: '/src/pages/homepage/index'
								})
							}, 1500)
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 2000
							});
						}
					})
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		.login-header {
			width: 100%;
			height: 600rpx;
			background-image: url(../../static/image/login/bg-header.png);
			background-size: 100% 100%;
			background-position: center;
			background-repeat: no-repeat;

			image {
				width: 369rpx;
				height: 198rpx;
				margin: 197rpx 301rpx 205rpx 80rpx;
			}
		}

		.login-container {
			background-image: url(../../static/image/login/bg-container.png);
			width: 100%;
			height: 1129rpx;
			background-size: 100% 100%;
			background-position: center;
			background-repeat: no-repeat;
			position: absolute;
			top: 495rpx;

			.login-container-title {
				width: 590rpx;
				height: 54rpx;
				margin: 77rpx auto 0 auto;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.login-form {
				uni-form {
					span {
						.uni-form-item {
							display: flex;
							width: 590rpx;
							margin: 78rpx auto 0 auto;
							border-bottom: 1px solid #e5e5e5;
							padding-bottom: 16rpx;
							position: relative;

							&:nth-of-type(2) {
								margin-top: 53rpx;
							}

							.title {
								width: 100rpx;
								color: #333;
								font-size: 30rpx;
							}

							.line {
								position: relative;
								top: 6rpx;
								width: 1px;
								left: 20rpx;
								height: 30rpx;
								background-color: #f2f2f2;
							}

							.uni-input {
								margin-left: 60rpx;

								.uni-input-wrapper {
									.input-placeholder {
										color: #999999;
									}
								}
							}

							.image {
								width: 40rpx;
								height: 40rpx;
								position: absolute;
								top: 50%;
								transform: translateY(-50%);
								right: 45rpx;
							}

							.hidd_to {
								background: url(../../static/image/password/yj_icon_bxs@2x.png) center center no-repeat;
								background-size: 100% 100%;
							}

							.show_to {
								background: url(../../static/image/password/yj_icon_xs@2x.png) center center no-repeat;
								background-size: 100% 100%;
							}
						}

						.login-btn {
							width: 620rpx;
							height: 110rpx;
							margin: 95rpx auto 0 auto;

							button {
								background-image: linear-gradient(to right, #FA5046, #DC1428);
								border-radius: 40rpx;
								font-size: 30rpx;
								color: #ffffff;
							}
						}

					}
				}
			}
		}
	}
</style>
