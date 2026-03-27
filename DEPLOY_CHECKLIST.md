# ✅ Deploy Checklist - Vercel

## 📋 Estado Actual

- [x] **Vite + React** configurado
- [x] **Supabase** conectado y funcional
- [x] **vercel.json** creado
- [x] **.vercelignore** configurado
- [x] **.gitignore** correcto (variables de entorno excluidas)
- [x] **package.json** listo
- [x] **GitHub repository** activo

---

## 🚀 Pasos para Deploy (2-3 minutos)

### Paso 1️⃣: Push a GitHub
```bash
git add .
git commit -m "feat: preparación para deploy en Vercel"
git push origin main
```

### Paso 2️⃣: Ir a Vercel
1. Abre https://vercel.com
2. Inicia sesión (o crea cuenta)
3. Haz clic en **"New Project"**

### Paso 3️⃣: Conectar GitHub
1. Haz clic en **"Continue with GitHub"**
2. Autoriza si es necesario
3. Selecciona **`A13XMC11/bodyhealtgym`**
4. Haz clic en **"Import"**

### Paso 4️⃣: Agregar Variables de Entorno
**Framework Preset**: Vite (se detecta automáticamente)

En la sección **Environment Variables**, agrega:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://isgzovddlwckdqjwntjo.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Tu anon key de Supabase |

⚠️ **NO copies aquí tu clave real** — mejor úsala del dashboard de Supabase

### Paso 5️⃣: Deploy
Haz clic en **"Deploy"** y espera ⏳

### Paso 6️⃣: Verifica
- Abre la URL que genera Vercel (ej: `https://bodyhealtgym.vercel.app`)
- Prueba login y funcionalidades

---

## 📦 Archivos Creados para Vercel

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "framework": "vite",
  "outputDirectory": "dist",
  "routes": [{
    "src": "/(?<path>.*)",
    "destination": "/index.html"
  }]
}
```
✅ Configura build, framework y rutas SPA

### `.vercelignore`
```
node_modules
.env
.git
dist
.vite
```
✅ Excluye archivos innecesarios del deploy

---

## 🔒 Variables de Entorno Seguras

**¿Cómo funcionan en Vercel?**
1. Las defines en dashboard → **Settings** → **Environment Variables**
2. Vercel las inyecta en build time
3. Se incluyen en el build como valores estáticos
4. El `.env` actual NO se sube a Vercel

**Variables requeridas:**
```
VITE_SUPABASE_URL=https://isgzovddlwckdqjwntjo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✨ Ventajas del Deploy en Vercel

- ✅ Gratuito (con límites generosos)
- ✅ Certificado SSL automático
- ✅ CDN global (rápido en cualquier país)
- ✅ Auto-deploy en cada push a main
- ✅ Análytics de performance
- ✅ Logs en tiempo real
- ✅ Rollback con 1 clic

---

## 🎯 Resultado Final

**Tu app estará en:**
```
https://bodyhealtgym.vercel.app
```

**Con:**
- ✅ HTTPS seguro
- ✅ Supabase conectado
- ✅ Usuarios y autenticación funcionando
- ✅ Dashboard mostrando datos
- ✅ Búsqueda, pagos, reportes, etc.

---

## 🔄 Actualizaciones Futuras

Después del primer deploy, cada push a `main` se actualiza automáticamente:

```bash
# Cambias código y haces commit
git commit -m "fix: mejorar diseño"
git push origin main

# ⚡ Vercel detecta cambios y redeploya automáticamente
# En 2-3 minutos tu app está actualizada
```

---

## 🐛 Si algo falla

1. **Revisa los logs**: Dashboard → **Deployments** → último build
2. **Ejecuta localmente**: `npm run build && npm run preview`
3. **Verifica variables**: **Settings** → **Environment Variables**
4. **Revisa errores**: DevTools (F12) → Console

---

## 📞 Soporte

- **Docs Vercel**: https://vercel.com/docs
- **Guía completa**: Ver `VERCEL_DEPLOYMENT_GUIDE.md`
- **Design Guide**: Ver `DESIGN_GUIDE_SOFT.md`

---

## ✅ Próximos Pasos

1. [ ] Hacer push a GitHub
2. [ ] Conectar proyecto en Vercel
3. [ ] Agregar variables de entorno
4. [ ] Hacer deploy
5. [ ] Probar la app en vivo
6. [ ] Configurar dominio personalizado (opcional)

