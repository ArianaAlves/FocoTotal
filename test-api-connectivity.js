// Script de teste de conectividade da API
console.log('🧪 Testando conectividade da API...');

const API_URL = 'https://focototal.onrender.com/api';

async function testApiConnectivity() {
  try {
    console.log(`📡 Testando: ${API_URL}/health`);

    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('📊 Status OK:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API funcionando! Resposta:', data);
    } else {
      console.log('❌ API retornou erro:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Erro de conectividade:', error.message);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.log('🔍 Possível problema de CORS ou rede');
    }
  }
}

// Executar teste
testApiConnectivity();