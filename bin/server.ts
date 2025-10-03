// bin/server.ts
import { Ignitor } from '@adonisjs/core'

const APP_ROOT = new URL('./', import.meta.url)

const ignitor = new Ignitor(APP_ROOT)
await ignitor.httpServer().start()
