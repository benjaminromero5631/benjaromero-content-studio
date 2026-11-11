# CLAUDE.md — Benja Content Studio

## Propósito

Herramienta interna privada para crear, organizar y aprender de contenido corto de la marca personal de Benjamin Romero (@benjaromerozl). No es una web pública. Es un estudio para gestionar hooks, guiones, grabaciones, historias y métricas de Instagram, con ciclo de aprendizaje basado en rendimiento.

## Arquitectura técnica

```
benjaromero-content-studio/
├── studio.html          # UI completa del estudio (SPA estática)
├── studio.js            # Toda la lógica del cliente: datos, generación de hooks, sincronización
├── styles.css           # Estilos
├── api/
│   ├── content-data.js      # GET/PUT datos principales (Vercel Blob)
│   ├── content-auth.js      # Autenticación por clave de acceso + sesión
│   ├── content-store.js     # Helpers de almacenamiento en Blob
│   ├── ai-news.js           # Radar IA: obtiene titulares de OpenAI/Anthropic/Google
│   ├── ig-token.js          # Almacenamiento seguro del token de Instagram
│   ├── instagram-auth.js    # Inicio del flujo OAuth de Meta
│   ├── instagram-callback.js # Callback OAuth de Meta
│   ├── instagram-disconnect.js
│   ├── instagram-metrics.js # Sincronización de Reels e Insights
│   └── instagram-status.js  # Estado de la conexión con Instagram
├── lib/
│   ├── content-auth.js      # Sesión firmada con HMAC-SHA256
│   ├── content-store.js     # Helpers de lectura/escritura en Vercel Blob
│   └── ig-token.js          # Encriptación del token de Instagram
├── vercel.json          # Configuración de rutas y funciones
└── manifest.json        # PWA manifest
```

**Despliegue:** Vercel. Sitio estático + funciones serverless bajo `api/`. Sin build step.
**Persistencia:** Vercel Blob (privado). Los datos se sincronizan entre dispositivos autorizados.
**Acceso:** Sesión autorizada por `CONTENT_ACCESS_KEY`, válida 180 días por navegador. Los datos públicos (hooks, guiones) son legibles sin clave; la base de marca y el contexto de generación requieren sesión.

## Variables de entorno requeridas

```
BLOB_READ_WRITE_TOKEN
CONTENT_ACCESS_KEY
SESSION_SECRET
IG_APP_ID
IG_APP_SECRET
SITE_URL
```

## Estrategia de contenido actualizada

### Tres formatos activos (organización principal)

Los hooks y el contenido se organizan exclusivamente por formato de video. No hay pilares ni categorías temáticas — el formato define la vista, la planificación y la generación.

| Formato | Descripción | Uso |
|---|---|---|
| **Talking head** | Cámara fija, habla directa a cámara | Opiniones, lecciones, decisiones, aprendizajes |
| **B-roll + voz en off** | Escenas reales con narración | Documentación del proceso, deporte, día a día |
| **Green screen** | Fondo con datos/pantalla/diagrama | Contenido de alcance, datos, procesos visuales |

### Temas que atraviesan todos los formatos

El contenido gira en torno a dos ejes temáticos que pueden aparecer en cualquier formato:

1. **ConnAI / negocio** — Building in public: agentes de IA para atención al cliente (WhatsApp e Instagram). Clientes objetivo: veterinarias, peluquerías caninas, clínicas dentales, pymes locales.
2. **Deporte y proceso** — BJJ, running, gimnasio. El deporte es contexto visual y motor de reflexión, no el tema central.

**Desarrollo personal** es la capa narrativa que lo atraviesa todo: la mentalidad, la presión, las dudas y el proceso de construir una vida propia. Nunca aparece como tema independiente; siempre se integra en la voz.

### Marca de referencia a largo plazo

**Nike** es el horizonte de marca. Contenido que muestre rendimiento, identidad atlética y construcción desde cero, con la misma energía aspiracional pero desde un proceso real y sin exagerar resultados. Modelo de referencia en video: Toto Ortuzo / Emilio Antún.

### Cadencia semanal

5 piezas por semana, distribuidas entre los tres formatos activos.

## Objetivos a 3 meses (hasta ~febrero 2027)

- 20-30 conversaciones reales con negocios locales para ConnAI (DMs a veterinarias, peluquerías caninas, clínicas dentales)
- 500-1.000 seguidores nuevos en Instagram
- Constancia de 5 piezas por semana durante 12 semanas consecutivas

## Reglas de generación vigentes

- No mencionar Zeeltra ni Agenda Viva.
- El único negocio activo en el contenido es ConnAI.
- No inventar clientes, resultados, precios ni métricas.
- Los hooks NO tienen campo `pillar`. Solo tienen: `id`, `format`, `hook`, `angle`, `hookCategory`, `status`, `createdAt`.
- Rotar categorías de hooks: Curiosidad, Identificación, Promesa de valor, Pregunta directa, Giro inesperado. No repetir la misma categoría dos veces seguidas.
- Cada hook debe incluir una dirección específica (`angle`) para desarrollar el video.
- No duplicar hooks. Verificar similitud textual antes de agregar.
- Desarrollo personal es voz en off, no tema central.
- No exponer datos privados de clientes.
- Las hipótesis de rendimiento son señales, no certezas.

## Flujo editorial

1. **Hooks** — bandeja de revisión, agrupados por formato de video
2. **Guionización** — hook aprobado pasa a guion; debe indicar formato
3. **Para grabar** — filtrable por formato; Green screen tiene checklist de fondo
4. **Grabado**
5. **Publicación** en Instagram
6. **Sincronización de métricas** — Instagram es la fuente principal
7. **Vinculación Reel-guion** — por similitud textual, fecha y formato
8. **Clasificación de rendimiento** — ganador / prometedor / normal / bajo rendimiento
9. **Contenido ganador** — marcar, guardar hipótesis, generar variaciones
10. **Replicación** — conservar ángulo o estructura, cambiar hook o contexto

## Reglas para Claude en este proyecto

- Nunca sobrescribir ni eliminar datos de usuario sin confirmación explícita.
- No modificar `studio.js` sin leer el archivo completo primero: tiene inicialización encadenada con versiones (`_versionFlag`) que controlan migraciones de datos.
- Los endpoints en `api/` leen y escriben Vercel Blob. No asumir que el Blob está vacío.
- No hardcodear valores de las variables de entorno.
- El token de Instagram vive solo en el servidor (`api/ig-token.js`); nunca enviarlo a la página pública.
- Antes de agregar hooks en `studio.js`, verificar si ya existe una función seed/batch para ese formato.
- El script `seed-hooks-v4.js` reemplaza TODOS los hooks en Vercel Blob. Requiere `.env.local` con `BLOB_READ_WRITE_TOKEN`. Correr solo con `vercel link` y `vercel env pull .env.local` previos.
