# CLAUDE.md — Benja Content Studio

## Propósito

Herramienta interna privada para crear, organizar y aprender de contenido corto de la marca personal de Benjamin Romero (@benjaromerozl). No es una web pública. Es un estudio para gestionar hooks, guiones, grabaciones y métricas de Instagram, con ciclo de aprendizaje basado en rendimiento.

## Arquitectura técnica

```
benjaromero-content-studio/
├── studio.html          # UI completa del estudio (SPA estática)
├── studio.js            # Toda la lógica del cliente: datos, generación de hooks, sincronización
├── styles.css           # Estilos
├── api/
│   ├── content-data.js      # GET/PUT datos principales (GitHub Contents API)
│   ├── content-auth.js      # Autenticación por clave de acceso + sesión
│   ├── content-store.js     # Helpers de lectura/escritura en GitHub
│   ├── ai-news.js           # Radar IA: obtiene titulares de OpenAI/Anthropic/Google
│   ├── ig-token.js          # Almacenamiento seguro del token de Instagram
│   ├── instagram-auth.js    # Inicio del flujo OAuth de Meta
│   ├── instagram-callback.js # Callback OAuth de Meta
│   ├── instagram-disconnect.js
│   ├── instagram-metrics.js # Sincronización de Reels e Insights
│   └── instagram-status.js  # Estado de la conexión con Instagram
├── lib/
│   ├── content-auth.js      # Sesión firmada con HMAC-SHA256
│   ├── content-store.js     # Helpers de lectura/escritura (GitHub Contents API)
│   └── ig-token.js          # Encriptación del token de Instagram
├── _data/
│   └── studio.json          # Datos del estudio (hooks, guiones, métricas)
├── vercel.json          # Configuración de rutas y funciones
└── manifest.json        # PWA manifest
```

**Despliegue:** Vercel. Sitio estático + funciones serverless bajo `api/`. Sin build step.
**Persistencia:** GitHub Contents API. Los datos viven en `_data/studio.json` del repositorio `benjaminromero5631/benjaromero-content-studio`. La lectura/escritura se hace con `GITHUB_TOKEN` en el servidor.
**Acceso:** Sesión autorizada por `CONTENT_ACCESS_KEY`, válida 180 días por navegador.

## Variables de entorno requeridas

```
GITHUB_TOKEN              # Token de GitHub con acceso de escritura al repo
CONTENT_ACCESS_KEY        # Clave de acceso al estudio
SESSION_SECRET            # Para firmar sesiones HMAC-SHA256
IG_APP_ID                 # Meta App ID para OAuth de Instagram
IG_APP_SECRET             # Meta App Secret
SITE_URL                  # URL del sitio desplegado
```

> ⚠️ `BLOB_READ_WRITE_TOKEN` ya no existe. El almacenamiento migró de Vercel Blob a GitHub Contents API. `lib/content-store.js` fue reescrito para usar `fetch()` con `GITHUB_TOKEN`.

## Identidad y contexto de marca

- **Persona:** Benjamin Romero, @benjaromerozl, chileno
- **Bio activa:** `building @connai.ai and my own life.`
- **Idioma del contenido:** español chileno
- **Voz:** 60% reflexiva, 40% directa. Cercana, humana, informal, sin tono de gurú ni promesas exageradas. Muestra dudas, errores, avances y aprendizajes reales.

## Negocio activo en el contenido: ConnAI

ConnAI es el único negocio que aparece en el contenido. Es un SaaS de agentes IA para atención al cliente (WhatsApp e Instagram). Nichos objetivo: veterinarias, peluquerías caninas, clínicas dentales, pymes locales.

Estado actual: sistema de cold email corriendo, landing page en construcción, prospección activa vía Google Maps.

**No mencionar Zeeltra ni Agenda Viva.** No inventar clientes, resultados, precios ni métricas.

## Sistema de formatos (organización principal)

El contenido se organiza por formato, no por pilares temáticos.

| Formato | Frecuencia | Descripción |
|---|---|---|
| **B-roll + voz en off** | ~4-5 piezas/semana (formato principal) | Escenas reales con narración. Hook que funciona sin cara en cámara. |
| **Talking head** | Máximo 2 veces al mes (~cada 15 días) | Cara a cámara, opinión directa. Solo para momentos que lo justifiquen: hito, opinión fuerte, decisión concreta. |
| **Green screen** | Ocasional | Solo para reaccionar a noticias o hitos de IA relevantes. Hook tipo noticia/reacción. |
| **Carrusel** | Formato de apoyo | Portada tipo lección o lista concreta relacionada con construir ConnAI. Complementa, no reemplaza el B-roll. |

**Regla del deporte:** El gym, BJJ y running son ESCENARIO VISUAL únicamente. El B-roll puede mostrar entrenamiento mientras la voz habla de negocio o proceso. El deporte NUNCA es el tema del hook. Benjamin no es coach fitness.

**Desarrollo personal** es la capa narrativa de la voz en off, no un tema central ni un pilar separado.

## Referencias de estilo y tono

Toto Artuso, Alejo Muñoz, Emilio Antún, Daniel Dalen, Pinilla de la IA, Martin Baumann.

**Marca de referencia a largo plazo:** Nike. Contenido que muestre rendimiento, identidad atlética y construcción desde cero. Energía aspiracional desde un proceso real, sin exagerar resultados.

## Cadencia y objetivos

- 5 piezas por semana en Instagram
- TikTok como segundo canal solo después de 4 semanas estables en Instagram
- **Objetivos a 3 meses (hasta ~febrero 2027):**
  - 20-30 conversaciones reales con negocios locales para ConnAI
  - 500-1.000 seguidores nuevos en Instagram
  - 12 semanas consecutivas publicando 5 piezas/semana

## Reglas de generación de hooks

- Los hooks NO tienen campo `pillar`. Estructura exacta: `{ id, format, hook, angle, hookCategory, status, createdAt }`
- `status` debe ser `'new'` para que aparezcan en la bandeja del estudio
- Rotar categorías: Curiosidad, Identificación, Promesa de valor, Pregunta directa, Giro inesperado. No repetir la misma categoría dos veces seguidas.
- Cada hook incluye `angle`: dirección específica para desarrollar el video
- No duplicar hooks. Verificar similitud textual antes de agregar.
- No mencionar Zeeltra, Agenda Viva, ni inventar clientes o métricas
- Desarrollo personal = voz en off, nunca el tema principal

## Carga de hooks en producción (vía API)

Para cargar o reemplazar hooks en producción, usar `fetch('/api/content-data', { method: 'PUT', ... })` desde el estudio autenticado (Chrome automation con `javascript_tool`). El endpoint usa `GITHUB_TOKEN` server-side y escribe en `_data/studio.json`.

**Flags de versión obligatorios al escribir `studio.json`:** Incluir siempre estos campos en el objeto raíz para evitar que `initLocal()` sobreescriba los hooks con seeds internos:

```json
{
  "_curatedIdeasVersion": 1,
  "_curatedVolumeVersion": 1,
  "_aiPillarRemoved": true,
  "_screenShareRemoved": true,
  "_performanceBatchVersion": 1,
  "_quotaVersion": 1,
  "_connaiBuildingPublicVersion": 1,
  "_currentBrandContextVersion": 1,
  "_guionShotVersion": 3,
  "_freshHookBatchVersion": 1,
  "_secondHookBatchVersion": 1,
  "_thirdHookBatchVersion": 1,
  "_fiftyPerPillarVersion": 1,
  "_performanceIntroVersion": 1
}
```

Sin estos flags, `replacePendingWithCuratedIdeas()` archiva todos los hooks con `status === 'new'` al iniciar el estudio.

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

- **Nunca sobrescribir ni eliminar datos de usuario sin confirmación explícita.**
- **No modificar `studio.js` sin leer el archivo completo primero.** Tiene inicialización encadenada con `_versionFlag` que controlan migraciones de datos.
- Los endpoints en `api/` leen y escriben GitHub (no Vercel Blob). No asumir que `_data/studio.json` está vacío.
- No hardcodear valores de las variables de entorno.
- El token de Instagram vive solo en el servidor (`api/ig-token.js`); nunca enviarlo a la página pública.
- Para escribir en producción cuando `gh` CLI no tiene acceso de escritura: usar Chrome automation (`javascript_tool`) para llamar `fetch('/api/content-data', { method: 'PUT', ... })` desde el estudio autenticado.
- No usar `seed-hooks-v4.js` ni scripts similares; están obsoletos. La carga de datos se hace vía API.
- Antes de confirmar cualquier cambio que afecte datos del usuario, pedir confirmación explícita.
