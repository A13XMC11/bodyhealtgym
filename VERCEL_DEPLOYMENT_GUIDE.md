# Guía de Deploy en Vercel - Body Health Gym

## 📦 Pre-requisitos

- [x] Proyecto Node.js con Vite + React
- [x] Git repository (GitHub)
- [x] Cuenta en Vercel (gratuita)
- [x] Variables de entorno configuradas

---

## 🚀 Pasos para Deploy

### 1. **Conectar GitHub a Vercel**

1. Ve a https://vercel.com
2. Haz clic en **"New Project"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza Vercel a acceder a tu GitHub
5. Selecciona el repositorio `bodyhealtgym`
6. Haz clic en **"Import"**

### 2. **Configurar Variables de Entorno**

En la página de configuración del proyecto:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

```
VITE_SUPABASE_URL = https://isgzovddlwckdqjwntjo.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZ3pvdmRkbHdja2RxandudGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjM2MTEsImV4cCI6MjA5MDE5OTYxMX0.maj47MFHTal7Flts3jUnqVNhuEQEGkBPy2oWuUmgx_Y
```

⚠️ **IMPORTANTE**:
- Usa **"Preview"** y **"Production"** según sea necesario
- Estas variables ya están en tu `.env.example`
- Vercel las inyectará automáticamente en build time

### 3. **Configuración Automática**

Vercel detectará automáticamente:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Development Command: `npm run dev`

### 4. **Deploy**

1. Haz clic en **"Deploy"**
2. Espera a que termine la compilación
3. Tu app estará en: `https://[nombre-proyecto].vercel.app`

---

## ✅ Verificación Post-Deploy

Después del deploy, verifica que:

- [ ] La app carga sin errores
- [ ] Supabase conecta correctamente
- [ ] Login funciona
- [ ] Dashboard muestra datos
- [ ] Búsqueda de clientes funciona
- [ ] No hay errores en console

### Comandos para verificar localmente:

```bash
# Build de producción local
npm run build

# Previsualizar build
npm run preview
```

---

## 🔄 Actualizaciones Futuras

### Opción 1: Auto-deploy (Recomendado)
- Vercel despliega automáticamente cuando haces push a main
- Configurable en **Settings** → **Git**

### Opción 2: Deploy manual
```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

---

## 📋 Estructura de Archivos Importantes

```
body-health-gym/
├── vercel.json          ✅ Configuración de Vercel
├── .vercelignore        ✅ Archivos a ignorar
├── vite.config.js       ✅ Config de Vite
├── package.json         ✅ Dependencies
├── .env.example         ✅ Variables de referencia
└── dist/                📦 Build output (generado)
```

---

## 🌍 Dominios Personalizados (Opcional)

Si quieres usar un dominio propio (ej: `gym.midominio.com`):

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio
3. Actualiza DNS según instrucciones
4. Espera propagación (5-48 horas)

---

## 🛡️ Checklist de Seguridad

- [x] Variables de entorno NO están en código
- [x] `.env` está en `.gitignore`
- [x] `.vercelignore` excluye archivos sensibles
- [x] Supabase RLS policies configuradas
- [x] No hay console.log con datos sensibles

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "Environment variables not found"
- Verifica que las variables estén en **Settings** → **Environment Variables**
- Reconstruye el proyecto

### Error: "Build failed"
- Revisa los logs en Vercel dashboard
- Ejecuta `npm run build` localmente para debugear

### App en blanco / No carga
- Abre DevTools (F12)
- Busca errores en console
- Verifica conexión a Supabase

---

## 📊 Monitoreo

Vercel proporciona:
- **Analytics**: Visitas, performance
- **Logs**: Errores y eventos
- **Deployments**: Historial de versiones

Accede en: Dashboard → **Analytics** / **Logs**

---

## 💡 Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs [proyecto-name]

# Rollback a versión anterior
vercel rollback

# Listar todos los deployments
vercel list

# Información del proyecto
vercel inspect
```

---

## 🎯 URL de Producción

Después del deploy, tu app estará en:
```
https://bodyhealtgym.vercel.app
```

O con dominio personalizado:
```
https://gym.tudominio.com
```

---

## 📞 Soporte

- **Docs de Vercel**: https://vercel.com/docs
- **Comunidad**: https://github.com/vercel/next.js/discussions
- **Status**: https://www.vercelstatus.com

