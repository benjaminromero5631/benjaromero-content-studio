require('dotenv').config({path: '.env.local'});
const {DATA_PATH, readJson, writeJson} = require('./lib/content-store');

const HOOKS = [
  // ===== TALKING HEAD (30) =====
  {id:'h-th-01',format:'Talking head',hook:'Llevo meses construyendo ConnAI y esto es lo que nadie te dice sobre vender IA a negocios locales.',angle:'Desde adentro: fricciones reales de vender tecnología que la gente no entiende todavía.',hookCategory:'Identificación'},
  {id:'h-th-02',format:'Talking head',hook:'Por qué creo que la atención al cliente es el problema más ignorado de los negocios locales en Chile.',angle:'Opinión directa con evidencia de tus visitas comerciales.',hookCategory:'Opinión'},
  {id:'h-th-03',format:'Talking head',hook:'Me dijeron que si quería crecer en el negocio tenía que sacrificar el entreno. Les dije que no.',angle:'Tu postura sobre integrar deporte y negocio — no como consejo, como decisión personal.',hookCategory:'Identificación'},
  {id:'h-th-04',format:'Talking head',hook:'Aprendí más del mercado hablando con cinco negocios que leyendo diez artículos.',angle:'La diferencia entre teoría y conversaciones reales con clientes potenciales.',hookCategory:'Lección'},
  {id:'h-th-05',format:'Talking head',hook:'Por qué creo que el deporte es la mejor inversión que hago mientras construyo un negocio.',angle:'Conexión mente-rendimiento: no como fitness, como herramienta de trabajo.',hookCategory:'Opinión'},
  {id:'h-th-06',format:'Talking head',hook:'Por qué decidí documentar mi proceso aunque no tenga un antes y después impresionante.',angle:'La decisión de construir en público sin esperar resultados espectaculares.',hookCategory:'Identificación'},
  {id:'h-th-07',format:'Talking head',hook:'Equivocarte no significa que no sirves para emprender.',angle:'Lección aprendida de errores propios en ConnAI o en negocios anteriores.',hookCategory:'Lección'},
  {id:'h-th-08',format:'Talking head',hook:'Si estás en tus 20s y te sientes atrasado, quédate que este video es para ti.',angle:'Comparación social y por qué el timing del emprendimiento no existe.',hookCategory:'Identificación'},
  {id:'h-th-09',format:'Talking head',hook:'Pensé que tener la app era lo más difícil. Ahora viene la parte de vender.',angle:'El giro real de constructor a comercial — honesto, sin romantizar.',hookCategory:'Giro inesperado'},
  {id:'h-th-10',format:'Talking head',hook:'Estudiar, trabajar y emprender me obligó a mirar dónde se me va el tiempo.',angle:'Gestión real del tiempo sin vender ningún método, solo tu experiencia.',hookCategory:'Lección'},
  {id:'h-th-11',format:'Talking head',hook:'Estoy aprendiendo que construir un negocio no se trata de hacerlo perfecto.',angle:'El progreso sobre la perfección — desde tu proceso real con ConnAI.',hookCategory:'Lección'},
  {id:'h-th-12',format:'Talking head',hook:'La mejor habilidad que puedes tener en los negocios no es IA ni programar.',angle:'Tu respuesta: escuchar al mercado antes de construir.',hookCategory:'Opinión'},
  {id:'h-th-13',format:'Talking head',hook:'Tener mil ideas no sirve mucho si no eliges cuál vas a probar primero.',angle:'El problema del founder paralizado por opciones — lo viviste.',hookCategory:'Lección'},
  {id:'h-th-14',format:'Talking head',hook:'Compararte con alguien que lleva años puede hacerte olvidar que tú recién estás empezando.',angle:'El peligro de comparar etapas distintas del proceso.',hookCategory:'Identificación'},
  {id:'h-th-15',format:'Talking head',hook:'Me cuesta aceptar que cambiar de opinión también puede ser madurar.',angle:'Reflexión honesta sobre pivotar ideas o decisiones que antes defendías.',hookCategory:'Vulnerabilidad'},
  {id:'h-th-16',format:'Talking head',hook:'Si le pides a la IA que haga todo, quizá ni siquiera sabes qué es lo que quieres tú.',angle:'El límite de delegar el pensamiento a herramientas.',hookCategory:'Opinión'},
  {id:'h-th-17',format:'Talking head',hook:'Soñar en grande está bien, pero también te genera presión que a veces te paraliza.',angle:'La tensión entre visión ambiciosa y ejecución del día a día.',hookCategory:'Vulnerabilidad'},
  {id:'h-th-18',format:'Talking head',hook:'Una idea de negocio puede emocionarte mucho pero eso no significa que le va a servir a alguien.',angle:'Validación antes de construir — lo que aprendiste haciendo ConnAI.',hookCategory:'Lección'},
  {id:'h-th-19',format:'Talking head',hook:'La pregunta más difícil de construir un negocio no es qué función agregar, sino quién la necesita.',angle:'Customer discovery vs. feature development — tu experiencia real.',hookCategory:'Lección'},
  {id:'h-th-20',format:'Talking head',hook:'Si estás intentando construir una app con IA, escucha esto primero.',angle:'Consejo directo desde tu experiencia — sin suavizar las partes difíciles.',hookCategory:'Lección'},
  {id:'h-th-21',format:'Talking head',hook:'Me endeudé a los 18 por crear un negocio. Ojalá me hubieran dicho esto antes de lanzarme.',angle:'Historia real de riesgo temprano — qué cambiarías, qué no.',hookCategory:'Historia personal'},
  {id:'h-th-22',format:'Talking head',hook:'Quiero que otros jóvenes vean que pueden empezar a construir algo antes de sentirse listos.',angle:'Tu propósito de marca — por qué documentas el proceso.',hookCategory:'Propósito'},
  {id:'h-th-23',format:'Talking head',hook:'Construir con IA sin entender qué apruebas puede cagarle todo el negocio a un cliente.',angle:'El riesgo real de implementar sin supervisión — honesto y sin filtro.',hookCategory:'Advertencia'},
  {id:'h-th-24',format:'Talking head',hook:'Si empezara de nuevo un negocio digital, daría todo gratis los primeros meses.',angle:'Tu visión sobre adquisición de primeros clientes — lo que harías diferente.',hookCategory:'Lección'},
  {id:'h-th-25',format:'Talking head',hook:'El trabajo que más mueve un negocio a veces no se ve en una pantalla.',angle:'Conversaciones, visitas, seguimientos — el trabajo invisible del founder.',hookCategory:'Lección'},
  {id:'h-th-26',format:'Talking head',hook:'Antes de automatizar una tarea, necesito entender qué problema repetido estoy resolviendo.',angle:'Tu proceso de pensar antes de construir — aplicado a ConnAI.',hookCategory:'Proceso'},
  {id:'h-th-27',format:'Talking head',hook:'Una cotización no termina cuando la envías. Ahí empieza la venta real.',angle:'El follow-up como parte de la venta — lo aprendiste en campo.',hookCategory:'Lección'},
  {id:'h-th-28',format:'Talking head',hook:'Por qué creo que los 20s son el mejor momento para fallar y no el peor.',angle:'Reencuadrar el fracaso como ventaja de la edad.',hookCategory:'Opinión'},
  {id:'h-th-29',format:'Talking head',hook:'Deja de querer demostrarle algo al mundo. Empieza a construir algo que resuelva un problema real.',angle:'El ego vs. el mercado — una lección que te costó aprender.',hookCategory:'Lección'},
  {id:'h-th-30',format:'Talking head',hook:'Por qué los negocios locales están perdiendo clientes sin saberlo y nadie les dice nada.',angle:'El silencio del mercado sobre mensajes sin responder — tu diagnóstico.',hookCategory:'Opinión'},

  // ===== B-ROLL + VOZ EN OFF (30) =====
  {id:'h-br-01',format:'B-roll + voz en off',hook:'Así se ve construir un SaaS desde cero cuando estudias, trabajas y no tienes equipo.',angle:'B-roll de tu setup real: laptop, cuadernos, café. Narra el día sin romantizarlo.',hookCategory:'Documentación'},
  {id:'h-br-02',format:'B-roll + voz en off',hook:'Entrené tres veces esta semana mientras armaba el backend de ConnAI. Así se ve realmente.',angle:'B-roll del gym + setup de trabajo. Narra la integración, no el sacrificio.',hookCategory:'Documentación'},
  {id:'h-br-03',format:'B-roll + voz en off',hook:'No entreno para verme bien. Entreno para pensar mejor.',angle:'B-roll post-entreno: en la calle, vestuario, caminando de vuelta. Narra la claridad mental.',hookCategory:'Propósito'},
  {id:'h-br-04',format:'B-roll + voz en off',hook:'Había una semana que no corría. Lo noté en el trabajo, no en el físico.',angle:'B-roll de retomar el running. Narra el impacto en foco y energía para el negocio.',hookCategory:'Lección'},
  {id:'h-br-05',format:'B-roll + voz en off',hook:'Estoy entrenando jiu jitsu todos los días. Y lo que me enseña no es solo físico.',angle:'B-roll de la clase o llegando al dojo. Narra la mentalidad que se traslada al negocio.',hookCategory:'Lección'},
  {id:'h-br-06',format:'B-roll + voz en off',hook:'Este soy yo volviendo al running después de un tiempo sin correr.',angle:'B-roll del trayecto. Narra la decisión de retomar — sin drama, honesto.',hookCategory:'Documentación'},
  {id:'h-br-07',format:'B-roll + voz en off',hook:'No todos los días son productivos, pero este fue mi día estudiando, entrenando y trabajando.',angle:'B-roll del día completo en 30 segundos. Narra sin filtrar los momentos difíciles.',hookCategory:'Documentación'},
  {id:'h-br-08',format:'B-roll + voz en off',hook:'Fui a hablar con cinco negocios esta semana. Todos tenían el mismo problema y ninguno lo nombraba.',angle:'B-roll desde tu auto o caminando antes de las visitas. Narra el patrón encontrado.',hookCategory:'Lección'},
  {id:'h-br-09',format:'B-roll + voz en off',hook:'Fui a correr sin auriculares. Lo que pensé esos 30 minutos cambió algo.',angle:'B-roll del trayecto en silencio. Narra el insight que tuviste — sobre ConnAI o sobre ti.',hookCategory:'Reflexión'},
  {id:'h-br-10',format:'B-roll + voz en off',hook:'Así fue el primer mes de ConnAI: lo que salió bien, lo que salió mal y lo que cambiaría.',angle:'B-roll de tu pantalla con métricas o notas reales. Narra honesto — no un case study perfecto.',hookCategory:'Documentación'},
  {id:'h-br-11',format:'B-roll + voz en off',hook:'Tengo 22 años y estoy intentando construir una vida que me guste vivir, no que me angustie.',angle:'B-roll de tu rutina diaria real. Narra el contraste entre lo que construyes y lo que sientes.',hookCategory:'Vulnerabilidad'},
  {id:'h-br-12',format:'B-roll + voz en off',hook:'Estoy construyendo un software para digitalizar a los emprendedores locales de Chile. Así se ve eso.',angle:'B-roll de n8n, tu pantalla, o reuniones con clientes. Narra el proceso real.',hookCategory:'Documentación'},
  {id:'h-br-13',format:'B-roll + voz en off',hook:'Mi rutina de gym no es complicada. No necesita serlo para funcionar.',angle:'B-roll de los ejercicios básicos. Narra que la simplicidad es intencional, no falta de conocimiento.',hookCategory:'Proceso'},
  {id:'h-br-14',format:'B-roll + voz en off',hook:'No soy atleta. Pero me trato como si lo fuera, y eso lo cambia todo.',angle:'B-roll del entreno más mundano. Narra que la identidad importa más que el nivel.',hookCategory:'Mentalidad'},
  {id:'h-br-15',format:'B-roll + voz en off',hook:'Llevo semanas con la misma rutina: estudio, entreno, trabajo en ConnAI. Así se ve el proceso.',angle:'B-roll de los tres momentos del día. Narra la consistencia sin romanticismo.',hookCategory:'Documentación'},
  {id:'h-br-16',format:'B-roll + voz en off',hook:'A veces avanzar un poco en un día difícil vale más que esperar el día perfecto.',angle:'B-roll de un día normal, sin energía especial. Narra desde la honestidad.',hookCategory:'Mentalidad'},
  {id:'h-br-17',format:'B-roll + voz en off',hook:'Fui a correr y en ese rato resolví algo que llevaba días dando vueltas en mi cabeza.',angle:'B-roll del trayecto. Narra el problema de ConnAI que resolviste en movimiento.',hookCategory:'Reflexión'},
  {id:'h-br-18',format:'B-roll + voz en off',hook:'Así empieza mi mañana antes de sentarme a trabajar en ConnAI.',angle:'B-roll de la rutina matutina. Narra sin vender ningún hábito — solo mostrando tu proceso.',hookCategory:'Documentación'},
  {id:'h-br-19',format:'B-roll + voz en off',hook:'No siempre tengo energía. Pero me presento igual. Y eso es lo que hace la diferencia.',angle:'B-roll de un entreno o día de trabajo sin momentum. Narra la consistencia sobre la motivación.',hookCategory:'Mentalidad'},
  {id:'h-br-20',format:'B-roll + voz en off',hook:'Estoy en DuocUC estudiando marketing y al mismo tiempo construyendo lo que quiero vender.',angle:'B-roll de la sala de clases o estudiando. Narra la dualidad sin quejas — es parte del proceso.',hookCategory:'Documentación'},
  {id:'h-br-21',format:'B-roll + voz en off',hook:'Grabé este video después de un entrenamiento porque necesitaba decir esto en voz alta.',angle:'B-roll post-gym, sudado, auténtico. Narra la reflexión que necesitabas procesar.',hookCategory:'Vulnerabilidad'},
  {id:'h-br-22',format:'B-roll + voz en off',hook:'El deporte me ayuda a mantener la cabeza clara cuando el negocio se pone difícil.',angle:'B-roll del entreno en un período de estrés con ConnAI. Narra el rol del movimiento.',hookCategory:'Lección'},
  {id:'h-br-23',format:'B-roll + voz en off',hook:'Así empezó mi semana: gym a las 8, clases a las 10, ConnAI en las tardes.',angle:'B-roll de los tres momentos del lunes. Narra sin exagerar — solo mostrando tu realidad.',hookCategory:'Documentación'},
  {id:'h-br-24',format:'B-roll + voz en off',hook:'Salí a correr sin saber adónde iba. Volví sabiendo qué tenía que hacer.',angle:'B-roll del trayecto. Narra la claridad que llegó sola cuando dejaste de forzarla.',hookCategory:'Reflexión'},
  {id:'h-br-25',format:'B-roll + voz en off',hook:'Llevo meses documentando este proceso. No porque sea perfecto, sino porque es real.',angle:'B-roll de tus herramientas de trabajo. Narra el propósito detrás de construir en público.',hookCategory:'Propósito'},
  {id:'h-br-26',format:'B-roll + voz en off',hook:'Me cuesta mantener el ritmo algunos días. Encontré que el movimiento físico lo resetea todo.',angle:'B-roll de salir a entrenar después de un día difícil. Narra sin sermón — solo tu experiencia.',hookCategory:'Vulnerabilidad'},
  {id:'h-br-27',format:'B-roll + voz en off',hook:'Un negocio que no responde mensajes a tiempo pierde clientes sin enterarse. Lo vi esta semana.',angle:'B-roll desde tu auto o caminando después de una visita. Narra el hallazgo sin nombrar el cliente.',hookCategory:'Lección'},
  {id:'h-br-28',format:'B-roll + voz en off',hook:'Construir algo solo no es romántico. Pero a veces en el gym encuentro la claridad que necesito.',angle:'B-roll del gym o running. Narra la soledad del proceso sin victimizarte.',hookCategory:'Vulnerabilidad'},
  {id:'h-br-29',format:'B-roll + voz en off',hook:'Este es mi físico inicial para construir mi mejor versión. No estoy donde quiero, pero estoy empezando.',angle:'B-roll del primer día o semana de entrenamiento documentado. Honesto, sin filtros.',hookCategory:'Documentación'},
  {id:'h-br-30',format:'B-roll + voz en off',hook:'Esto es lo que hago cuando el negocio me genera ansiedad: salgo a moverme.',angle:'B-roll de salir a correr o ir al gym en un momento de presión. Narra sin romantizar.',hookCategory:'Proceso'},

  // ===== GREEN SCREEN (30) =====
  {id:'h-gs-01',format:'Green screen',hook:'El descanso también es entrenamiento. No porque lo diga un coach, sino por esto.',angle:'Fondo: datos de recuperación o calendario de entrenos. Evidencia visual de la ciencia detrás.',hookCategory:'Dato'},
  {id:'h-gs-02',format:'Green screen',hook:'¿Cuántas consultas pierde un negocio local en un fin de semana sin atención activa?',angle:'Fondo: cálculo simple en pantalla — mensajes × tasa de conversión × días sin respuesta.',hookCategory:'Dato'},
  {id:'h-gs-03',format:'Green screen',hook:'Lo que un agente de IA necesita saber antes de poder responder bien por un negocio.',angle:'Fondo: lista o esquema de los requisitos mínimos de contexto para un agente.',hookCategory:'Proceso'},
  {id:'h-gs-04',format:'Green screen',hook:'Por qué los negocios locales están perdiendo clientes en los primeros 10 minutos de espera.',angle:'Fondo: estadística o gráfico sobre tiempo de respuesta y tasa de abandono de clientes.',hookCategory:'Dato'},
  {id:'h-gs-05',format:'Green screen',hook:'Un negocio me mandó este screenshot. Llevaba 3 días sin responder a un cliente.',angle:'Fondo: conversación real o simulada de WhatsApp con mensajes sin leer acumulados.',hookCategory:'Evidencia'},
  {id:'h-gs-06',format:'Green screen',hook:'¿Cuántas ventas pierde un negocio que no responde WhatsApp fuera de horario?',angle:'Fondo: cálculo en pantalla — X mensajes por semana × porcentaje que son consultas × precio promedio.',hookCategory:'Dato'},
  {id:'h-gs-07',format:'Green screen',hook:'Así se ve mi semana cuando combino estudio, trabajo, negocio y entreno. No es perfecta.',angle:'Fondo: tu Google Calendar o planificador semanal real, sin editarlo.',hookCategory:'Documentación'},
  {id:'h-gs-08',format:'Green screen',hook:'Llevo semanas entrenando consecutivo. Así se ve la racha en números.',angle:'Fondo: tu registro real de entrenos — app, hoja de cálculo, lo que uses. Sin editar.',hookCategory:'Evidencia'},
  {id:'h-gs-09',format:'Green screen',hook:'Este mensaje llegó a las 11 PM. Ningún empleado disponible. Esto es lo que pasó.',angle:'Fondo: captura de WhatsApp con horario nocturno visible. Narra qué hubiera cambiado ConnAI.',hookCategory:'Evidencia'},
  {id:'h-gs-10',format:'Green screen',hook:'Los 2 errores más comunes cuando creas un negocio digital desde cero.',angle:'Fondo: lista simple de los 2 errores con ejemplos reales tuyos.',hookCategory:'Lección'},
  {id:'h-gs-11',format:'Green screen',hook:'Esto es lo que nadie te cuenta sobre crear un negocio digital y la gente lo romantiza.',angle:'Fondo: lista de las realidades no romantizadas — tiempo, dinero, rechazo.',hookCategory:'Desmitificación'},
  {id:'h-gs-12',format:'Green screen',hook:'Lo difícil que es salir de tu zona de confort. Y sobre todo en tus 20s.',angle:'Fondo: datos o gráfico sobre la brecha entre intención y acción en jóvenes emprendedores.',hookCategory:'Dato'},
  {id:'h-gs-13',format:'Green screen',hook:'Te daré 3 razones de por qué todas las empresas están incorporando IA ahora mismo.',angle:'Fondo: lista con las 3 razones y un ejemplo real por cada una.',hookCategory:'Lección'},
  {id:'h-gs-14',format:'Green screen',hook:'La presión de estar siempre avanzando. Qué te hace y cómo la estoy manejando.',angle:'Fondo: tu pantalla con tareas pendientes o métricas — lo que genera la presión.',hookCategory:'Vulnerabilidad'},
  {id:'h-gs-15',format:'Green screen',hook:'Mi método para revisar una idea de negocio: quién tiene el problema, cómo lo resuelve hoy y qué le cuesta.',angle:'Fondo: framework de 3 preguntas en pantalla. Muéstralo aplicado a ConnAI.',hookCategory:'Proceso'},
  {id:'h-gs-16',format:'Green screen',hook:'Antes de llenar tu día de tareas, elige una que te haría sentir que avanzaste.',angle:'Fondo: tu lista de tareas real o método de priorización. Una tarea marcada.',hookCategory:'Proceso'},
  {id:'h-gs-17',format:'Green screen',hook:'Oportunidad de negocio que veo en el mercado chileno y por qué nadie lo está resolviendo bien todavía.',angle:'Fondo: datos del mercado o problema específico que identificaste visitando negocios.',hookCategory:'Oportunidad'},
  {id:'h-gs-18',format:'Green screen',hook:'Si recién estás aprendiendo IA, esto es lo primero que deberías entender.',angle:'Fondo: diagrama simple de cómo funciona un LLM o agente — sin tecnicismos.',hookCategory:'Educación'},
  {id:'h-gs-19',format:'Green screen',hook:'Mi guía para tomar una decisión importante: qué sé, qué no sé y cuál es el paso más chico.',angle:'Fondo: framework de 3 columnas en pantalla aplicado a una decisión real de ConnAI.',hookCategory:'Proceso'},
  {id:'h-gs-20',format:'Green screen',hook:'La diferencia entre un chatbot y un agente de IA no es tecnología. Es si el negocio vende o no.',angle:'Fondo: comparación visual de respuesta chatbot genérico vs. agente con contexto.',hookCategory:'Educación'},
  {id:'h-gs-21',format:'Green screen',hook:'No estoy reinventando nada. Estoy poniendo lo que ya existe donde los negocios lo necesitan.',angle:'Fondo: pantalla de n8n, WhatsApp Business u otra herramienta que uses. Narra la integración.',hookCategory:'Desmitificación'},
  {id:'h-gs-22',format:'Green screen',hook:'Así se ve el pipeline de ConnAI cuando un cliente entra por WhatsApp y nadie está disponible.',angle:'Fondo: diagrama simple del flujo de atención automática. Sin tecnicismos.',hookCategory:'Demo'},
  {id:'h-gs-23',format:'Green screen',hook:'Por qué los negocios locales desconfían de la IA y qué hace que finalmente digan que sí.',angle:'Fondo: lista de objeciones reales que escuchaste + lo que las venció.',hookCategory:'Lección'},
  {id:'h-gs-24',format:'Green screen',hook:'El número que todo negocio debería calcular antes de decidir si contratar un agente de IA.',angle:'Fondo: fórmula simple — costo de mensajes sin responder vs. costo del agente.',hookCategory:'Dato'},
  {id:'h-gs-25',format:'Green screen',hook:'Así se ve una semana de outreach a negocios locales. Los datos reales, sin editarlos.',angle:'Fondo: tu hoja de seguimiento o CRM real. Narra los números sin maquillarlos.',hookCategory:'Evidencia'},
  {id:'h-gs-26',format:'Green screen',hook:'Mi calendario real de esta semana. Así se ve combinar DuocUC, ConnAI y entreno al mismo tiempo.',angle:'Fondo: Google Calendar de la semana actual sin editar. Muéstralo tal cual.',hookCategory:'Documentación'},
  {id:'h-gs-27',format:'Green screen',hook:'Esto es lo que un negocio local pierde cada mes al no tener atención fuera de horario.',angle:'Fondo: cálculo mensual de oportunidad perdida — proyectado a 12 meses.',hookCategory:'Dato'},
  {id:'h-gs-28',format:'Green screen',hook:'Antes de automatizar algo en un negocio, hago estas 3 preguntas. Te las muestro.',angle:'Fondo: las 3 preguntas en pantalla con ejemplos concretos de ConnAI.',hookCategory:'Proceso'},
  {id:'h-gs-29',format:'Green screen',hook:'Una cotización enviada sin seguimiento tiene menos del 20% de probabilidad de cerrarse.',angle:'Fondo: dato o estadística de seguimiento de ventas. Aplícalo a tu experiencia.',hookCategory:'Dato'},
  {id:'h-gs-30',format:'Green screen',hook:'Así luce la arquitectura básica de un agente de WhatsApp. Sin tecnicismos.',angle:'Fondo: diagrama simple del agente — entrada, procesamiento, respuesta. Visual y limpio.',hookCategory:'Educación'},
];

async function main() {
  const stored = await readJson(DATA_PATH);
  if (!stored) { console.error('No hay datos en el Blob todavía.'); process.exit(1); }
  const data = stored.data;
  const prev = Array.isArray(data.hooks) ? data.hooks.length : 0;
  data.hooks = HOOKS.map(h => ({
    ...h,
    status: 'new',
    createdAt: new Date().toISOString()
  }));
  await writeJson(DATA_PATH, data);
  console.log(`Listo. Se reemplazaron ${prev} hooks por ${data.hooks.length} nuevos (sin pilares, agrupados por formato).`);
}

main().catch(err => { console.error(err); process.exit(1); });
