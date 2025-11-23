<template>
  <!-- Content -->
  <main class="p-6">
    <!-- KPI Cards -->
    <section class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Pengguna Aktif</div>
            <div class="text-2xl font-semibold">1,248</div>
          </div>
          <div class="p-2 bg-emerald-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
        <div class="text-xs text-slate-400 mt-3">+3.2% dari minggu lalu</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Tryout Hari Ini</div>
            <div class="text-2xl font-semibold">24</div>
          </div>
          <div class="p-2 bg-indigo-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3"
              />
            </svg>
          </div>
        </div>
        <div class="text-xs text-slate-400 mt-3">+1.1% dari kemarin</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Pendaftar Baru</div>
            <div class="text-2xl font-semibold">312</div>
          </div>
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-yellow-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14"
              />
            </svg>
          </div>
        </div>
        <div class="text-xs text-slate-400 mt-3">+8.6% bulan ini</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Pendapatan</div>
            <div class="text-2xl font-semibold">Rp 18,450,000</div>
          </div>
          <div class="p-2 bg-pink-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-pink-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3v18h18"
              />
            </svg>
          </div>
        </div>
        <div class="text-xs text-slate-400 mt-3">+12.4% bulan lalu</div>
      </div>
    </section>

    <!-- Section: Kuis Terakhir -->
    <section
      class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6"
    >
      <h3 class="font-semibold mb-3">Kuis Terakhir Dikerjakan</h3>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Nama Kuis</div>
          <div class="text-lg font-semibold">Tes Pengetahuan Umum 2025</div>
          <div class="text-xs text-slate-400 mt-1">
            Dikerjakan: 20 November 2025
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-slate-500">Nilai</div>
          <div class="text-3xl font-bold text-indigo-600">87</div>
        </div>
      </div>
    </section>

    <!-- Section: Sedang Mengerjakan -->
    <section
      class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6"
    >
      <h3 class="font-semibold mb-3">Sedang Mengerjakan</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-slate-500 text-xs text-left bg-slate-50">
            <tr>
              <th class="py-3 pr-6">Nama Akun</th>
              <th class="py-3 pr-6">Try Out</th>
              <th class="py-3 pr-6">Jumlah Koin</th>
              <th class="py-3 pr-6">Jam Mulai</th>
            </tr>
          </thead>
          <tbody class="text-slate-700 bg-white">
            <tr class="border-t">
              <td class="py-3 flex items-center gap-3">
                <img
                  src="../mnt/data/ADCD5DD8-A0A1-4C40-A2D9-63D9E2449E55.jpeg"
                  alt="avatar Robert Clinton"
                  class="w-9 h-9 rounded-full"
                />
                <div>
                  <div class="font-medium">Robert Clinton</div>
                  <div class="text-xs text-slate-400">ID: 2381</div>
                </div>
              </td>
              <td class="py-3">Samsung</td>
              <td class="py-3">$38,536</td>
              <td class="py-3">Smart Phone</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Table / Management -->
    <section class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold">Manajemen Tryout Terbaru</h3>
        <div class="flex items-center gap-2">
          <button class="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">
            Buat Tryout
          </button>
          <button class="px-3 py-2 border rounded-lg text-sm">Impor CSV</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-slate-500 text-xs text-left">
            <tr>
              <th class="py-3 pr-6">#</th>
              <th class="py-3 pr-6">Nama Tryout</th>
              <th class="py-3 pr-6">Tanggal</th>
              <th class="py-3 pr-6">Peserta</th>
              <th class="py-3 pr-6">Status</th>
              <th class="py-3 pr-6">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-slate-700">
            <tr class="border-t">
              <td class="py-3">1</td>
              <td class="py-3">Tryout SKD CPNS 2026</td>
              <td class="py-3">2026-01-12</td>
              <td class="py-3">1,024</td>
              <td class="py-3">
                <span
                  class="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs"
                  >Publik</span
                >
              </td>
              <td class="py-3">
                <button class="text-sm text-indigo-600">Kelola</button>
              </td>
            </tr>
            <tr class="border-t">
              <td class="py-3">2</td>
              <td class="py-3">Tryout Seleksi Sekolah Kedinasan</td>
              <td class="py-3">2025-12-05</td>
              <td class="py-3">432</td>
              <td class="py-3">
                <span
                  class="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs"
                  >Draft</span
                >
              </td>
              <td class="py-3">
                <button class="text-sm text-indigo-600">Kelola</button>
              </td>
            </tr>
            <tr class="border-t">
              <td class="py-3">3</td>
              <td class="py-3">Tryout Materi Tes Bahasa</td>
              <td class="py-3">2025-11-10</td>
              <td class="py-3">88</td>
              <td class="py-3">
                <span
                  class="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs"
                  >Selesai</span
                >
              </td>
              <td class="py-3">
                <button class="text-sm text-indigo-600">Kelola</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
