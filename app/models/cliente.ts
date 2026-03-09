import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare email: string

  @column()
  declare telefone: string

  @column()
  declare rg: string

  @column()
  declare cpf: string

  @column()
  declare profissao: string | null

  @column()
  declare cnh: string | null

  @column()
  declare cep: string

  @column()
  declare cidade: string

  @column()
  declare estado: string

  @column()
  declare rua: string

  @column()
  declare numero: string

  @column()
  declare bairro: string

  @column()
  declare numero_contrato: string | null

  // CAMPO TITULOS CORRIGIDO
  @column({
    prepare: (value: string[] | null) => {
      // Ao salvar, converte array para JSON string
      return value ? JSON.stringify(value) : null
    },
    consume: (value: any) => {
      // Ao buscar do banco, trata diferentes formatos
      if (!value) return null

      // Se já for array, retorna diretamente
      if (Array.isArray(value)) return value

      // Se for objeto, converte para array
      if (typeof value === 'object') return Object.values(value)

      // Se for string, tenta fazer parse
      if (typeof value === 'string') {
        // Verifica se é um JSON array válido
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            return JSON.parse(value)
          } catch {
            // Se falhar, remove colchetes e divide por vírgula
            const semColchetes = value.slice(1, -1)
            return semColchetes.split(',').map((item) => item.trim().replace(/^["']|["']$/g, ''))
          }
        }

        // Se for string com vírgulas, divide
        if (value.includes(',')) {
          return value.split(',').map((item) => item.trim())
        }

        // Se for string única, retorna como array de um item
        return [value.trim()]
      }

      return null
    },
  })
  declare titulos: string[] | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
