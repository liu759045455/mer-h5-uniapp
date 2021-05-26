<template>
	<view class="unsettled">
		<!-- 查看账单 -->
		<view class="c-bill">
			<view class="c-bill-date">
				<text class="common">{{cycle[nextCycle]}}</text>
				<text class="date">下次结算日期：{{cycleDate}}</text>
			</view>
		</view>
		<!-- bill list -->
		<view class="c-blist">
			<view class="blist-tap">
				<view :class="['tap',{selected:billIndex === 0}]" @click="handleBillTab(0)">
					待结算账单
				</view>
				<view :class="['tap',{selected:billIndex === 1}]" @click="handleBillTab(1)">
					已结算账单
				</view>
			</view>
			<!-- 待结算list -->
			<view class="blist-table" v-show="billIndex === 0" id="waitBlist">
				<view class="table-position">
					<view class="table">
						<view class="header wait-header" @click.stop="handleHeaderClick">
							<view class="header-name">
								账单时间：
								<text class="time">
									{{waitResult.start}}-{{waitResult.end}}
								</text>
							</view>
							<view class="header-icon"></view>
						</view>
					</view>
				</view>
			</view>
			<!-- 已结算list -->
			<view class="blist-table" v-show="billIndex === 1" id="alBlist">
				<view class="table-position" v-if="alreadyResult.length > 0">
					<view class="table" v-for="(cell,idx) in alreadyResult" :key="idx">
						<view class="header al-header" @click.stop="handleHeaderAlClick(idx)">
							<view class="header-alname">
								<text class="alname">{{cell.index}}</text>
								<text :class="['alstatus',{ing:cell.status =='0'},{ed:cell.status =='1'}]">
									{{cell.status =='0' ? '打款中':'已打款'}}
								</text>
							</view>
							<scroll-view class="header-alnumber" scroll-x="true">
								<view class="alnumber-number">
									对账单号：
									<view class="number">{{cell.merchantBillNo}}</view>
								</view>
								<view class="alnumber-time">
									{{cell.time}}
								</view>
							</scroll-view>
							<view class="header-icon">
							</view>
						</view>
						<view class="tbody" v-if="cell.status">
							<view class="item" v-for="(item,index) in bill" :key="index">
								<view class="time">{{item.time}}</view>
								<view class="money">{{item.money.toFixed(2)}}</view>
								<view class="action">查看</view>
							</view>
						</view>
					</view>
				</view>
				<u-empty v-else text="数据为空" mode="data"></u-empty>
			</view>
			<!-- 查看日账单 -->
			<view class="blist-view view-popup">
				<u-popup v-model="popupShow" mode="bottom" height="60%" border-radius="15">
					<view class="close" @click.stop="handleClosePopup">

					</view>
					<view class="popup-view">
						<view class="p-title">
							<view class="p-title-icon">

							</view>
							<view class="p-title-date">
								{{currentTime}} 日账单
							</view>
							<view class="p-title-total">
								共计:<text class="total">{{currentTotal}}笔</text>
							</view>
						</view>
						<view class="p-table">
							<view class="p-table-header">
								<text class="td">时间</text>
								<text class="td">账单单号</text>
								<text class="td">类型</text>
								<text class="td">金额</text>
							</view>
							<view class="p-table-tbody">
								<scroll-view id="scrollId" class="scroll-view_H" scroll-y="true"
									@scrolltolower="handleRefresh" v-if="billResult.length > 0">
									<view class="p-item" v-for="(item,index) in billResult" :key="index">
										<text class="td">{{formatDateTimeFunc(item.createTime)}}</text>
										<text class="td">{{item.billNumber}}</text>
										<text class="td">{{item.billTypeName}}</text>
										<text class="td">￥{{item.money}}</text>
									</view>
									<uni-load-more :status="detailsStatus" v-if="billResult.length >= 20"
										:icon-size="16" :content-text="contentText" iconType="auto" />
								</scroll-view>
								<u-empty v-else text="数据为空" mode="data"></u-empty>
							</view>
						</view>
					</view>
				</u-popup>
			</view>
			<!-- 未结算/已结算账单列表 -->
			<u-modal v-model="showModal" :show-title="false" confirm-text="关闭" class="blist-bill">
				<scroll-view class="modal-scroll" scroll-y="true" scroll-left="120" @scrolltolower="scrolltolower"
					v-if="waitBill.length > 0">
					<view class="item" v-for="(item,index) in waitBill" :key="index">
						<view class="time">{{item.dayTime}}</view>
						<view class="money">¥{{item.merchantIncomeCount.toFixed(2)}}</view>
						<view class="action" @click.stop="handleView(item)">查看</view>
					</view>
					<uni-load-more :status="status" v-if="waitBill.length >= 20" :icon-size="16"
						:content-text="contentText" iconType="auto" />
				</scroll-view>
				<u-empty v-else text="数据为空" mode="data"></u-empty>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import $ from './jquery.js'
	import {
		formatDate,
		formatDateMonth,
		formatDateTime
	} from "@/src/common/util.js"
	export default {
		data() {
			return {
				status: 'loading',
				detailsStatus: 'loading',
				alreadyStatus: {},
				popupShow: false,
				billIndex: 0,
				waitResult: {
					start: null,
					end: null,
					status: false
				},
				alreadyResult: [],
				billResult: [],
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				billPage: {
					page: 1,
					pageSize: 20
				},
				detailsPage: {
					pageNum: 1,
					pageSize: 20
				},
				waitBill: [],
				waitStatus: true,
				detailStatus: true,
				currentTime: null,
				currentTotal: null,
				showModal: false,
				cycle: {
					1: '月结',
					2: '季节',
					3: '年结'
				}
			}
		},
		computed: {
			cycleDate() {
				return formatDateMonth(this.settleDate)
			}
		},
		watch: {
			settleTime: {
				handler(result) {
					if (Object.keys(result) <= 0) return;
					this.waitResult.start = formatDate(result.start);
					this.waitResult.end = formatDate(result.end)
				},
				deep: true
			},
		},
		props: {
			settleTime: {
				type: Object,
				default: () => {}
			},
			nextCycle: {
				type: Number,
				default: -1
			},
			settleDate: {
				type: Number,
				default: 0
			}
		},
		//下拉
		onPullDownRefresh() {
			console.log("别啦了")
		},
		//触底
		onReachBottom() {
			console.log("触底")
		},
		methods: {
			formatDateTimeFunc(time) {
				return formatDateTime(time, true)
			},
			/*  触底操作  */
			scrolltolower() {
				if (this.waitStatus) {
					this.billPage.page++;
					this.handleWaitBillFunc(false);
				}
			},
			handleBillTab(index) {
				this.billIndex = index;
				if (0 === index) {
					return;
				}
				if (this.alreadyResult.length > 0) {
					return
				}
				this.$api.getAllRecordBills({}).then(result => {
					if (result.code === 200) {
						let list = result.data || [];
						let length = list.length;
						this.alreadyResult = list.map((item, index) => {
							item.index = '#' + length--;
							item.time =
								`${formatDate(item.settlementStartDate)}-${formatDate(item.settlementEndDate)}`

							return item;
						})
					}
				})
			},
			/* 未结算账单点击 */
			handleHeaderClick() {
				this.status = 'loading';
				this.waitStatus = true;
				this.billPage = {
					page: 1,
					pageSize: 20
				};
				this.showModal = true;
				this.handleWaitBillFunc(true);
			},
			/* 已结算账单点击 */
			handleHeaderAlClick(index) {
				this.status = 'loading';
				this.waitStatus = true;
				this.billPage = {
					page: 1,
					pageSize: 20
				};
				this.showModal = true;
				this.handlealBillFunc(true, this.alreadyResult[index]);
			},
			/** 请求已结算账单数据**/
			handlealBillFunc(type, item) {
				let params = {
					settlementStartDate: this.formatDateToStamp(item.settlementStartDate),
					settlementEndDate: this.formatDateToStamp(item.settlementEndDate),
					...this.billPage
				}
				this.$api.getAppointCycle(params).then(result => {
					if (result.code === 200) {
						if (type) {
							this.waitBill = result.data
							return;
						}
						if (result.data.length <= 0) {
							this.status = 'noMore';
							this.waitStatus = false
							return
						}
						this.status = 'loading';
						this.waitBill = this.waitBill.concat(result.data)
						this.waitStatus = true;
					}
				})
			},
			/** 请求未结算账单数据**/
			handleWaitBillFunc(type) {
				let params = {
					settlementStartDate: this.formatDateToStamp(this.waitResult.start),
					settlementEndDate: this.formatDateToStamp(this.waitResult.end),
					...this.billPage
				}
				this.$api.getAppointCycle(params).then(result => {
					if (result.code === 200) {
						if (type) {
							this.waitBill = result.data
							return;
						}
						if (result.data.length <= 0) {
							this.status = 'noMore';
							this.waitStatus = false
							return
						}
						this.status = 'loading';
						this.waitBill = this.waitBill.concat(result.data)
						this.waitStatus = true;
					}
				})
			},
			formatDateToStamp(str) {
				return new Date(str).getTime();
			},
			handleView(row) {
				this.currentTime = row.dayTime.split(" ")[0].replace(new RegExp("/", "gm"), '-');
				this.$nextTick(() => {
					let wrapper = $("#scrollId").height();
					let item = $(".p-table-header").height();
					let length = Math.ceil(wrapper / item)
					this.detailsPage.pageSize = length;
					this.handleDetailsFunc(true);
				})
				this.popupShow = true
			},
			handleClosePopup() {
				this.popupShow = false
			},
			handleRefresh() {
				console.log(2)
				if (this.detailStatus) {
					this.detailsPage.pageNum++;
					this.handleDetailsFunc(false)
				}
			},
			handleDetailsFunc(type) {
				let params = Object.assign({
					createTime: this.currentTime
					// createTime: '2021-03-25'
				}, this.detailsPage)
				this.$api.getAllBillRecord(params).then(result => {
					if (result.code === 200) {
						if (type) {
							this.billResult = result.data && result.data.list;
							this.currentTotal = result.data && result.data.totalCount
							return
						}
						if (result.data && result.data.list.length <= 0) {
							this.detailsStatus = 'nomore'
							this.detailStatus = false;
							return
						}
						this.detailsStatus = 'loading';
						this.billResult = this.billResult.concat(result.data && result.data.list);
						this.detailStatus = true;
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.unsettled {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin: 0 7rpx;

		.c-bill {
			display: flex;
			justify-content: flex-start;
			height: 85rpx;
			align-items: center;
			padding-left: 70rpx;

			&-date {
				width: 390rpx;

				.common {
					width: 60rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #333333;
					line-height: 34rpx;
					position: relative;

					&::before {
						position: absolute;
						top: 50%;
						left: -20rpx;
						transform: translateY(-50%);
						content: "";
						width: 8rpx;
						height: 30rpx;
						display: inline-block;
						margin-right: 12rpx;
						background-image: linear-gradient(to bottom, #FA5046, #DC1428);
					}
				}

				.date {
					margin-left: 10rpx;
					width: 250rpx;
					font-size: 26rpx;
					line-height: 34rpx;
					color: #999999;
				}
			}

			&-day {
				width: 240rpx;
				text-align: center;
				color: #F1444D;
				font-size: 26rpx;
				font-weight: bold;
			}
		}

		.c-blist {
			flex: 1;
			background-color: #FFFFFF;
			border-radius: 15rpx;
			overflow-y: auto;
			padding: 0rpx 50rpx;
			position: relative;

			.blist-tap {
				height: 67rpx;
				line-height: 67rpx;
				display: flex;

				.tap {
					width: 290rpx;
					text-align: center;
					position: relative;
					font-size: 26rpx;
					font-weight: bold;
					color: #999999;
				}

				.selected {
					color: #333333;

					&::after {
						content: "";
						position: absolute;
						display: inline-block;
						height: 4rpx;
						width: 290rpx;
						bottom: -4rpx;
						left: 0;
						background-image: linear-gradient(to bottom, #FA5046, #DC1428);
					}
				}
			}

			.blist-table {
				margin-top: 20rpx;
				height: calc(100% - 100rpx);
				overflow-y: auto;
				position: relative;

				.table-position {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
				}

				.table {
					height: auto;

					.header {
						margin: 10rpx 0;
						font-weight: bold;
						color: #333333;
						line-height: 80rpx;
						border-radius: 5rpx;
						background: #f9f9f9;
						display: flex;
						justify-content: space-around;
						align-items: center;

						&-name {
							font-size: 24rpx;
							line-height: 80rpx;
							color: #666666;

							.time {
								font-size: 26rpx;
								line-height: 80rpx;
								color: #333333;
							}
						}

						&-alname {
							width: 80rpx;
							text-align: center;
							display: flex;
							flex-direction: column;
							padding: 0 20rpx;
							border-right: 1px solid rgba($color: #000000, $alpha: 0.1);
							box-sizing: content-box;

							.alname {
								font-size: 32rpx;
								line-height: 38rpx;
							}

							.alstatus {
								font-size: 24rpx;
								line-height: 38rpx;
								font-weight: normal;
							}

							.ing {
								color: #F1444D;
							}

							.ed {
								color: #00CC6A;
							}
						}

						&-alnumber {
							padding: 0 20rpx;
							font-weight: normal;
							flex: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;

							.alnumber-number {
								font-size: 24rpx;
								line-height: 32rpx;
								color: #666666;
								display: flex;

								.title {
									width: 110rpx;
								}

								.number {
									flex: 1;
									font-size: 30rpx;
									color: #333333;
								}
							}

							.alnumber-time {
								font-size: 24rpx;
								color: #999999;
								margin-top: 10rpx;
							}
						}

						&-icon {
							box-sizing: content-box;
							margin: 0 10rpx 0 40rpx;
							width: 60rpx;
							height: 60rpx;
							transform: rotate(-90deg);
							background: url(../../static/image/homepage/flexible.png) center center no-repeat;
							background-size: 100% 100%;
						}

						.open {
							animation: rotateOpen .2s linear 1 forwards;
						}

						.close {
							animation: rotateClose .2s linear 1 forwards;
						}

						@-webkit-keyframes rotateOpen {
							from {
								transform: rotate(0)
							}

							to {
								transform: rotate(-180deg)
							}
						}

						@-webkit-keyframes rotateClose {
							from {
								transform: rotate(-180deg)
							}

							to {
								transform: rotate(0)
							}
						}

						.time {
							width: 270rpx;
						}

						.money {
							width: 190rpx;
						}

						.action {
							width: 110rpx;
						}
					}

					.wait-header {
						height: 80rpx;
					}

					.al-header {
						height: 112rpx;
						line-height: normal;
					}

					.tbody {
						position: relative;

						// .float {
						// 	width: 100%;
						// 	height: 100%;
						// }

						.item {
							height: 50rpx;
							line-height: 50rpx;
							display: flex;
							font-size: 24rpx;
							text-align: center;
							justify-content: space-around;
							color: #999999;

							.time {
								width: 270rpx;
							}

							.money {
								width: 190rpx;
							}

							.action {
								width: 110rpx;
								color: #2995E6;
							}

							&:nth-of-type(2n) {
								background-color: #f9f9f9;
							}
						}
					}
				}
			}

			.blist-view {
				.popup-view {
					padding: 0 50rpx;
					height: 100%;

					.p-title {
						display: flex;
						align-items: center;
						line-height: 120rpx;

						&-icon {
							width: 36rpx;
							height: 36rpx;
							background: url(../../static/image/homepage/date.png) center center no-repeat;
							background-size: 100% 100%;
						}

						&-date {
							font-size: 26rpx;
							color: #2995E6;
							text-indent: 20rpx;
						}

						&-total {
							width: 50%;
							color: #999999;

							text-align: right;

							.total {
								color: #333333;
								font-weight: bold;
							}
						}
					}

					.p-table {
						height: calc(100% - 120rpx);

						&-header {
							display: flex;
							background-color: #EEEEEE;
							color: #333333;
							font-size: 24rpx;
							font-weight: bold;
							height: 50rpx;
							line-height: 50rpx;

							.td {
								width: 110rpx;
								text-align: center;

								&:nth-of-type(1) {
									width: 130rpx;
								}

								&:nth-of-type(2) {
									flex: 1;
								}
							}
						}

						&-tbody {
							height: calc(100% - 40rpx);
							font-size: 24rpx;
							line-height: 50rpx;

							.scroll-view_H {
								height: 100%;
							}

							::v-deep .uni-scroll-view-content {
								.p-item {
									display: flex;

									.td {
										height: 50rpx;
										color: #666666;
										width: 110rpx;
										text-align: center;

										&:nth-of-type(1) {
											width: 130rpx;
										}

										&:nth-of-type(2) {
											flex: 1;
											overflow: hidden;
											text-overflow: ellipsis;
											white-space: nowrap;
										}
									}

									&:nth-of-type(2n) {
										background-color: #f9f9f9;
									}
								}

							}
						}
					}
				}
			}

			.view-popup {
				background-color: red;

				::v-deep .u-drawer {
					z-index: 20000 !important;
				}

				::v-deep .u-drawer-content {
					width: 690rpx !important;
					margin: 0 auto;
					overflow: visible !important;

					.u-drawer__scroll-view {
						position: relative;

						>.uni-scroll-view {
							>.uni-scroll-view {
								overflow: visible !important;
							}
						}

						.close {
							width: 80rpx;
							height: 80rpx;
							background: url(../../static/image/homepage/popup-quit.png) center center no-repeat;
							background-size: 100% 100%;
							position: absolute;
							top: -100rpx;
							left: 50%;
							transform: translateX(-50%);
						}
					}

				}

			}

			.blist-bill {
				.modal-scroll {
					position: relative;
					height: 800rpx;

					::v-deep .uni-scroll-view-content {
						margin-top: 20rpx;
					}

					.item {
						height: 50rpx;
						line-height: 50rpx;
						display: flex;
						font-size: 24rpx;
						text-align: center;
						justify-content: space-around;
						color: #999999;

						.time {
							width: 270rpx;
						}

						.money {
							width: 190rpx;
						}

						.action {
							width: 110rpx;
							color: #2995E6;
						}

						&:nth-of-type(2n) {
							background-color: #f9f9f9;
						}
					}
				}
			}
		}
	}
</style>
