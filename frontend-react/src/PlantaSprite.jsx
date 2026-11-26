// Roseta inspirada en la planta de referencia; ilustración decorativa, no diagnóstico.
const hojas = [
  {
    clase: 'hoja-superior-izquierda',
    borde: 'M10 12h2v4h3v4h3v5h3v5h3v6h4v9H18v-7h-3v-8h-2v-8h-2v-6h-1Z',
    luz: 'M12 18h2v5h3v6h3v7h4v7h-4v-7h-3v-7h-2v-6h-3Z',
    marcas: 'M14 23h2v1h-2Zm3 7h2v1h-2Zm3 7h3v1h-3Z',
  },
  {
    clase: 'hoja-superior-derecha',
    borde: 'M52 8h2v10h-2v8h-2v7h-3v6h-3v6H33v-8h5v-6h4v-6h4v-6h3v-6h3Z',
    luz: 'M51 18h1v7h-3v7h-3v6h-4v5h-5v-4h4v-7h4v-7h3v-5h3Z',
    marcas: 'M48 26h2v1h-2Zm-4 8h3v1h-3Zm-5 6h3v1h-3Z',
  },
  {
    clase: 'hoja-superior-izquierda',
    borde: 'M22 5h2v5h3v6h3v7h2v9h2v13H23v-9h-2V25h-1V15h1V9h1Z',
    luz: 'M23 12h2v7h3v10h2v14h-4V31h-2V21h-1Z',
    marcas: 'M23 19h2v1h-2Zm2 7h3v1h-3Zm0 6h3v1h-3Zm2 6h3v1h-3Z',
  },
  {
    clase: 'hoja-superior-derecha',
    borde: 'M39 7h2v7h2v11h-1v9h-2v11H29V33h3v-9h3v-8h2v-5h2Z',
    luz: 'M39 16h2v10h-2v9h-3v8h-4v-9h3v-9h2v-5h2Z',
    marcas: 'M38 23h3v1h-3Zm-2 6h3v1h-3Zm-2 7h3v1h-3Z',
  },
  {
    clase: 'hoja-inferior-izquierda',
    borde: 'M5 26h2v5h3v4h4v4h6v3h8v5H16v-3h-5v-4H8v-5H6v-5H5Z',
    luz: 'M8 33h2v4h5v4h7v3h-6v-2h-4v-3h-2v-3H8Z',
    marcas: 'M10 37h2v1h-2Zm5 5h3v1h-3Z',
  },
  {
    clase: 'hoja-inferior-derecha',
    borde: 'M58 23h1v8h-2v6h-3v5h-4v3h-5v2H33v-6h10v-3h5v-4h4v-4h3v-4h3Z',
    luz: 'M55 31h2v5h-4v5h-5v3h-9v-2h6v-3h5v-4h3v-2h2Z',
    marcas: 'M53 35h3v1h-3Zm-5 5h3v1h-3Zm-6 3h3v1h-3Z',
  },
  {
    clase: 'hoja-central',
    borde: 'M30 14h2v7h2v7h2v8h2v11H25V36h1v-9h2v-8h2Z',
    luz: 'M30 24h2v8h2v13h-6V33h1v-5h1Z',
    marcas: 'M29 31h3v1h-3Zm-1 5h3v1h-3Zm3 4h3v1h-3Z',
  },
];

export default function PlantaSprite() {
  return <div className="planta-escena" aria-hidden="true">
    <svg className="planta-sprite" viewBox="0 0 64 72" fill="none" shapeRendering="crispEdges">
      <ellipse cx="32" cy="68" rx="25" ry="3" fill="var(--sprite-sombra)" />
      <path d="M12 44h40v5H12z" fill="#493d2b" />
      {hojas.map((hoja, i) => <g key={i} className={`planta-hoja ${hoja.clase}`}>
        <path d={hoja.borde} fill="#2d4b35" />
        <path d={hoja.luz} fill="#54744b" />
        <path d={hoja.marcas} fill="#a5b480" />
      </g>)}
      <path d="M10 45h44v7h-3v6h-2v6h-4v3H19v-3h-4v-6h-2v-6h-3Z" fill="#754936" />
      <path d="M14 51h36v6h-3v7H20v-3h-3v-5h-3Z" fill="#ad6d4e" />
      <path d="M15 52h5v8h3v4h-3v-3h-3v-5h-2Z" fill="#c48b65" />
      <path d="M45 52h5v5h-3v7h-5v-3h3Z" fill="#91563e" />
      <path d="M11 45h42v5H11z" fill="#c58b65" />
      <path d="M13 45h38v2H13z" fill="#dcaa7e" />
      <path d="M19 55h26v1H19zm2 5h22v1H21z" fill="#965c43" />
      <path d="M12 66h40v3H12z" fill="#956044" />
      <path d="M15 66h34v1H15z" fill="#cd936d" />
    </svg>
  </div>;
}
