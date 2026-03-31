<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Tambah Tryout</h1>
        <p class="text-slate-500 text-sm">
          Buat tryout terlebih dahulu. Soal akan ditambahkan sesuai komposisi
          yang ditentukan.
        </p>
      </div>

      <div
        class="bg-purple-50 border border-purple-100 text-purple-700 text-sm px-4 py-2 rounded-lg"
      >
        Mode Admin
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border p-6 space-y-8">
      <!-- Informasi Dasar -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border"
      >
        <div>
          <label class="text-sm font-medium text-slate-700">
            Nama Tryout
          </label>
          <input
            v-model="form.title"
            type="text"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
            placeholder="Contoh: Tryout SKD Paket 1"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-slate-700">
            Durasi (menit)
          </label>
          <input
            v-model.number="form.duration"
            type="number"
            min="1"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-slate-700">
            Tipe Tryout
          </label>

          <select
            v-model="form.type"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
          >
            <option value="free">Gratis</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div v-if="form.type === 'free'">
          <label class="text-sm font-medium text-slate-700">
            Kuota Peserta (Gratis)
          </label>

          <input
            v-model.number="form.quota"
            type="number"
            min="1"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
            placeholder="Contoh: 100"
          />
        </div>

        <div v-if="form.type === 'free'">
          <label class="text-sm font-medium text-slate-700">
            Tanggal Berlaku Mulai
          </label>
          <input
            v-model="form.free_start_date"
            type="datetime-local"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
          />
          <p class="mt-1 text-xs text-slate-500">
            Akses tryout gratis dibuka mulai tanggal ini. Opsional.
          </p>
        </div>



        <div v-if="form.type === 'free'">
          <label class="text-sm font-medium text-slate-700">
            Tanggal Berlaku Hingga
          </label>
          <input
            v-model="form.free_valid_until"
            type="datetime-local"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
          />
          <p class="mt-1 text-xs text-slate-500">
            Akses tryout gratis ditutup lewat tanggal ini. Opsional.
          </p>
        </div>

        <div v-if="form.type === 'free'">
          <label class="text-sm font-medium text-slate-700">
            Link Postingan IG
          </label>
          <input
            v-model="form.info_ig"
            type="url"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
            placeholder="https://instagram.com/p/..."
          />
          <p class="mt-1 text-xs text-slate-500">
            Link postingan Instagram untuk misi follow/share. Boleh dikosongkan.
          </p>
        </div>

        <div v-if="form.type === 'free'">
          <label class="text-sm font-medium text-slate-700">
            Link WhatsApp / Telegram
          </label>
          <input
            v-model="form.info_wa"
            type="url"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
            placeholder="https://chat.whatsapp.com/..."
          />
          <p class="mt-1 text-xs text-slate-500">
            Link grup WhatsApp atau grup info. Boleh dikosongkan.
          </p>
        </div>
      </div>

      <!-- Komposisi Soal (TARGET) -->
      <div>
        <h2
          class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"
        >
          <span class="w-2 h-2 bg-purple-600 rounded-full"></span>
          Target Komposisi Soal
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border rounded-xl p-4">
            <h3 class="font-semibold text-purple-600 mb-3">TWK</h3>
            <input
              v-model.number="form.twk_count"
              type="number"
              min="0"
              class="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div class="border rounded-xl p-4">
            <h3 class="font-semibold text-purple-600 mb-3">TIU</h3>
            <input
              v-model.number="form.tiu_count"
              type="number"
              min="0"
              class="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div class="border rounded-xl p-4">
            <h3 class="font-semibold text-purple-600 mb-3">TKP</h3>
            <input
              v-model.number="form.tkp_count"
              type="number"
              min="0"
              class="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Passing Grade -->
      <div>
        <h2
          class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"
        >
          <span class="w-2 h-2 bg-purple-600 rounded-full"></span>
          Passing Grade
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            v-model.number="form.twk_pg"
            type="number"
            min="0"
            class="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            v-model.number="form.tiu_pg"
            type="number"
            min="0"
            class="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            v-model.number="form.tkp_pg"
            type="number"
            min="0"
            class="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <!-- Harga & Diskon -->
      <div>
        <h2
          class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"
        >
          <span class="w-2 h-2 bg-purple-600 rounded-full"></span>
          Harga & Diskon
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="text-sm font-medium text-slate-700">
              Harga (koin)
            </label>

            <input
              v-model.number="form.price"
              type="number"
              min="0"
              class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-slate-700">
              Diskon (%)
            </label>

            <input
              v-model.number="form.discount"
              type="number"
              min="0"
              max="100"
              class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Ringkasan -->
      <div
        class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-5 flex items-center justify-between"
      >
        <div>
          <h3 class="font-semibold text-slate-700 mb-1">Ringkasan Target</h3>
          <p class="text-sm text-slate-600">Total Target Soal</p>
        </div>

        <div class="text-2xl font-bold text-purple-700">
          {{ totalQuestions }}
        </div>
      </div>

      <!-- Action -->
      <div class="flex justify-between items-center gap-3 pt-4 border-t">
        <router-link
          to="/tryouts"
          class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
        >
          Batal
        </router-link>

        <button
          :disabled="loading"
          @click="submitForm"
          class="bg-purple-600 hover:bg-purple-700 shadow-sm text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
        >
          {{ loading ? "Menyimpan..." : "Simpan Tryout" }}
        </button>
      </div>
    </div>

    <BaseToast v-model="showToast" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api.js";
import BaseToast from "../Toast/BaseToast.vue";

const router = useRouter();

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

function showNotification(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}

const form = reactive({
  title: "",
  duration: 100,
  type: "free",
  price: 0,
  discount: 0,
  quota: 100,
  free_start_date: "",
  free_valid_until: "",
  info_ig: "",
  info_wa: "",
  twk_count: 30,
  tiu_count: 35,
  tkp_count: 35,
  twk_pg: 65,
  tiu_pg: 80,
  tkp_pg: 166,
});

const loading = ref(false);

const totalQuestions = computed(
  () => form.twk_count + form.tiu_count + form.tkp_count,
);

async function submitForm() {
  if (!form.title) {
    showNotification("Nama tryout wajib diisi", "error");
    return;
  }

  if (totalQuestions.value <= 0) {
    showNotification("Target soal minimal 1", "error");
    return;
  }

  try {
    loading.value = true;

    let payload = {
      title: form.title,
      duration: Number(form.duration),
      type: form.type,
      twk_count: Number(form.twk_count),
      tiu_count: Number(form.tiu_count),
      tkp_count: Number(form.tkp_count),
      twk_pg: Number(form.twk_pg),
      tiu_pg: Number(form.tiu_pg),
      tkp_pg: Number(form.tkp_pg),
      quota: null,
      price: 0,
      discount: 0,
    };

    // aturan free / premium
    if (form.type === "free") {
      payload.quota = Number(form.quota) || 100;
      if (form.free_start_date) {
        payload.free_start_date = form.free_start_date;
      }
      if (form.free_valid_until) {
        payload.free_valid_until = form.free_valid_until;
      }
      if (form.info_ig) {
        payload.info_ig = form.info_ig;
      }
      if (form.info_wa) {
        payload.info_wa = form.info_wa;
      }
    } else {
      payload.quota = null;
      payload.free_start_date = null;
      payload.free_valid_until = null;
      payload.info_ig = null;
      payload.info_wa = null;
    }

    // harga & diskon menggunakan satuan koin untuk semua tipe
    payload.price = Number(form.price) || 0;
    payload.discount = Number(form.discount) || 0;

    await api.post("/tryouts", payload);

    showNotification("Tryout berhasil dibuat", "success");

    setTimeout(() => {
      router.push("/tryout-builder");
    }, 1000);
  } catch (error) {
    showNotification(
      error.response?.data?.message || "Gagal membuat tryout",
      "error",
    );
  } finally {
    loading.value = false;
  }
}
</script>
