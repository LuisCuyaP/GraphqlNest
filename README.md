# Levantar proyecto
1. Copiar el env.template y renombar a .env

2. Ejecutar
```
yarn install
```

3. Levantar la imagen (Docker desktop)
```
docker-compose up -d
```

4. Levantar el backend de Nest
```
yarn start:dev
```

5.Visiar el sitio
```
localhost:3000/graphql
```

6. Ejecutar la "mutation" executeSeed, para llenar la base de datos con información

# Nest
CRUD
1. npm i -g @nestjs/cli
2. nest new foundation --crear proyecto
3. nest g rest todo --no-sprec (crear como un componente llamado todo donde estara el service y el controller)

# GraphqlNest
yarn add @nestjs/graphql @nestjs/apollo graphql apollo-server-express
yarn add @apollo/server
yarn add apollo-server-core
1. nest new todo --crear proyecto
2. nest g mo helloWorld
3. nest g r helloWorld --no-spec

