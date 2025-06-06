// valeria.codex.ts
import { defineCodex, type Action } from '@genkit-ai/core'; // Corrected import
import { z } from 'zod';

// Define the structure for a single task
interface TareaLanzamiento {
  nombre: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  orden: number;
}

// Zod schema for the input of planificarLanzamiento action
const PlanificarLanzamientoInputSchema = z.object({
  etapaActual: z.string().describe("Describe la etapa actual del lanzamiento, ej: 'no tengo nada hecho', 'solo me falta la landing', 'ya tengo el contenido pero no he lanzado'"),
});

// Zod schema for a single task (for output validation)
const TareaLanzamientoSchema = z.object({
  nombre: z.string(),
  descripcion: z.string(),
  prioridad: z.enum(['alta', 'media', 'baja']),
  orden: z.number(),
});

// Zod schema for the output of planificarLanzamiento action
const PlanificarLanzamientoOutputSchema = z.array(TareaLanzamientoSchema);

// Helper function to generate tasks based on the current stage
const generarTareasSegunEtapa = (etapa: string): TareaLanzamiento[] => {
  etapa = etapa.toLowerCase(); // Normalize input for easier matching

  if (etapa.includes("no tengo nada") || etapa.includes("cero") || etapa.includes("inicio")) {
    return [
      { nombre: "Definir nicho y audiencia ideal", descripcion: "Investigar y definir claramente el nicho de mercado y el perfil del alumno ideal (avatar).", prioridad: "alta", orden: 1 },
      { nombre: "Validar idea de curso", descripcion: "Confirmar el interés del mercado en el tema del curso (encuestas, entrevistas, preventa).", prioridad: "alta", orden: 2 },
      { nombre: "Estructurar contenido del curso (Módulos y Lecciones)", descripcion: "Crear un esquema detallado de módulos, lecciones y temas principales.", prioridad: "alta", orden: 3 },
      { nombre: "Desarrollar el contenido del curso", descripcion: "Crear materiales (videos, textos, PDFs, ejercicios) para cada lección.", prioridad: "alta", orden: 4 },
      { nombre: "Elegir y configurar plataforma de venta/alojamiento", descripcion: "Seleccionar plataforma (Teachable, Thinkific, WordPress+LMS, etc.) y configurarla.", prioridad: "media", orden: 5 },
      { nombre: "Crear página de ventas (Landing Page)", descripcion: "Diseñar y escribir el copy de una página de ventas persuasiva y optimizada.", prioridad: "media", orden: 6 },
      { nombre: "Definir estrategia de precios y oferta", descripcion: "Establecer el precio del curso y posibles ofertas de lanzamiento.", prioridad: "media", orden: 7 },
      { nombre: "Plan de marketing de lanzamiento", descripcion: "Definir estrategias para atraer los primeros alumnos (email, redes, colaboraciones).", prioridad: "media", orden: 8 },
    ];
  } else if (etapa.includes("landing") || etapa.includes("página de ventas") || etapa.includes("pagina de ventas")) {
    return [
      { nombre: "Finalizar diseño y copy de la Landing Page", descripcion: "Asegurar que todos los elementos de la página de ventas estén optimizados para la conversión.", prioridad: "alta", orden: 1 },
      { nombre: "Configurar e integrar pasarela de pago", descripcion: "Conectar Stripe, PayPal u otra pasarela con la plataforma y la landing page.", prioridad: "alta", orden: 2 },
      { nombre: "Realizar pruebas exhaustivas del flujo de compra", descripcion: "Comprobar el proceso de inscripción, pago y acceso al curso desde varios dispositivos.", prioridad: "alta", orden: 3 },
      { nombre: "Configurar secuencia de emails de bienvenida", descripcion: "Redactar y automatizar los correos para nuevos alumnos (bienvenida, acceso, primeros pasos).", prioridad: "media", orden: 4 },
      { nombre: "Preparar campaña de expectativa pre-lanzamiento", descripcion: "Generar interés y anticipación antes del lanzamiento oficial (emails, redes sociales).", prioridad: "media", orden: 5 },
      { nombre: "Definir métricas de seguimiento del lanzamiento", descripcion: "Establecer KPIs para medir el éxito del lanzamiento (visitas, conversiones, etc.).", prioridad: "baja", orden: 6 },
    ];
  } else if ((etapa.includes("contenido") && etapa.includes("listo")) || etapa.includes("curso creado")) {
    return [
      { nombre: "Revisión final y edición del contenido del curso", descripcion: "Asegurar la calidad, corregir errores y mejorar la claridad de todos los materiales.", prioridad: "alta", orden: 1 },
      { nombre: "Subir todo el contenido a la plataforma", descripcion: "Cargar videos, PDFs, audios y otros recursos a la plataforma de alojamiento del curso.", prioridad: "alta", orden: 2 },
      { nombre: "Configurar acceso, precios y bundles en la plataforma", descripcion: "Definir los planes de acceso, precios finales y posibles paquetes o bonos.", prioridad: "alta", orden: 3 },
      { nombre: "Preparar y programar campaña de email marketing para el lanzamiento", descripcion: "Redactar la secuencia de emails para el lanzamiento (anuncio, recordatorios, cierre de carrito).", prioridad: "media", orden: 4 },
      { nombre: "Crear y programar contenido para redes sociales", descripcion: "Diseñar posts, historias y anuncios para promocionar el lanzamiento.", prioridad: "media", orden: 5 },
      { nombre: "Anunciar oficialmente la fecha de lanzamiento", descripcion: "Comunicar a la audiencia la fecha y hora de apertura de inscripciones.", prioridad: "media", orden: 6 },
      { nombre: "Preparar plan de soporte para alumnos", descripcion: "Definir cómo se atenderán las dudas y consultas durante y después del lanzamiento.", prioridad: "baja", orden: 7 },
    ];
  } else if (etapa.includes("lanzado") || etapa.includes("vendiendo")) {
    return [
        { nombre: "Monitorear ventas y métricas en tiempo real", descripcion: "Seguir de cerca las inscripciones, conversiones y el rendimiento de las campañas.", prioridad: "alta", orden: 1 },
        { nombre: "Brindar soporte activo a los nuevos alumnos", descripcion: "Responder preguntas, resolver problemas técnicos y fomentar la participación.", prioridad: "alta", orden: 2 },
        { nombre: "Realizar ajustes en la campaña de marketing según resultados", descripcion: "Optimizar anuncios, emails o copys si es necesario para mejorar la conversión.", prioridad: "media", orden: 3 },
        { nombre: "Recopilar testimonios y feedback inicial", descripcion: "Pedir a los primeros alumnos sus opiniones y testimonios sobre el curso.", prioridad: "media", orden: 4 },
        { nombre: "Planificar estrategias post-lanzamiento", descripcion: "Definir cómo se seguirá vendiendo el curso (evergreen, próximos lanzamientos).", prioridad: "baja", orden: 5 },
    ];
  }
  // Default tasks if no specific stage is matched
  return [
    { nombre: "Clarificar etapa actual del lanzamiento", descripcion: "Define con más detalle en qué punto te encuentras para obtener un plan más preciso.", prioridad: "alta", orden: 1 },
    { nombre: "Revisar checklist general de lanzamiento de producto digital", descripcion: "Consultar una lista de tareas estándar para lanzamientos.", prioridad: "media", orden: 2 },
  ];
};

export const valeriaCodex = defineCodex({
  name: 'valeria',
  actions: {
    saludo: async () => {
      return 'Hola, soy Valeria. ¿En qué te puedo ayudar hoy?';
    },
    planificarLanzamiento: {
      inputSchema: PlanificarLanzamientoInputSchema,
      outputSchema: PlanificarLanzamientoOutputSchema,
      handler: async (input) => {
        const tareas = generarTareasSegunEtapa(input.etapaActual);
        return tareas;
      }
    } as Action<typeof PlanificarLanzamientoInputSchema, typeof PlanificarLanzamientoOutputSchema>
  }
});
