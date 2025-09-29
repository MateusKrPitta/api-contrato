import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash' // ✅ Importe o hash

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, senha } = request.only(['email', 'senha'])

    try {
      // 1. Busca o usuário pelo email
      const user = await User.findBy('email', email)

      if (!user) {
        return response.unauthorized({ error: 'Email ou senha incorreto !' })
      }

      // 2. ✅ VERIFICAÇÃO MANUAL da senha (corrige o erro)
      const isValidPassword = await hash.verify(user.senha, senha)

      if (!isValidPassword) {
        return response.unauthorized({ error: 'Credenciais inválidas' })
      }

      // 3. Gera o token
      const token = await User.accessTokens.create(user)

      return {
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          permissao: user.permissao,
        },
        token: token,
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return response.unauthorized({ error: 'Credenciais inválidas' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      return response.ok({ message: 'Logout realizado' })
    } catch {
      return response.badRequest({ error: 'Erro ao fazer logout' })
    }
  }

  async profile({ auth, response }: HttpContext) {
    const user = auth.user!
    return response.ok({
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        permissao: user.permissao,
        profissao: user.profissao,
        oab: user.oab,
      },
    })
  }
}
