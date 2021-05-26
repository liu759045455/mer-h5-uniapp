let base_url = ""

if (process.env.NODE_ENV === 'development') {
	// 开发环境
	base_url = 'http://192.168.0.199:9199'
	// base_url = 'http://192.168.0.111:8199'
	// base_url = "https://153.99.183.84/"
} else {
	// 生产环境
	base_url = '/smartxw'
}
export default base_url
