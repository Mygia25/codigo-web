// src/app/page.tsx (originally landing/page.tsx)
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ChevronRight, Users, Video, Gift, BarChartHorizontal, ShieldCheck, HelpCircle, ShoppingCart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

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

  return (
    <header className="sticky top-0 z-50 bg-landing-fg text-white py-3 px-4 sm:px-6 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        <p className="text-sm sm:text-base font-semibold mb-2 sm:mb-0">
          🚀 ¡Oferta de Lanzamiento Exclusiva! <span className="hidden sm:inline">-</span> Acceso al MÉTODO CÓDIGO con Descuento Especial
        </p>
        <div className="bg-primary/80 text-primary-foreground px-3 py-1 rounded-md text-base sm:text-lg font-bold">
          Tiempo Restante: {formatTime(timeLeft)}
        </div>
      </div>
    </header>
  );
};

export default function Home() { // Renamed from LandingPage to Home
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
      router.push('/auth/signin?redirect=/checkout'); // Redirect to checkout after signin
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

  return (
    <div className="landing-page-body min-h-screen antialiased">
      <LandingPageHeader timeLeft={timeLeft} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-landing-bg text-landing-fg flex items-center min-h-[calc(100vh-68px)]">
        <div className="absolute inset-0 opacity-5">
            {/* Subtle background pattern or image if desired */}
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 !leading-tight">
            Descubre el <span className="text-primary">MÉTODO CÓDIGO:</span> Tu Start Inteligente <br className="hidden md:block"/> Para Crear y Vender Cursos Online Exitosos.
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-landing-fg/80">
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
         {/* TODO: Add high-quality image or video background here - for now, placeholder styling */}
         <div className="absolute inset-0 z-0">
            <Image 
                src="https://placehold.co/1920x1080.png" 
                alt="Background image representing success or digital products"
                layout="fill"
                objectFit="cover"
                className="opacity-10"
                data-ai-hint="digital product hero background"
                priority
            />
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
               {/* TODO: Event Tracking for CTA clicks - GTM/Analytics */}
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
                <div className="flex justify-center items-center mb-4">
                  {React.cloneElement(benefit.icon, { 'data-ai-hint': benefit.dataAiHint })}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-landing-fg">{benefit.title}</h3>
                <p className="text-landing-fg/80">{benefit.description}</p>
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
            {/* Placeholder for YouTube/Vimeo embed or local MP4 */}
            <Video className="h-24 w-24 text-slate-400" data-ai-hint="video play button"/>
            <p className="absolute text-slate-500">Video de presentación próximamente</p>
            {/* TODO: Implement Event Tracking for video interactions - GTM/Analytics */}
          </div>
          <p className="mt-6 text-lg text-landing-fg/80">Un breve tour por la plataforma y la metodología que cambiará tu forma de ver los negocios digitales.</p>
        </div>
      </section>

      {/* Section: Testimonials */}
      <section className="py-16 md:py-24 bg-landing-bg text-landing-fg">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Lo Que Nuestros Alumnos Opinan</h2>
          {/* TODO: Implement slider or animated cards for testimonials */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Valeria M.", testimonial: "¡El MÉTODO CÓDIGO transformó mi negocio! Pasé de 0 a facturar $5,000 USD en mis primeros 3 meses. ¡Increíble!", imageHint: "happy student female", photoUrl:"https://placehold.co/100x100.png" },
              { name: "Carlos R.", testimonial: "Estaba perdido con tanta información. CÓDIGO me dio la claridad y el paso a paso que necesitaba. ¡100% recomendado!", imageHint: "smiling student male", photoUrl:"https://placehold.co/100x100.png" },
              { name: "Ana P.", testimonial: "Lo mejor es la comunidad y el soporte. Siempre hay alguien para ayudarte. ¡Ya lancé mi primer curso y estoy emocionada!", imageHint: "student working laptop", photoUrl:"https://placehold.co/100x100.png" }
            ].map((item, index) => (
              <Card key={index} className="bg-white shadow-lg p-6">
                <div className="flex items-center mb-4">
                    <Image src={item.photoUrl} alt={item.name} width={60} height={60} className="rounded-full mr-4" data-ai-hint={item.imageHint}/>
                    <div>
                        <CardTitle className="text-lg text-landing-fg">{item.name}</CardTitle>
                        <CardDescription className="text-sm text-primary">Alumno Verificado</CardDescription>
                    </div>
                </div>
                <p className="text-landing-fg/80 italic">"{item.testimonial}"</p>
              </Card>
            ))}
          </div>
          {/* TODO: Implement Event Tracking for slider interactions - GTM/Analytics */}
        </div>
      </section>

      {/* Section: Bonus Included */}
      <section className="py-16 md:py-24 bg-white text-landing-fg">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Además, al Unirte Hoy, Recibirás Estos <span className="text-primary">Bonos Exclusivos:</span></h2>
            <p className="text-lg text-landing-fg/80 max-w-2xl mx-auto mb-12">Valorados en más de $997 USD, ¡Gratis para ti!</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Placeholder Bonus Cards */}
                {[
                    { title: "Plantillas PRO de Embudos", description: "Embudos de venta listos para copiar y pegar.", icon: <Gift className="text-accent"/>, dataAiHint:"template funnel" },
                    { title: "Comunidad VIP de Alumnos", description: "Networking, soporte y colaboración con otros emprendedores.", icon: <Users className="text-accent"/>, dataAiHint:"community group" },
                    { title: "Masterclass 'Escalado a 6 Cifras'", description: "Estrategias avanzadas para llevar tu negocio al siguiente nivel.", icon: <BarChartHorizontal className="text-accent"/>, dataAiHint:"masterclass trophy" }
                ].map(bonus => (
                     <Card key={bonus.title} className="bg-landing-bg shadow-lg p-6">
                        <div className="flex justify-center text-3xl mb-3">{bonus.icon}</div>
                        <h3 className="text-xl font-semibold mb-2 text-landing-fg">{bonus.title}</h3>
                        <p className="text-landing-fg/80">{bonus.description}</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>
      
      {/* Section: Comparison Table */}
      <section className="py-16 md:py-24 bg-landing-bg text-landing-fg">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Compara tu Situación: Antes vs. Después del MÉTODO CÓDIGO</h2>
          <div className="grid md:grid-cols-2 gap-0 max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden border border-primary/20">
            <div className="bg-red-100 p-8">
              <h3 className="text-2xl font-bold text-red-700 mb-6 text-center">ANTES</h3>
              <ul className="space-y-3 text-red-600">
                <li className="flex items-start"><span className="text-2xl mr-2">😩</span><span>Frustración por no vender.</span></li>
                <li className="flex items-start"><span className="text-2xl mr-2">💸</span><span>Dinero perdido en estrategias que no funcionan.</span></li>
                <li className="flex items-start"><span className="text-2xl mr-2">🤯</span><span>Confusión sobre qué pasos seguir.</span></li>
                <li className="flex items-start"><span className="text-2xl mr-2">🏃‍♂️</span><span>Perseguir clientes uno por uno.</span></li>
                <li className="flex items-start"><span className="text-2xl mr-2">🕒</span><span>Horas interminables sin resultados claros.</span></li>
              </ul>
            </div>
            <div className="bg-green-100 p-8">
              <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">DESPUÉS (Con CÓDIGO)</h3>
              <ul className="space-y-3 text-green-800">
                <li className="flex items-start"><span className="text-2xl mr-2">😊</span><span>Confianza y ventas consistentes.</span></li>
                <li className="flex items-start"><span className="text-2xl mr-2">💰</span><span>Ingresos predecibles y automatizados.</span></li>
                <li className="flex items-start"><span className="text-2xl mr-2">🗺️</span><span>Un plan claro y probado paso a paso.</span></li>
                <li className="flex items-start"><span className="text-2xl mr-2">🧲</span><span>Atraer clientes cualificados en piloto automático.</span></li>
                <li className="flex items-start"><span className="text-2xl mr-2">🏖️</span><span>Más tiempo libre y libertad financiera.</span></li>
              </ul>
            </div>
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
          {/* TODO: Event Tracking for CTA clicks - GTM/Analytics */}
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
          {/* TODO: Event Tracking for FAQ interactions - GTM/Analytics */}
        </div>
      </section>

      {/* Sticky CTA Footer */}
      <div className="sticky bottom-0 z-40 bg-landing-fg/90 backdrop-blur-sm text-white p-4 shadow-2xl_upward">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">¡No Esperes Más! Transforma tu Conocimiento en Ingresos.</h3>
            <p className="text-sm opacity-80">Accede al MÉTODO CÓDIGO con la oferta de lanzamiento.</p>
          </div>
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 mt-4 sm:mt-0 rounded-md shadow-lg transform hover:scale-105 transition-transform"
            onClick={handleCTAClick}
          >
            ACCEDER AL MÉTODO AHORA
            <ShoppingCart className="ml-2 h-5 w-5" />
          </Button>
           {/* TODO: Event Tracking for CTA clicks - GTM/Analytics */}
        </div>
      </div>
       {/* TODO: General page view, scroll depth tracking - GTM/Analytics */}
       {/* TODO: Consider A/B testing for headlines, CTAs, images - GTM/Optimize */}
    </div>
  );
}
