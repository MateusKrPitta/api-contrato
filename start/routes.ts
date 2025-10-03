import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const ClientesController = () => import('#controllers/clientes_controller')
const ContratosController = () => import('#controllers/contratos_controller')

router.get('/', () => {
  return { message: 'API Users funcionando!' }
})

// Health check
router.get('/health', () => ({ status: 'OK' }))

// Rotas públicas (sem autenticação)
router.post('/login', [AuthController, 'login'])

router
  .group(() => {
    router.resource('users', UsersController).apiOnly()
    router.get('/profile', [AuthController, 'profile'])
    router.resource('clientes', ClientesController).apiOnly()
    router.get('/contratos/search', [ContratosController, 'search'])
    router.get('/contratos/count', [ContratosController, 'count'])
    router.resource('contratos', ContratosController).apiOnly()
    router.post('/logout', [AuthController, 'logout'])
  })
  .use(middleware.auth())
