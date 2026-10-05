# Aturan Pengembangan (Repository Guidelines)

## Deployment Otomatis
- **WAJIB**: Setiap kali selesai melakukan perubahan kode atau fitur (setelah verifikasi build), selalu lakukan:
  ```bash
  git add .
  git commit -m "<deskripsi perubahan>"
  git push origin main
  ```
- Push ke branch `main` akan memicu deployment otomatis ke Vercel.
