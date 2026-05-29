# 🚀 Panduan Vercel Deployment untuk Siputzx API

Dokumentasi lengkap untuk deploy aplikasi Elysia REST API ke Vercel.

## 📦 File-File yang Ditambahkan

Berikut adalah file-file support Vercel yang telah dibuat:

```
apisku/
├── vercel.json              # Konfigurasi Vercel
├── .vercelignore            # File yang diabaikan saat deploy
└── api/
    └── index.ts             # Serverless function handler
```

---

## 🔧 Prasyarat

- ✅ GitHub account dengan repo `Maikelowenz/apisku`
- ✅ Vercel account (daftar di https://vercel.com)
- ✅ Node.js 18+ terinstall
- ✅ npm, yarn, atau bun package manager

---

## 🚀 Langkah-Langkah Deploy

### 1️⃣ Persiapan Kode

```bash
# Clone atau update repo
git clone https://github.com/Maikelowenz/apisku.git
cd apisku

# Install dependencies
npm install
# atau jika menggunakan bun
bun install
```

### 2️⃣ Test Lokal dengan Vercel CLI

```bash
# Install Vercel CLI global
npm install -g vercel

# Login ke Vercel
vercel login

# Test di lokal (development)
vercel dev

# Akan berjalan di http://localhost:3000
```

### 3️⃣ Deploy ke Production

#### **Opsi A: Via GitHub (Auto-Deploy) ⭐ RECOMMENDED**

1. **Push code ke GitHub**
   ```bash
   git add .
   git commit -m "feat: Add Vercel support"
   git push origin main
   ```

2. **Connect Repository ke Vercel**
   - Buka https://vercel.com/dashboard
   - Klik **"Add New..."** → **"Project"**
   - Klik **"Import Git Repository"**
   - Cari `Maikelowenz/apisku` dan pilih
   - Klik **"Import"**

3. **Configure Environment Variables**
   - Di halaman project settings, buka **"Environment Variables"**
   - Tambahkan variables berikut:
   
   | Key | Value | Contoh |
   |-----|-------|--------|
   | `MONGO_URI` | MongoDB connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
   | `DISCORD_TOKEN` | Discord bot token | `NzI4Nzk4NDk4MzU4NzI2Ng...` |
   | `DATABASE_URL` | DB connection | `postgres://...` |
   | `NODE_ENV` | Environment | `production` |

4. **Deploy**
   - Klik **"Deploy"**
   - Tunggu 2-5 menit hingga selesai
   - Dapatkan URL: `https://apisku.vercel.app`

#### **Opsi B: Via CLI Manual**

```bash
# Deploy pertama kali
vercel --prod

# Deploy ulang
vercel --prod

# Dengan link GitHub
vercel link
vercel --prod
```

---

## ✅ Verifikasi Deployment

Setelah deploy berhasil, test endpoints:

```bash
# Health check
curl https://apisku.vercel.app/health

# API endpoint
curl https://apisku.vercel.app/api/some-endpoint

# View logs
vercel logs [project-name]

# View live analytics
# Buka: https://vercel.com/dashboard/[project-name]/analytics
```

---

## 📊 Struktur Konfigurasi

### `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts",
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
  ]
}
```

### `.vercelignore`
```
# File yang tidak perlu di-upload ke Vercel
node_modules/
.env
src/
router/
dist/
```

---

## ⚠️ Keterbatasan Vercel & Solusi

### 1. **⏱️ Timeout 60 Detik**
Serverless Functions memiliki timeout maksimal.

**Solusi:**
```typescript
// Gunakan response streaming untuk operasi panjang
res.setHeader('Content-Type', 'text/event-stream')
// Kirim data secara bertahap
```

### 2. **💾 Ephemeral Filesystem**
Data yang disimpan ke disk akan hilang setelah request.

**Solusi:**
- Gunakan cloud storage (AWS S3, Google Cloud Storage)
- Simpan ke database, bukan file system

### 3. **🤖 Browser Automation (Puppeteer/Playwright)**
Memerlukan setup khusus karena ukuran besar.

**Solusi:**
- Gunakan `@vercel/node-bridge` untuk browser
- Atau gunakan service terpisah untuk web scraping

### 4. **👁️ File Watcher (Chokidar)**
Tidak bekerja di serverless environment.

**Solusi:**
```typescript
// Disable file watcher di production
if (process.env.NODE_ENV !== 'production') {
  setupFileWatcher() // Hanya di development
}
```

---

## 🔄 CI/CD Configuration

### Auto-Deploy dari GitHub

Vercel otomatis deploy ketika:
- ✅ Push ke branch yang di-connect
- ✅ Pull request dibuat (preview deployment)
- ✅ Changes di-merge ke main branch

### Manual Trigger

```bash
# Redeploy latest commit
vercel --prod

# Deploy specific branch
vercel --prod -- --target production
```

---

## 📝 Environment Variables Setup

### Lokal Development
```bash
# .env.local
MONGO_URI=mongodb://localhost:27017/siputzx
DISCORD_TOKEN=your_discord_token
DATABASE_URL=postgres://...
API_KEY=sk_test_...
NODE_ENV=development
```

### Vercel Production
Di dashboard → Settings → Environment Variables:

```bash
# Tambahkan dengan Vercel CLI
vercel env add MONGO_URI
vercel env add DISCORD_TOKEN
vercel env add DATABASE_URL
vercel env add API_KEY
```

---

## 🐛 Troubleshooting

### Build Failed
```bash
# Lihat log detail
vercel logs --limit 50

# Rebuild dengan fresh cache
vercel --prod --force

# Clear cache
vercel env pull
```

### Function Timeout
```typescript
// Reduce processing time
// atau split ke background jobs
```

### Memory Issues
```bash
# Check function size
vercel list --json

# Remove unused dependencies
npm prune --production
```

### Environment Variables Not Working
```bash
# Verify variables
vercel env list

# Rebuild
vercel --prod --force

# Cek di request
console.log(process.env.MONGO_URI)
```

---

## 📚 Useful Commands

```bash
# List all projects
vercel projects list

# Get project info
vercel projects inspect [project-name]

# View deployments
vercel deployments

# View specific deployment
vercel inspect [deployment-url]

# View logs real-time
vercel logs [project-name] --follow

# Cancel deployment
vercel cancel [deployment-id]

# Promote deployment
vercel promote [deployment-url]
```

---

## 🎯 Advanced Configuration

### Custom Build Command
```json
{
  "buildCommand": "npm run build && npm run setup-vercel",
  "installCommand": "npm ci --prefer-offline"
}
```

### Multiple Functions
```
api/
├── index.ts          # Main handler
├── health.ts         # Health check
├── metrics.ts        # Metrics endpoint
└── webhook.ts        # Webhook handler
```

### Regional Deployment
```json
{
  "regions": ["sin1"]  // Deploy hanya di Singapore
}
```

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Jangan commit `.env`
   - Gunakan `.vercelignore` untuk exclude sensitive files

2. **API Keys**
   - Rotate API keys regularly
   - Use separate keys for dev/prod

3. **CORS Configuration**
   ```typescript
   .use(cors({
     origin: process.env.ALLOWED_ORIGINS?.split(',')
   }))
   ```

4. **Rate Limiting**
   - Implement di application level
   - Gunakan Vercel's built-in rate limiting

---

## 📊 Monitoring & Analytics

### Vercel Dashboard
- **Analytics**: Response time, invocations, errors
- **Logs**: Real-time application logs
- **Deployments**: Version history
- **Usage**: Bandwidth, functions usage

### External Monitoring
```bash
# Setup error tracking
npm install sentry-node

# Setup performance monitoring
npm install elastic-apm-node
```

---

## 🆘 Getting Help

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 🚀 [Vercel Functions Guide](https://vercel.com/docs/functions/serverless-functions)
- 💬 [Vercel Community](https://github.com/vercel/community)
- 🐛 [Report Issues](https://github.com/Maikelowenz/apisku/issues)

---

## ✨ Next Steps

- [ ] Configure environment variables di Vercel
- [ ] Test deployment dengan `vercel dev`
- [ ] Push to GitHub dan auto-deploy
- [ ] Monitor logs via Vercel dashboard
- [ ] Setup custom domain (optional)
- [ ] Enable analytics dan monitoring
- [ ] Setup alerts untuk errors

---

**Selamat! Aplikasi Anda sudah siap di-deploy ke Vercel! 🎉**

Untuk pertanyaan lebih lanjut, buka issue di repository atau cek dokumentasi resmi Vercel.
