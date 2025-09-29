import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Contrato extends BaseModel {
  static table = 'contratos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cliente_id: number

  @column()
  declare user_id: number // ← Agora user_id em vez de advogado_id

  @column()
  declare titulo: string

  @column()
  declare numero_contrato: string | null

  @column()
  declare procuracao_html: string | null

  @column()
  declare honorario_html: string | null

  @column()
  declare peticao_html: string | null

  @column()
  declare hash: string | null

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
