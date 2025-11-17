// Teste simples da API
const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Iniciando testes da API...\n');

  try {
    // 1. Teste Health Check
    console.log('1️⃣ Testando Health Check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    console.log();

    // 2. Teste de Registro
    console.log('2️⃣ Testando Registro de Usuário...');
    const testUser = {
      name: 'Teste User',
      email: `teste${Date.now()}@email.com`,
      password: '123456'
    };

    const registerResponse = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    console.log('✅ Registro:', registerData);
    console.log('📊 Status:', registerResponse.status);
    console.log();

    // 3. Teste de Login
    console.log('3️⃣ Testando Login...');
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };

    const loginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();
    console.log('✅ Login:', loginResult);
    console.log('📊 Status:', loginResponse.status);
    console.log();

    if (registerResponse.ok && loginResponse.ok) {
      console.log('🎉 Todos os testes passaram com sucesso!');
    } else {
      console.log('⚠️ Alguns testes falharam, mas a API está respondendo.');
    }

  } catch (error) {
    console.error('❌ Erro no teste:', {
      message: error.message,
      name: error.name
    });
  }
}

testAPI();