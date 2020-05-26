const BaseRoute = require('./base/baseRoute')
const Join = require('@hapi/joi')
const Boom = require('@hapi/boom')
const JWT = require('jsonwebtoken')

const FailAction = (request, headers, error) => {
    throw error
}

const DEFAULT_USER = {
    username: 'admin',
    password: 'admin'
}

class AuthRoutes extends BaseRoute {
    constructor(secret) {
        super()
        this.secret = secret
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

                        if (username.toLowerCase() !== DEFAULT_USER.username.toLowerCase() &&
                                password.toLowerCase() !== DEFAULT_USER.password.toLowerCase()) {
                            return Boom.unauthorized('Usuário e/ou Senha Inválidos!')
                        }

                        const token = JWT.sign({
                            username: username,
                            id: 1   
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