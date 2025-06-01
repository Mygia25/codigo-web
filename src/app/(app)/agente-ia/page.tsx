// src/app/(app)/agente-ia/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AgenteIAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://n8n.dlyrabrand.com/webhook-test/8917eab2-93b0-4fd8-bc55-559832e1feb5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: currentInput }), 
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
      }

      const result = await response.json();
      
      const aiResponseText = result.reply || result.text || result.message || result.guidance || "No se pudo obtener una respuesta clara del agente.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling webhook:", error);
      toast({
        variant: "destructive",
        title: "Error de Conexión",
        description: "No se pudo obtener respuesta de Valeria. Inténtalo de nuevo.",
      });
       const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, tuve un problema al procesar tu solicitud con Valeria. Por favor, inténtalo de nuevo.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.8))]"> {/* Adjusted height based on new header/paddings */}
      <PageTitle 
        title="Agente CÓDIGO IA"
        description="Tu asistente personal para guiarte a través del método CÓDIGO."
      />
      <Card className="flex-1 flex flex-col shadow-lg overflow-hidden">
        <CardHeader className="border-b">
          <p className="text-sm text-muted-foreground">Hablando con <span className="font-semibold text-primary">Valeria</span></p>
        </CardHeader>
        <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'ai' && (
                  <Avatar className="h-8 w-8 border border-primary/50">
                    <AvatarFallback><Bot className="text-primary" /></AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card text-card-foreground border'
                  }`}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 border border-accent/50">
                    <AvatarFallback><User className="text-accent" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-3">
                 <Avatar className="h-8 w-8 border border-primary/50">
                    <AvatarFallback><Bot className="text-primary" /></AvatarFallback>
                  </Avatar>
                <div className="max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-md bg-card text-card-foreground border">
                  <LoadingSpinner size="sm" text="Valeria está pensando..." />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <CardFooter className="p-4 sm:p-6 border-t">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Escribe tu mensaje a Valeria..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-base"
              autoFocus
            />
            <Button type="submit" size="icon" disabled={isLoading || input.trim() === ''} className="bg-accent hover:bg-accent/90">
              <Send className="h-5 w-5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
