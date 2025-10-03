// start/app.ts
import app from '@adonisjs/core/services/app'
import { HttpContext } from '@adonisjs/core/http'

/**
 * Configure the application after it has been built
 */
app.ready(async () => {
  // Optional: Add any application ready hooks here
  console.log('Application is ready')
})

/**
 * Start the application
 */
app.start(async () => {
  // Optional: Add any post-start hooks here
  console.log('Application started')
})

/**
 * Register a test route to verify the application is working
 */
import router from '@adonisjs/core/services/router'

router.get('/', async ({ response }: HttpContext) => {
  return response.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  })
})

export default app
