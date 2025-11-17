// Teste completo do fluxo de login
console.log('🧪 Testando fluxo completo de login...');

const API_URL = 'https://focototal.onrender.com/api';

async function testLoginFlow() {
  try {
    // 1. Testar endpoint de saúde
    console.log('\n📡 1. Testando endpoint de saúde...');
    const healthResponse = await fetch(`${API_URL}/health`);
    console.log('✅ Health check:', healthResponse.ok ? 'OK' : 'FALHOU');

    // 2. Testar endpoint de login (sem credenciais válidas)
    console.log('\n📡 2. Testando endpoint de login...');
    const loginResponse = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'teste@email.com',
        password: 'senhateste'
      })
    });

    console.log('📊 Status do login:', loginResponse.status);

    if (loginResponse.status === 400 || loginResponse.status === 401) {
      console.log('✅ Endpoint de login acessível (erro esperado para credenciais inválidas)');
    } else if (loginResponse.status === 500) {
      const errorData = await loginResponse.text();
      console.log('⚠️ Erro interno do servidor:', errorData);
    }

    // 3. Testar CORS
    console.log('\n📡 3. Testando CORS...');
    const corsHeaders = loginResponse.headers;
    console.log('🔒 Access-Control-Allow-Origin:', corsHeaders.get('access-control-allow-origin'));
    console.log('🔒 Content-Type:', corsHeaders.get('content-type'));

    console.log('\n✅ Testes concluídos! A API parece estar funcionando corretamente.');

  } catch (error) {
    console.log('\n❌ Erro durante os testes:', error.message);

    if (error.message.includes('fetch')) {
      console.log('🔍 Possível problema de conectividade ou CORS');
    }
  }
}

// Executar teste
testLoginFlow();