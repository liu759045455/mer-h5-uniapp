<template>
	<view class="settled">
		<view class="c-date">
			<view class="c-date-select">
				<text class="common">今天</text>
				<text class="date">{{formatterToday()}}</text>
				<view class="icon">
				</view>
			</view>
			<view class="c-date-count">
				<text class="common">收</text>
				<text class="money up">{{inComeRefund.income}}</text>
				<text class="common">退</text>
				<text class="money down">{{inComeRefund.refund}}</text>
			</view>
		</view>
		<!-- liebiao -->
		<view class="c-list">
			<view class="list-item" v-if="record.length > 0">
				<view class="item" v-for="(item,index) in record" :key="index">
					<view class="item-title">
						<view class="item-title-text">
							{{item.index}}
						</view>
						<view class="item-title-time">
							{{formatDateTimeFunc(item.createTime)}}
						</view>
					</view>
					<view class="item-type">
						{{item.billTypeName}}
					</view>
					<view :class="['item-money',{down:item.billType == 200 || item.billType ==201}]">
						{{upDownFormatter(item.money,item.billType)}}
					</view>
				</view>
				<uni-load-more :status="status" :icon-size="16" :content-text="contentText" iconType="auto"
					id="waitMore" />
			</view>
			<u-empty v-else text="数据为空" mode="data"></u-empty>
		</view>
	</view>
</template>

<script>
	import {
		formatDate,
		formatDateTime
	} from "@/src/common/util.js"
	import $ from '../home-unsettled/jquery.js'
	export default {
		data() {
			return {
				today: formatDate(new Date().getTime(), true),
				inComeRefund: {
					income: null,
					refund: null
				},
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				waitStatus: true,
				record: [],
				page: {
					pageNum: 1,
					pageSize: 20
				}
			}
		},
		mounted() {
			$(".c-list").scroll(() => {
				if ($("#waitMore").offset().top - $("body").height() + 40 <= 0) {
					if (this.waitStatus) {
						this.waitStatus = false;
						this.page.pageNum++;
						this.handleGetBill(false)
					}
				}
			})
		},
		methods: {
			//转换今天的日期格式
			formatterToday() {
				var date = new Date();
				var object = {
					1: '一',
					2: '二',
					3: '三',
					4: '四',
					5: '五',
					6: '六',
				}
				var str = date.getDay() === 0 ? '周天' : '周' + object[date.getDay()]
				return (date.getMonth() + 1) + '月' + (date.getDate()) + '日' + ' ' + str
			},
			init() {
				//获取收退
				this.$api.getBillIncomeAndRefund({
					createTime: this.today
				}).then(result => {
					if (result.code === 200) {
						this.inComeRefund.income = result.data.income.toFixed(2);
						this.inComeRefund.refund = result.data.refund.toFixed(2);
						console.log(this.inComeRefund)
					}
				})
			},
			upDownFormatter(money, type) {
				if (type == 200 || type == 201) {
					return money.toFixed(2)
				}
				return '+' + money.toFixed(2)
			},
			handleGetBill(bool) {
				//获取今天流水
				let params = Object.assign({
					createTime: this.today
					// createTime: '2021-03-25'
				}, this.page)
				this.$api.getAllBillRecord(params).then(result => {
					if (result.code === 200) {
						if (bool) {
							let list = result.data && result.data.list
							let length = list.length;
							this.record = list.map(item => {
								item.index = "#" + length--;
								return item;
							})
							return;
						}
						if (result.data.list.length <= 0) {
							this.status = 'noMore';
							this.waitStatus = false
							return
						}
						this.status = 'loading';
						let list = this.record.concat(result.data.list)
						let length = list.length;
						this.record = list.map(item => {
							item.index = "#" + length--;
							return item;
						})
						this.waitStatus = true;
					}
				})
			},
			formatDateTimeFunc(time) {
				return formatDateTime(time)
			}
		},
		created() {
			this.init();
			this.handleGetBill(true);
		}
	}
</script>

<style scoped lang="scss">
	.settled {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 0 7rpx;

		.c-date {
			height: 85rpx;
			display: flex;

			&-select {
				display: flex;
				width: 50%;
				justify-content: flex-end;
				align-items: center;

				.common {
					width: 60rpx;
					color: #999999;
					font-size: 26rpx;
				}

				.date {
					width: 180rpx;
					color: #2995E6;
					font-size: 26rpx;
					font-weight: bold;
				}

				.icon {
					width: 36rpx;
					height: 36rpx;
					background: url(../../static/image/homepage/date.png) center center no-repeat;
					background-size: 100% 100%;
				}
			}

			&-count {
				width: 50%;
				display: flex;
				align-items: center;
				justify-content: center;

				.common {
					width: 40rpx;
					color: #999999;
					font-size: 26rpx;
				}

				.money {
					font-size: 26rpx;
					font-weight: bold;
					min-width: 100rpx;
				}

				.up {
					color: #00CC6A;
				}

				.down {
					color: #F1444D;
				}
			}
		}

		.c-list {
			flex: 1;
			background-color: #FFFFFF;
			border-radius: 15rpx;
			overflow-y: auto;
			padding: 10rpx 50rpx;
			position: relative;

			.list-item {
				left: 50rpx;
				right: 50rpx;
				position: absolute;
				top: 0
			}

			.item {
				height: 97rpx;
				border-bottom: 1rpx solid rgba($color: #000000, $alpha: 0.1);
				display: flex;
				align-items: center;

				&-title {
					flex: 1;

					&-text {
						color: #333333;
						font-size: 32rpx;
						line-height: 38rpx;
					}

					&-time {
						margin-top: 4rpx;
						color: #999999;
						font-size: 24rpx;
						line-height: 28rpx;
					}
				}

				&-type {
					width: 170rpx;
					text-align: center;
					margin: 0 10rpx
				}

				&-money {
					width: 170rpx;
					text-align: right;
					color: #00CC6A;
				}

				.down {
					color: #F1444D
				}
			}
		}
	}
</style>
