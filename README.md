# Benja Romero · Content Studio

Herramienta interna de guionización y métricas para la marca personal de Benja Romero. Hecho con HTML, CSS y JavaScript nativos. No usa paquetes, base de datos ni APIs de IA de pago.

## Cómo funciona

- `/` redirige directamente al estudio interno (`/studio`). No hay una página pública de marca personal.
- El estudio guarda historias, guiones, publicación y métricas en el navegador actual. Los datos se cifran con la clave local que se crea al abrirlo. Exporta un respaldo regularmente; cambiar de navegador o borrar los datos del sitio no traslada el contenido.
- `private-seed.json` tiene la base inicial de historias. Se excluye del repositorio y del despliegue para no publicar ideas, notas ni información de revisión. Importa este archivo una vez desde **Importar base / respaldo** dentro del estudio.
- Las métricas manuales funcionan sin conectar Instagram. El panel calcula interacciones/alcance, tasa de guardados, tasa de compartidos y tiempo promedio visto respecto de la duración.
- El conector oficial de Instagram está preparado. Requiere una app de Meta gratuita y autorización de la cuenta. Los tokens se cifran en una cookie HttpOnly; las credenciales de la app van solo en variables privadas de Vercel.
- Las métricas automáticas disponibles dependen de los permisos y de lo que Instagram devuelva por Reel. La medición manual queda como respaldo.

## Flujo de contenido con el asistente

Pídele al asistente, por ejemplo: **“Genera 4 contenidos del pilar Emprendimiento y negocios para la etapa activa, usando solo hechos confirmados, y prepáralos para el Estudio.”** El asistente debe respetar la etapa abierta, no inventar datos, marcar afirmaciones por confirmar y respetar que Benja define el CTA. Luego carga el paquete JSON en la vista Guiones. La carga crea borradores de producción en el almacenamiento cifrado de este navegador; no publica videos en Instagram.

El contenido no se sincroniza entre dispositivos ni se almacena en el servidor. El banco privado de historias tampoco se despliega.

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
- El panel es de uso personal por navegador, no un producto multiusuario con base en la nube.
- Las métricas comparan tus resultados entre sí. No predicen ni garantizan viralidad.
- Las historias de la base privada contienen pendientes y necesitan tu revisión antes de guionizar/publicar.
