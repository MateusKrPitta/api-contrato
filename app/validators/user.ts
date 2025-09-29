import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

// Função helper para validação de email único com tipagem correta
const uniqueEmailRule = vine.createRule((value: unknown, options, field: FieldContext) => {
  return async () => {
    // Verifica se o valor é uma string
    if (typeof value !== 'string') {
      field.report('O e-mail deve ser uma string', 'email.invalid', field)
      return
    }

    const db = field.data.db
    const userId = field.data.id

    const query = db.from('users').where('email', value)

    if (userId) {
      query.whereNot('id', userId)
    }

    const existingUser = await query.first()

    if (existingUser) {
      field.report('O e-mail já está em uso', 'unique.email', field)
    }
  }
})

// Função helper para validação de CPF único com tipagem correta
const uniqueCpfRule = vine.createRule((value: unknown, options, field: FieldContext) => {
  return async () => {
    // Se for undefined ou null, ignora (campo optional)
    if (value === null || value === undefined || value === '') {
      return
    }

    // Verifica se o valor é uma string
    if (typeof value !== 'string') {
      field.report('O CPF deve ser uma string', 'cpf.invalid', field)
      return
    }

    const db = field.data.db
    const userId = field.data.id

    const query = db.from('users').where('cpf', value)

    if (userId) {
      query.whereNot('id', userId)
    }

    const existingUser = await query.first()

    if (existingUser) {
      field.report('O CPF já está cadastrado', 'unique.cpf', field)
    }
  }
})

// Validator para criação de usuário
export const createUserValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().email().use(uniqueEmailRule()),
    senha: vine.string().minLength(6).maxLength(180),
    permissao: vine.number().min(1).max(3),
    oab: vine.string().maxLength(50).optional(),
    profissao: vine.string().maxLength(100).optional(),
    cpf: vine.string().maxLength(14).optional().use(uniqueCpfRule()),
    cep: vine.string().maxLength(9).optional(),
    cidade: vine.string().maxLength(100).optional(),
    estado: vine.string().fixedLength(2).optional(),
    rua: vine.string().maxLength(255).optional(),
    numero: vine.string().maxLength(20).optional(),
    rg: vine.string().maxLength(20).optional(),
    telefone: vine.string().maxLength(20).optional(),
    bairro: vine.string().maxLength(100).optional(),
  })
)

// Validator para atualização de usuário
export const updateUserValidator = vine.compile(
  vine.object({
    nome: vine.string().trim().minLength(3).maxLength(255).optional(),
    email: vine.string().email().optional().use(uniqueEmailRule()),
    senha: vine.string().minLength(6).maxLength(180).optional(),
    permissao: vine.number().min(1).max(3).optional(),
    oab: vine.string().maxLength(50).optional(),
    profissao: vine.string().maxLength(100).optional(),
    cpf: vine.string().maxLength(14).optional().use(uniqueCpfRule()),
    cep: vine.string().maxLength(9).optional(),
    cidade: vine.string().maxLength(100).optional(),
    estado: vine.string().fixedLength(2).optional(),
    rua: vine.string().maxLength(255).optional(),
    numero: vine.string().maxLength(20).optional(),
    rg: vine.string().maxLength(20).optional(),
    telefone: vine.string().maxLength(20).optional(),
    bairro: vine.string().maxLength(100).optional(),
  })
)
