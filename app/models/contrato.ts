import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Cliente from '#models/cliente'

export default class Contrato extends BaseModel {
  static table = 'contratos'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cliente_id: number

  @column()
  declare user_id: number

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

  // Relação com Cliente
  @belongsTo(() => Cliente, {
    foreignKey: 'cliente_id',
  })
  declare cliente: BelongsTo<typeof Cliente>

  // Relação com User (Advogado)
  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  serializeExtras() {
    return {
      cliente: this.cliente,
      advogado: this.user,
    }
  }
}
