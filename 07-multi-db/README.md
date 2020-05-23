

## Postgres

docker run \
    --name postgres \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=admin \
    -e POSTGRES_DB=heroes \
    -p 5432:5432 \
    -d \
    postgres


## Adminer - Postgres Client

docker run \
    --name adminer \
    -p 8080:8080 \
    --link postgres:postgres \
    -d \
    adminer

## MongoDB

docker run \
    --name mongodb \
    -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=admin \
    -d \
    mongo:4

## Mongo client

docker run \
    --name mongoclient \
    -p 3000:3000 \
    --link mongodb:mongodb \
    -d \
    mongoclient/mongoclient

### Criar usuario de aplicação e permissão para o database

docker exec -it mongodb \
    mongo --host localhost -u admin -p admin --authenticationDatabase admin \
    --eval "db.getSiblingDB('heroes').createUser({user: 'thiago', pwd: 'minhasenha', roles: [{role: 'readWrite', db: 'heroes'}]})"

#### Docker, comandos gerais

docker ps

docker ps -f "status=exited"

docker start mongodb

docker start mongoclient

docker exec -it postgres /bin/bash




