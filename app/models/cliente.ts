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
}
