const assert = require('assert')
const api = require('../api')
let app = {}

describe('Suite de testes da API de Heróis', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('Listar Heróis', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes'
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(200, statusCode)
        assert.ok(Array.isArray(dados))
    })
})