import { useState, useEffect, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  message?: string;
  data?: any;
  timestamp: string;
}

export default function WebSocketConnection() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Initialize WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setConnected(true);
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };
    
    setSocket(ws);
    
    // Clean up function
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Function to send a message to the WebSocket server
  const sendMessage = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN && inputMessage.trim()) {
      socket.send(JSON.stringify({
        text: inputMessage,
        sentAt: new Date().toISOString()
      }));
      setInputMessage('');
    }
  }, [socket, inputMessage]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }, [sendMessage]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className={`h-3 w-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="font-medium">
          {connected ? 'Conectado ao WebSocket' : 'Desconectado do WebSocket'}
        </span>
      </div>
      
      <div className="border rounded-md p-4 h-64 overflow-y-auto mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-20">
            Nenhuma mensagem recebida
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-2 p-2 rounded border border-gray-200">
              <div className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleString()} - {msg.type}
              </div>
              <div className="mt-1 text-sm">
                {msg.message ? (
                  <div>{msg.message}</div>
                ) : (
                  <pre className="whitespace-pre-wrap bg-gray-100 p-1 rounded text-xs">
                    {JSON.stringify(msg.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite uma mensagem..."
          disabled={!connected}
        />
        <button 
          onClick={sendMessage}
          disabled={!connected || !inputMessage.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}