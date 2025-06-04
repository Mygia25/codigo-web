
// src/app/page.tsx (originally landing/page.tsx)
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ChevronRight, Users, Video, Gift, BarChartHorizontal, ShieldCheck, HelpCircle, ShoppingCart, ExternalLink, XCircle, CheckCircle2, Cpu, Sparkles, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { cn } from "@/lib/utils";
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';

const COUNTDOWN_DURATION = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const COUNTDOWN_STORAGE_KEY = 'codigo_launch_countdown_end_time';

const LandingPageHeader: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const offerText = "🚀 ¡Oferta de Lanzamiento Exclusiva! - Acceso al MÉTODO CÓDIGO con Descuento Especial";

  return (
    <header className="sticky top-0 z-50 bg-landing-fg text-white shadow-lg overflow-hidden h-12 flex items-center">
      <div className="flex items-center justify-between w-full h-full relative"> {/* Full width for background */}
        <div className="flex-grow overflow-hidden relative h-full flex items-center pl-4 sm:pl-6"> {/* Padding for marquee start */}
          <div className="animate-marquee-slow whitespace-nowrap flex">
            <span className="text-sm sm:text-base font-semibold py-3 pr-12">{offerText}</span>
            <span className="text-sm sm:text-base font-semibold py-3 pr-12">{offerText}</span>
            <span className="text-sm sm:text-base font-semibold py-3 pr-12">{offerText}</span>
          </div>
        </div>
        <div className="bg-primary/80 text-primary-foreground px-2 py-1 rounded-md text-xs sm:text-sm font-bold ml-4 mr-4 sm:mr-6 flex-shrink-0 z-10">
          {formatTime(timeLeft)}
        </div>
      </div>
    </header>
  );
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);

  useEffect(() => {
    let storedEndTime = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
    let endTime: number;

    if (storedEndTime) {
      endTime = parseInt(storedEndTime, 10);
    } else {
      endTime = Date.now() + COUNTDOWN_DURATION;
      localStorage.setItem(COUNTDOWN_STORAGE_KEY, endTime.toString());
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endTime - now;
      setTimeLeft(difference > 0 ? difference : 0);
    };

    calculateTimeLeft();
    const timerInterval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleCTAClick = () => {
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/auth/signin?redirect=/checkout');
    }
  };
  
  const faqItems = [
    {
      question: "¿Necesito experiencia previa para usar el MÉTODO CÓDIGO?",
      answer: "No, el MÉTODO CÓDIGO está diseñado para guiarte desde cero. Te llevaremos paso a paso, incluso si nunca has vendido nada online o no tienes conocimientos técnicos."
    },
    {
      question: "¿Cuánto tiempo tardaré en ver resultados?",
      answer: "Los resultados varían según tu dedicación y el nicho que elijas. Sin embargo, el método está optimizado para que puedas lanzar tu primer producto digital y empezar a generar ingresos en cuestión de semanas, no meses."
    },
    {
      question: "¿Qué tipo de soporte ofrecen?",
      answer: "Tendrás acceso a nuestra comunidad privada, sesiones de preguntas y respuestas en vivo, y soporte directo por email para resolver todas tus dudas."
    },
    {
      question: "¿Qué pasa si el método no funciona para mí?",
      answer: "Estamos tan seguros de la efectividad del MÉTODO CÓDIGO que ofrecemos una garantía de satisfacción de 30 días. Si sigues los pasos y no obtienes resultados, te devolvemos tu inversión."
    }
  ];

  const antesItems = [
    { text: "Frustración por no vender.", icon: XCircle, color: "text-destructive" },
    { text: "Dinero perdido en estrategias que no funcionan.", icon: XCircle, color: "text-destructive" },
    { text: "Confusión sobre qué pasos seguir.", icon: XCircle, color: "text-destructive" },
    { text: "Perseguir clientes uno por uno.", icon: XCircle, color: "text-destructive" },
    { text: "Horas interminables sin resultados claros.", icon: XCircle, color: "text-destructive" },
  ];

  const despuesItems = [
    { text: "Confianza y ventas consistentes.", icon: CheckCircle2, color: "text-green-600" },
    { text: "Ingresos predecibles y automatizados.", icon: CheckCircle2, color: "text-green-600" },
    { text: "Un plan claro y probado paso a paso.", icon: CheckCircle2, color: "text-green-600" },
    { text: "Atraer clientes cualificados en piloto automático.", icon: CheckCircle2, color: "text-green-600" },
    { text: "Más tiempo libre y libertad financiera.", icon: CheckCircle2, color: "text-green-600" },
  ];

 const bonusItems = [
    { title: "Plantillas PRO de Embudos", description: "Embudos de venta listos para copiar y pegar, optimizados para convertir.", icon: <Gift className="text-accent"/>, dataAiHint:"template funnel", value: 170 },
    { title: "Comunidad VIP de Alumnos", description: "Networking, soporte y colaboración con otros emprendedores como tú.", icon: <Users className="text-accent"/>, dataAiHint:"community group", value: 137 },
    { title: "Masterclass 'Escalado a 6 Cifras'", description: "Estrategias avanzadas para llevar tu negocio de cursos al siguiente nivel.", icon: <BarChartHorizontal className="text-accent"/>, dataAiHint:"masterclass trophy", value: 260 },
    { title: "Sesión Privada de Coaching con Nuestro Equipo", description: "Estrategia personalizada de 60 minutos para acelerar tus resultados y despejar tus dudas clave.", icon: <MessageSquare className="text-accent"/>, dataAiHint:"coaching session team", value: 527 },
    { title: "GPTs Personalizados y Probados", description: "Accede a nuestra suite de asistentes IA para potenciar cada etapa de creación de tu curso: desde validar tu nicho y estructurar contenido, hasta generar ideas y optimizar textos para máxima conversión.", icon: <Cpu className="text-accent"/>, dataAiHint:"ai gpt assistant", value: 580 }
  ];


  return (
    <div className="landing-page-body min-h-screen antialiased">
      <LandingPageHeader timeLeft={timeLeft} />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-landing-bg text-landing-fg flex items-center min-h-[calc(80vh-68px)]">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 !leading-tight">
            Descubre el <span className="text-primary">MÉTODO CÓDIGO:</span> Tu Start Inteligente <br className="hidden md:block"/> Para Crear y Vender Cursos Online Exitosos.
          </h1>
          <p className="text-base md:text-lg mb-10 max-w-3xl mx-auto text-landing-fg/80">
            Transforma tu conocimiento en ingresos pasivos, sin perseguir clientes y con un sistema que trabaja para ti 24/7. Aprende a generar, ordenar, determinar, implementar, ganar y optimizar.
          </p>
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl px-10 py-7 rounded-lg shadow-xl transform hover:scale-105 transition-transform"
            onClick={handleCTAClick}
          >
            QUIERO ACCEDER AL MÉTODO AHORA
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
          <p className="mt-4 text-sm text-landing-fg/70">¡Únete a cientos que ya están monetizando sus pasiones!</p>
        </div>
      </section>

      {/* Section: Problem & Solution */}
      <section className="py-16 md:py-24 bg-white text-landing-fg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cansado de Intentar Sin Resultados?</h2>
            <p className="text-lg text-landing-fg/80 max-w-2xl mx-auto">
              Has invertido tiempo y esfuerzo en crear un curso increíble, pero... ¿las ventas no llegan? ¿Te sientes perdido en el marketing digital? No estás solo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Image 
                src="https://placehold.co/600x400.png" 
                alt="Frustrated person with a course" 
                width={600} height={400} 
                className="rounded-lg shadow-xl mx-auto"
                data-ai-hint="frustrated course creator"
              />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-primary">El Problema: Vender Conocimiento es Más Que Solo Crear Contenido</h3>
              <p className="mb-4 text-landing-fg/90">Muchos expertos fracasan no por falta de calidad, sino por no tener un sistema probado para atraer, convertir y fidelizar alumnos. Perseguir clientes, invertir en publicidad sin retorno, y la complejidad técnica son obstáculos comunes.</p>
              <h3 className="text-2xl font-semibold mb-3 text-accent">La Solución: El MÉTODO CÓDIGO</h3>
              <p className="text-landing-fg/90">Te entregamos el mapa exacto, las herramientas y las estrategias paso a paso para construir un negocio digital rentable alrededor de tu conocimiento. Deja de adivinar y empieza a implementar un sistema que funciona.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Benefits */}
      <section className="py-16 md:py-24 bg-landing-bg text-landing-fg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Con el MÉTODO CÓDIGO, Tú Podrás:</h2>
            <p className="text-lg text-landing-fg/80 max-w-2xl mx-auto">Descubre cómo transformar tu pasión en un flujo de ingresos constante y predecible.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Generar Ingresos Automatizados", description: "Configura sistemas que vendan por ti, incluso mientras duermes.", icon: <Users className="h-8 w-8 mb-3 text-primary" />, dataAiHint:"money automation" },
              { title: "Dejar de Perseguir Clientes", description: "Atrae a tu audiencia ideal de forma orgánica y estratégica.", icon: <Video className="h-8 w-8 mb-3 text-primary" />, dataAiHint:"attract customers magnet" },
              { title: "Lanzar Productos Exitosos", description: "Desde la idea hasta la primera venta, te guiamos en todo el proceso.", icon: <Gift className="h-8 w-8 mb-3 text-primary" />, dataAiHint:"product launch rocket" },
              { title: "Dominar el Marketing Digital", description: "Aprende estrategias efectivas sin necesidad de ser un gurú.", icon: <BarChartHorizontal className="h-8 w-8 mb-3 text-primary" />, dataAiHint:"digital marketing graph" },
              { title: "Construir una Marca Personal Sólida", description: "Posiciónate como un referente en tu nicho de mercado.", icon: <ShieldCheck className="h-8 w-8 mb-3 text-primary" />, dataAiHint:"personal brand shield" },
              { title: "Optimizar y Escalar tu Negocio", description: "Haz crecer tus ingresos de forma sostenible y sin agotarte.", icon: <HelpCircle className="h-8 w-8 mb-3 text-primary" />, dataAiHint:"business growth scale" }
            ].map(benefit => (
              <Card key={benefit.title} className="bg-white shadow-lg hover:shadow-2xl transition-shadow p-6 text-center">
                <CardHeader className="p-0 mb-4 text-center">
                  <div className="flex justify-center items-center mb-3">
                    {React.cloneElement(benefit.icon, { 'data-ai-hint': benefit.dataAiHint })}
                  </div>
                  <CardTitle className="text-xl font-semibold text-landing-fg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-center">
                  <p className="text-landing-fg/80">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Video Presentation */}
      <section className="py-16 md:py-24 bg-white text-landing-fg">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Descubre el Poder del MÉTODO CÓDIGO en Acción</h2>
          <div className="aspect-video max-w-3xl mx-auto bg-slate-200 rounded-lg shadow-xl flex items-center justify-center">
            <Video className="h-24 w-24 text-slate-400" data-ai-hint="video play button"/>
            <p className="absolute text-slate-500">Video de presentación próximamente</p>
          </div>
          <p className="mt-6 text-lg text-landing-fg/80">Un breve tour por la plataforma y la metodología que cambiará tu forma de ver los negocios digitales.</p>
        </div>
      </section>

      {/* Section: Testimonials */}
      <section className="py-16 md:py-24 bg-landing-bg text-landing-fg">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Lo Que Nuestros Alumnos Opinan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Valeria M.", testimonial: "¡El MÉTODO CÓDIGO transformó mi negocio! Pasé de 0 a facturar $5,000 USD en mis primeros 3 meses. ¡Increíble!", imageHint: "happy student female", photoUrl:"https://placehold.co/100x100.png" },
              { name: "Carlos R.", testimonial: "Estaba perdido con tanta información. CÓDIGO me dio la claridad y el paso a paso que necesitaba. ¡100% recomendado!", imageHint: "smiling student male", photoUrl:"https://placehold.co/100x100.png" },
              { name: "Ana P.", testimonial: "Lo mejor es la comunidad y el soporte. Siempre hay alguien para ayudarte. ¡Ya lancé mi primer curso y estoy emocionada!", imageHint: "student working laptop", photoUrl:"https://placehold.co/100x100.png" }
            ].map((item, index) => (
              <Card key={index} className="bg-white shadow-lg p-6 flex flex-col">
                <CardHeader className="p-0 mb-4 text-center">
                  <div className="flex items-center mb-2">
                      <Image src={item.photoUrl} alt={item.name} width={60} height={60} className="rounded-full mr-4" data-ai-hint={item.imageHint}/>
                      <div>
                          <CardTitle className="text-lg text-landing-fg">{item.name}</CardTitle>
                          <CardDescription className="text-sm text-primary">Alumno Verificado</CardDescription>
                      </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-grow text-center">
                  <p className="text-landing-fg/80 italic">"{item.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Bonus Included */}
      <section className="py-16 md:py-24 bg-white text-landing-fg">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Además, al Unirte Hoy, Recibirás Estos <span className="text-primary">Bonos Exclusivos:</span></h2>
            <p className="text-lg text-landing-fg/80 max-w-2xl mx-auto mb-12">
                ¡Todos estos recursos, valorados en más de <span className="font-bold line-through">$1674 USD</span>, <span className="font-bold text-primary">GRATIS</span> para ti!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {bonusItems.map((bonus, index) => (
                     <Card 
                        key={bonus.title} 
                        className={cn(
                            "bg-landing-bg shadow-lg p-6 flex flex-col text-center hover:shadow-xl transition-shadow duration-300",
                            index === 4 && "sm:col-span-2" 
                        )}
                     >
                        <CardHeader className="p-0 mb-3 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2 mb-2">
                            <div className="text-3xl flex-shrink-0 w-10 h-10 flex items-center justify-center">{bonus.icon}</div>
                            <CardTitle className="text-xl font-semibold text-landing-fg">{bonus.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-grow text-center">
                          <p className="text-landing-fg/80 text-sm">{bonus.description}</p>
                        </CardContent>
                        <CardFooter className="p-0 pt-4 mt-auto justify-center">
                           <p className="text-sm text-landing-fg/70">
                                Valorado en <span className="line-through">${bonus.value} USD</span>
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
      </section>
      
      {/* Section: Comparison Table - REFINED */}
      <section className="py-16 md:py-24 bg-landing-bg text-landing-fg"> 
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Compara tu Situación: Antes vs. Después del MÉTODO CÓDIGO</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"> {/* Ensured md:grid-cols-2 */}
            <Card className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02]">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-destructive text-center">ANTES</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4">
                  {antesItems.map((item, index) => (
                    <li key={`antes-${index}`} className="flex items-start text-landing-fg/80">
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-destructive shrink-0 mt-0.5 sm:mt-1" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02]">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-green-600 text-center">DESPUÉS (Con CÓDIGO)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4">
                  {despuesItems.map((item, index) => (
                    <li key={`despues-${index}`} className="flex items-start text-landing-fg/80">
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-green-600 shrink-0 mt-0.5 sm:mt-1" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section: Guarantee */}
      <section className="py-16 md:py-24 bg-white text-landing-fg"> 
        <div className="container mx-auto px-6 text-center">
          <ShieldCheck className="h-20 w-20 text-primary mx-auto mb-6" data-ai-hint="guarantee shield badge"/>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tu Inversión 100% Segura: Garantía de Satisfacción</h2>
          <p className="text-lg text-landing-fg/80 max-w-2xl mx-auto mb-8">
            Estamos convencidos del poder transformador del MÉTODO CÓDIGO. Si en los próximos 30 días aplicas el método, participas en la comunidad, y no ves resultados tangibles o no estás completamente satisfecho, te devolvemos el 100% de tu inversión. Sin preguntas complicadas. Tu éxito es nuestra prioridad.
          </p>
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl px-10 py-7 rounded-lg shadow-xl transform hover:scale-105 transition-transform"
            onClick={handleCTAClick}
          >
            SÍ, QUIERO ACCEDER SIN RIESGO
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Section: FAQ */}
      <section className="py-16 md:py-24 bg-landing-bg text-landing-fg"> 
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="bg-white shadow-sm rounded-lg mb-3 border-b-0">
                <AccordionTrigger className="p-6 text-lg font-semibold text-left hover:no-underline text-landing-fg focus:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-base text-landing-fg/80">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Sticky CTA Footer */}
      <div className="sticky bottom-0 z-40 bg-landing-fg/90 backdrop-blur-sm text-white p-0 shadow-2xl_upward"> {/* p-0 for full-width background */}
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-4 sm:px-6 lg:px-8"> {/* Container for content margins */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold">¡No Esperes Más! Transforma tu Conocimiento en Ingresos.</h3>
            <p className="text-xs opacity-80">Accede al MÉTODO CÓDIGO con la oferta de lanzamiento.</p>
          </div>
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 mt-4 sm:mt-0 rounded-md shadow-lg transform hover:scale-105 transition-transform flex-shrink-0"
            onClick={handleCTAClick}
          >
            ACCEDER AL MÉTODO AHORA
            <ShoppingCart className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <FloatingWhatsAppButton />
    </div>
  );
}

