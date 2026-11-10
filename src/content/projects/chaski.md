---
title: "Chaski"
description: "
  API de facturación electrónica del SRI para negocios en Ecuador. Se conecta al sistema, tienda o app del cliente: cada venta se firma, se autoriza en el SRI y le llega al comprador por correo, sin entrar al portal.

  Construí el producto completo en un monorepo con Turborepo: API en NestJS (Fastify) con Prisma y PostgreSQL, colas con BullMQ y Redis para la autorización asíncrona y los reintentos, firma XAdES-BES, RIDE en PDF, almacenamiento en S3, webhooks, panel en SvelteKit y SDK publicado en npm.
"
technologies: [
  "NestJS",
  "Fastify",
  "TypeScript",
  "Prisma",
  "PostgreSQL",
  "Redis",
  "BullMQ",
  "S3",
  "Svelte",
  "SvelteKit",
  "Tailwind",
  "Turborepo",
  "Docker",
  "Dockploy",
]
kind: "propio"
areas: ["fullstack", "backend"]
featured: true
order: 3
images: [
  "/static/projects/chaski/1.webp",
  "/static/projects/chaski/2.webp",
  "/static/projects/chaski/3.webp",
  "/static/projects/chaski/4.webp",
]
previewLink: "https://chaski.ec"
githubLink: ""
features: [
  "Facturas y notas de crédito por API, firmadas con el certificado del emisor (XAdES-BES).",
  "Envío y autorización en el SRI de forma asíncrona, con reintentos si el SRI está lento o caído.",
  "RIDE en PDF con el logo del negocio y envío al cliente por correo, con estado de entrega.",
  "Varios RUC, marcas y puntos de emisión en una sola cuenta.",
  "Webhooks, SDK en npm y ambiente de pruebas del SRI gratis y sin límite.",
  "Usuarios con permisos, verificación en dos pasos (passkeys) e historial de cambios.",
]
---
