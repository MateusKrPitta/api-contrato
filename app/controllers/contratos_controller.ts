import type { HttpContext } from '@adonisjs/core/http'
import Contrato from '#models/contrato'

interface ContratoData {
  cliente_id: number
  user_id: number
  titulo: string
  numero_contrato?: string | null
  procuracao_html?: string | null
  honorario_html?: string | null
  peticao_html?: string | null
  hash?: string | null
  status?: string
}

export default class ContratosController {
  private calcularStatus(
    procuracao?: string | null,
    honorario?: string | null,
    peticao?: string | null
  ): string {
    if (!procuracao && !honorario && !peticao) {
      return 'pendente'
    }
    if (procuracao && honorario && peticao) {
      return 'concluido'
    }
    return 'andamento'
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data: ContratoData = request.only([
        'cliente_id',
        'user_id',
        'titulo',
        'numero_contrato',
        'procuracao_html',
        'honorario_html',
        'peticao_html',
        'hash',
      ])

      data.status = this.calcularStatus(
        data.procuracao_html,
        data.honorario_html,
        data.peticao_html
      )

      const contrato = await Contrato.create(data)

      return response.status(201).json({
        success: true,
        message: 'Contrato criado com sucesso! 📄',
        data: contrato,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Ops! Não foi possível criar o contrato. 😕',
        error: error.message,
      })
    }
  }

  public async findByUser({ params, request, response }: HttpContext) {
    try {
      const userId = params.userId
      const page = request.input('page', 1)
      const perPage = request.input('perPage', 10)

      const contratos = await Contrato.query()
        .where('user_id', userId)
        .preload('cliente') // ✅ Agora funciona
        .preload('user') // ✅ Agora funciona
        .orderBy('created_at', 'desc')
        .paginate(page, perPage)

      return response.json({
        success: true,
        message:
          contratos.total > 0
            ? `Encontrados ${contratos.total} contrato(s) para este usuário! 📋`
            : 'Nenhum contrato encontrado para este usuário. 📭',
        data: contratos,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar contratos do usuário. 😕',
        error: error.message,
      })
    }
  }

  public async count({ response }: HttpContext) {
    try {
      const totalContratos = await Contrato.query().count('* as total')

      return response.json({
        success: true,
        message: `Total de contratos encontrado! 📊`,
        data: {
          total: Number(totalContratos[0].$extras.total),
        },
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao contar contratos. 😕',
        error: error.message,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)

      return response.json({
        success: true,
        message: 'Contrato encontrado! 🔍',
        data: contrato,
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Contrato não encontrado. 🧐',
        error: 'O contrato solicitado não existe em nossa base de dados.',
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)

      const data: ContratoData = request.only([
        'cliente_id',
        'user_id',
        'titulo',
        'numero_contrato',
        'procuracao_html',
        'honorario_html',
        'peticao_html',
        'hash',
      ])

      data.status = this.calcularStatus(
        data.procuracao_html,
        data.honorario_html,
        data.peticao_html
      )

      contrato.merge(data)
      await contrato.save()

      return response.json({
        success: true,
        message: 'Contrato atualizado com sucesso! ✏️',
        data: contrato,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Não foi possível atualizar o contrato. 😕',
        error: error.message,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const contrato = await Contrato.findOrFail(params.id)
      await contrato.delete()

      return response.status(200).json({
        success: true,
        message: 'Contrato excluído com sucesso! 🗑️',
        data: { id: params.id },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Não foi possível excluir o contrato. 😕',
        error: error.message,
      })
    }
  }

  // Método adicional para listar todos os contratos
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1) // Página atual (default = 1)
      const perPage = request.input('perPage', 5) // Registros por página (default = 10)

      const contratos = await Contrato.query().paginate(page, perPage)

      return response.json({
        success: true,
        message:
          contratos.total > 0
            ? `Encontrados ${contratos.total} contrato(s)! 📋`
            : 'Nenhum contrato encontrado. 📭',
        data: contratos, // já vem com meta e data
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar contratos. 😕',
        error: error.message,
      })
    }
  }

  public async search({ request, response }: HttpContext) {
    try {
      const termo = request.input('q')

      if (!termo) {
        return response.status(400).json({
          success: false,
          message: 'Informe um termo de busca. 🔎',
        })
      }

      const contratos = await Contrato.query()
        .distinct('contratos.*')
        .join('clientes', 'clientes.id', 'contratos.cliente_id')
        .join('users as advogados', 'advogados.id', 'contratos.user_id')
        .where((query) => {
          query
            .whereILike('clientes.nome', `%${termo}%`)
            .orWhereILike('advogados.nome', `%${termo}%`)
            .orWhereILike('contratos.titulo', `%${termo}%`)
        })
        .preload('cliente')
        .preload('user')
        .orderBy('created_at', 'desc')

      return response.json({
        success: true,
        message:
          contratos.length > 0
            ? `Encontrados ${contratos.length} contrato(s)! 📋`
            : 'Nenhum contrato encontrado. 📭',
        data: contratos,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar contratos. 😕',
        error: error.message,
      })
    }
  }
  public async duplicate({ params, response }: HttpContext) {
    try {
      // Busca o contrato original com os relacionamentos
      const contratoOriginal = await Contrato.query()
        .where('id', params.id)
        .preload('cliente')
        .preload('user')
        .firstOrFail()

      // Prepara os dados para o novo contrato (cópia)
      const novoContratoData = {
        cliente_id: contratoOriginal.cliente_id,
        user_id: contratoOriginal.user_id,
        titulo: `${contratoOriginal.titulo} - CÓPIA ${new Date().toLocaleDateString('pt-BR')}`,
        numero_contrato: `CTR-${Date.now()}`, // Gera um novo número
        procuracao_html: contratoOriginal.procuracao_html,
        honorario_html: contratoOriginal.honorario_html,
        peticao_html: contratoOriginal.peticao_html,
        hash: `${contratoOriginal.hash || 'CTR'}-COPY-${Date.now()}`, // Gera um novo hash
        status: 'pendente', // Começa como pendente para revisão
      }

      // Cria o novo contrato
      const novoContrato = await Contrato.create(novoContratoData)

      return response.status(201).json({
        success: true,
        message: 'Contrato duplicado com sucesso! 📄✨',
        data: {
          original: {
            id: contratoOriginal.id,
            titulo: contratoOriginal.titulo,
          },
          copia: {
            id: novoContrato.id,
            titulo: novoContrato.titulo,
            numero_contrato: novoContrato.numero_contrato,
          },
        },
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Não foi possível duplicar o contrato. 😕',
        error: error.message,
      })
    }
  }
}
