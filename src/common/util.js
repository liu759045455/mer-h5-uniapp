/**
 * 拼接对象为请求字符串
 * 对于需要编码的文本（比如说中文）我们要进行编码
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 **/
export function formatGetUri(obj) {
	const params = []
	Object.keys(obj).forEach((key) => {
		let value = obj[key]
		if (typeof value !== 'undefined' || value !== null) {
			params.push([key, encodeURIComponent(value)].join('='))
		}
	})
	return '?' + params.join('&')
}

export function formatDate(cellValue, type) {
	if (cellValue == null || cellValue == "") return "";
	var date = new Date(cellValue)
	var year = date.getFullYear()
	var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
	var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
	var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
	var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
	if (!type) return year + '/' + month + '/' + day;
	return year + '-' + month + '-' + day;
}

export function formatDateTime(cellValue, type) {
	if (cellValue == null || cellValue == "") return "";
	var date = new Date(cellValue)
	var year = date.getFullYear()
	var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
	var day = date.getDate();
	var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
	var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
	if (type) {
		return hours + ':' + minutes + ':' + seconds
	}
	return month + '月' + day + '日' + ' ' + hours + ':' + minutes;
}

export function formatDateMonth(cellValue) {
	if (cellValue == null || cellValue == "") return "";
	var date = new Date(cellValue)
	var year = date.getFullYear()
	var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
	var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
	var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
	var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
	return month + '/' + day;
}

