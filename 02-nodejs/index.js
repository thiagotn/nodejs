const util = require('util')
const obterEndereoAsync = util.promisify(obterEndereco)

/*
0 Obter um usuario
1 Obter o numero de telefone de um usuario a partir de seu Id
2 Obter o endereco do usuario pelo Id
*/
function obterUsuario() {
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(function () {
            return resolve({
                id: 1,
                nome: "Aladin",
                dataNascimento: new Date()
            })
        }, 1000);
    })
}

function obterTelefone(idUsuario) {
    return new Promise(function resolvePromise(resolve, reject) {
        setTimeout(() => {
            return resolve({
                telefone: '11992233',
                ddd: '11'
            })
        }, 2000);
    })
}

function obterEndereco(idUsuario) {
    return new Promise(function resolverEndereco(resolve, reject){
        setTimeout(() => {
            return resolve({
                rua: 'rua lins',
                numero: 0
            })
        }, 2000);
    })
}

function resolverUsuario(erro, usuario) {
    console.log('usuario', usuario)
}

// const usuarioPromise = obterUsuario()
// usuarioPromise
//     .then(function (usuario) {
//         return obterTelefone(usuario.id)
//             .then(function resolverTelefone(result){
//                 return {
//                     usuario: {
//                         nome: usuario.nome,
//                         id: usuario.id
//                     },
//                     telefone: result
//                 }  
//             })
//     })
//     .then(function (resultado) {
//         const endereco = obterEndereoAsync(resultado.usuario.id)
//         return endereco.then(function resolverEndereco(result) {
//             return {
//                 usuario: resultado.usuario,
//                 telefone: resultado.telefone,
//                 endereco: result
//             }
//         })
//     })
//     .then(function (resultado) {
//         console.log(`
//             Nome: ${resultado.usuario.nome}
//             Endereco: ${resultado.endereco.rua}, ${resultado.endereco.numero}
//             Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
//         `)
//     }).catch(function (error) {
//         console.error('Erro ao obter usuario')
//     })


main()    
async function main() {
    try {
        console.time('medida-promise')
        const usuario = await obterUsuario()
        // const telefone = await obterTelefone(usuario.id)
        // const endereco = await obterEndereco(usuario.id)
        const resultado = await Promise.all([
            obterTelefone(usuario.id),
            obterEndereco(usuario.id)
        ])
        const endereco = resultado[1]
        const telefone = resultado[0]

        console.log(`
            Nome: ${usuario.nome}
            Telefone: (${telefone.ddd}) ${telefone.telefone}
            Endereco: ${endereco.rua}, ${endereco.numero}
        `)
        console.timeEnd('medida-promise')
    } catch(error) {

    }
}

// obterUsuario(function resolverUsuario(error, usuario) {
//     if (error) {
//         console.error("Erro ao obter usuario")
//         return;
//     }
//     obterTelefone(usuario.id, function resolverTelefone(error1, telefone) {
//         if (error1) {
//             console.error("Erro ao obter telefone")
//             return;
//         }
//         obterEndereco(usuario.id, function resolverEndereco(error2, endereco) {
//             if (error2) {
//                 console.error("Erro ao obter endereco")
//                 return;
//             }

//             console.log(`
//                 Nome: ${usuario.nome}
//                 Endereco: ${endereco.rua}, ${endereco.numero}
//                 Telefone: (${telefone.ddd})${telefone.telefone}
//             `)
//         })
//     })
// })
// const telefone = obterTelefone(usuario.id)


// console.log('telefone', telefone)