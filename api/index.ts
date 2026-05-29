import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ElysiaServer } from '../src/main'

let serverInstance: any = null

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize server on first request
  if (!serverInstance) {
    try {
      // Import server initialization
      const { ElysiaServer } = await import('../src/main')
      serverInstance = new ElysiaServer()
    } catch (error) {
      console.error('Failed to initialize server:', error)
      return res.status(500).json({ error: 'Server initialization failed' })
    }
  }

  try {
    // Create a new Elysia app instance for this request
    const { Elysia } = await import('elysia')
    const app = new Elysia()

    // Handle the request
    const response = await app.handle(req)
    
    // Copy response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value as string)
    })

    // Send response
    res.status(response.status).send(await response.text())
  } catch (error) {
    console.error('Handler error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
