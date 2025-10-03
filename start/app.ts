import app from '@adonisjs/core/services/app'

await app.boot()

app.start(async () => {
  console.log('🚀 Application is ready')
})

export default app
