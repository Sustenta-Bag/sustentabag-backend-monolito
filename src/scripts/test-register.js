/**
 * Script para testar a API de registro sem usar Swagger
 * Execute com: node src/scripts/test-register.js
 */
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// URL base da API (atualize conforme necessário)
const API_URL = process.env.API_URL || 'http://localhost:4041';

// Novo usuário a ser registrado (altere os dados para evitar emails duplicados)
const newUser = {
  entityType: "client",
  userData: {
    email: `usuario-teste-${Date.now()}@example.com`,
    password: "senha123"
  },
  entityData: {
    name: "Usuário de Teste",
    cpf: "12345678900",
    phone: "11987654321",
    status: 1
  }
};

console.log(`\n🔍 Tentando registrar um novo usuário...`);
console.log(`📧 Email: ${newUser.userData.email}`);

async function testRegister() {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    
    const data = await response.json();
    
    console.log(`\n📊 Status da resposta: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log(`\n✅ Registro bem-sucedido!`);
      console.log(`📋 Detalhes da resposta:`);
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(`\n❌ Falha no registro!`);
      console.log(`📋 Detalhes do erro:`);
      console.log(JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error(`\n🚨 Erro ao fazer a requisição:`, error.message);
  }
}

// Executar o teste
testRegister();
