<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Tambah Tryout</h1>
      <p class="text-slate-500 text-sm">
        Buat tryout terlebih dahulu. Soal akan ditambahkan sesuai komposisi yang
        ditentukan.
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border p-6 space-y-8">
      <!-- Informasi Dasar -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <!-- Komposisi Soal (TARGET) -->
      <div>
        <h2 class="text-lg font-semibold text-slate-800 mb-4">
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
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Passing Grade</h2>

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

      <!-- Ringkasan -->
      <div class="bg-slate-50 border rounded-xl p-4">
        <h3 class="font-semibold text-slate-700 mb-2">Ringkasan Target</h3>
        <p class="text-sm text-slate-600">
          Total Target Soal: {{ totalQuestions }}
        </p>
      </div>

      <!-- Action -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <router-link to="/tryouts" class="px-4 py-2 rounded-lg border text-sm">
          Batal
        </router-link>

        <button
          :disabled="loading"
          @click="submitForm"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
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

    await api.post("/tryouts", form);

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
