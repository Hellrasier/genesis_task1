const Crypto  = require('crypto')
const Storage = require('../../storage/storage')

const generateToken = () => Crypto.randomBytes(16).toString("hex"),

const hashPassword = (password) => new Promise(resolve => {
        const salt = Crypto.randomBytes(16).toString("hex")
        Crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        })
    }),

const verifyPassword = (password, hash) => new Promise(resolve => {
        const [salt, key] = hash.split(":")
        Crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })

module.exports = {
    
    createUser: (email, password) => {
        const hashed_password = await hashPassword(password)
        const token = await generateToken()
        await Storage.insert({
            email: email,
            password: hashed_password,
            token: token
        })
    },
    
    logIn: (email, password) => {
        const user = storage.get(email)
        if(!await verifyPassword(password, user.password)){
            return {
                body: `Error, password is invalid`,
                status: 400
            }
        }
    }, 

    checkAuth: (token) => storage.checkToken(Authoriation)

}