
require('dotenv').config()

const app = require('express')();

const server = require('./app/graphQL')

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);