const ICrud = require('./base/interfaces/interfaceCrud')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
}

class MongoDB extends ICrud {
    constructor() {
        super()
        this._heroes = null
        this._driver = null
    }

    defineModel() {
        const heroesSchema = Mongoose.Schema({
            nome: {
                type: String,
                require: true
            },
            poder: {
                type: String,
                require: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        })
        this._heroes = Mongoose.model('heroes', heroesSchema)
    }

    async isConnected() {
        const state = STATUS[this._driver.readyState] 
        if (state === 'Conectado') return state

        if (state !== 'Conectando') return state

        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._driver.readyState]        
    }

    connect() {
        Mongoose.connect('mongodb://thiago:minhasenha@localhost:27017/heroes',
            { useNewUrlParser: true }, function (error) {
                if (!error) return;
                console.log('Falha na conexão', error)
            })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('conectado ao mongodb'))
        this._driver = connection
        this.defineModel()
    }

    async create(item) {
        return this._heroes.create(item)
    }

    async read(query, skip = 0, limit = 10) {
        return this._heroes.find(query).skip(skip).limit(limit)
    }

    update(id, item) {
        return this._heroes.updateOne({ _id: id}, { $set:  item })
    }

    delete(id) {
        return this._heroes.deleteOne({ _id: id })
    }

}

module.exports = MongoDB