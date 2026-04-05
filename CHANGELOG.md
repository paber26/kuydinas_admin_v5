# Changelog (Update Terbaru)

## [April 2026] - Peningkatan Editor Bank Soal & Rendering UI

### 🐛 Bug Fixes & Refactoring
* **Pembenaran Render KaTeX (Matematika)**: Memperbaiki regex *parser* teks di `src/utils/richText.js`. Saat ini render teks tidak hanya mendukung simbol `$...$`, tetapi juga mencakup format standar KaTeX lain seutuhnya (`$$...$$`, `\(...\)`, `\[...\]`, `<span class="math-tex">`). Kini tulisan matematika *live preview* tampil visual secara sempurna saat ditambahkan dari internal *database*.
* **Perbaikan Layout EditModal (Aksi Overlap)**: Memperbaiki masalah CSS pada fitur edit Bank Soal (`EditModal.vue`) yang tadinya bilah navigasi simpan (*action footer*) menimpa bagian bawah teks editor. Diperbaiki dengan mengganti kerangka struktur menjadi tata letak *Flexbox* penuh (`flex-col`, `overflow-y-auto`, dan flex-scaling).

### ✨ Perubahan Minor (Teks)
* Mengubah nama tombol aksi komponen dari *"Simpan ke API"* menjadi *"Simpan"* saja pada `TryoutDetail.vue` agar lebih elegan.
