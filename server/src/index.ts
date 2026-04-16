import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/use/ws'
import { schema } from './schema.js'

const yoga = createYoga({
  schema,
  graphiql: {
    subscriptionsProtocol: 'WS',
  },
})

const server = createServer(yoga)

const wsServer = new WebSocketServer({
  server,
  path: yoga.graphqlEndpoint,
})

useServer({ schema }, wsServer)

const port = 4000
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/graphql`)
})
