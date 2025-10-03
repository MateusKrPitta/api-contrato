// start/app.ts
import app from '@adonisjs/core/services/app'

app.ready(() => {
  console.log('🚀 Application is ready')
})

export default app
