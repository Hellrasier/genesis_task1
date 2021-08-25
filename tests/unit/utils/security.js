const {generateToken, hashPassword, verifyPassword} = require('../../../api/utils/security')
const TestFramework = require('../UTestFramework')

const hash_length = 32

const tokens = [...Array(10)].map((_, id) => generateToken())

const passwords = [
			'dskjdsjdkjsdkj',
			'2R@*R8r2hf2f28@*',
			'@:@"E"@E":@EE@J@E"',
			'!!DBDAP{F}A>F<S<FS?><}'
			];


(async () => {	
	
	const hashed_pswds = await Promise.all(passwords.map(pswd => hashPassword(pswd)))
	
	await TestFramework({
		
		testTokenGen_unique: {
			pars: tokens, 
			names: id => `Token_${id} is unique`,
			type: 'notEqual',
			test: token => (another_token, satisfy) => satisfy(token) 
		},

		testTokenGen_correctLength: {
			pars:  tokens.map(x => x.length),
			names: id => `Token_${id} has length ${hash_length}`,
			type: 'equal',
			test: (token_length, satisfy) => satisfy(hash_length)
		},

		testHashVerify_equals: {
			pars: passwords, 
			names: id => `Password_${id} equals to hashed password`,
			test: async (pswd, satisfy) => {
				const hashed_pswd = await hashPassword(pswd)
				satisfy(await verifyPassword(pswd, hashed_pswd))
			}
		},

		testHash_length: {
			pars: hashed_pswds.map(x => x.length),
			names: id => `Password_${id} has length ${hash_length}`,
			type: 'equal',
			test: async (hashed_pswd_length, satisfy) => satisfy(hash_length * 2 + 1)
		}

	})
})()






