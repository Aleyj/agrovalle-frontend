# AgroValle: mejora visual simple

Actualizacion visual del 24 de noviembre de 2026: Manrope variable alojada en
public/fonts con su licencia SIL OFL, acento trigo/dorado y textos mas breves.
Se retiran el contador 1 ESP32, la descripcion repetida del estado y el subtitulo
duplicado de la tarjeta. Los avisos de reporte pasan a una notificacion flotante:
«Reporte solicitado. Revisa tu correo en unos momentos.» o «Reporte preparado.
No se envio correo.» en preparacion. Los exitos se ocultan a los cinco segundos;
los errores permanecen y todos pueden cerrarse manualmente. No se muestran detalles
de Resend ni se afirma entrega. El backend conserva su respuesta tecnica completa.
Se mantienen emojis, foto difuminada, temas claro/oscuro y aviso de datos antiguos.
La ayuda de carga del iframe queda en un desplegable. No se requiere nueva variable
de entorno para estos ajustes ni se hizo despliegue.

Actualizacion del 24 de noviembre de 2026: se agrega una seccion desplegable de
analisis dentro de la misma pagina. PanelAnalisis.jsx carga Streamlit por iframe
solo al abrir; admite recarga, enlace alternativo y movil. La URL publica se configura
con VITE_STREAMLIT_URL; en desarrollo usa localhost:8501 si no se define, y en
produccion muestra un estado no disponible sin URL valida. Se rechazan URLs con
credenciales/parametros y HTTP remoto. No se transmite el JWT ni claves al iframe.
El tema inicial se conserva en el marco para no perder filtros al alternar el tema
principal. Ocultar o salir desmonta el iframe. Streamlit tiene acceso independiente,
consulta un endpoint de solo lectura y requiere despliegue Python separado; ver
backend/dashboard/README.md en el repositorio backend. Historial de mejoras anterior:

Actualización del 22 de noviembre de 2026: el panel pasa a una sola planta y un
ESP32. Consulta `/api/estado` y actualiza la misma tarjeta con el último cambio,
mostrando la planta asociada, el dispositivo y la fecha del cambio. Las filas
históricas ya no se interpretan como equipos distintos. No se implementan dashboard,
tabla, promedios ni gráficos. Se conservan temas, foto, AgroBot y reporte.
Publicar primero el backend que incorpora este endpoint. La lógica de persistencia
y el SQL pendiente están documentados en `backend/LOGICA-PLANTA-UNICA.md` del workspace.
Las secciones siguientes son antecedentes de la versión con varias tarjetas.

4 de noviembre de 2026. Cambios locales para revisión, sin commit, push ni despliegue.

## Cambio actual: filas independientes y fondo de cultivo

Por solicitud del usuario, cada fila recibida en `/api/historial` ahora se presenta
como un dispositivo ESP independiente, usando su ID como identidad de la tarjeta.
No se agrupa por `dispositivo_id`: nombres repetidos siguen siendo tarjetas distintas
y el ID visible permite diferenciarlas. Esto es una interpretación de presentación,
no una migración del modelo de Supabase. El endpoint existente conserva su límite
de 20 filas y el refresco de cinco segundos; no se modifica la consulta del backend.

Se elimina la tabla de mediciones y se reduce el ancho de tarjeta de escritorio a
un máximo de 280 px. En móvil se usa una columna adaptada a la pantalla. Se conservan
datos, fechas, umbral >30, correo, AgroBot, emojis y selector de tema.

El fondo de toda la página, incluido el acceso, usa `public/fondo_cultivo.jpg`,
centrado con `cover`, posición fija y desenfoque CSS de 9 px. Solo se desenfoca la
capa de fondo; los textos y tarjetas mantienen su nitidez. Una capa clara/oscura
superpuesta y paneles opacos conservan la legibilidad. No se altera la imagen original.

El usuario añadió finalmente una foto JPEG válida como `fondo_cultivo.jpg`, de
5728×3819 píxeles y unos 22,5 MB. Se conserva ese archivo original y se usa su nombre
real en CSS. Su tamaño puede ralentizar la primera carga; queda pendiente una versión
optimizada para publicación. Sin el archivo se conserva el color de fondo como
alternativa. Las secciones de
agrupación y tabla que siguen describen versiones anteriores, ya sustituidas.

Validación final de este cambio: build y lint correctos, sin aviso de recurso
pendiente; foto copiada a `dist` y decodificada correctamente en Chrome. Pasaron
30 comprobaciones con API simulada, incluyendo tres tarjetas para tres filas aunque
dos compartan nombre, ausencia de tabla, ancho de escritorio <=280 px, fondo fijo
con filtro separado, modos claro/oscuro, móvil, chat y reporte sin envío real. No
se modificó Supabase ni se publicaron cambios. Auditoría de archivos versionables:
sin coincidencias sensibles detectadas con los controles existentes.

## Ajuste posterior: emojis, tema y tipografía

El usuario publicó la mejora inicial del panel en `main` (`53c6247`). Este ajuste
posterior aún es local: 🌱 para la marca, bienvenida y estado vacío; 🤖 para AgroBot;
favicon de planta y tipografía original `system-ui, sans-serif`, comprobada en
`a2ef710:frontend-react/src/App.css`. Se recuperan la base de 18 px en escritorio,
16 px en pantallas pequeñas y el interlineado original, conservando la distribución.

El selector de modo claro/oscuro aparece en el acceso y en el panel. Inicialmente
usa la preferencia del sistema; guarda la elección manual en `temaAgroValle`,
independiente del token. La elección persiste al recargar y al salir. Si el navegador
bloquea guardar esa preferencia, el selector sigue funcionando durante la sesión.
Se aplica el tema antes del arranque de React para reducir el destello inicial.

La paleta usa variables CSS para fondo, paneles, textos, campos, mensajes, alertas,
botones y tabla. Las alertas conservan texto y color en ambos temas. No se añaden
fuentes externas, dependencias, llamadas a otros servicios ni cambios de backend.
Las descripciones de tema claro de la mejora inicial que siguen abajo son antecedentes.

Validación de este ajuste: build y lint aprobados; 26 comprobaciones de Chrome con
API simulada, incluidas preferencia inicial, persistencia tras recarga, familia
tipográfica, emojis, móvil y contraste >=4.5:1 de las combinaciones comprobadas de
texto principal/secundario, alertas, botones y burbujas de chat en ambos modos.
Esto no constituye una auditoría completa de accesibilidad. Vistas previas locales:
`.local/frontend-tema-oscuro.png`, `.local/frontend-tema-oscuro-movil.png` y
`.local/frontend-acceso-oscuro.png`. Los archivos no contienen datos reales.

## Comportamiento

- Una pantalla con fondo claro, texto oscuro, encabezado compacto y acentos verdes.
- Tarjetas con la última medición de cada dispositivo presente en el historial
  recuperado. No representan dispositivos fuera de ese conjunto. Se prefiere la
  fecha de medición más reciente; si falta, se conserva el orden recibido por ID.
- Temperatura y humedad destacadas, estado de bomba y fecha absoluta visibles.
  La etiqueta de alerta solo evalúa temperatura >30; no afirma salud general del
  cultivo ni conectividad del dispositivo. Un fallo al refrescar conserva los
  datos visibles y advierte que pueden estar desactualizados.
- Historial en tabla debajo, con desplazamiento horizontal interno en móvil.
- AgroBot junto a las lecturas en escritorio y debajo en móvil. Negritas y saltos
  de línea seguros; no se interpreta HTML recibido. Estado de consulta y recuperación
  de la pregunta si falla. No se añaden dependencias de Markdown.
- Reporte con botón bloqueado mientras espera y mensaje dentro de la página:
  preparación en memoria y aceptación por Resend siguen diferenciadas de entrega.
- Acceso con etiquetas y errores visibles, foco de teclado y tema claro coherente
  también cuando Windows tiene preferencia oscura. Nombre de pestaña y favicon propios.

## Compatibilidad

Se conservan Axios, `VITE_API_URL`, URL alternativa de Render, token local y rutas
`/api/login`, `/api/historial`, `/api/chatbot`, `/api/reporte`. El historial se consulta
cada cinco segundos sin solapar solicitudes; se cancela al salir. El frontend no
inserta ni modifica telemetría y no acepta destinatarios de correo.

Archivos: `frontend-react/src/App.jsx`, `frontend-react/src/App.css`,
`frontend-react/src/index.css`, `frontend-react/index.html` y
`frontend-react/public/favicon.svg`. No se modificó el backend ni el archivo de
entorno. El `package-lock.json` sin seguimiento de la raíz del repositorio se conserva
sin incluirlo en esta mejora; la app sigue estando en `frontend-react`.

## Validación local

- `npm run build` y `npm run lint` desde `frontend-react`.
- Chrome real sin ventana, API HTTP simulada y sin acceso de la aplicación a servicios
  externos: login correcto/incorrecto, agrupación de dispositivos, historial,
  temperatura alta, fechas, chat con negritas y HTML escapado, error de chat,
  reportes simulados preparados/aceptados, bloqueo de doble envío, fallo de refresco,
  recuperación, historial vacío y cierre de sesión.
- Escritorio de 1440 px y móvil de 390 px; sin desbordamiento de página, tabla
  desplazable y presentación clara aunque se prefiera tema oscuro.
- No se enviaron correos, consultó Gemini ni se accedió a Supabase en estas pruebas.

Evidencia local fuera de ambos repositorios: `.local/frontend-simple-validacion.json`,
`.local/frontend-simple-escritorio.png` y `.local/frontend-simple-movil.png`.
Las capturas usan datos ficticios y no son lecturas de producción. El verificador
reproducible está en `.local/validar-frontend-simple.cjs` del workspace.

Para revisar la app manualmente, ejecutar `npm run dev` desde `frontend-react`.
Ese arranque utiliza el `VITE_API_URL` local existente o Render si falta: los botones
de chat/reporte usan ese backend. No confundirlo con el verificador de API simulada.
La publicación de Vercel queda pendiente de revisión y autorización.
