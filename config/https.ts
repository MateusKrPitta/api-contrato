import { defineConfig } from '@adonisjs/core/http'

export default defineConfig({
  /**
   * Whether to allow method spoofing. Method spoofing enables defining
   * the HTTP method via a query string.
   */
  allowMethodSpoofing: false,

  /**
   * Whether to use async local storage to automatically share the HTTP
   * context with other async operations.
   */
  useAsyncLocalStorage: true,

  /**
   * Generate a request id for each HTTP request and set it as the
   * "x-request-id" header.
   */
  generateRequestId: true,
})
