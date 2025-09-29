import type { HttpContext } from '@adonisjs/core/http'
import Cliente from '#models/cliente'

export default class ClientesController {
  async index({ response }: HttpContext) {
    try {
      const clientes = await Cliente.all()
      return response.ok({
        success: true,
        message: 'Lista de clientes carregada com sucesso!',
        data: clientes,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erro interno ao carregar lista de clientes',
        details: this.getErrorMessage(error),
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'nome',
        'email',
        'telefone',
        'rg',
        'cpf',
        'profissao',
        'cnh',
        'cep',
        'cidade',
        'estado',
        'rua',
        'numero',
        'bairro',
      ])

      // Verificar se já existe cliente com este email, CPF ou RG
      const erros: string[] = []

      const clienteComEmail = await Cliente.findBy('email', data.email)
      if (clienteComEmail) {
        erros.push('Já existe um cliente cadastrado com este e-mail')
      }

      const clienteComCpf = await Cliente.findBy('cpf', data.cpf)
      if (clienteComCpf) {
        erros.push('Já existe um cliente cadastrado com este CPF')
      }

      const clienteComRg = await Cliente.findBy('rg', data.rg)
      if (clienteComRg) {
        erros.push('Já existe um cliente cadastrado com este RG')
      }

      if (erros.length > 0) {
        return response.badRequest({
          success: false,
          message: 'Erro ao cadastrar cliente',
          details: erros.join(', '),
        })
      }

      const cliente = await Cliente.create(data)

      return response.created({
        success: true,
        message: 'Cliente cadastrado com sucesso!',
        data: cliente,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erro ao cadastrar cliente',
        details: this.getErrorMessage(error),
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const cliente = await Cliente.find(params.id)
      if (!cliente) {
        return response.notFound({
          success: false,
          message: 'Cliente não encontrado',
        })
      }

      return response.ok({
        success: true,
        message: 'Cliente encontrado com sucesso!',
        data: cliente,
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erro interno ao buscar cliente',
        details: this.getErrorMessage(error),
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const cliente = await Cliente.find(params.id)
      if (!cliente) {
        return response.notFound({
          success: false,
          message: 'Cliente não encontrado',
        })
      }

      const data = request.only([
        'nome',
        'email',
        'telefone',
        'rg',
        'cpf',
        'profissao',
        'cnh',
        'cep',
        'cidade',
        'estado',
        'rua',
        'numero',
        'bairro',
      ])

      // Verificar se email, CPF ou RG já existem em outros clientes
      const erros: string[] = []

      if (data.email && data.email !== cliente.email) {
        const clienteComEmail = await Cliente.query()
          .where('email', data.email)
          .andWhereNot('id', params.id)
          .first()
        if (clienteComEmail) {
          erros.push('Já existe um cliente cadastrado com este e-mail')
        }
      }

      if (data.cpf && data.cpf !== cliente.cpf) {
        const clienteComCpf = await Cliente.query()
          .where('cpf', data.cpf)
          .andWhereNot('id', params.id)
          .first()
        if (clienteComCpf) {
          erros.push('Já existe um cliente cadastrado com este CPF')
        }
      }

      if (data.rg && data.rg !== cliente.rg) {
        const clienteComRg = await Cliente.query()
          .where('rg', data.rg)
          .andWhereNot('id', params.id)
          .first()
        if (clienteComRg) {
          erros.push('Já existe um cliente cadastrado com este RG')
        }
      }

      if (erros.length > 0) {
        return response.badRequest({
          success: false,
          message: 'Erro ao atualizar cliente',
          details: erros.join(', '),
        })
      }

      cliente.merge(data)
      await cliente.save()

      return response.ok({
        success: true,
        message: 'Cliente atualizado com sucesso!',
        data: cliente,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Erro ao atualizar cliente',
        details: this.getErrorMessage(error),
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const cliente = await Cliente.find(params.id)
      if (!cliente) {
        return response.notFound({
          success: false,
          message: 'Cliente não encontrado',
        })
      }

      await cliente.delete()

      return response.ok({
        success: true,
        message: 'Cliente excluído com sucesso!',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'Erro interno ao excluir cliente',
        details: this.getErrorMessage(error),
      })
    }
  }

  /**
   * Método auxiliar para traduzir mensagens de erro comuns
   */
  private getErrorMessage(error: any): string {
    const errorMessage = error.message?.toLowerCase() || ''

    // Traduzir erros comuns do banco de dados
    if (errorMessage.includes('clientes_email_unique')) {
      return 'Já existe um cliente cadastrado com este e-mail'
    }

    if (errorMessage.includes('clientes_cpf_unique')) {
      return 'Já existe um cliente cadastrado com este CPF'
    }

    if (errorMessage.includes('clientes_rg_unique')) {
      return 'Já existe um cliente cadastrado com este RG'
    }

    if (errorMessage.includes('duplicar valor da chave viola')) {
      if (errorMessage.includes('email')) {
        return 'Já existe um cliente cadastrado com este e-mail'
      }
      if (errorMessage.includes('cpf')) {
        return 'Já existe um cliente cadastrado com este CPF'
      }
      if (errorMessage.includes('rg')) {
        return 'Já existe um cliente cadastrado com este RG'
      }
      return 'Registro duplicado: já existe um cliente com estes dados'
    }

    if (errorMessage.includes('unique constraint')) {
      if (errorMessage.includes('email')) {
        return 'Já existe um cliente cadastrado com este e-mail'
      }
      if (errorMessage.includes('cpf')) {
        return 'Já existe um cliente cadastrado com este CPF'
      }
      if (errorMessage.includes('rg')) {
        return 'Já existe um cliente cadastrado com este RG'
      }
      return 'Registro duplicado: já existe um cliente com estes dados'
    }

    if (errorMessage.includes('not null constraint')) {
      return 'Campos obrigatórios não preenchidos'
    }

    if (errorMessage.includes('foreign key constraint')) {
      return 'Não é possível realizar esta operação devido a relacionamentos existentes'
    }

    if (errorMessage.includes('invalid input syntax')) {
      return 'Dados informados estão em formato inválido'
    }

    if (errorMessage.includes('connection') || errorMessage.includes('timeout')) {
      return 'Erro de conexão com o banco de dados'
    }

    // Para outros erros, retorna a mensagem original
    return error.message || 'Erro desconhecido'
  }
}
