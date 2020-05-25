const BaseRoute = require('./base/baseRoute')

class HeroesRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    let query = {}
                    if (nome) {
                        query.nome = nome
                    }

                    if (skip && isNaN(skip))
                        throw Error('"skip" has a invalid value!')

                    if (limit && isNaN(limit))
                        throw Error('"limit" has a invalid value!')

                    return this.db.read( query, parseInt(skip), parseInt(limit))
                } catch(error) {
                    console.log(error)
                    return "Internal Error"
                }
            }
        }
    }
}

module.exports = HeroesRoutes