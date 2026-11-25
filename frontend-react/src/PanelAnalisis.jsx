import { useState } from 'react';
import { urlAnalisis } from './analisis-url';

export default function PanelAnalisis({ tema }) {
  const [abierto, setAbierto] = useState(false);
  const [version, setVersion] = useState(0);
  // El tema se fija al montar el panel para no perder filtros/acceso al cambiarlo.
  const [temaInicial] = useState(tema);
  const configurada = import.meta.env.VITE_STREAMLIT_URL || (import.meta.env.DEV ? 'http://localhost:8501' : '');
  const url = urlAnalisis(configurada, temaInicial);
  return <section className="analisis-panel" aria-labelledby="titulo-analisis">
    <div className="analisis-cabecera">
      <div><span className="antetitulo">EL COMPORTAMIENTO DE TU CULTIVO</span><h2 id="titulo-analisis">Análisis de sensores</h2><p>Temperatura y humedad a lo largo del tiempo.</p></div>
      <button type="button" className="boton primario" aria-expanded={abierto} aria-controls="contenido-analisis" onClick={() => setAbierto(v => !v)}>{abierto ? 'Ocultar análisis' : 'Ver análisis'}</button>
    </div>
    {abierto && <div id="contenido-analisis">
      {url ? <>
        <div className="analisis-herramientas"><div><button className="boton secundario" type="button" onClick={() => setVersion(v => v + 1)}>Recargar</button><a className="boton secundario" href={url} target="_blank" rel="noopener noreferrer">Abrir aparte</a></div></div>
        <iframe key={version} className="analisis-marco" src={url} title="Dashboard de análisis de sensores AgroValle" loading="lazy" referrerPolicy="no-referrer" />
        <details className="ayuda-analisis"><summary>¿No carga el análisis?</summary><p>Prueba «Recargar» o «Abrir aparte». Puede tardar unos momentos en iniciarse.</p></details>
      </> : <p className="estado-vacio" role="status">El análisis aún no está disponible. Se mostrará aquí cuando se habilite el servicio.</p>}
    </div>}
  </section>;
}
