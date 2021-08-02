// const storage = require('../storage/storage.js')
// const Security = require('./services/cryproCurrencies');
const cryptoCurrencies = require('./services/cryproCurrencies')
const auth = require('./services/authentification')


const emailAlreadyExist = email => {
    let users_data = storage.get()
    return users_data.length != 0 && users_data.every(user => user.email == email)
}

const isCorrectEmail = email => email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)

const api = {
    '/user/create/POST': async ({email, password}) => {
        if(!(email && password)) {
            return {
                body: `Error, your E-mail or password field is empty`,
                status: 400
            }
        }
        if(!isCorrectEmail(email)) {
            return {
                body: `Error, incorrect email`,
                status: 400
            }
        }
        if(emailAlreadyExist(email)){
            return {
                body: `Error, user with this E-mail adress already exists`,
                status: 409
            }
        }
        auth.createUser({email, password})
        return {
            body: `Created user with E-mail: ${email}`,
            status: 201
        }
    },

    '/user/login/POST': async ({email, password}) => {
        if(!(email && password)) {
            return {
                body: `Error, your E-mail or password field is empty`,
                status: 400
            }
        }
        if(!emailAlreadyExist(email)){
            return {
                body: `Error, user with this email does not exist`,
                status: 400
            }
        }
        const user = storage.get(email)
        if(!await Security.verifyPassword(password, user.password)){
            return {
                body: `Error, password is invalid`,
                status: 400
            }
        }
        return {
                body: user.token,
                status: 200
            }
    },

    '/btcRate/GET': async (_, {Authorization}) => {
        if(!auth.a){
            return {
                body: `Error, user is unauthorized`,
                status: 401
            }
        }
        const rate = JSON.parse(await cryptoCurrencies.getRate('BTC', 'UAH'))
        console.log(rate)
        return {
            body: {
                cryptoCurrency: rate.asset_id_base,
                rate: rate.rate.toFixed(2) + ' UAH'
            },
            status: 200
        }
    }
}
 
module.exports = api 