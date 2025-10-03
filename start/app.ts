// start/app.ts - ESTE É O QUE PRECISA SER CORRIGIDO!
import app from '@adonisjs/core/services/app'

app.ready(async () => {
  console.log('Application ready')
})

app.start(async () => {
  console.log('Application started')
})

export default app
