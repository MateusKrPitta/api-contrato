import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // ✅ CORRETO: Use texto plano - o modelo faz hash automático
    await User.firstOrCreate(
      { email: 'admin@email.com' },
      {
        nome: 'Administrador',
        senha: '123456', // ⬅️ TEXTO PLANO!
        permissao: 3,
        cpf: '123.456.789-00',
        profissao: 'Administrador',
        oab: null,
        cep: '01234-567',
        cidade: 'São Paulo',
        estado: 'SP',
        rua: 'Rua Principal',
        numero: '100',
      }
    )

    await User.firstOrCreate(
      { email: 'joao@email.com' },
      {
        nome: 'João Advogado',
        senha: '123456', // ⬅️ TEXTO PLANO!
        permissao: 2,
        cpf: '987.654.321-00',
        profissao: 'Advogado',
        oab: 'OAB/SP123456',
        cep: '04567-890',
        cidade: 'São Paulo',
        estado: 'SP',
        rua: 'Avenida Paulista',
        numero: '200',
      }
    )

    await User.firstOrCreate(
      { email: 'maria@email.com' },
      {
        nome: 'Maria Usuária',
        senha: '123456', // ⬅️ TEXTO PLANO!
        permissao: 1,
        cpf: '111.222.333-44',
        profissao: 'Analista',
        oab: null,
        cep: '03000-000',
        cidade: 'São Paulo',
        estado: 'SP',
        rua: 'Rua das Flores',
        numero: '300',
      }
    )

    console.log('Seed de usuários executado com sucesso!')
  }
}
