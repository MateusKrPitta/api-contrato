// start/app.ts
import env from '#start/env'

export default {
  appKey: env.get('APP_KEY'),
  http: {
    allowMethodSpoofing: false,
    trustProxy: () => true,
    generatingRequest: false,
  },
}
