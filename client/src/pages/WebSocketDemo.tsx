import Layout from '../components/Layout';
import WebSocketConnection from '../components/WebSocketConnection';

export default function WebSocketDemo() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">WebSocket Demo</h1>
          <p className="text-gray-500 mt-1">
            Esta página demonstra a integração de WebSockets no Tripulante Dashboard
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Sobre WebSockets</h2>
          <p className="mb-4">
            WebSockets permitem comunicação bidirecional em tempo real entre o cliente e o servidor.
            Isso é útil para recursos como:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Notificações em tempo real</li>
            <li>Chat ao vivo entre usuários</li>
            <li>Atualizações instantâneas de dados</li>
            <li>Monitoramento em tempo real</li>
          </ul>
          <p>
            Use o painel abaixo para enviar mensagens através da conexão WebSocket 
            e ver as respostas em tempo real.
          </p>
        </div>
        
        <WebSocketConnection />
      </div>
    </Layout>
  );
}