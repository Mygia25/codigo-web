// src/components/FloatingWhatsAppButton.tsx
"use client";

import Link from 'next/link';
import React from 'react';
import { MessageCircle } from 'lucide-react'; // Using MessageCircle as a proxy for WhatsApp

export default function FloatingWhatsAppButton() {
  const phoneNumber = "19542283490"; // Number without '+' or special characters
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-transform duration-300 ease-in-out hover:scale-110 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Link>
  );
}
