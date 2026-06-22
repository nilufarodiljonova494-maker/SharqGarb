# Netlify va Bulutli Platformalarga Joylashtirish (Deploy) Qo'llanmasi

Ushbu platforma **Full-Stack** (Vite + Express + Gemini AI) texnologiyasida yaratilgan. Sizning **GEMINI_API_KEY** xavfsizligini ta'minlash uchun barcha AI so'rovlari backend (server.ts) orqali amalga oshiriladi.

Quyida loyihani Netlify yoki muqobil platformalarga joylashtirish bo'yicha batafsil bosqichlar keltirilgan:

---

## 1-Usul: Loyihani Netlify-da static SPA sifatida va Serverni alohida joylashtirish (Tavsiya etiladi)

Netlify faqat static fayllar (HTML, CSS, JS) uchun mo'ljallangan. Shuning uchun:

### A. Frontendni Netlify-ga yuklash:
1. Loyihani build qiling:
   ```bash
   npm run build
   ```
2. Netlify-da yangi sayt yarating va **`dist`** papkasini yuklang (drag-and-drop).
3. Yoki loyiha kodlarini GitHub-ga yuklab, Netlify sozlalamalarida quyidagicha sozlang:
   - **Build Command:** `npm run build`
   - **Publish directory:** `dist`

### B. Backend serverni alohida (Render yoki Railway-ga) bepul joylashtirish:
Chunki server doimiy ishlab turishi kerak:
1. Loyihani **Render.com** yoki **Railway.app** platformasiga ulaysiz.
2. U yerdagi Atrof-muhit o'zgaruvchilariga (**Environment Variables**) quyidagilarni qo'shasiz:
   - `GEMINI_API_KEY` = *Sizning Google AI Studio kalitingiz*
   - `NODE_ENV` = `production`
3. Render-da saytni ishga tushirgandan so'ng sizga beriladigan Server URL-ni Frontend kodingizdagi fetch so'rovlariga ulang.

---

## 2-Usul: Butun Full-stack loyihani bitta joyda bepul yoqtirish (Render, Railway yoki Google Cloud Run)

Bu usul eng oson va qulay hisoblanadi, chunki server va frontend birga ishlaydi:

1. **GitHub-da repozitoriya yarating** va loyihani unga yuklang.
2. **Render.com** sahifasiga kiring va **Web Service** yaratish tugmasini bosing.
3. Loyihangiz sozlamalarida quyidagi buyruqlarni kiriting:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start` (bu avtomatik tarzda `dist/server.cjs`ni ishga tushiradi)
4. Atrof-muhit o'zgaruvchilariga (**Environment Variables**) quyidagi kalitni qo'shing:
   - `GEMINI_API_KEY` = *Sizning maxfiy kalitingiz*

---

## Kalit Sozlamalar va Maslahatlar:
* Loyalty Google AI Studio panelidan yuklab olish uchun yuqoridagi sozlamalar menyusidan **"Export to ZIP"** yoki **"Export to GitHub"** tanlang.
* Netlify-da ishga tushirishda router xatoliklari (404 Page Not Found) bo'lmasligi uchun loyiha ildiziga `public/_redirects` faylini yaratib, ichiga `/* /index.html 200` yozib qo'yishingiz mumkin.
