<template>
  <main class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p class="text-sm text-slate-500">
          Ringkasan operasional dan aktivitas terbaru
        </p>
      </div>
      <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <span class="px-2 py-1 rounded-full bg-slate-100">Admin Panel</span>
        <span class="px-2 py-1 rounded-full bg-slate-100">KuyDinas</span>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg"
    >
      {{ errorMessage }}
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <div
        class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500"
        ></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Total Akun</div>
            <div class="text-2xl font-semibold">
              <span
                v-if="loadingKpi"
                class="inline-block skeleton w-24 h-6 rounded"
              ></span>
              <span v-else>{{ totalAkunFormatted }}</span>
            </div>
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
                d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 8v6"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M23 11h-6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-lime-500"
        ></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Pengguna Aktif</div>
            <div class="text-2xl font-semibold">
              <span
                v-if="loadingKpi"
                class="inline-block skeleton w-24 h-6 rounded"
              ></span>
              <span v-else>{{ activeAkunFormatted }}</span>
            </div>
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
                d="M20 21v-2a4 4 0 0 0-3-3.87"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 21v-2a4 4 0 0 1 3-3.87"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 3.13a4 4 0 0 1 0 7.75"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 3.13a4 4 0 0 0 0 7.75"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14a4 4 0 0 0-4 4v3h8v-3a4 4 0 0 0-4-4z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500"
        ></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Total Tryout</div>
            <div class="text-2xl font-semibold">
              <span
                v-if="loadingKpi"
                class="inline-block skeleton w-24 h-6 rounded"
              ></span>
              <span v-else>{{ totalTryoutFormatted }}</span>
            </div>
          </div>
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-purple-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 6h13M8 12h13M8 18h13"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 6h.01M3 12h.01M3 18h.01"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500"
        ></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Total Soal</div>
            <div class="text-2xl font-semibold">
              <span
                v-if="loadingKpi"
                class="inline-block skeleton w-24 h-6 rounded"
              ></span>
              <span v-else>{{ totalSoalFormatted }}</span>
            </div>
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
                d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 2H6.5A2.5 2.5 0 0 0 4 4.5v15"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h8M8 11h8M8 15h6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500"
        ></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Paket Topup Aktif</div>
            <div class="text-2xl font-semibold">
              <span
                v-if="loadingKpi"
                class="inline-block skeleton w-24 h-6 rounded"
              ></span>
              <span v-else>{{ paketTopupAktifFormatted }}</span>
            </div>
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
                d="M12 1v22"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"
        ></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Total Transaksi</div>
            <div class="text-2xl font-semibold">
              <span
                v-if="loadingKpi"
                class="inline-block skeleton w-28 h-6 rounded"
              ></span>
              <span v-else>{{ totalGrossAmountFormatted }}</span>
            </div>
            <div class="text-[11px] text-slate-400 mt-1">Gross (paid)</div>
          </div>
          <div class="p-2 bg-cyan-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-cyan-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h8"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 11h8"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 15h4"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-500 to-gray-500"
        ></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Soal per Kategori</div>
            <div class="text-sm font-semibold mt-1">
              <span class="text-slate-700">
                TWK: {{ loadingKpi ? "-" : soalTWKFormatted }}
              </span>
              <span class="text-slate-400 mx-1">•</span>
              <span class="text-slate-700">
                TIU: {{ loadingKpi ? "-" : soalTIUFormatted }}
              </span>
              <span class="text-slate-400 mx-1">•</span>
              <span class="text-slate-700">
                TKP: {{ loadingKpi ? "-" : soalTKPFormatted }}
              </span>
            </div>
          </div>
          <div class="p-2 bg-slate-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h18v18H3z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9h18M9 21V9"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">Tryout Terbaru</h3>
          <router-link
            to="/tryout-builder"
            class="text-xs text-purple-600 hover:underline"
          >
            Lihat semua
          </router-link>
        </div>
        <div v-if="loadingRecent" class="text-sm text-slate-500">Memuat...</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-slate-500 text-xs text-left bg-slate-50">
              <tr>
                <th class="py-3 px-3">Judul</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3">Tipe</th>
                <th class="py-3 px-3">Update</th>
              </tr>
            </thead>
            <tbody class="text-slate-700 bg-white">
              <tr v-for="row in recentTryouts" :key="row.id" class="border-t">
                <td class="py-3 px-3 font-medium">{{ row.title || "-" }}</td>
                <td class="py-3 px-3">{{ row.status || "-" }}</td>
                <td class="py-3 px-3">{{ row.type || "-" }}</td>
                <td class="py-3 px-3">{{ formatDate(row.updated_at) }}</td>
              </tr>
              <tr v-if="!recentTryouts.length">
                <td class="py-3 px-3 text-xs text-slate-400" colspan="4">
                  Tidak ada data
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">Soal Terbaru</h3>
          <router-link
            to="/banksoal"
            class="text-xs text-purple-600 hover:underline"
          >
            Lihat semua
          </router-link>
        </div>
        <div v-if="loadingRecent" class="text-sm text-slate-500">Memuat...</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-slate-500 text-xs text-left bg-slate-50">
              <tr>
                <th class="py-3 px-3">Kategori</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3">Update</th>
              </tr>
            </thead>
            <tbody class="text-slate-700 bg-white">
              <tr v-for="row in recentSoals" :key="row.id" class="border-t">
                <td class="py-3 px-3 font-medium">{{ row.category || "-" }}</td>
                <td class="py-3 px-3">{{ row.status || "-" }}</td>
                <td class="py-3 px-3">{{ formatDate(row.updated_at) }}</td>
              </tr>
              <tr v-if="!recentSoals.length">
                <td class="py-3 px-3 text-xs text-slate-400" colspan="3">
                  Tidak ada data
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">Paket Topup Terbaru</h3>
          <router-link
            to="/topup-packages"
            class="text-xs text-purple-600 hover:underline"
          >
            Lihat semua
          </router-link>
        </div>
        <div v-if="loadingRecent" class="text-sm text-slate-500">Memuat...</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-slate-500 text-xs text-left bg-slate-50">
              <tr>
                <th class="py-3 px-3">Nama</th>
                <th class="py-3 px-3">Harga</th>
                <th class="py-3 px-3">Coin</th>
                <th class="py-3 px-3">Bonus</th>
                <th class="py-3 px-3">Aktif</th>
              </tr>
            </thead>
            <tbody class="text-slate-700 bg-white">
              <tr v-for="row in recentTopups" :key="row.id" class="border-t">
                <td class="py-3 px-3 font-medium">{{ row.name || "-" }}</td>
                <td class="py-3 px-3">{{ formatPrice(row.price) }}</td>
                <td class="py-3 px-3">{{ formatNumber(row.coin_amount) }}</td>
                <td class="py-3 px-3">
                  {{ formatNumber(row.bonus_coin || 0) }}
                </td>
                <td class="py-3 px-3">
                  <span
                    class="px-2 py-1 rounded-full text-xs"
                    :class="
                      row.is_active
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-100 text-slate-600'
                    "
                  >
                    {{ row.is_active ? "Aktif" : "Nonaktif" }}
                  </span>
                </td>
              </tr>
              <tr v-if="!recentTopups.length">
                <td class="py-3 px-3 text-xs text-slate-400" colspan="5">
                  Tidak ada data
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 class="font-semibold mb-1">Pendaftar Tryout per Bulan</h3>
      <p class="text-xs text-slate-400 mb-4">
        Berdasarkan tanggal pendaftaran (created_at).
      </p>
      <div
        class="w-full h-72 flex items-center justify-center rounded-lg bg-slate-50"
      >
        <div v-if="!monthlyData.length" class="text-sm text-slate-500">
          Data belum tersedia
        </div>
        <canvas v-else ref="monthlyChartRef"></canvas>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
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

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
);

const totalAkun = ref(0);
const activeAkun = ref(0);
const totalTryout = ref(0);
const totalSoal = ref(0);
const soalTWK = ref(0);
const soalTIU = ref(0);
const soalTKP = ref(0);
const paketTopupAktif = ref(0);
const totalGrossAmount = ref(null);

const recentTryouts = ref([]);
const recentSoals = ref([]);
const recentTopups = ref([]);

const loadingKpi = ref(false);
const loadingRecent = ref(false);
const errorMessage = ref("");

function formatNumber(val) {
  try {
    return Number(val || 0).toLocaleString("id-ID");
  } catch {
    return String(val ?? 0);
  }
}

function formatPrice(val) {
  return `Rp ${formatNumber(val)}`;
}

function formatDate(val) {
  if (!val) return "-";
  try {
    return new Date(val).toLocaleString("id-ID");
  } catch {
    return "-";
  }
}

const totalAkunFormatted = computed(() => formatNumber(totalAkun.value));
const activeAkunFormatted = computed(() => formatNumber(activeAkun.value));
const totalTryoutFormatted = computed(() => formatNumber(totalTryout.value));
const totalSoalFormatted = computed(() => formatNumber(totalSoal.value));
const soalTWKFormatted = computed(() => formatNumber(soalTWK.value));
const soalTIUFormatted = computed(() => formatNumber(soalTIU.value));
const soalTKPFormatted = computed(() => formatNumber(soalTKP.value));
const paketTopupAktifFormatted = computed(() =>
  formatNumber(paketTopupAktif.value),
);
const totalGrossAmountFormatted = computed(() => {
  if (totalGrossAmount.value === null || totalGrossAmount.value === undefined) {
    return "-";
  }
  return formatPrice(totalGrossAmount.value);
});

const monthlyChartRef = ref(null);
const monthlyData = ref([]);
let monthlyChart = null;

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

  const lastRows = monthlyData.value.slice(-12);

  const labels = lastRows.map(
    (row) => row.bulan_label || row.bulan || row.month_label || row.month || "",
  );

  const values = lastRows.map((row) =>
    Number(row.total || row.jumlah || row.count || 0),
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

function readPaginated(res) {
  const payload = res?.data?.data;
  const rows = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];
  const total =
    Number(
      payload?.total ?? payload?.meta?.total ?? res?.data?.meta?.total ?? 0,
    ) || 0;
  return { rows, total };
}

function isAuthError(err) {
  const status = err?.response?.status;
  return status === 401 || status === 403;
}

function isNotFoundError(err) {
  return err?.response?.status === 404;
}

function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
}

onMounted(async () => {
  errorMessage.value = "";
  loadingKpi.value = true;
  loadingRecent.value = true;

  const tasks = [
    { key: "usersCount", promise: api.get("/users/count") },
    { key: "usersActive", promise: api.get("/users/active-count") },
    { key: "tryouts", promise: api.get("/tryouts") },
    { key: "soals", promise: api.get("/soal") },
    {
      key: "soalTWK",
      promise: api.get("/soal", { params: { category: "TWK" } }),
    },
    {
      key: "soalTIU",
      promise: api.get("/soal", { params: { category: "TIU" } }),
    },
    {
      key: "soalTKP",
      promise: api.get("/soal", { params: { category: "TKP" } }),
    },
    {
      key: "topupActive",
      promise: api.get("/topup-packages", { params: { is_active: 1 } }),
    },
    { key: "topupRecent", promise: api.get("/topup-packages") },
    {
      key: "topupGross",
      optional: true,
      promise: api.get("/topup-transactions/summary", {
        params: { status: "paid" },
      }),
    },
  ];

  const results = await Promise.allSettled(tasks.map((t) => t.promise));

  const byKey = {};
  results.forEach((res, idx) => {
    byKey[tasks[idx].key] = res;
  });

  for (const key of Object.keys(byKey)) {
    const r = byKey[key];
    if (r.status === "rejected" && isAuthError(r.reason)) {
      forceLogout();
      return;
    }
  }

  const rejected = tasks
    .map((t) => ({ task: t, result: byKey[t.key] }))
    .filter(({ task, result }) => {
      if (!result || result.status !== "rejected") return false;
      if (task.optional && isNotFoundError(result.reason)) return false;
      return true;
    });
  if (rejected.length) {
    const first = rejected[0].result;
    const msg =
      first.reason?.response?.data?.message ||
      first.reason?.response?.data?.error ||
      "Sebagian data dashboard gagal dimuat";
    errorMessage.value = msg;
  }

  if (byKey.usersCount?.status === "fulfilled") {
    totalAkun.value =
      Number(byKey.usersCount.value?.data?.data?.total ?? 0) || 0;
  }
  if (byKey.usersActive?.status === "fulfilled") {
    activeAkun.value =
      Number(byKey.usersActive.value?.data?.data?.active ?? 0) || 0;
  }
  if (byKey.tryouts?.status === "fulfilled") {
    const { rows, total } = readPaginated(byKey.tryouts.value);
    totalTryout.value = total;
    recentTryouts.value = (rows || []).slice(0, 5);
  }
  if (byKey.soals?.status === "fulfilled") {
    const { rows, total } = readPaginated(byKey.soals.value);
    totalSoal.value = total;
    recentSoals.value = (rows || []).slice(0, 5);
  }
  if (byKey.soalTWK?.status === "fulfilled") {
    soalTWK.value = readPaginated(byKey.soalTWK.value).total;
  }
  if (byKey.soalTIU?.status === "fulfilled") {
    soalTIU.value = readPaginated(byKey.soalTIU.value).total;
  }
  if (byKey.soalTKP?.status === "fulfilled") {
    soalTKP.value = readPaginated(byKey.soalTKP.value).total;
  }
  if (byKey.topupActive?.status === "fulfilled") {
    paketTopupAktif.value = readPaginated(byKey.topupActive.value).total;
  }
  if (byKey.topupRecent?.status === "fulfilled") {
    recentTopups.value = (
      readPaginated(byKey.topupRecent.value).rows || []
    ).slice(0, 5);
  }
  if (byKey.topupGross?.status === "fulfilled") {
    const d = byKey.topupGross.value?.data?.data || {};
    totalGrossAmount.value =
      Number(
        d.total_gross_amount ??
          d.gross_amount_total ??
          d.total ??
          d.amount_total ??
          0,
      ) || 0;
  } else if (byKey.topupGross?.status === "rejected") {
    if (!isNotFoundError(byKey.topupGross.reason)) {
      totalGrossAmount.value = null;
    }
  }

  loadingKpi.value = false;
  loadingRecent.value = false;

  await nextTick();
  buildMonthlyChart();
});
</script>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb;
}
.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
table tbody tr:nth-child(odd) {
  background-color: #fafafa;
}
</style>
