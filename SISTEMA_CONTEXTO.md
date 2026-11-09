# Contexto del sistema

## Propósito

Benja Content Studio es una herramienta interna para crear, organizar y aprender de contenido corto de la marca personal de Benjamin Romero.

## Flujo editorial

Hooks → Guionización → Para grabar → Grabado → métricas de Instagram → contenido ganador → replicación.

Los hooks se agrupan por pilar y formato. Los hooks aprobados pasan a guionización sin sacar al usuario de su contexto innecesariamente. Los guiones manuales exigen formato.

## Datos y privacidad

Los datos del estudio se guardan en la nube del proyecto y se sincronizan entre dispositivos autorizados. Las credenciales privadas de Meta no deben incluirse en este documento. No almacenar datos personales de clientes.

## Reglas de generación

- No mencionar Zeeltra ni Agenda Viva en contenido actual.
- Priorizar ConnAI y su construcción desde cero.
- No inventar clientes, resultados, precios o métricas.
- Evitar duplicados y guardar la dirección específica de cada hook.
- El deporte se genera únicamente como B-roll + voz en off.
- Las hipótesis de rendimiento son señales, no certezas.

## Infraestructura

- Aplicación: `studio.html`, `studio.js`, `styles.css`.
- Deploy: Vercel.
- Métricas: integración de Instagram mediante endpoints en `api/`.
- Persistencia: almacenamiento del proyecto y sincronización entre sesiones autorizadas.

## Historial de decisiones

Se retiraron los formatos Pantalla compartida y POV. Inteligencia artificial dejó de ser pilar independiente y se integra principalmente en ConnAI y Desarrollo personal. El sistema evolucionó desde una biblioteca de hooks hacia un ciclo de aprendizaje basado en métricas, vinculación Reel–guion y replicación de contenidos ganadores.
