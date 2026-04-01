# Ringkasan Fitur KuyDinas Admin v5

- Stack: Vue 3, Vite, Vue Router, TailwindCSS, Axios, Chart.js, KaTeX, vuedraggable
- Entry: [main.js](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/main.js), [App.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/App.vue)
- Routing & Guard: [router](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/router/index.js)
- API service: [api.js](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/services/api.js)

## Autentikasi Admin

- Halaman login dengan validasi dan Google OAuth redirect.
- Menyimpan token, role, dan user di localStorage; guard rute mengecek requiresAuth dan role admin.
- Sumber: [Login.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Auth/Login.vue), [router guard](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/router/index.js#L76-L96)

## Layout Admin

- Sidebar navigasi, header dengan identitas admin, footer.
- Sidebar mengelola menu, ikon lucide, dan tombol logout.
- Sumber: [App.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/App.vue), [Sidebar.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Sidebar.vue)

## Dashboard

- KPI dari API admin: total akun, pengguna aktif, total tryout, total soal, paket topup aktif, breakdown soal TWK/TIU/TKP.
- Aktivitas terbaru: tryout terbaru, soal terbaru, paket topup terbaru.
- KPI tambahan (opsional): total transaksi gross (paid) via endpoint summary (jika tersedia).
- Grafik pendaftar per bulan tetap tampil sebagai placeholder jika data belum tersedia.
- Sumber: [Dashboard.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Dashboard.vue)

## Bank Soal SKD

- Fitur TWK/TIU/TKP: list, filter subkategori/kesulitan/status, preview, edit, hapus.
- Tambah soal dengan dukungan KaTeX untuk LaTeX di pertanyaan/opsi/pembahasan.
- API: GET/POST/PUT/DELETE pada endpoint /soal.
- Sumber:
  - List & aksi: [BankSoal.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/BankSoal/BankSoal.vue)
  - Form tambah: [BankSoalCreate.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/BankSoal/BankSoalCreate.vue)

## Tryout Builder

- Daftar Tryout: tampilkan meta (durasi, tipe, harga, kuota), ubah status Publish/Draft, hapus.
- Publish tryout menggunakan endpoint publish khusus backend ketika status diubah ke Publish atau tombol Terbitkan ditekan.
- Buat Tryout: isi judul, durasi, tipe (free/premium), kuota, target komposisi TWK/TIU/TKP, passing grade, harga/diskon.
- Detail Tryout: rangkum meta dan daftar soal; filter per kategori; edit isi soal inline.
- Kelola Tryout:
  - Edit meta (tipe, harga, diskon) dan target komposisi.
  - Tambah soal dari Bank Soal per kategori dengan cek kuota target.
  - Hapus soal dari tryout.
  - Susun urutan soal via drag-and-drop (vuedraggable) dan simpan ke backend.
- API utama:
  - Tryout list: GET /tryouts
  - Create: POST /tryouts
  - Detail: GET /tryouts/{id}
  - Update meta/target: PUT /tryouts/{id}
  - Reorder: PUT /tryouts/{id}/reorder
  - Attach soal: POST /tryouts/{id}/attach
  - Detach soal: DELETE /tryouts/{id}/detach/{soalId}
  - Publish: POST /tryouts/{id}/publish
- Sumber:
  - List: [TryoutBuilder.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/TryoutBuilder.vue)
  - Create: [TryoutCreate.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/TryoutCreate.vue)
  - Detail: [TryoutDetail.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/TryoutDetail.vue)
  - Kelola: [TryoutManage.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/TryoutManage.vue)
  - Komponen pendukung:
    - [TryoutQuestionTable.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/TryoutQuestionTable.vue)
    - [CategorySection.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/CategorySection.vue)
    - [BankSoalTable.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/BankSoalTable.vue)
    - [CategoryFilter.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/CategoryFilter.vue)

## Tryout SKD (Legacy Pages)

- Daftar Tryout SKD harian dengan filter status & pencarian; navigasi ke lihat/edit.
- Lihat Tryout: normalisasi payload pivot, tampil opsi dan pembahasan; cetak.
- Edit Tryout: form meta, unggah gambar, edit daftar soal (opsi, poin, jawaban, pembahasan), simpan.
- API yang digunakan: /tryoutskd, /tryoutskd/info/{eid}, /tryoutskd/lihat/{eid}, POST /tryoutskd/edit.
- Sumber:
  - List: [Tryoutskd.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/Tryoutskd.vue)
  - Lihat: [Tryoutskdlihat.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/Tryoutskdlihat.vue)
  - Edit: [Tryoutskdedit.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Tryout/Tryoutskdedit.vue)

## Manajemen Akun

- Daftar akun (baru): tabel akun admin dengan pagination, pencarian, filter aktif/nonaktif, dan opsi per-page.
- Endpoint utama: GET /users (admin). Fallback: /getakunv2 jika endpoint /users belum tersedia (untuk kompatibilitas).
- Toggle aktif/nonaktif: PATCH /users/{id} dengan payload { is_active: boolean }.
- Sumber:
  - Halaman: [Accounts.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Users/Accounts.vue)
  - Service: [adminUsersApi.js](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/services/adminUsersApi.js)
  - Legacy: [Daftarakun.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Daftarakun.vue)

## Paket Top Up

- CRUD paket top up via API admin: list/search/filter aktif, tambah, edit, hapus (tampil pesan backend untuk error 422).
- Routing: /topup-packages.
- Sumber:
  - Halaman: [TopupPackages.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Topup/TopupPackages.vue)
  - Form modal: [TopupPackageForm.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Topup/TopupPackageForm.vue)
  - Service: [topupPackagesApi.js](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/services/topupPackagesApi.js)

## Materi SKD

- Placeholder halaman materi.
- Sumber: [Materiskd.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Materiskd.vue)

## Toast/Notifikasi

- Komponen toast dengan auto-dismiss, progress bar, tipe success/error.
- Digunakan lintas halaman untuk feedback aksi CRUD.
- Sumber: [BaseToast.vue](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/components/Toast/BaseToast.vue)

## Routing & Proteksi

- Definisi rute utama: dashboard, bank soal, tryout builder, detail/manage tryout, paket top up, daftar akun, login, halaman legacy SKD.
- Guard:
  - Redirect ke /login jika requiresAuth tanpa token.
  - Redirect ke / jika sudah login dan membuka /login.
  - Blokir akses jika role bukan admin.
- Sumber: [router/index.js](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/router/index.js)

## Integrasi API

- Base URL via env: VITE_ADMIN_API_BASE_URL.
- Penanganan 401: hapus token/role dan redirect ke /login.
- Contoh env: [.env.example](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/.env.example)
- Sumber: [services/api.js](file:///Users/marchelinoraco/Documents/2026/kuy/kuydinas_admin_v5/src/services/api.js)

## Catatan Implementasi

- KaTeX untuk rendering LaTeX pada konten soal.
- vuedraggable untuk reorder soal per kategori di tryout manage.
- Chart.js untuk grafik pendaftar bulanan di dashboard.
