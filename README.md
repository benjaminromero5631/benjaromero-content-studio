# Benja Romero · Content Studio

Herramienta interna de guionización y métricas para la marca personal de Benja Romero. El contenido abarca emprendimiento y negocios, desarrollo personal, IA aplicada y automatización/sistemas. La construcción del SaaS es una serie dentro de la marca, no el eje único. Hecho con HTML, CSS y JavaScript nativos. No usa paquetes, base de datos ni APIs de IA de pago.

## Cómo funciona

- `/` redirige directamente al estudio interno (`/studio`). No hay una página pública de marca personal.
- El estudio tiene cuatro áreas: **Métricas**, **Guiones**, **Inspiración** e **Historias**. Guarda contenido y métricas en el navegador actual, cifrados con la clave local que se crea al abrirlo. Exporta un respaldo regularmente; cambiar de navegador o borrar los datos del sitio no traslada el contenido.
- `private-seed.json` tiene la base inicial de historias. Se excluye del repositorio y del despliegue para no publicar ideas, notas ni información de revisión. Importa este archivo una vez desde **Importar base / respaldo** dentro del estudio.
- Las métricas manuales funcionan sin conectar Instagram. El panel compara por plataforma, pilar, objetivo y periodo: alcance, vistas, seguimiento atribuido, visitas al perfil, comentarios, compartidos, guardados, retención media y consultas cuando aplican. Cada pieza lleva un objetivo (conexión, descubrimiento, aprendizaje o consulta) para leerla con contexto.
- El conector oficial de Instagram está preparado. Requiere una app de Meta gratuita y autorización de la cuenta. Los tokens se cifran en una cookie HttpOnly; las credenciales de la app van solo en variables privadas de Vercel.
- Las métricas automáticas disponibles dependen de los permisos y de lo que Instagram devuelva por Reel. La medición manual queda como respaldo.

## Flujo de contenido con el asistente

En **Inspiración**, elige cuántos videos quieres y el pilar o mezcla, prepara el pedido y pégalo en el chat del asistente. Incluye las historias registradas que no están marcadas para revisión, y pide guiones para hablar a cámara con tres ganchos alternativos. Pega el JSON recibido en **Guiones** y elige **Cargar piezas al Estudio**. Los pilares incluyen emprendimiento, desarrollo personal, IA aplicada y automatización; el SaaS es una serie opcional. En **Historias** puedes guardar momentos reales y copiar formatos para Stories. Revisa los hechos antes de grabar. Este flujo no publica videos ni llama a una API de IA.

El contenido no se sincroniza entre dispositivos ni se almacena en el servidor. El banco privado de historias se importa desde tu archivo local de respaldo/base de conocimiento.

## Despliegue de la herramienta interna en Vercel

Este es un sitio estático con funciones bajo `api/`. No requiere comando de build ni dependencias externas. El proyecto de Vercel debe usar esta carpeta como raíz.

Para desplegar desde terminal:

```sh
vercel --prod
```

Vercel crea un dominio `vercel.app` gratuito. La URL aloja la herramienta; no hay una web de presentación pública. El contenido privado permanece cifrado en el navegador y el banco de historias no se despliega.

## Conectar Instagram más adelante

1. En Meta for Developers, crea una app y configura el caso de uso **Instagram API with Instagram Login**.
2. Agrega como URL de redirección OAuth válida: `https://TU-DOMINIO.vercel.app/api/instagram-callback`.
3. En Vercel, configura estas variables para Production:
   - `IG_APP_ID`: identificador de la app de Meta.
   - `IG_APP_SECRET`: secreto de la app de Meta.
   - `SESSION_SECRET`: secreto aleatorio largo para cifrar la cookie del token.
   - `SITE_URL`: dominio completo del sitio, sin `/` al final.
4. Vuelve a desplegar y autoriza la cuenta desde el Estudio.

No pegues contraseñas, tokens ni secretos en el chat ni dentro de archivos públicos. El endpoint usa la versión `v26.0` de Graph API (vigente al preparar este proyecto, 11-oct-2026); puede actualizarse en `api/instagram-callback.js` y `api/instagram-metrics.js` si Meta cambia versiones.

## Límites actuales

- La app de Meta aún no está creada ni autorizada; por eso la sincronización automática no se puede activar todavía.
- El panel es de uso personal por navegador, no un producto multiusuario con base en la nube. La lista de ideas y guiones requiere que prepares el pedido en el chat y luego importes la respuesta; no hay una conexión automática de escritura desde ChatGPT.
- Revisa cada 15 días y compara piezas a una edad similar desde su publicación. Compara tus propios resultados por objetivo y pilar; no existe una tasa universal que garantice viralidad. Usa seguidores/alcance y visitas al perfil para crecimiento, tiempo medio visto/duración para retención, comentarios/compartidos/guardados sobre alcance para conexión y consultas solo en videos cuyo objetivo sea comercial.
- Las historias de la base privada contienen pendientes y necesitan tu revisión antes de guionizar/publicar.
