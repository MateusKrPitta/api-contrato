// bin/server.ts
import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

const APP_ROOT = new URL('../', import.meta.url)

const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

console.log('=== ADONISJS DEBUG ===')
console.log('APP_ROOT:', APP_ROOT.href)
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('APP_KEY exists:', !!process.env.APP_KEY)

try {
  const ignitor = new Ignitor(APP_ROOT, { importer: IMPORTER })

  console.log('=== CREATING HTTP SERVER ===')
  const httpServer = ignitor.httpServer()

  console.log('=== STARTING SERVER ===')
  await httpServer.start()
} catch (error) {
  console.error('=== CRITICAL ERROR ===')
  console.error(error)
  process.exitCode = 1
  prettyPrintError(error)
}
