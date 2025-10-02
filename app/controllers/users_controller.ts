import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import db from '@adonisjs/lucid/services/db'

// Objeto de tradução para as mensagens de erro
const errorTranslations: { [key: string]: string } = {
  'The estado field must be 2 characters long': 'O campo estado deve ter exatamente 2 caracteres',
  'The email field must be a valid email address': 'Por favor, informe um e-mail válido',
  'The nome field must be at least 3 characters long': 'O nome deve ter pelo menos 3 caracteres',
  'The nome field must not be greater than 255 characters':
    'O nome não pode ter mais de 255 caracteres',
  'The senha field must be at least 6 characters long': 'A senha deve ter pelo menos 6 caracteres',
  'The senha field must not be greater than 180 characters':
    'A senha não pode ter mais de 180 caracteres',
  'The permissao field must be at least 1': 'A permissão deve ser no mínimo 1',
  'The permissao field must not be greater than 3': 'A permissão deve ser no máximo 3',
  // Adicione mais traduções conforme necessário
}

export default class UsersController {
  async index({ response }: HttpContext) {
    try {
      const users = await User.all()
      return response.ok({
        success: true,
        message: 'Lista de usuários carregada com sucesso.',
        data: users,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erro ao buscar usuários.',
        details: error.message,
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      // 1. Valida dados básicos com VineJS - FORMA CORRETA
      const data = await createUserValidator.validate(request.all())

      // 2. Validações manuais de unicidade
      const existingEmail = await db.from('users').where('email', data.email).first()
      if (existingEmail) {
        return response.badRequest({
          success: false,
          message: 'Erro ao criar usuário.',
          errors: [{ field: 'email', message: 'O e-mail já está em uso' }],
        })
      }

      if (data.cpf) {
        const existingCpf = await db.from('users').where('cpf', data.cpf).first()
        if (existingCpf) {
          return response.badRequest({
            success: false,
            message: 'Erro ao criar usuário.',
            errors: [{ field: 'cpf', message: 'O CPF já está cadastrado' }],
          })
        }
      }

      // 3. Cria o usuário
      const user = await User.create(data)

      return response.created({
        success: true,
        message: 'Usuário criado com sucesso.',
        data: user,
      })
    } catch (error) {
      // Se for erro de validação do VineJS - TRADUZ AS MENSAGENS
      if (error.messages) {
        const translatedErrors = error.messages.map((msg: any) => ({
          field: msg.field,
          message: errorTranslations[msg.message] || msg.message, // Traduz se existir
          rule: msg.rule,
        }))

        return response.badRequest({
          success: false,
          message: 'Erro de validação.',
          errors: translatedErrors,
        })
      }

      return response.badRequest({
        success: false,
        message: 'Erro ao criar usuário.',
        details: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)
      if (!user) {
        return response.notFound({
          success: false,
          message: 'Usuário não encontrado.',
        })
      }
      return response.ok({
        success: true,
        message: 'Usuário encontrado.',
        data: user,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erro ao buscar usuário.',
        details: error.message,
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.find(params.id)
      if (!user) {
        return response.notFound({
          success: false,
          message: 'Usuário não encontrado.',
        })
      }

      // 1. Valida dados básicos com VineJS - FORMA CORRETA
      const data = await updateUserValidator.validate(request.all())

      // 2. Validações manuais de unicidade
      if (data.email && data.email !== user.email) {
        const existingEmail = await db
          .from('users')
          .where('email', data.email)
          .whereNot('id', user.id)
          .first()

        if (existingEmail) {
          return response.badRequest({
            success: false,
            message: 'Erro ao atualizar usuário.',
            errors: [{ field: 'email', message: 'O e-mail já está em uso' }],
          })
        }
      }

      if (data.cpf && data.cpf !== user.cpf) {
        const existingCpf = await db
          .from('users')
          .where('cpf', data.cpf)
          .whereNot('id', user.id)
          .first()

        if (existingCpf) {
          return response.badRequest({
            success: false,
            message: 'Erro ao atualizar usuário.',
            errors: [{ field: 'cpf', message: 'O CPF já está cadastrado' }],
          })
        }
      }

      // 3. Atualiza o usuário
      user.merge(data)
      await user.save()

      return response.ok({
        success: true,
        message: 'Usuário atualizado com sucesso.',
        data: user,
      })
    } catch (error) {
      // Se for erro de validação do VineJS - TRADUZ AS MENSAGENS
      if (error.messages) {
        const translatedErrors = error.messages.map((msg: any) => ({
          field: msg.field,
          message: errorTranslations[msg.message] || msg.message, // Traduz se existir
          rule: msg.rule,
        }))

        return response.badRequest({
          success: false,
          message: 'Erro de validação.',
          errors: translatedErrors,
        })
      }

      return response.badRequest({
        success: false,
        message: 'Erro ao atualizar usuário.',
        details: error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)
      if (!user) {
        return response.notFound({
          success: false,
          message: 'Usuário não encontrado.',
        })
      }

      await user.delete()
      return response.ok({
        success: true,
        message: 'Usuário excluído com sucesso.',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erro ao excluir usuário.',
        details: error.message,
      })
    }
  }
}
