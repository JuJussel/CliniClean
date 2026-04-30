import { sseEvents } from '../utils/sse'

export default defineEventHandler((event) => {
  // Set SSE headers
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  // Function to send formatted SSE data
  const sendEvent = (data: any) => {
    try {
      event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
    } catch (error) {
      console.error('[SSE] Error sending event:', error)
    }
  }

  // Listen for publish events from any API route
  const listener = (data: any) => sendEvent(data)
  sseEvents.on('publish', listener)

  console.log('[SSE] New client connected')

  // Clean up when client disconnects
  event.node.res.on('close', () => {
    console.log('[SSE] Client disconnected')
    sseEvents.off('publish', listener)
  })

  // Keep connection alive
  return new Promise(() => {})
})
