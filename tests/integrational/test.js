const {user, btcRate} = require('./client.js')


const createUser = (email, password) => user.create({email, password})
const loginUser = (email, password) => user.login({email, password})
const getBtcRate = (token) => btcRate(null, token)

const users = [
	['first@user.com', '12345'],
	['scnd@user.com', '12345'],
	['thrd@user.com', '12345']
];



(async () => {
	
	console.log(`Integration test started...`)
	console.log('Creating 3 users and 3 mistakenly')

	for(let user of users){
		await createUser(...user).then(res => console.log(`Succesfully created ${users.indexOf(user) + 1} user`))
					.catch(err => console.log(err))
	}
	await createUser('first@user.com', '12345').catch(res => {i
		if(res == 'Error, user with this E-mail adress already exists') console.log('Sucessfully user 4 not created')
		else throw Error('Something went wrong')
	})
	await createUser('fsfafsaf', '12345').catch(res => {
		if(res == 'Error, incorrect email') console.log('Sucessfully user 5 not created')
		else throw Error('Something went wrong')
	})
	await createUser().catch(res => {
		if(res == 'Error, your E-mail or password field is empty') console.log('Sucessfully user 6 not created')
		else throw Error('Something went wrong')
	})
	
	console.log('Succesfully tested creating user')
	console.log('Loggining 1, 2 and 3 user and 3 other with mistakes')
	for(let user of users){
		await loginUser(...user).then(res => {
			user.push(res)
			console.log(`Succesfully logged ${users.indexOf(user) + 1} user`)
		}).catch(err => console.log(err))
	}

	await loginUser('fsfafsaf', '12345').catch(res => {
		if(res == 'Error, user with this email does not exist') console.log('Sucessfully user 4 not logged')
		else throw Error('Something went wrong')
	})


	await loginUser('first@user.com', '124124').catch(res => {
		if(res == 'Error, password is invalid') console.log('Sucessfully user 5 not logged')
		else throw Error('Something went wrong')
	})

	await createUser().catch(res => {
		if(res == 'Error, your E-mail or password field is empty') console.log('Sucessfully user 6 not logged')
		else throw Error('Something went wrong')
	})
	
	console.log('Succesfully tested logging')

	console.log('Getting BTC rate for 3 users...')

	for(let [_, a, token] of users){
		await getBtcRate(token).then(res => {
			if(res.rate) console.log("Success!")
		})
	}

	console.log('Getting BTC rate without token or mistake token...')

	await getBtcRate().then(res => {
		if(res == 'Error, user is unauthorized') console.log("Sucessfully didn't get btc rate without token")
		else throw Error('Something went wrong')
	})

	await getBtcRate('dsdsadaffa3f').then(res => {
		if(res == 'Error, user is unauthorized') console.log("Sucessfully didn't get btc rate with incorrect token")
		else throw Error('Something went wrong')
	})

	console.log('Integration test is over, all tests done!')

})()


