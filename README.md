# CuentasClarasRD 🇩🇴
**Plataforma Avanzada de Cumplimiento Fiscal para República Dominicana**

CuentasClarasRD es un ecosistema boutique de contabilidad diseñado para simplificar la relación entre los contribuyentes dominicanos y la DGII. Utiliza IA de última generación para automatizar el ciclo de ingresos y gastos, proyectar ITBIS y asegurar el cumplimiento normativo con una experiencia de usuario de clase élite.

---

## 🚀 Funcionalidades Principales (Estado de Producción)

- **Tax Engine Pro**: Cálculo automático de ITBIS (Pagable vs Adelantado) basado en transacciones reales de 606 y 607.
- **Módulo 606 (Compras)**: Ingreso de facturas con validación de RNC y NCF. Procesamiento inteligente mediante **Gemini 1.5 Flash**.
- **Módulo 607 (Ventas)**: Gestión de ingresos, vinculación con facturas emitidas y preparación de reportes mensuales.
- **Invoicing System**: Generación de facturas con estructura NCF y firma digital (e-CF workflow ready).
- **Core Security**: Autenticación endurecida con Supabase y RBAC (Admin, Accountant, Viewer).
- **Resiliencia Operativa**: Validación de configuración al inicio, registro centralizado de errores y observabilidad total.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + Framer Motion (Glassmorph Aesthetics).
- **Backend & Auth**: Supabase SSR.
- **Inteligencia Artificial**: Google Gemini API (Vision Pro extraction).
- **Estándares**: Arquitectura compatible con regulaciones DGII (e-CF, 606, 607).

## 📦 Configuración e Instalación

1. **Clonar el repositorio**.
2. **Setup Supabase**: Ejecutar migraciones en `/supabase/migrations`.
3. **Configuración Local**: Crear `.env.local` basado en `.env.example`.
4. **Dependencias**: `npm install`.
5. **Ejecución**: `npm run dev`.

## 📜 Documentación Operativa

- [Guía de Despliegue (Production)](DEPLOYMENT.md)
- [Checklist de Lanzamiento (Pre-flight)](RELEASE_CHECKLIST.md)
- [Arquitectura de Seguridad (Step 11)](src/lib/auth/permissions.js)

---
**Orgullosamente desarrollado en Santiago de los Caballeros, República Dominicana.**
