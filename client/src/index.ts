import { createClient } from 'graphql-ws'
import { WebSocket } from 'ws'
import readline from 'node:readline'

const client = createClient({
  url: 'ws://localhost:4000/graphql',
  webSocketImpl: WebSocket,
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function main() {
  const username = await new Promise<string>((resolve) => {
    rl.question('Enter your username: ', resolve)
  })

  console.log(`\nWelcome, ${username}! You can now start chatting.\n`)

  // Subscribe to messages
  client.subscribe(
    {
      query: 'subscription { messageAdded { user content } }',
    },
    {
      next: (data: any) => {
        const { user, content } = data.data.messageAdded
        if (user !== username) {
          console.log(`[${user}]: ${content}`)
        }
      },
      error: (err) => console.error('Subscription error:', err),
      complete: () => console.log('Subscription complete'),
    },
  )

  const askMessage = () => {
    rl.question('', async (content) => {
      if (content.trim()) {
        try {
          const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: 'mutation($user: String!, $content: String!) { postMessage(user: $user, content: $content) }',
              variables: { user: username, content },
            }),
          })
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        } catch (err) {
          console.error('Mutation error:', err)
        }
      }
      askMessage()
    })
  }

  askMessage()
}

main().catch(console.error)
