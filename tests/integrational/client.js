const http = require('http')

const urls = ['user/create|POST', 'user/login|POST', 'btcRate|GET']


const generateApi = url => (body, token) => new Promise((resolve, reject) => {
	const [endpoint, method] = url.split('|')
	headers = { 'Content-Type': 'application/json'}
	if(token) headers['Authorization'] = token 
	const options = {
    	hostname: 'localhost',
		port: 8003,
    	path: `/${endpoint}`,
    	method,
    	headers
  	} 
	return http.request(options, res => {
    	const buffer = []
    	res.on('data', chunk => {
      	buffer.push(chunk)
		}).on('end', () => {
		  const data = buffer.join('')
		  resolve(JSON.parse(data))
		})
	  }).on('error', reject)
  		.end(body ? JSON.stringify(body) : null)
});

const api = {}

for(let url of urls){
	const [func, subfunc] = url.split('|')[0].split('/')
	if(!subfunc) api[func] = generateApi(url)
	else {
		if(!api[func]) api[func] = {}
		api[func][subfunc] = generateApi(url)
	}
}

module.exports = api
