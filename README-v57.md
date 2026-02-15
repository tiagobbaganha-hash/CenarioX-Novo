# CenarioX - Layout Original (Build Compilado)

## 📋 Sobre

Este é o **build compilado** da versão original do CenarioX com o layout que você desenvolveu.

⚠️ **Importante**: Este é um build de produção (arquivos compilados), não o código fonte. Para editar, você precisará do código fonte original.

## 🚀 Deploy

### Opção 1: Netlify
1. Extraia o arquivo `v57-original-layout.tar.gz`
2. Faça upload da pasta `v57` para o Netlify
3. Pronto!

### Opção 2: Vercel
1. Extraia o arquivo
2. Instale Vercel CLI: `npm i -g vercel`
3. Rode: `vercel --prod`

### Opção 3: Qualquer hospedagem estática
1. Extraia o arquivo
2. Faça upload dos arquivos da pasta `v57` para seu servidor
3. Configure o arquivo `_redirects` ou `.htaccess` para SPA routing

## 📁 Estrutura

```
v57/
├── index.html          # Página principal (SPA)
├── admin/              # Área administrativa
├── assets/             # JS, CSS, imagens
├── _redirects          # Configuração de rotas (Netlify)
├── .htaccess           # Configuração (Apache)
├── netlify.toml        # Configuração Netlify
├── vercel.json         # Configuração Vercel
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
└── icon-*.png          # Ícones PWA
```

## 🔐 Login

O sistema usa Supabase para autenticação.

### Credenciais Demo:
- Email: `tiagobbaganha@gmail.com`
- Senha: `admin123`

### Login com Google:
- Configurado via Supabase OAuth

## 🌐 URLs

- `/` - Homepage
- `/login` - Login
- `/dashboard` - Dashboard do usuário
- `/admin` - Área administrativa

## ⚠️ Limitações

Como este é um **build compilado**:
- ❌ Não é possível editar o código
- ❌ Não é possível adicionar novas funcionalidades
- ❌ Apenas configurações via Supabase

Para editar, você precisa do **código fonte original** (React + TypeScript).

---

**Deploy atual:** https://ppksavsw6ci7i.ok.kimi.link
