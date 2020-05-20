const ICrud = require('./interfaces/interfaceCrud')

class ContextStrategy extends ICrud {
    constructor(strategy) {
        super()
        this._database = strategy
    }

    create(item) {
        this._database.create(item)
    }

    read(query) {
        this._database.read(query)
    }

    update(id, item) {
        this._database.update(id, item)
    }

    delete(id) {
        this._database.delete(id)
    }
}

module.exports = ContextStrategy