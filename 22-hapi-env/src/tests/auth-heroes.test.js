const assert = require('assert')
const api = require('../api')
const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres')
const UserSchema = require('../db/strategies/postgres/schemas/userSchema')

let app = {}

const USER = {
    username: 'admin',
    password: '1234'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$1zhINPs6DCtxMvFSim8FPO1BtRc8HrdOidIRHfmwAVYvBupqbKd.y'
}

describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UserSchema)
        const postgres = new Context(new Postgres(connectionPostgres, model))
        await postgres.update(null, USER_DB, true)
    })

    it('Deve obter um Token JWT', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })
        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)
        console.log('data', data)
        assert.deepEqual(200, statusCode)
        assert.ok(data.token.length > 10)
    })

    it('Deve retornar não Autorizado se não passar um usuario ou senha invalido', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'asfdas',
                password: 'fasda'
            }
        })
        const statusCode = result.statusCode
        assert.deepEqual(401, statusCode)
    })
})