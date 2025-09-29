import type { HttpContext } from '@adonisjs/core/http'
import Contrato from '#models/contrato'
import db from '@adonisjs/lucid/services/db'

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
      const termo = request.input('q') // parâmetro de busca

      if (!termo) {
        return response.status(400).json({
          success: false,
          message: 'Informe um termo de busca. 🔎',
        })
      }

      // CORREÇÃO: Usar where com subquery para OR conditions
      const contratos = await Contrato.query()
        .select('contratos.*')
        .join('clientes', 'clientes.id', 'contratos.cliente_id')
        .join('users as advogados', 'advogados.id', 'contratos.user_id')
        .where((query) => {
          query
            .whereILike('clientes.nome', `%${termo}%`)
            .orWhereILike('advogados.nome', `%${termo}%`)
            .orWhereILike('contratos.titulo', `%${termo}%`)
        })

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
}
