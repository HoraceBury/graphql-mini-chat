import { createSchema } from 'graphql-yoga'
import { PubSub } from 'graphql-subscriptions'

export const pubsub = new PubSub()

const CHANNEL_MESSAGE_ADDED = 'MESSAGE_ADDED'

export type Message = {
  id: string
  user: string
  content: string
}

const messages: Message[] = []

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Message {
      id: ID!
      user: String!
      content: String!
    }

    type Query {
      messages: [Message!]!
    }

    type Mutation {
      postMessage(user: String!, content: String!): ID!
    }

    type Subscription {
      messageAdded: Message!
    }
  `,
  resolvers: {
    Query: {
      messages: () => messages,
    },
    Mutation: {
      postMessage: (_parent, { user, content }) => {
        const id = messages.length.toString()
        const message = { id, user, content }
        messages.push(message)
        pubsub.publish(CHANNEL_MESSAGE_ADDED, { messageAdded: message })
        return id
      },
    },
    Subscription: {
      messageAdded: {
        subscribe: () => pubsub.asyncIterableIterator([CHANNEL_MESSAGE_ADDED]),
      },
    },
  },
})
