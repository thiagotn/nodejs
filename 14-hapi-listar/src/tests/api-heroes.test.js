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

    it('Listar Heróis - /heroes - deve retornar somente 10 herois', async () => {
        const DEFAULT_LIMIT = 3
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${DEFAULT_LIMIT}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(200, statusCode)
        assert.ok(Array.isArray(dados))
        assert.ok(dados.length === DEFAULT_LIMIT)
    })

    it('Listar Heróis - /heroes - deve filtrar um item', async () => {
        const NAME = "Clone6"
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=1000&nome=${NAME}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(200, statusCode)
        assert.ok(dados[0].nome === NAME)
    })

    it('Listar Heróis - /heroes - com parametro incorreto de "limit" deve retornar "Internal Error"', async () => {
        const DEFAULT_LIMIT = 'AEEEE'
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${DEFAULT_LIMIT}`
        })
        assert.deepEqual(result.payload, "Internal Error")
    })

})