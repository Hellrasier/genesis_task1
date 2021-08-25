const storage = require('../../../storage/storage')
const TestFramework = require('../UTestFramework');


(async () => {

	const data = [...Array(10)].map((_, id) => ({
		email: `example${id}@email.com`, 
		password: `examplepassword${id}`, 
		token: `securetoken${id}`
	}));

	await Promise.all(data.map(async user => storage.insert(user)))

	await TestFramework({
		
		testStorage_getInsert: {
			pars: data,
			names: id => `Get equals insert id ${id}`,
			type: 'deepEqual',
			test: async (user, satisfy) => {
				satisfy(await storage.get(user.email))
			}
		},

		testStorage_getAll: {
			pars: [data],
			names: id => `All data from storage equals created`,
			type: 'deepEqual',
			test: async (data, satisfy) => satisfy(await storage.get())
		},

		testStorage_getToken: {
			pars: data.map(x => x.token),
			names: id => `token ${id} equals to token in storage`,
			test: async (token, satisfy) => satisfy(await storage.checkToken(token))
		},

		testStorage_noUserGet: {
			pars: ['this', 'user', 'does', 'not', 'exist'],
			names: id => `user ${id} not exists`,
			type: 'notEqual',
			test: async (email, satisfy) => satisfy(!(await storage.get(email)))
		}

	})
})()
