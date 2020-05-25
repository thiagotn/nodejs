const assert = require('assert')
const api = require('../api')
let app = {}

const MOCK_CREATE_HEROE = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}

const MOCK_UPDATE_HEROE = {
    nome: 'Gavião Negro',
    poder: 'Flechas'
}

const MOCK_DELETE_HEROE = {
    nome: 'Dead Pool',
    poder: 'Ironia'
}

let MOCK_UPDATE_ID = ''

let MOCK_DELETE_ID = ''

describe('Suite de testes da API de Heróis', function () {
    this.beforeAll(async () => {
        app = await api

        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            payload: JSON.stringify(MOCK_UPDATE_HEROE)
        })
        const dados = JSON.parse(result.payload)
        MOCK_UPDATE_ID = dados._id

        const result2 = await app.inject({
            method: 'POST',
            url: '/heroes',
            payload: JSON.stringify(MOCK_DELETE_HEROE)      
        })
        const dados2 = JSON.parse(result2.payload)
        MOCK_DELETE_ID = dados2._id
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

    it('Atualizar Herói', async () => {
        const _id = MOCK_UPDATE_ID
        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: JSON.stringify(expected)
        })

        const status = result.statusCode
        const { message } = JSON.parse(result.payload)
        assert.ok(200 === status)
        assert.deepEqual("Herói atualizado com sucesso!", message)
    })

    it('Não deve Atualizar Herói com ID inválido', async () => {
        const _id = '1ecbcc7d6c4ad56646699d93'
        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: JSON.stringify(expected)
        })

        const status = result.statusCode
        const { message } = JSON.parse(result.payload)
        assert.ok(412 === status)
        assert.deepEqual("Não foi possível atualizar!", message)
    })

    it('Deve Remover Herói por ID', async () => {
        const _id = MOCK_DELETE_ID
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const status = result.statusCode
        const { message } = JSON.parse(result.payload)
        assert.ok(200 === status)
        assert.deepEqual("Herói removido com sucesso!", message)
    })

    it('Não deve Remover Herói por ID inválido', async () => {
        const _id = '1ecbcc7d6c4ad56646699d93'
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const status = result.statusCode
        const { message } = JSON.parse(result.payload)
        assert.ok(412 === status)
        assert.deepEqual("Não foi possível remover!", message)
    })
})