const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class HeroesRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            config: {
                validate: {
                    // payload -> body
                    // headers -> auth
                    // params -> 
                    // query -> 
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    const query = nome ? { nome: { $regex: `.*${nome}*.` } }: { }

                    return this.db.read( query, skip, limit)
                } catch(error) {
                    console.log(error)
                    return "Internal Error"
                }
            }
        }
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            config: {
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = this.db.create({ nome: nome, poder: poder })
                    return {
                        message: "Herói cadastrado com sucesso!",
                        _id: result._id
                    }
                } catch(error) {
                    console.log(error)
                    return "Internal Error"
                }
            }
        }
    }
}

module.exports = HeroesRoutes