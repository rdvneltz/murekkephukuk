# 🚀 Netlify Deployment ve MongoDB Atlas Kurulum Rehberi

## 📋 Gerekli Adımlar

### 1️⃣ MongoDB Atlas Kurulumu (ÜCRETSİZ)

#### Adım 1: Hesap Oluşturma
1. https://www.mongodb.com/cloud/atlas/register adresine git
2. "Sign Up" butonuna tıkla
3. Email, şifre ile kayıt ol veya Google hesabınla giriş yap
4. Formu doldur ve "Get started free" butonuna tıkla

#### Adım 2: Cluster Oluşturma
1. "Build a Database" butonuna tıkla
2. **M0 FREE** seçeneğini seç (0$/month)
3. Cloud Provider: **AWS** (önerilen)
4. Region: **Frankfurt (eu-central-1)** veya **Ireland (eu-west-1)** (Türkiye'ye yakın)
5. Cluster Name: `murekkephukuk` veya istediğin isim
6. "Create Deployment" butonuna tıkla

#### Adım 3: Kullanıcı Oluşturma
1. Username: `admin` (veya istediğin isim)
2. Password: Güçlü bir şifre oluştur (kaydet, lazım olacak!)
3. "Autogenerate Secure Password" da kullanabilirsin
4. ⚠️ **ÖNEMLİ:** Şifreyi bir yere kaydet!
5. "Create Database User" butonuna tıkla

#### Adım 4: IP Whitelist (Erişim İzni)
1. "Network Access" sekmesine git
2. "Add IP Address" butonuna tıkla
3. "Allow Access From Anywhere" seçeneğini seç
   - IP: `0.0.0.0/0` (tüm IP'lere izin verir)
   - ⚠️ **Not:** Production için daha güvenli ama şimdilik bu yeterli
4. "Confirm" butonuna tıkla

#### Adım 5: Connection String Alma
1. "Database" sekmesine dön
2. Cluster'ın yanındaki "Connect" butonuna tıkla
3. "Drivers" seçeneğini seç
4. Driver: **Node.js**, Version: **5.5 or later** seç
5. Connection string'i kopyala:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. ⚠️ **ÖNEMLİ:** `<password>` kısmını kendi şifrenle değiştir!
7. Sonuna database adını ekle:
   ```
   mongodb+srv://admin:SIFREN@cluster0.xxxxx.mongodb.net/murekkephukuk?retryWrites=true&w=majority
   ```

---

### 2️⃣ Netlify Deployment

#### Adım 1: Netlify Hesabı
1. https://www.netlify.com/ adresine git
2. "Sign Up" veya GitHub hesabınla giriş yap
3. GitHub ile giriş yapman önerilirim (kolay entegrasyon)

#### Adım 2: Yeni Site Oluşturma
1. Dashboard'da "Add new site" butonuna tıkla
2. "Import an existing project" seçeneğini seç
3. "Deploy with GitHub" seçeneğini seç
4. GitHub'da yetki ver
5. `murekkephukuk` repository'sini seç

#### Adım 3: Build Settings
1. **Branch to deploy:** `main`
2. **Build command:** `npm run build`
3. **Publish directory:** `.next`
4. **Deploy** butonuna HENÜZ tıklama! Önce environment variables ekleyeceğiz

#### Adım 4: Environment Variables (Çevre Değişkenleri)
"Site configuration" > "Environment variables" > "Add a variable" butonuna tıkla ve şunları ekle:

```
DATABASE_URL
mongodb+srv://admin:SIFREN@cluster0.xxxxx.mongodb.net/murekkephukuk?retryWrites=true&w=majority

NEXTAUTH_URL
https://YOUR-SITE-NAME.netlify.app

NEXTAUTH_SECRET
[BURAYA RANDOM BİR STRING KOYACAĞIZ - ALTTAKI KOMUTU KULLAN]

ADMIN_EMAIL
admin@murekkephukuk.com

ADMIN_PASSWORD
admin123
```

**NEXTAUTH_SECRET için random string oluşturma:**
Terminal'de şunu çalıştır:
```bash
openssl rand -base64 32
```
Çıkan sonucu NEXTAUTH_SECRET değeri olarak kullan.

#### Adım 5: Deploy!
1. "Deploy site" butonuna tıkla
2. Build sürecini izle (2-3 dakika sürer)
3. Build başarılı olursa ✅ "Published" görünecek

#### Adım 6: Site İsmini Değiştir (Opsiyonel)
1. "Site configuration" > "Site details"
2. "Change site name" butonuna tıkla
3. İstediğin ismi gir: `murekkephukuk` veya `murekkep-hukuk`
4. Site URL'in: `https://murekkephukuk.netlify.app` olacak

#### Adım 7: NEXTAUTH_URL'i Güncelle
1. Netlify'da site ismini değiştirdiysen:
2. "Site configuration" > "Environment variables"
3. `NEXTAUTH_URL` değişkenini yeni site URL'inle güncelle
4. "Save" butonuna tıkla
5. "Deploys" > "Trigger deploy" > "Deploy site" ile yeniden deploy et

---

### 3️⃣ İlk Verileri Ekleme (Seed)

Site deploy olduktan sonra admin kullanıcısını oluşturmak için:

**Seçenek 1: Netlify CLI (Önerilen)**
```bash
# Netlify CLI'yi kur
npm install -g netlify-cli

# Login ol
netlify login

# Seed komutunu çalıştır
netlify env:import .env.local
```

**Seçenek 2: Manuel**
1. MongoDB Atlas'a git
2. "Database" > "Browse Collections"
3. "Add My Own Data" butonuna tıkla
4. Database name: `murekkephukuk`
5. Collection name: `User`
6. "Insert Document" ile şu veriyi ekle:
```json
{
  "email": "admin@murekkephukuk.com",
  "password": "$2a$12$[HASHED_PASSWORD]",
  "name": "Admin"
}
```

**Seçenek 3: Basit Yol**
İlk deploydan sonra `https://YOUR-SITE/api/seed` endpoint'ini ekleyebiliriz.

---

### 4️⃣ Test Etme

1. Site URL'ini aç: `https://YOUR-SITE.netlify.app`
2. Ana sayfa açılmalı ✅
3. Admin panele git: `https://YOUR-SITE.netlify.app/admin/login`
4. Giriş yap:
   - Email: `admin@murekkephukuk.com`
   - Şifre: `admin123`

---

## 🔧 Sorun Giderme

### Build Hatası
1. Netlify deploy logs'ları kontrol et
2. "Site configuration" > "Environment variables" doğru mu kontrol et
3. DATABASE_URL'de özel karakterler varsa encode et

### MongoDB Bağlantı Hatası
1. MongoDB Atlas'ta IP whitelist kontrolü
2. Connection string doğru mu kontrol et
3. Şifrede özel karakterler varsa URL encode et:
   ```
   @ → %40
   : → %3A
   / → %2F
   ```

### Admin Panel Açılmıyor
1. NEXTAUTH_URL doğru site URL'ini gösteriyor mu kontrol et
2. NEXTAUTH_SECRET boş mu kontrol et
3. Browser console'da hata var mı kontrol et

---

## 📱 Özel Domain Bağlama (Opsiyonel)

murekkephukuk.com domain'i varsa:

1. Netlify'da "Domain settings" > "Add custom domain"
2. `www.murekkephukuk.com` ekle
3. DNS ayarlarında Netlify'ın verdiği A record'ları ekle
4. SSL otomatik aktif olacak

---

## ✅ Checklist

- [ ] MongoDB Atlas cluster oluşturuldu
- [ ] Database user oluşturuldu
- [ ] IP whitelist ayarlandı
- [ ] Connection string alındı
- [ ] Netlify hesabı oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] Environment variables eklendi
- [ ] Site deploy edildi
- [ ] Admin panel test edildi
- [ ] İlk içerikler eklendi

---

## 🎉 Tebrikler!

Siteniz artık canlı!

**Yararlı Linkler:**
- Site: https://YOUR-SITE.netlify.app
- Admin: https://YOUR-SITE.netlify.app/admin/login
- Netlify Dashboard: https://app.netlify.com
- MongoDB Atlas: https://cloud.mongodb.com

**Not:** Her GitHub push otomatik olarak Netlify'da yeni deploy tetikler! 🚀
