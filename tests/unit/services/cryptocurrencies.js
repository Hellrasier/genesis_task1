const {getRate} = require('../../../api/services/cryproCurrencies')
const TestFramework = require('../UTestFramework');



TestFramework({
	
	testRate: {
		pars: [['BTC', 'UAH'], ['BTC', 'USD']],
		names: id => `BTC rate try ${id}`,
		test: async (arg, satisfy) => {
			const resp = await getRate(...arg)
			satisfy(JSON.parse(resp).rate != undefined)
		}
	}

})
