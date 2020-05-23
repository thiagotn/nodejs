const ICrud = require('./base/interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class PostgresDB extends ICrud {
    constructor() {
        super()
        this._driver = null
        this._heroes = null
        this.connect()
    }

    create(item) {
        return this._heroes.create(item, { raw: true })
    }

    read(item) {
        return this._heroes.findAll({ where: item, raw: true });
    }

    update(id, item) {
        return this._heroes.update(item, { where: { id } });
    }

    delete(id) {
        const query = id ? { id } : {};
        return this._heroes.destroy({ where: query });
    }

    async isConnected() {
        try {
            await this._driver.authenticate()
            return true
        } catch (error) {
            console.log('fail!', error)
            return false;
        }
    }

    async defineModel() {
        this._heroes = this._driver.define('herois', {
            id: {
                type: Sequelize.INTEGER,
                require: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                require: true
            },
            poder: {
                type: Sequelize.STRING,
                require: true
            }
        }, {
            tableName: 'TB_HEROIS',
            freezeTableName: false,
            timestamps: false
        })
        await this._heroes.sync()
    }

    async connect() {
        this._driver = new Sequelize(
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
        await this.defineModel()
    }
}

module.exports = PostgresDB