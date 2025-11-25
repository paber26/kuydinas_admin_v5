<template>
  <!-- Content -->
  <main class="p-6">
    <!-- KPI Cards -->
    <section class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Pengguna Aktif</div>
            <div class="text-2xl font-semibold">{{ totalAkunFormatted }}</div>
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
                  src="/src/assets/logo-kuydinas.png"
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
    <!-- Section: Grafik Pendaftar per Bulan -->
    <section
      class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6"
    >
      <h3 class="font-semibold mb-1">Jumlah Pendaftar Tryout per Bulan</h3>
      <p class="text-xs text-slate-400 mb-4">
        Berdasarkan tanggal pendaftaran (created_at).
      </p>
      <div class="w-full h-72">
        <canvas ref="monthlyChartRef"></canvas>
      </div>
    </section>

    <!-- Section: Asal Provinsi Peserta -->
    <section
      class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mt-6"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold">Asal Provinsi Peserta</h3>
        <p class="text-xs text-slate-400">
          Ringkasan jumlah peserta yang mendaftar berdasarkan provinsi asal.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-slate-500 text-xs text-left bg-slate-50">
            <tr>
              <th
                class="py-3 pr-6 text-center cursor-pointer select-none"
                @click="sortData('provinsi')"
              >
                Provinsi
                <span v-if="sortBy === 'provinsi'">
                  {{ sortDir === "asc" ? "▲" : "▼" }}
                </span>
              </th>

              <th
                class="py-3 pr-6 text-center cursor-pointer select-none"
                @click="sortData('jumlah')"
              >
                Jumlah Peserta
                <span v-if="sortBy === 'jumlah'">
                  {{ sortDir === "asc" ? "▲" : "▼" }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="text-slate-700 bg-white">
            <tr
              v-for="row in provinsiStats"
              :key="row.kode || row.nama || row.provinsi"
              class="border-t"
            >
              <td class="py-3 text-center">
                {{ row.nama || row.provinsi || "-" }}
              </td>
              <td class="py-3 text-center font-medium">
                {{
                  row.jumlah?.toLocaleString?.() ||
                  row.total?.toLocaleString?.() ||
                  row.count?.toLocaleString?.() ||
                  row.jumlah ||
                  row.total ||
                  row.count ||
                  0
                }}
              </td>
            </tr>
            <tr v-if="!provinsiStats.length">
              <td class="py-3 text-xs text-slate-400" colspan="2">
                Belum ada data provinsi. Silakan hubungkan ke API peserta atau
                isi data secara manual di variabel <code>provinsiStats</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";

// registrasi komponen dasar Chart.js
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

// =========================
// 1. DATA TABEL PROVINSI (SAMA SEPERTI SEBELUMNYA)
// =========================
const totalAkun = ref(0);
const totalAkunFormatted = computed(() =>
  totalAkun.value.toLocaleString("id-ID")
);
const provinsiStats = ref([]);

const sortBy = ref("provinsi"); // atau 'jumlah'
const sortDir = ref("asc");

function sortData(key) {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = key;
    sortDir.value = "asc";
  }

  provinsiStats.value = [...provinsiStats.value].sort((a, b) => {
    const valA =
      key === "provinsi"
        ? (a.nama || a.provinsi || "").toString().toLowerCase()
        : Number(a.jumlah || a.total || a.count || 0);
    const valB =
      key === "provinsi"
        ? (b.nama || b.provinsi || "").toString().toLowerCase()
        : Number(b.jumlah || b.total || b.count || 0);

    if (valA < valB) return sortDir.value === "asc" ? -1 : 1;
    if (valA > valB) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });
}

// =========================
// 2. DATA & GRAFIK PENDAFTAR PER BULAN
// =========================
const monthlyChartRef = ref(null);
const monthlyData = ref([]);
let monthlyChart = null;

// plugin sederhana: label angka di atas tiap titik
const valueLabelPlugin = {
  id: "valueLabel",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const data = chart.data.datasets[0].data || [];

    ctx.save();
    meta.data.forEach((point, index) => {
      const value = data[index];
      if (value == null) return;

      const label = value.toString();
      ctx.font =
        "10px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
      const textWidth = ctx.measureText(label).width;
      const boxWidth = textWidth + 12;
      const boxHeight = 18;
      const radius = 4;

      const x = point.x;
      const y = point.y - 16;
      const left = x - boxWidth / 2;
      const top = y - boxHeight / 2;
      const right = left + boxWidth;
      const bottom = top + boxHeight;

      // kotak ungu kecil
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.moveTo(left + radius, top);
      ctx.lineTo(right - radius, top);
      ctx.quadraticCurveTo(right, top, right, top + radius);
      ctx.lineTo(right, bottom - radius);
      ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
      ctx.lineTo(left + radius, bottom);
      ctx.quadraticCurveTo(left, bottom, left, bottom - radius);
      ctx.lineTo(left, top + radius);
      ctx.quadraticCurveTo(left, top, left + radius, top);
      ctx.closePath();
      ctx.fill();

      // teks nilai
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y);
    });
    ctx.restore();
  },
};

Chart.register(valueLabelPlugin);

function buildMonthlyChart() {
  const canvas = monthlyChartRef.value;
  if (!canvas || !monthlyData.value.length) return;

  // Ambil hanya 12 bulan terakhir (data diasumsikan sudah terurut dari backend)
  const lastRows = monthlyData.value.slice(-12);

  const labels = lastRows.map(
    (row) => row.bulan_label || row.bulan || row.month_label || row.month || ""
  );

  const values = lastRows.map((row) =>
    Number(row.total || row.jumlah || row.count || 0)
  );

  if (monthlyChart) {
    monthlyChart.data.labels = labels;
    monthlyChart.data.datasets[0].data = values;
    monthlyChart.update();
    return;
  }

  monthlyChart = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Pendaftar",
          data: values,
          borderColor: "#6366f1",
          backgroundColor: "rgba(129, 140, 248, 0.15)",
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#6366f1",
          pointBorderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              try {
                return Number(value).toLocaleString();
              } catch {
                return value;
              }
            },
          },
        },
      },
    },
  });
}

// =========================
// 3. FETCH DATA DARI API
// =========================
onMounted(async () => {
  try {
    const [totalRes, provRes, bulanRes] = await Promise.all([
      api.get("/gettotalakun"),
      api.get("/getakunperprovinsi"),
      api.get("/getpendaftarperbulan"), // <- pastikan endpoint ini ada
    ]);

    // total pengguna aktif
    const rawTotal = totalRes?.data;
    // console.log("Raw total akun:", totalRes?.data);
    totalAkun.value = Number(rawTotal) || 0;

    // tabel provinsi (tetap)
    provinsiStats.value = provRes.data || [];
    sortData(sortBy.value);

    // grafik bulanan
    monthlyData.value = bulanRes.data || [];
    buildMonthlyChart();
  } catch (err) {
    console.error("Error dashboard:", err);
  }
});
</script>
