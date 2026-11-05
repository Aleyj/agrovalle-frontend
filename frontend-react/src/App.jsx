import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'https://agrovalle-backend-api.onrender.com').replace(/\/+$/, ''),
  timeout: 60000,
});

function Icono({ nombre, ...props }) {
  if (nombre === 'planta' || nombre === 'bot') {
    return <span className="icono-emoji" aria-hidden="true">{nombre === 'planta' ? '🌱' : '🤖'}</span>;
  }
  const trazos = {
    temperatura: <><path d="M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0Z" /><path d="M12 8v10" /></>,
    humedad: <path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z" />,
    correo: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>,
    flecha: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{trazos[nombre]}</svg>;
}

function Marca() {
  return <div className="marca"><span className="marca-icono"><Icono nombre="planta" /></span><div><h1>AgroValle</h1><p>Monitoreo agrícola</p></div></div>;
}

function SelectorTema({ tema, cambiarTema }) {
  const destino = tema === 'dark' ? 'claro' : 'oscuro';
  return <button type="button" className="boton secundario selector-tema" onClick={cambiarTema} aria-label={`Activar modo ${destino}`} aria-pressed={tema === 'dark'} title={`Activar modo ${destino}`}><span aria-hidden="true">{tema === 'dark' ? '☀️' : '🌙'}</span><span className="texto-tema">Modo {destino}</span></button>;
}

function temaInicial() {
  try {
    const guardado = localStorage.getItem('temaAgroValle');
    if (guardado === 'light' || guardado === 'dark') return guardado;
  } catch { /* El tema sigue funcionando si el navegador bloquea su persistencia. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function numero(valor) {
  if (valor === null || valor === undefined || typeof valor === 'boolean' || String(valor).trim() === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function medida(valor) {
  const n = numero(valor);
  return n === null ? '—' : n.toLocaleString('es-PE', { maximumFractionDigits: 1 });
}

function fecha(valor) {
  const d = valor ? new Date(valor) : null;
  return d && Number.isFinite(d.getTime()) ? d.toLocaleString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha no disponible';
}

function estadoBomba(valor) {
  return valor === true ? 'Encendida' : valor === false ? 'Apagada' : 'Sin dato';
}

function TextoMensaje({ texto }) {
  // Solo negritas y saltos de línea. El contenido siempre se renderiza como texto seguro.
  return <span className="texto-mensaje">{String(texto).split(/(\*\*[^*]+\*\*)/g).map((parte, i) => parte.startsWith('**') && parte.endsWith('**') ? <strong key={i}>{parte.slice(2, -2)}</strong> : parte)}</span>;
}

function App() {
  const [tema, setTema] = useState(temaInicial);
  const [datos, setDatos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('tokenAgroValle') || '');
  const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });
  const [ingresando, setIngresando] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorDatos, setErrorDatos] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [preguntaPendiente, setPreguntaPendiente] = useState('');
  const [chatHistorial, setChatHistorial] = useState([]);
  const [cargandoChat, setCargandoChat] = useState(false);
  const [errorChat, setErrorChat] = useState('');
  const [enviandoReporte, setEnviandoReporte] = useState(false);
  const [avisoReporte, setAvisoReporte] = useState(null);
  const mensajesRef = useRef(null);
  const sesionRef = useRef(0);

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    try { localStorage.setItem('temaAgroValle', tema); } catch { /* Preferencia solo durante esta sesión. */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'dark' ? '#111a16' : '#f4f7f3');
  }, [tema]);

  const cambiarTema = () => setTema(actual => actual === 'dark' ? 'light' : 'dark');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (ingresando) return;
    setIngresando(true);
    setErrorLogin('');
    try {
      const res = await api.post('/api/login', credenciales);
      setToken(res.data.token);
      localStorage.setItem('tokenAgroValle', res.data.token);
      setCredenciales({ usuario: '', password: '' });
    } catch (error) {
      setErrorLogin(error.response?.status === 401 ? 'Usuario o contraseña incorrectos.' : 'No se pudo iniciar sesión. Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      setIngresando(false);
    }
  };

  const handleLogout = () => {
    sesionRef.current += 1;
    setToken('');
    localStorage.removeItem('tokenAgroValle');
    setDatos([]);
    setChatHistorial([]);
    setPregunta('');
    setPreguntaPendiente('');
    setErrorChat('');
    setErrorDatos('');
    setAvisoReporte(null);
    setCargandoDatos(true);
    setCargandoChat(false);
    setEnviandoReporte(false);
  };

  const solicitarReporte = async () => {
    if (enviandoReporte) return;
    const sesion = sesionRef.current;
    setEnviandoReporte(true);
    setAvisoReporte(null);
    try {
      const res = await api.post('/api/reporte');
      if (sesion !== sesionRef.current) return;
      const mensaje = res.data.preparado ? 'Reporte preparado para revisión; no se envió correo.' :
        res.data.correo?.estado === 'aceptado' ? `Reporte aceptado por ${res.data.correo.proveedor === 'resend' ? 'Resend' : 'el servidor de correo'}. La entrega aún no está confirmada.` :
        res.data.mensaje || 'Solicitud de reporte procesada.';
      setAvisoReporte({ error: false, mensaje });
    } catch (error) {
      if (sesion === sesionRef.current) setAvisoReporte({ error: true, mensaje: error.response?.data?.error || 'No se pudo confirmar el envío del reporte. No se reintentó automáticamente.' });
    } finally {
      if (sesion === sesionRef.current) setEnviandoReporte(false);
    }
  };

  const enviarPreguntaChat = async (e) => {
    e.preventDefault();
    if (!pregunta.trim() || cargandoChat) return;
    const sesion = sesionRef.current;
    const preguntaActual = pregunta.trim();
    setCargandoChat(true);
    setErrorChat('');
    setPreguntaPendiente(preguntaActual);
    setPregunta('');
    try {
      const res = await api.post('/api/chatbot', { pregunta: preguntaActual });
      if (sesion !== sesionRef.current) return;
      setChatHistorial(prev => [...prev, { rol: 'user', texto: preguntaActual }, { rol: 'bot', texto: res.data.respuesta }]);
    } catch (error) {
      if (sesion !== sesionRef.current) return;
      setPregunta(preguntaActual);
      setErrorChat(error.response?.data?.error || 'No se pudo consultar a AgroBot. Inténtalo de nuevo.');
    } finally {
      if (sesion === sesionRef.current) {
        setCargandoChat(false);
        setPreguntaPendiente('');
      }
    }
  };

  useEffect(() => {
    if (!token) return;
    let activo = true;
    let consultando = false;
    const controller = new AbortController();
    const cargarDatos = async () => {
      if (consultando) return;
      consultando = true;
      try {
        const respuesta = await api.get('/api/historial', { signal: controller.signal });
        if (!Array.isArray(respuesta.data)) throw new Error('HISTORIAL_INVALIDO');
        if (activo) {
          setDatos(respuesta.data);
          setErrorDatos('');
        }
      } catch {
        if (activo) setErrorDatos('No se pudieron actualizar las lecturas. Los datos visibles pueden estar desactualizados.');
      } finally {
        consultando = false;
        if (activo) setCargandoDatos(false);
      }
    };
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 5000);
    return () => { activo = false; controller.abort(); clearInterval(intervalo); };
  }, [token]);

  useEffect(() => {
    const lista = mensajesRef.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  }, [chatHistorial, cargandoChat]);

  // El historial llega ordenado por ID descendente. Se elige la fecha más reciente
  // de cada dispositivo cuando está disponible, manteniendo el orden como alternativa.
  const ultimas = new Map();
  for (const lectura of datos) {
    const dispositivo = lectura.dispositivo_id ?? '';
    const previa = ultimas.get(dispositivo);
    const actualFecha = Date.parse(lectura.fecha_hora);
    const previaFecha = Date.parse(previa?.fecha_hora);
    if (!previa || Number.isFinite(actualFecha) && (!Number.isFinite(previaFecha) || actualFecha > previaFecha)) ultimas.set(dispositivo, lectura);
  }

  if (!token) return (
    <main className="acceso">
      <div className="acceso-panel">
        <div className="acceso-marca"><Marca /><SelectorTema tema={tema} cambiarTema={cambiarTema} /></div>
        <div className="acceso-titulo"><h2>Bienvenido a tu cultivo</h2><p>Ingresa para consultar tus lecturas y conversar con AgroBot.</p></div>
        <form className="form-acceso" onSubmit={handleLogin}>
          <label htmlFor="usuario">Usuario</label>
          <input id="usuario" autoComplete="username" value={credenciales.usuario} onChange={e => setCredenciales({ ...credenciales, usuario: e.target.value })} required />
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" value={credenciales.password} onChange={e => setCredenciales({ ...credenciales, password: e.target.value })} required />
          {errorLogin && <p className="mensaje-error" role="alert">{errorLogin}</p>}
          <button className="boton primario" type="submit" disabled={ingresando}>{ingresando ? 'Ingresando…' : 'Ingresar'}<Icono nombre="flecha" /></button>
        </form>
        <p className="nota-acceso">AgroValle · Agricultura de precisión</p>
      </div>
    </main>
  );

  return (
    <div className="app">
      <header className="cabecera">
        <Marca />
        <div className="acciones-cabecera">
          <button className="boton primario" onClick={solicitarReporte} disabled={enviandoReporte}><Icono nombre="correo" />{enviandoReporte ? 'Preparando reporte…' : 'Enviar reporte'}</button>
          <SelectorTema tema={tema} cambiarTema={cambiarTema} />
          <button className="boton secundario" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <main>
        {avisoReporte && <div className={`aviso ${avisoReporte.error ? 'aviso-error' : ''}`} role={avisoReporte.error ? 'alert' : 'status'}>{avisoReporte.mensaje}</div>}
        <div className="contenido-principal">
          <section className="lecturas" aria-labelledby="titulo-lecturas">
            <div className="titulo-seccion"><div><span className="antetitulo">TU CULTIVO, DE UN VISTAZO</span><h2 id="titulo-lecturas">Últimas lecturas</h2></div><span className="contador">{ultimas.size} {ultimas.size === 1 ? 'dispositivo' : 'dispositivos'}</span></div>
            <p className="descripcion-seccion">Última medición por dispositivo en el historial disponible.</p>
            {errorDatos && <p className="aviso aviso-error" role="alert">{errorDatos}</p>}
            {cargandoDatos ? <div className="estado-vacio" role="status">Cargando lecturas…</div> : datos.length === 0 ? <div className="estado-vacio"><Icono nombre="planta" /><h3>Aún no hay lecturas disponibles</h3><p>Las mediciones aparecerán aquí cuando se registren.</p></div> :
              <div className="tarjetas">{[...ultimas.values()].map(lectura => {
                const alta = numero(lectura.temperatura) !== null && numero(lectura.temperatura) > 30;
                return <article key={lectura.id} className={`tarjeta ${alta ? 'tarjeta-alerta' : ''}`}>
                  <div className="tarjeta-cabecera"><h3>{lectura.dispositivo_id || 'Dispositivo sin nombre'}</h3><span className={`etiqueta ${alta ? 'alta' : ''}`}>{alta ? 'Temperatura alta' : numero(lectura.temperatura) === null ? 'Sin temperatura' : 'Sin alerta térmica'}</span></div>
                  <dl className="mediciones">
                    <div><dt><Icono nombre="temperatura" />Temperatura</dt><dd className={alta ? 'valor-alto' : ''}>{medida(lectura.temperatura)}<span>°C</span></dd></div>
                    <div><dt><Icono nombre="humedad" />Humedad</dt><dd>{medida(lectura.humedad)}<span>%</span></dd></div>
                  </dl>
                  <div className="estado-bomba"><span>Bomba</span><span className="bomba-valor"><span className={`punto ${lectura.bomba_encendida === true ? 'activo' : ''}`} />{estadoBomba(lectura.bomba_encendida)}</span></div>
                  <p className="fecha-lectura">Última lectura<span>{fecha(lectura.fecha_hora)}</span></p>
                </article>;
              })}</div>}
          </section>

          <section className="chat-panel" aria-labelledby="titulo-chat">
            <div className="chat-cabecera"><span className="bot-icono"><Icono nombre="bot" /></span><div><h2 id="titulo-chat">AgroBot</h2><p>Tu asistente agronómico</p></div><span className="etiqueta ia">IA</span></div>
            <div className="mensajes" ref={mensajesRef} role="log" aria-label="Conversación con AgroBot" aria-live="polite" aria-relevant="additions text" tabIndex={0}>
              {chatHistorial.length === 0 && !cargandoChat && <div className="chat-bienvenida"><Icono nombre="planta" /><h3>Una mano para cuidar tu cultivo</h3><p>Consulta los parámetros del manual y resuelve tus dudas sobre temperatura y humedad.</p><button className="sugerencia" onClick={() => setPregunta('¿Cuál es el rango de temperatura recomendado?')}>¿Qué temperatura se recomienda?</button></div>}
              {chatHistorial.map((msg, i) => <div className={`mensaje ${msg.rol}`} key={i}><span className="autor-mensaje">{msg.rol === 'user' ? 'Tú' : 'AgroBot'}</span><TextoMensaje texto={msg.texto} /></div>)}
              {cargandoChat && <><div className="mensaje user"><span className="autor-mensaje">Tú</span><TextoMensaje texto={preguntaPendiente} /></div><p className="consultando">Consultando…</p></>}
            </div>
            <form className="form-chat" onSubmit={enviarPreguntaChat}>
              {errorChat && <p className="mensaje-error" role="alert">{errorChat}</p>}
              <label className="solo-lector" htmlFor="pregunta">Tu pregunta para AgroBot</label>
              <div className="entrada-chat"><input id="pregunta" type="text" placeholder="Escribe tu consulta…" value={pregunta} maxLength={4000} disabled={cargandoChat} onChange={e => setPregunta(e.target.value)} /><button className="boton primario" type="submit" disabled={cargandoChat || !pregunta.trim()} aria-label="Enviar pregunta"><Icono nombre="flecha" /></button></div>
              <p className="nota-chat">Orientación basada en el manual del proyecto.</p>
            </form>
          </section>
        </div>

        <section className="historial-panel" aria-labelledby="titulo-historial">
          <div className="titulo-seccion"><div><span className="antetitulo">REGISTRO DE MEDICIONES</span><h2 id="titulo-historial">Historial reciente</h2></div><span className="contador">{datos.length} {datos.length === 1 ? 'lectura' : 'lecturas'}</span></div>
          <div className="tabla-contenedor" tabIndex={0} role="region" aria-label="Tabla de historial, desplazable horizontalmente">
            <table><caption className="solo-lector">Lecturas recuperadas, ordenadas desde el registro más reciente</caption><thead><tr><th scope="col">Dispositivo</th><th scope="col">Temperatura</th><th scope="col">Humedad</th><th scope="col">Bomba</th><th scope="col">Fecha de lectura</th></tr></thead><tbody>
              {datos.map(lectura => <tr key={lectura.id}><th scope="row">{lectura.dispositivo_id || 'Sin nombre'}</th><td><span className={numero(lectura.temperatura) > 30 ? 'temperatura-alta' : ''}>{medida(lectura.temperatura)} °C</span></td><td>{medida(lectura.humedad)} %</td><td>{estadoBomba(lectura.bomba_encendida)}</td><td className="fecha-tabla">{fecha(lectura.fecha_hora)}</td></tr>)}
              {!datos.length && <tr><td colSpan={5} className="tabla-vacia">{cargandoDatos ? 'Cargando historial…' : 'No hay lecturas para mostrar.'}</td></tr>}
            </tbody></table>
          </div>
        </section>
      </main>
      <footer className="pie">AgroValle<span>Monitoreo agrícola · Proyecto académico</span></footer>
    </div>
  );
}

export default App;
