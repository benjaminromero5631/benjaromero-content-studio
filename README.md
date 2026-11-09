# Benja Romero · Estudio de marca personal

Herramienta privada para revisar métricas de Instagram y convertir experiencias reales en hooks, guiones, grabaciones e historias. Incluye un radar de anuncios de IA con enlaces a fuentes primarias. La interfaz funciona en computador y teléfono.

## Uso

- La pantalla inicial es **Métricas**. Instagram sincroniza al abrir el estudio si la última sincronización tiene más de 3 horas; también se puede actualizar manualmente. La sincronización automática ocurre mientras el estudio está abierto o al volver a abrirlo.
- Hooks, guiones, ideas y métricas se guardan en un Blob privado de Vercel y se sirven públicamente desde la web para que cualquier dispositivo los pueda consultar sin clave. La base de marca y el contexto personal del generador solo se entregan a una sesión autorizada. La edición y la sincronización requieren `CONTENT_ACCESS_KEY`; cada navegador queda autorizado por 180 días. El estudio guarda también una copia local para que cargue rápido.
- **Contenido → Hooks** es la bandeja de revisión. Pide tus lotes directamente en la conversación con Codex; las propuestas se cargan aquí con pilar, audiencia, formato y estructura, y tú eliges cuáles desarrollar.
- Elegir un hook lo agrega a **Grabaciones**, donde puedes guardar un esquema, el texto hablado, un cierre opcional y el estado por grabar/grabado/publicado.
- **Historias** propone momentos cotidianos relacionados con los pilares. Guarda solo las ideas que reflejen lo que realmente estás viviendo.
- **Radar IA** reúne novedades públicas de fuentes oficiales al abrir la sección o actualizarla. Traduce solo los títulos al español con el endpoint público gratuito de Google Translate; el resumen y el enlace conservan el contenido original. La traducción puede fallar temporalmente y las fuentes no garantizan cobertura completa de todas las noticias.
- Cada propuesta conserva su pilar, audiencia, formato y estructura al pasar a Guionización. El estudio no muestra prompts ni necesita que copies e importes respuestas.
- Una publicación importada sin pilar queda como **Sin pilar** hasta que se clasifique. Los campos no devueltos por Instagram se muestran como “—”.
- Exporta un respaldo desde el menú izquierdo como copia adicional. No necesitas descargarlo para pasar tus datos a otro dispositivo.

## Datos y privacidad

Hooks, guiones, ideas e Insights son visibles para cualquiera que visite el estudio o consulte su endpoint público. La base de marca y el contexto interno de generación quedan excluidos de la respuesta pública y requieren sesión autorizada. No incluyas datos privados de clientes en los hooks o guiones públicos. La edición queda protegida por la clave del estudio y la copia del navegador queda en `localStorage`. El token de Instagram permanece en el Blob privado y solo lo leen las funciones del servidor; nunca se entrega a la página pública. El Radar IA solicita titulares públicos de OpenAI, Anthropic y Google cuando se actualiza.

El almacenamiento usa Vercel Blob privado. Configura `BLOB_READ_WRITE_TOKEN`, `CONTENT_ACCESS_KEY`, `SESSION_SECRET`, `IG_APP_ID`, `IG_APP_SECRET` y `SITE_URL` en los entornos de Vercel. No los publiques ni los pegues en el chat.

## Despliegue

Sitio estático con funciones Vercel bajo `api/`. No requiere paquetes ni comando de build. El directorio raíz del proyecto de Vercel es esta carpeta.

```sh
vercel --prod
```

Variables privadas requeridas para Meta: `IG_APP_ID`, `IG_APP_SECRET`, `SESSION_SECRET` y `SITE_URL`. No las pegues en el chat ni en archivos públicos.
