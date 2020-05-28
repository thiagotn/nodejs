const ICrud = require('../base/interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class PostgresDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    create(item) {
        return this._schema.create(item, { raw: true })
    }

    read(item) {
        return this._schema.findAll({ where: item, raw: true });
    }

    update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'
        return this._schema[fn](item, { where: { id } });
    }

    delete(id) {
        const query = id ? { id } : {};
        return this._schema.destroy({ where: query });
    }

    async isConnected() {
        try {
            await this._connection.authenticate()
            return true
        } catch (error) {
            console.log('fail!', error)
            return false;
        }
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        await model.sync()
        return model
    }

    static async connect() {
        const connection = new Sequelize(
            'heroes',
            'admin',
            'admin',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorAliases: false
            }
        )
        return connection
    }
}

module.exports = PostgresDB