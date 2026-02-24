import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clientes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email').nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Se quiser reverter, volta para notNullable
      table.string('email').notNullable().alter()
    })
  }
}
