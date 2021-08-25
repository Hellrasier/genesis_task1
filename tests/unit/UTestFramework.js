const assert = require('assert').strict


const runTest = async (pars, names_array, type, current) => {
	let results = []
	while(pars.length > 0){
		let par = pars.shift()
		let name = names_array.shift()
		let result
		try{
			if(type == 'ok') {
				result = await current(par, result => assert.ok(result, name))
			} else {
				result = await current(par, result => assert[type](par, result, name))
			}
		} catch(err){
			const {expected, actual, operator} = err
			results.push({message: `Error in ${name}`, actual, expected, operator})
		}
		if(typeof result == 'function'){
			results = results.concat(await runTest([...pars], [...names_array], type, result))
		}
	}
	return results
}

async function TestFramework(unit_tests){
	for(let [uTest_name, tests] of Object.entries(unit_tests)){
		console.log(`Starting unit test ${uTest_name}...`)
		let {pars, names, type, test} = tests
		if(!pars || !test) throw Error('"pars" (params) field and "test" function is required!')
		if(!type) type = 'ok'
		if(!names) names = x => x
		const results = await runTest(pars, pars.map((_, id) => names(id)), type, test)
		if(results.length > 0){
			console.log(`Unit test ${uTest_name} failed, Results:`)
			console.table(results)
		} else {
			console.log(`Unit test ${uTest_name} done successfully! `)
		}
	}
}

module.exports = TestFramework
