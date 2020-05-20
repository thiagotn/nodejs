const ICrud = require('./base/interfaces/interfaceCrud')

class PostgresDB extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log('O item foi salvo em Postgres')
    }
}

module.exports = PostgresDB