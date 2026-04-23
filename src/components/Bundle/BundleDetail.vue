<template>
  <div class="min-h-full bg-slate-50">
    <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">Admin: Detail Bundle</p>
            <h1 class="mt-1 text-xl font-semibold text-slate-800 sm:text-2xl">{{ bundle?.name || "Memuat..." }}</h1>
            <p class="text-xs text-slate-500">{{ bundle?.description || "-" }}</p>
          </div>
          <div class="flex gap-2">
            <router-link
              :to="`/bundles/${route.params.id}/edit`"
              class="inline-flex items-center rounded-xl bg-amber-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-amber-600 sm:text-sm"
            >
              Edit
            </router-link>
            <router-link
              to="/bundles"
              class="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:text-sm"
            >
              Kembali
            </router-link>
          </div>
        </div>
      </section>

      <div v-if="loading" class="space-y-3">
        <div class="h-20 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-40 animate-pulse rounded-2xl bg-slate-100"></div>
      </div>

      <div
        v-else-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <template v-else-if="bundle">
        <div class="grid gap-4 sm:grid-cols-4">
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-[11px] uppercase tracking-wide text-slate-500">Harga</p>
            <p class="mt-1 text-xl font-bold text-slate-800">Rp {{ formatNumber(bundle.price) }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-[11px] uppercase tracking-wide text-slate-500">Tryout</p>
            <p class="mt-1 text-xl font-bold text-indigo-600">{{ bundle.tryouts?.length || 0 }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-[11px] uppercase tracking-wide text-slate-500">Terjual</p>
            <p class="mt-1 text-xl font-bold text-emerald-600">{{ bundle.paid_count || 0 }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-[11px] uppercase tracking-wide text-slate-500">Limit</p>
            <p class="mt-1 text-sm font-bold text-slate-700">
              {{ bundle.limit_type === 'quota' ? `Kuota: ${bundle.limit_quota ?? '∞'}` : `${bundle.limit_start_date || '?'} s/d ${bundle.limit_end_date || '?'}` }}
            </p>
          </div>
        </div>

        <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 space-y-3">
          <h2 class="text-sm font-semibold text-slate-700">Tryout dalam Bundle</h2>
          <div v-if="!bundle.tryouts?.length" class="text-sm text-slate-500">Belum ada tryout.</div>
          <div v-else class="divide-y divide-slate-100 rounded-xl border border-slate-200">
            <div
              v-for="tryout in bundle.tryouts"
              :key="tryout.id"
              class="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p class="text-sm font-medium text-slate-800">{{ tryout.title }}</p>
                <p class="text-[11px] text-slate-400">{{ tryout.type }} • {{ tryout.duration }} menit • {{ tryout.question_count }} soal</p>
              </div>
              <span class="text-xs text-slate-400">ID: {{ tryout.id }}</span>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-700">Transaksi Pembelian</h2>
            <span class="text-xs text-slate-400">{{ transactions.length }} transaksi</span>
          </div>

          <div v-if="loadingTrx" class="h-20 animate-pulse rounded-xl bg-slate-100"></div>

          <div v-else-if="!transactions.length" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            Belum ada transaksi pembelian.
          </div>

          <div v-else class="overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full border-collapse text-xs sm:text-sm">
              <thead class="bg-slate-100 text-slate-700">
                <tr>
                  <th class="px-3 py-3 text-left">User</th>
                  <th class="px-3 py-3 text-center">Nominal</th>
                  <th class="px-3 py-3 text-center">Status</th>
                  <th class="px-3 py-3 text-center">Bayar</th>
                  <th class="px-3 py-3 text-center">Tanggal</th>
                  <th class="px-3 py-3 text-center">WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="trx in transactions"
                  :key="trx.id"
                  class="border-b bg-white transition-colors hover:bg-slate-50/50"
                >
                  <td class="px-3 py-3">
                    <p class="font-medium text-slate-800">{{ trx.user?.name || "-" }}</p>
                    <p class="text-[10px] text-slate-400">{{ trx.user?.email || "-" }}</p>
                  </td>
                  <td class="px-3 py-3 text-center text-slate-700">Rp {{ formatNumber(trx.gross_amount) }}</td>
                  <td class="px-3 py-3 text-center">
                    <span
                      class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      :class="statusClass(trx.status)"
                    >
                      {{ trx.status }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-center text-slate-500">{{ trx.payment_type || "-" }}</td>
                  <td class="px-3 py-3 text-center text-slate-500">{{ formatDate(trx.paid_at || trx.created_at) }}</td>
                  <td class="px-3 py-3 text-center">
                    <a
                      v-if="trx.user?.whatsapp"
                      :href="getWhatsAppLink(trx.user.whatsapp)"
                      target="_blank"
                      class="inline-flex items-center gap-1 rounded bg-[#25D366]/10 px-2 py-0.5 text-[10px] font-medium text-[#128C7E] hover:bg-[#25D366]/20 transition-colors"
                    >
                      Chat
                    </a>
                    <span v-else class="text-[10px] text-slate-300">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import api from "../../services/api";

const route = useRoute();
const bundle = ref(null);
const transactions = ref([]);
const loading = ref(false);
const loadingTrx = ref(false);
const errorMessage = ref("");

function formatNumber(val) {
  try { return Number(val || 0).toLocaleString("id-ID"); } catch { return String(val || 0); }
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function statusClass(status) {
  if (status === "paid") return "bg-emerald-100 text-emerald-700";
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "failed" || status === "cancelled") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

function getWhatsAppLink(phone) {
  if (!phone) return "#";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.substring(1);
  return `https://wa.me/${cleaned}`;
}

async function loadBundle() {
  loading.value = true;
  try {
    const response = await api.get(`/admin/bundles/${route.params.id}`);
    bundle.value = response.data?.data || null;
  } catch (err) {
    console.error("Gagal memuat bundle:", err);
    errorMessage.value = "Gagal memuat detail bundle.";
  } finally {
    loading.value = false;
  }
}

async function loadTransactions() {
  loadingTrx.value = true;
  try {
    const response = await api.get(`/admin/bundles/${route.params.id}/transactions`);
    transactions.value = Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (err) {
    console.error("Gagal memuat transaksi:", err);
  } finally {
    loadingTrx.value = false;
  }
}

onMounted(() => {
  loadBundle();
  loadTransactions();
});
</script>
