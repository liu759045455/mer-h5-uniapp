<template>
	<view class="homepage">
		<view class="homepage-header">
			<view class="b-wrapper">
				<view class="b-head">
					<u-image :src="store.pic" height="100%" class="b-head-img" error-icon="photo"></u-image>
				</view>
				<view class="b-text">
					<view class="b-text-title">
						<text>{{store.name}}</text>
					</view>
				</view>
				<view class="b-logout">
					<text @click.stop="handleLogout">退出登录</text>
				</view>
			</view>
		</view>
		<view class="homepage-content">
			<!-- 收入/累计统计 -->
			<view class="c-total">
				<view class="c-total-box">
					<view class="title">
						本月收入（元）
					</view>
					<view class="income-price price">
						<text>{{baseInfo.monthIncome}}</text>
					</view>
				</view>
				<view class="c-total-box">
					<view class="title">
						累计结算金额（元）
					</view>
					<view class="cumulative-price price">
						<text>{{baseInfo.total}}</text>
					</view>
				</view>
			</view>
			<!-- 昨日/今日流水 -->
			<view class="c-stream">
				<swiper class="swiper" :current="current" @change="handleSwiperChange">
					<swiper-item>
						<view class="swiper-item swiper-stream">
							<view class="c-item yesterday">
								<view class="c-item-title">
									昨日流水
								</view>
								<view class="c-item-price">
									{{baseInfo.yesterdayOrderCount}}单
								</view>
							</view>
							<view class="c-item today">
								<view class="c-item-title">
									今日流水
								</view>
								<view class="c-item-price">
									{{baseInfo.todayOrderCount}}单
								</view>
							</view>
							<view :class="['c-item','chain',{negative:Math.sign(baseInfo.ratio) == -1}]">
								<view class="c-item-title">
									环比
								</view>
								<view class="c-item-price">
									{{baseInfo.ratio}}%
								</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item swiper-periods">
							<view class="c-item item-periods">
								<view class="c-item-title">
									店铺待结算金额（元）
								</view>
								<view class="c-item-price">
									{{currentBalance}}
								</view>
							</view>
							<view class="c-item item-periods">
								<view class="c-item-title">
									已结算期数
								</view>
								<view class="c-item-price">
									{{settledNum}}期
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 滑块点点点 -->
			<view class="c-dots">
				<view :class="['icon',{select:current === 0}]">
				</view>
				<view :class="['icon',{select:current === 1}]">
				</view>
			</view>

			<home-settled v-show='current === 0' :result="result"></home-settled>
			<home-unsettled v-show='current === 1' :settleTime="settleTime" :nextCycle="nextCycle"
				:settleDate="settleDate"></home-unsettled>
			<!-- 退出登录确认框 -->
			<u-modal v-model="showQuit" :show-title="false" :show-confirm-button="false" class="c-quit">
				<view class="quit-title">
					退出登录
				</view>
				<view class="quit-text">
					确定退出登录吗？
				</view>
				<view class="quit-button">
					<view class="btn cancel" @click="handleCancel">
						取消
					</view>
					<view class="btn quit" @click="handleConfirm">
						立即退出
					</view>
				</view>
			</u-modal>
		</view>
	</view>
</template>
<script>
	import {
		log
	} from 'util'
	export default {
		data() {
			return {
				current: 0,
				//待结算金额
				currentBalance: null,
				//已结算期数
				settledNum: null,
				//店铺基本信息
				baseInfo: {},
				settleTime: {
					start: null,
					end: null
				},
				result: [],
				nextCycle: null,
				settleDate: null,
				store: {
					name: null,
					pic: null
				},
				showQuit: false
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				//店铺基本信息
				this.$api.getMerchantInfo({}).then(result => {
					if (result.code === 200) {
						this.baseInfo = {
							"total": result.data.total.toFixed(2),
							"monthIncome": result.data.monthIncome.toFixed(2),
							"yesterdayOrderCount": result.data.yesterdayOrderCount,
							"todayOrderCount": result.data.todayOrderCount,
							"ratio": result.data.ratio
						}
					}
				})
				//待结算余额和已结算的账单信息
				this.$api.getCurrentBalance({}).then(result => {
					if (result.code === 200) {
						this.currentBalance = result.data.currentBalance.toFixed(2);
						this.settledNum = result.data.settledNum;
						this.nextCycle = result.data.nextCycle;
						this.settleDate = result.data.settleDate;
					}
				})
				//商家信息
				this.$api.getInfo({}).then(result => {
					console.log('result', result)
					if (result.code === 200) {
						const orgId = result.user && result.user.orgId;
						this.$api.getStoreInfo({
							orgId
						}).then(res => {
							console.log(res, 'res')
							if (res.code === 200) {
								this.store.name = res.data.storeName;
								this.store.pic = res.data.merchantIcon;
							}
						})
					}
				})
			},
			handleSwiperChange() {
				this.current = this.current === 1 ? 0 : 1
				if (!this.current) {
					return
				}
				this.$api.getCurrentCycle({}).then(result => {
					if (result && result.code === 200) {
						this.settleTime.start = result.data.settlementStartDate;
						this.settleTime.end = result.data.settlementEndDate;
					}
				})
			},
			handleDateClick() {
				this.showDate = true
			},
			//退出登录
			handleLogout() {
				this.showQuit = true
			},
			//退出登录确定
			handleConfirm() {
				this.$api.logout().then(result => {
					if (result.code === 200) {
						uni.showToast({
							title: '退出登录成功',
							duration: 2000
						});
						sessionStorage.removeItem("token")
						setTimeout(() => {
							uni.redirectTo({
								url: '/src/pages/login/index'
							})
						}, 1000)
					}
				})
			},
			//退出登录取消
			handleCancel() {
				this.showQuit = false;
			}
		}
	}
</script>
<style lang="scss" scoped>
	* {
		padding: 0;
		margin: 0
	}

	.homepage {
		display: flex;
		flex-direction: column;
		height: 100vh;

		&-header {
			width: 750rpx;
			height: 382rpx;
			display: flex;
			// justify-content: center;
			align-items: flex-end;
			padding: 0 30rpx;
			background-image: linear-gradient(to right, #FA5046, #DC1428);
			position: relative;

			.b-wrapper {
				display: flex;
				width: 100%;
				align-items: center;
				margin-bottom: 86rpx;

				.b-head {
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 20rpx;

					&-img {
						width: 100%;
						height: 100%;
					}
				}

				.b-text {
					flex: 1;
					color: #FFFFFF;

					&-title {
						font-size: 36rpx;
						line-height: 44rpx;
						font-weight: bold;
					}

					&-intro {
						margin-top: 5rpx;
						font-size: 22rpx;
						line-height: 26rpx;
					}

				}

				.b-logout {
					position: absolute;
					font-size: 22rpx;
					line-height: 26rpx;
					right: 31rpx;
					bottom: 23rpx;
					color: rgba($color: #ffffff, $alpha: 0.8);
					cursor: pointer;
				}
			}

		}

		&-content {
			flex: 1;
			background-color: #EEEEEE;
			padding: 28rpx 23rpx;
			display: flex;
			flex-direction: column;

			.c-total {
				display: flex;
				justify-content: space-around;

				&-box {
					width: 375rpx;
					height: 175rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					background: url(../../static/image/homepage/box.png) top center no-repeat;
					background-size: 100% 100%;

					.title {
						color: #666666;
						font-size: 24rpx;
						line-height: 30rpx;
						text-align: center;
					}

					.price {
						font-size: 52rpx;
						line-height: 65rpx;
						font-weight: bold;
					}

					.income-price {
						color: #F52525;
					}

					.cumulative-price {
						color: #666666;
					}
				}
			}

			.c-stream {
				height: 135rpx;
				margin-top: 16rpx;

				.swiper {
					height: 100%;

					.swiper-item {
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;

						.c-item {
							width: 160rpx;
							text-align: center;
							color: #FFFFFF;

							&-title {
								font-size: 24rpx;
								line-height: 28rpx;
							}

							&-price {
								font-weight: bold;
								margin-top: 8rpx;
								font-size: 36rpx;
								line-height: 43rpx;
							}
						}

						.item-periods {
							width: 240rpx;
						}

						.yesterday {
							color: rgba($color: #ffffff, $alpha: 0.8)
						}

						.today {
							margin: 0 30rpx
						}

						.chain {
							.c-item-title {
								&::after {
									margin-left: 8rpx;
									content: '';
									display: inline-block;
									width: 6rpx;
									height: 18rpx;
									background: url(../../static/image/homepage/arrow.png) center center no-repeat;
									background-size: 100% 100%;
								}
							}



							.c-item-price {
								color: #F52525;
							}
						}

						.negative {
							.c-item-title {
								&::after {
									background: url(../../static/image/homepage/negative.png) center center no-repeat;
									background-size: 100% 100%;
								}
							}
							.c-item-price {
								color: #00cc6a;
							}
						}
					}

					.swiper-stream {
						background: url(../../static/image/homepage/stream.png) center center no-repeat;
						background-size: 100% 100%;
					}

					.swiper-periods {
						background: url(../../static/image/homepage/periods.png) center center no-repeat;
						background-size: 100% 100%;
					}
				}
			}

			.c-dots {
				display: flex;
				justify-content: center;
				margin-top: 7rpx;

				.icon {
					width: 40rpx;
					height: 10rpx;
					border-radius: 5rpx;
					border: 1rpx solid #999999;
					margin-left: 10rpx;
				}

				.select {
					background-color: #999999;
				}
			}

			.c-quit {
				.quit-title {
					height: 114rpx;
					line-height: 114rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #000000;
					text-align: center;
				}

				.quit-text {
					height: 115rpx;
					line-height: 115rpx;
					font-size: 30rpx;
					color: #666666;
					text-align: center;
				}

				.quit-button {
					display: flex;
					justify-content: center;

					.btn {
						width: 241rpx;
						height: 81rpx;
						line-height: 81rpx;
						text-align: center;
						font-size: 30rpx;
						color: #666666;
						border-radius: 40rpx;
						margin-bottom: 40rpx;
					}

					.cancel {
						border: 1px solid #b1b1b1;
						margin-right: 15rpx;
					}

					.quit {
						color: #ffffff;
						margin-left: 15rpx;
						background-image: linear-gradient(to right, #FA5046, #DC1428);
					}
				}
			}
		}
	}
</style>
