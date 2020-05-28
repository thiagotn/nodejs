const BaseRoute = require('./base/baseRoute')
const Join = require('@hapi/joi')
const Boom = require('@hapi/boom')
const JWT = require('jsonwebtoken')
const PasswordHelper = require('../helpers/passwordHelper')

const FailAction = (request, headers, error) => {
    throw error
}

const DEFAULT_USER = {
    username: 'admin',
    password: 'admin'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            options: {
                auth: false,
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    payload: Join.object({
                        username: Join.string().required().min(4).max(100),
                        password: Join.string().required().min(4).max(100)
                    })
                },
                tags: ['api'],
                description: 'Obter Token JWT',
                notes: 'Faz login e obtém um Token JWT',
                handler: async (request) => {
                    try {
                        const { username, password } = request.payload

                        const [user] = await this.db.read({
                            username: username.toLowerCase()
                        })

                        if (!user) {
                            return Boom.unauthorized('Usuário e/ou Senha Inválidos!')
                        }

                        const match = await PasswordHelper.comparePassword(password, user.password)
                        if (!match) {
                            return Boom.unauthorized('Usuário e/ou Senha Inválidos!')
                        }

                        const token = JWT.sign({
                            username: username,
                            id: user.id   
                        }, this.secret)

                        return {
                            token
                        }

                    } catch (error) {
                        console.log(error)
                        return Boom.internal()
                    }
                }
            }
        }
    }
}

module.exports = AuthRoutes