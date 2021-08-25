const {isCorrectEmail} = require('../../../api/utils/utils.js')
const TestFramework = require('../UTestFramework')


TestFramework({
	
	isCorrectEmail_true: {
		pars: [
			'skdsdsk21@mail.com',
			'dlss3@woow.kek',
			'!DJ@lalla.ua',
			'superpuper@email.yo'
		], 
		names: id => `Email ${id} is correct`,
		test: (email, satisfy) => satisfy(isCorrectEmail(email))
	},

	isCorrectEmail_false: {
		pars: [
			"@@@@@@",
			"fajfaskfasjkfakj.com",
			"'rc'rr'1rc@@keks.kek'''",
			"double@aaa@.com",
			"111111111111111",
			"2121wwww.com.ua"
		],
		names: id => `Email ${id} is incorrect`,
		test: (email, satisfy) => satisfy(!isCorrectEmail(email))
	}

})
