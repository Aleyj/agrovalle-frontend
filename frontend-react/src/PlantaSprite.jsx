// Ilustración decorativa en una cuadrícula de 64 px; no representa salud ni conexión.
export default function PlantaSprite() {
  return <div className="planta-escena" aria-hidden="true">
    <svg className="planta-sprite" viewBox="0 0 64 72" fill="none" shapeRendering="crispEdges">
      <ellipse cx="32" cy="65" rx="22" ry="3" fill="var(--sprite-sombra)" />
      <g className="planta-follaje">
        <path d="M30 48V24h4v24h-4ZM26 30h4v4h-4Zm8-8h4v4h-4Z" fill="#385343" />
        <path d="M30 31H18v-4h-6V15h12v4h6v12Z" fill="#385343" />
        <path d="M16 19h8v4h6v4H18v-4h-2v-4Z" fill="#749664" />
        <path d="M16 19h8v4h-8z" fill="#a8b97a" />
        <path d="M34 25V15h6v-4h14v12h-6v4H38v4h-4v-6Z" fill="#385343" />
        <path d="M38 19h4v-4h8v8H38v4h-4v-4h4v-4Z" fill="#7e9c68" />
        <path d="M42 15h8v4h-8z" fill="#b0c184" />
        <path d="M30 39H20v-4h-6v-8h10v4h6v8Z" fill="#385343" />
        <path d="M18 31h6v4h6v4h-6v-4h-6z" fill="#87a16b" />
        <path d="M34 39v-8h6v-4h10v8h-6v4H34Z" fill="#385343" />
        <path d="M38 35v-4h8v4h-8z" fill="#92aa73" />
      </g>
      <path d="M18 46h28v6h-2v10h-4v4H24v-4h-4V52h-2v-6Z" fill="#684a3c" />
      <path d="M22 51h20v10h-4v3H26v-3h-4V51Z" fill="#b97d5e" />
      <path d="M22 51h5v10h-3v-3h-2v-7Z" fill="#d49c76" />
      <path d="M19 46h26v5H19z" fill="#cb936e" />
      <path d="M21 46h22v2H21z" fill="#e0b18a" />
      <path d="M38 53h4v8h-4z" fill="#9a654f" />
    </svg>
  </div>;
}
