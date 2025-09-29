import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clientes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').notNullable()
      table.string('email').unique().notNullable()
      table.string('telefone').notNullable()
      table.string('rg').unique().notNullable()
      table.string('cpf').unique().notNullable()
      table.string('profissao').nullable()
      table.string('cnh').unique().nullable()
      table.string('cep').notNullable()
      table.string('cidade').notNullable()
      table.string('estado', 3).notNullable()
      table.string('rua').notNullable()
      table.string('numero').notNullable()
      table.string('bairro').notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
