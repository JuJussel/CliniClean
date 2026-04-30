// server/utils/sse.ts
import { EventEmitter } from 'node:events'
export const sseEvents = new EventEmitter()

// server/routes/api/sse.ts
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  // Function to send formatted SSE data
  const sendEvent = (data: any) => {
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  // Listen for global publish events
  const listener = (data: any) => sendEvent(data)
  sseEvents.on('publish', listener)

  // Clean up when the user closes the tab
  event.node.res.on('close', () => {
    sseEvents.off('publish', listener)
  })

  // Stay open
  return new Promise(() => {}) 
})