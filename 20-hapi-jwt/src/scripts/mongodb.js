// docker ps
// docker exec -it 31c200579d98 /
//     mongo -u 

// docker exec -it mongodb \
//     mongo --host localhost -u thiago -p minhasenha --authenticationDatabase heroes

// databases
show dbs
// mudando contexto para heroes
use heroes
// mostrar colecoes
show collections

// create
db.heroes.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

for (let i=0 ; i<10 ; i++) {
    db.heroes.insert({
        nome: `Clone${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })  
}

// read
db.heroes.find()
db.heroes.find().pretty()
db.heroes.count()
db.heroes.findOne()
db.heroes.find().limit(1000).sort({ nome: -1 })
db.heroes.find({}, {poder: 1, _id: 0})
db.heroes.find({ nome: 'Flash' }

// update
db.heroes.update({_id: ObjectId("5ec6c52631cb5bf35bb5a082")},
    {nome: 'Mulher Maravilha'}
)

db.heroes.update({_id: ObjectId("5ec6c52631cb5bf35bb5a08b")},
    { $set: {nome: 'Lanterna Verde'} } 
)
