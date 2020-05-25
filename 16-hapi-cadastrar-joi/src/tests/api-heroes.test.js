const assert = require('assert')
const api = require('../api')
let app = {}

const MOCK_CREATE_HEROE = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}

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
        const NAME = "Homem Aranha-1590274573997"
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=1000&nome=${NAME}`
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(200, statusCode)
        console.log('dados[0].nome', dados[0].nome)
        assert.ok(dados[0].nome === NAME)
    })

    it('Listar Heróis - /heroes - com parametro incorreto de "limit" deve retornar "Bad Request"', async () => {
        const DEFAULT_LIMIT = 'AEEEE'
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${DEFAULT_LIMIT}`
        })
        const resultError = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }
        }
        assert.deepEqual(400, result.statusCode)
        assert.deepEqual(resultError, JSON.parse(result.payload))
    })

    it('Cadastrar Herói', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            payload: MOCK_CREATE_HEROE
        })
        const status = result.statusCode
        const { message } = JSON.parse(result.payload)
        assert.ok(200 === status)
        assert.deepEqual("Herói cadastrado com sucesso!", message)
    })
})