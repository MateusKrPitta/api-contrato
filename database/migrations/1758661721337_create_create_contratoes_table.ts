import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contratos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Referências CORRETAS:
      table.integer('cliente_id').unsigned().notNullable() // Cliente envolvido
      table.integer('user_id').unsigned().notNullable() // User/Advogado que criou

      // Metadados do contrato
      table.string('titulo', 255).notNullable()
      table.string('numero_contrato', 100).nullable().unique()
      table.string('status', 50).notNullable().defaultTo('rascunho')

      // Campos HTML específicos
      table.text('procuracao_html').nullable()
      table.text('honorario_html').nullable()
      table.text('peticao_html').nullable()

      // Hash para verificação/versão
      table.string('hash', 64).nullable()

      // Timestamps
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Chaves estrangeiras
      table.foreign('cliente_id').references('id').inTable('clientes').onDelete('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
