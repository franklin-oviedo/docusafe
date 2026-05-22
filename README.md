# 🔒 DocuSafe

DocuSafe es una **PWA** para almacenar, organizar y proteger facturas, comprobantes y garantías de forma segura. Interfaz mobile-first, búsqueda inteligente, previsualización de PDF e imágenes, y despliegue automático a Firebase Hosting.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | TailwindCSS (mobile-first) |
| PWA | manifest.json + service worker |
| Auth | Firebase Auth (Google) |
| Base de datos | Firestore (metadatos de documentos) |
| Storage | Firebase Storage (PDF, PNG, JPG) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |
| Backend | Firebase Cloud Functions (Node.js) |
| Forms | react-hook-form + zod |
| State | Zustand |
| PDF viewer | react-pdf (pdfjs-dist) |

## Estructura del proyecto

```
docusafe/
├── .github/workflows/firebase-deploy.yml   # CI/CD automático
├── public/
│   ├── manifest.json                        # PWA manifest
│   └── icons/                               # App icons (debes generarlos)
├── src/
│   ├── app/
│   │   ├── layout.tsx                       # Root layout + metadata PWA
│   │   ├── page.tsx                         # Redirect automático
│   │   ├── (auth)/login/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx                   # Guard de autenticación
│   │       ├── page.tsx                     # Dashboard con estadísticas
│   │       └── documents/page.tsx           # Listado + upload + preview
│   ├── components/
│   │   ├── auth/         # LoginForm, RegisterForm
│   │   ├── documents/    # DocumentCard, DocumentUpload, DocumentPreview, SearchBar
│   │   └── layout/       # Navbar
│   ├── lib/firebase/     # config, auth, firestore, storage helpers
│   ├── hooks/            # useAuth, useDocuments
│   ├── store/            # authStore (Zustand)
│   └── types/            # TypeScript types
├── firestore.rules
├── storage.rules
├── firebase.json
└── package.json
```

## Inicio rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita **Authentication** (Email/Password + Google)
3. Crea una base de datos **Firestore**
4. Crea un bucket de **Storage**
5. Copia el archivo de configuración:

```bash
# Windows PowerShell
Copy-Item .env.local.example .env.local
# macOS / Linux
cp .env.local.example .env.local
# Edita .env.local con tus valores de Firebase
```

### 3. Desplegar reglas de seguridad

```bash
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,storage
```

### 4. Desarrollar

```bash
npm run dev          # http://localhost:3000
```

### 5. Build y deploy a Firebase

```bash
npm run build        # genera carpeta /out
firebase deploy --only hosting
```

## CI/CD con GitHub Actions

Agrega estos **secrets** en `Settings > Secrets and variables > Actions`:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_SERVICE_ACCOUNT   ← JSON key de Service Accounts en Firebase
```

Cada `push` a `main` dispara build + deploy automático.

## Iconos PWA

Genera los iconos en `public/icons/` con [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator):

```bash
npx pwa-asset-generator ./logo.png ./public/icons --manifest ./public/manifest.json
```

## Seguridad

- Cada usuario solo puede leer/escribir **sus propios** documentos (reglas Firestore y Storage por `userId`)
- Los archivos se almacenan en `documents/{userId}/{timestamp}.ext`
- Las variables de entorno con `NEXT_PUBLIC_` son seguras para el cliente (son config pública de Firebase)
