import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'https://agrovalle-backend-api.onrender.com').replace(/\/+$/, ''),
  timeout: 60000,
});

function App() {
  const [datos, setDatos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('tokenAgroValle') || '');
  const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });
  const [pregunta, setPregunta] = useState('');
  const [chatHistorial, setChatHistorial] = useState([]);
  const [cargandoChat, setCargandoChat] = useState(false);
  const [enviandoReporte, setEnviandoReporte] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // API seleccionada por VITE_API_URL; Render es el valor predeterminado.
      const res = await api.post('/api/login', credenciales);
      setToken(res.data.token);
      localStorage.setItem('tokenAgroValle', res.data.token);
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('tokenAgroValle');
  };

  const solicitarReporte = async () => {
    if (enviandoReporte) return;
    setEnviandoReporte(true);
    try {
      // En validación local el backend prepara el correo sin enviarlo.
      const res = await api.post('/api/reporte');
      alert(res.data.mensaje);
    } catch (error) {
      alert(error.response?.data?.error || "Error al enviar el reporte");
    } finally {
      setEnviandoReporte(false);
    }
  };

  const enviarPreguntaChat = async (e) => {
    e.preventDefault();
    if (!pregunta.trim() || cargandoChat) return;

    setCargandoChat(true);
    const preguntaActual = pregunta;
    setPregunta('');

    try {
      // API seleccionada por VITE_API_URL.
      const res = await api.post('/api/chatbot', { pregunta: preguntaActual });
      setChatHistorial(prev => [...prev, { rol: 'user', texto: preguntaActual }, { rol: 'bot', texto: res.data.respuesta }]);
    } catch (error) {
      setPregunta(preguntaActual);
      alert(error.response?.data?.error || "Error al comunicarse con AgroBot");
    } finally {
      setCargandoChat(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    const cargarDatos = async () => {
      try {
        // API seleccionada por VITE_API_URL.
        const respuesta = await api.get('/api/historial');
        setDatos(respuesta.data);
      } catch (error) {
        console.error("Error al obtener datos", error);
      }
    };
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 5000);
    return () => clearInterval(intervalo);
  }, [token]);

  if (!token) {
    return (
      <div className="App" style={{ paddingTop: '100px' }}>
        <h2>🔒 Acceso Administrativo AgroValle</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Usuario" onChange={e => setCredenciales({...credenciales, usuario: e.target.value})} required style={{ padding: '10px', margin: '5px' }}/>
          <input type="password" placeholder="Contraseña" onChange={e => setCredenciales({...credenciales, password: e.target.value})} required style={{ padding: '10px', margin: '5px' }}/>
          <button type="submit" style={{ padding: '10px 20px', background: '#2c3e50', color: 'white', border: 'none', cursor: 'pointer' }}>Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🌱 Panel AgroValle + Asistente IA</h1>
        <div>
          <button onClick={solicitarReporte} disabled={enviandoReporte} style={{ background: '#27ae60', color: 'white', marginRight: '10px', padding: '10px', border: 'none', cursor: 'pointer' }}>{enviandoReporte ? 'Enviando reporte…' : '📧 Enviar Reporte'}</button>
          <button onClick={handleLogout} style={{ background: '#d9534f', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>Salir</button>
        </div>
      </header>
      
      <div className="tarjetas">
        {datos.map((lectura) => (
          <div key={lectura.id} className="tarjeta">
            <h3>{lectura.dispositivo_id}</h3>
            <p><b>Temperatura:</b> <span style={{ color: lectura.temperatura > 30 ? 'red' : 'inherit' }}>{lectura.temperatura}°C</span></p>
            <p><b>Humedad:</b> {lectura.humedad}%</p>
            <p><b>Bomba:</b> {lectura.bomba_encendida ? "Encendida 💧" : "Apagada 🛑"}</p>
            <small className="fecha">{new Date(lectura.fecha_hora).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="chat-container" style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'left', maxWidth: '800px', margin: '40px auto' }}>
        <h3>🤖 AgroBot - Asistente Agronómico con IA</h3>
        
        <div className="mensajes" style={{ background: 'white', padding: '15px', height: '250px', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '15px' }}>
          {chatHistorial.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>Escribe una consulta para consultar al manual...</p>}
          {chatHistorial.map((msg, index) => (
            <div key={index} style={{ margin: '10px 0', textAlign: msg.rol === 'user' ? 'right' : 'left' }}>
              <span style={{ background: msg.rol === 'user' ? '#e3f2fd' : '#e8f5e9', padding: '8px 12px', borderRadius: '8px', display: 'inline-block', maxWidth: '80%' }}>
                <b>{msg.rol === 'user' ? 'Tú: ' : 'AgroBot: '}</b>{msg.texto}
              </span>
            </div>
          ))}
          {cargandoChat && <p style={{ color: '#27ae60', fontStyle: 'italic' }}>AgroBot está consultando el manual...</p>}
        </div>

        <form onSubmit={enviarPreguntaChat} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Pregunta sobre los parámetros del cultivo..." 
            value={pregunta} 
            maxLength={4000}
            disabled={cargandoChat}
            onChange={e => setPregunta(e.target.value)} 
            style={{ flex: '1', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" disabled={cargandoChat} style={{ background: '#2980b9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default App;
