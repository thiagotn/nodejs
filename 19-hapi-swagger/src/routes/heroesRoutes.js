const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')

class HeroesRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            options: {
                validate: {
                    // payload -> body
                    // headers -> auth
                    // params -> 
                    // query -> 
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    })
                },
                tags: ['api'],
                handler: (request, headers) => {
                    try {
                        const { skip, limit, nome } = request.query
                        const query = nome ? { nome: { $regex: `.*${nome}*.` } }: { }
    
                        return this.db.read( query, skip, limit)
                    } catch(error) {
                        console.log(error)
                        return Boom.internal()
                    }
                }
            }
        }
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            options: {
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    payload: Joi.object({
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    })
                },
                tags:  ['api'],
                handler: async (request) => {
                    try {
                        const { nome, poder } = request.payload
                        const result = await this.db.create({ nome: nome, poder: poder })
                        return {
                            message: "Herói cadastrado com sucesso!",
                            _id: result._id
                        }
                    } catch(error) {
                        console.log(error)
                        return Boom.internal()
                    }
                }
            }
        }
    }

    update() {
        return {
            path: '/heroes/{id}',
            method: 'PATCH',
            options: {
                validate: {
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100),
                    })
                },
                tags: ['api'],
                handler: async (request) => {
                    try {
                        const {
                            id
                        } = request.params
                        const {
                            payload
                        } = request
    
                        const dadosString = JSON.stringify(payload)
                        const dados = JSON.parse(dadosString)
    
                        const result = await this.db.update(id, dados)
    
                        if (result.nModified !== 1) return Boom.preconditionFailed('Não foi possível atualizar!') 
    
                        return {
                            message: 'Herói atualizado com sucesso!'
                        }
    
                    } catch (error) {
                        console.error(error)
                        return Boom.internal()
                    }
                }
            }
        }
    }

    delete() {
        return {
            path: '/heroes/{id}',
            method: 'DELETE',
            options: {
                validate: {
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                },
                tags: ['api'],
                handler: async (request) => {
                    try {
                        const {
                            id
                        } = request.params
    
                        const result = await this.db.delete(id)
                        if (result.deletedCount !== 1) return  Boom.preconditionFailed('Não foi possível remover!')
    
                        return {
                            message: 'Herói removido com sucesso!'
                        }
    
                    } catch (error) {
                        console.error(error)
                        return Boom.internal()
                    }
                }
            }
        }
    }
}

module.exports = HeroesRoutes