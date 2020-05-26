const assert = require('assert')
const api = require('../api')
let app = {}

describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('Deve obter um Token JWT', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'admin',
                password: 'admin'
            }
        })
        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)
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