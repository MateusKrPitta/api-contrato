import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nome', 255).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('senha').notNullable()
      table.integer('permissao').notNullable().defaultTo(1)
      table.string('oab', 50).nullable()
      table.string('profissao', 100).nullable()
      table.string('cpf', 14).nullable().unique()
      table.string('cep', 9).nullable()
      table.string('cidade', 100).nullable()
      table.string('estado', 2).nullable()
      table.string('rua', 255).nullable()
      table.string('numero', 20).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
