<template>
  <div class="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- HEADER -->
    <div
      class="flex justify-between items-center mb-8 bg-white border shadow-sm rounded-2xl px-6 py-5"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-800 flex items-center gap-2">
          🎯 Kelola Tryout
        </h1>
        <p class="text-slate-500 text-sm mt-1">
          ID Tryout: {{ route.params.id }}
        </p>
      </div>

      <router-link
        to="/tryout-builder"
        class="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition"
      >
        Kembali
      </router-link>
    </div>

    <!-- INFO TRYOUT -->
    <TryoutInfoCard
      v-if="tryout"
      :tryout="tryout"
      :total="questions.length"
      :twk="totalTWK"
      :tiu="totalTIU"
      :tkp="totalTKP"
      :totalTarget="totalTarget"
      :target="editTarget"
      @save="updateTarget"
    />

    <!-- EDIT META TRYOUT -->
    <div
      v-if="tryout"
      class="mt-6 bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
    >
      <h2 class="text-lg font-semibold mb-4">Pengaturan Tryout</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-3">
          <label class="text-sm text-slate-600">Nama Tryout</label>
          <input
            v-model="editMeta.title"
            type="text"
            class="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label class="text-sm text-slate-600">Durasi (menit)</label>
          <input
            v-model.number="editMeta.duration"
            type="number"
            class="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label class="text-sm text-slate-600">Tipe</label>
          <select
            v-model="editMeta.type"
            class="mt-1 w-full border rounded-lg px-3 py-2"
          >
            <option value="free">Gratis</option>
            <option value="premium">Premium</option>
            <option value="regular">Regular</option>
          </select>
        </div>

        <div v-if="editMeta.type === 'free'">
          <label class="text-sm text-slate-600">Kuota Peserta</label>
          <input
            v-model.number="editMeta.quota"
            type="number"
            class="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div v-if="editMeta.type === 'free'">
          <label class="text-sm text-slate-600"> Tanggal Berlaku Mulai </label>
          <input
            v-model="editMeta.free_start_date"
            type="datetime-local"
            class="mt-1 w-full border rounded-lg px-3 py-2"
          />
          <p class="mt-1 text-xs text-slate-500">
            Akses tryout gratis dibuka mulai tanggal ini. Opsional.
          </p>
        </div>

        <div v-if="editMeta.type === 'free'">
          <label class="text-sm text-slate-600"> Tanggal Berlaku Hingga </label>
          <input
            v-model="editMeta.free_valid_until"
            type="datetime-local"
            class="mt-1 w-full border rounded-lg px-3 py-2"
          />
          <p class="mt-1 text-xs text-slate-500">
            Akses tryout gratis ditutup lewat tanggal ini. Opsional.
          </p>
        </div>

        <div v-if="editMeta.type === 'free'">
          <label class="text-sm text-slate-600"> Link Postingan IG </label>
          <input
            v-model="editMeta.info_ig"
            type="url"
            class="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="https://instagram.com/p/..."
          />
          <p class="mt-1 text-xs text-slate-500">
            Link postingan Instagram untuk misi follow/share. Boleh dikosongkan.
          </p>
        </div>

        <div v-if="editMeta.type === 'free'">
          <label class="text-sm text-slate-600">
            Link WhatsApp / Telegram
          </label>
          <input
            v-model="editMeta.info_wa"
            type="url"
            class="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="https://chat.whatsapp.com/..."
          />
          <p class="mt-1 text-xs text-slate-500">
            Link grup WhatsApp atau grup info. Boleh dikosongkan.
          </p>
        </div>

        <div>
          <label class="text-sm text-slate-600">Harga (koin)</label>
          <input
            v-model.number="editMeta.price"
            type="number"
            class="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label class="text-sm text-slate-600">Diskon (%)</label>
          <input
            v-model.number="editMeta.discount"
            type="number"
            class="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button
          @click="updateMeta"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>

    <!-- BUTTON TAMBAH -->
    <div class="flex justify-end mb-6 mt-6">
      <button
        @click="toggleBankSoal"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition"
      >
        {{ showBankSoal ? "Tutup Bank Soal" : "Tambah Soal" }}
      </button>
    </div>

    <!-- TABEL SOAL TRYOUT -->
    <TryoutQuestionTable
      :questions="questions"
      :badge="badge"
      @remove="removeQuestion"
      @reorder="reorderQuestion"
    />
    <!-- BANK SOAL -->
    <div
      v-if="showBankSoal"
      class="mt-10 bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
    >
      <h2
        class="text-xl font-semibold mb-6 text-slate-800 flex items-center gap-2"
      >
        📚 Pilih Soal dari Bank Soal
      </h2>

      <CategoryFilter v-model="selectedCategory" />

      <BankSoalTable
        :bankSoal="filteredBankSoal"
        :badge="badge"
        :isQuotaFull="isQuotaFull"
        @add="addQuestion"
      />
    </div>

    <!-- TOAST -->
    <BaseToast v-model="showToast" :type="toastType" :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import api from "../../services/api.js";

import TryoutInfoCard from "./TryoutInfoCard.vue";
import TryoutQuestionTable from "./TryoutQuestionTable.vue";
import BankSoalTable from "./BankSoalTable.vue";
import CategoryFilter from "./CategoryFilter.vue";
import BaseToast from "../Toast/BaseToast.vue";

const route = useRoute();
const tryoutId = route.params.id;

/* ================= STATE ================= */

const tryout = ref(null);
const questions = ref([]);
const bankSoal = ref([]);

const showBankSoal = ref(false);
const selectedCategory = ref("");

const editTarget = ref({
  twk: 0,
  tiu: 0,
  tkp: 0,
});

const editMeta = ref({
  title: "",
  duration: 0,
  type: "",
  quota: 0,

  free_start_date: "",
  free_valid_until: "",
  info_ig: "",
  info_wa: "",
  price: 0,
  discount: 0,
});

/* ================= TOAST ================= */

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

function showNotification(msg, type = "success") {
  toastMessage.value = msg;
  toastType.value = type;
  showToast.value = true;
}

watch(
  () => editMeta.value.type,
  (nextType, prevType) => {
    if (!tryout.value) return;
    if (tryout.value.status !== "publish") return;
    if (tryout.value.type === "free") return;
    if (nextType !== "free") return;

    editMeta.value.type = prevType || "premium";
    showNotification(
      "Tryout berbayar yang sudah publish tidak dapat diubah menjadi gratis.",
      "error",
    );
  },
);

/* ================= FETCH TRYOUT ================= */

async function fetchTryout() {
  try {
    const res = await api.get(`/tryouts/${tryoutId}`);

    tryout.value = res.data.data;

    questions.value = (res.data.data.soals || []).sort(
      (a, b) => a.pivot.urutan_soal - b.pivot.urutan_soal,
    );

    editTarget.value = {
      twk: tryout.value.twk_target,
      tiu: tryout.value.tiu_target,
      tkp: tryout.value.tkp_target,
    };
    editMeta.value = {
      title: tryout.value.title,
      duration: tryout.value.duration,
      type: tryout.value.type,
      quota: tryout.value.quota ?? 0,
      free_start_date: formatDateTimeInput(tryout.value.free_start_date),
      free_valid_until: formatDateTimeInput(tryout.value.free_valid_until),
      info_ig: tryout.value.info_ig || "",
      info_wa: tryout.value.info_wa || "",
      price: tryout.value.price ?? 0,
      discount: tryout.value.discount ?? 0,
    };
  } catch (err) {
    showNotification("Gagal mengambil data tryout", "error");
  }
}

/* ================= FETCH BANK SOAL ================= */

async function fetchBankSoal() {
  try {
    const res = await api.get("/soal", { params: { per_page: 1000 } });

    console.log(res);

    // Laravel pagination returns { data: [...], links, meta }
    bankSoal.value = res.data.data?.data || [];
  } catch (err) {
    showNotification("Gagal mengambil bank soal", "error");
  }
}

/* ================= UPDATE TARGET ================= */

async function updateTarget() {
  try {
    await api.put(`/tryouts/${tryoutId}`, {
      twk_count: editTarget.value.twk,
      tiu_count: editTarget.value.tiu,
      tkp_count: editTarget.value.tkp,
    });

    tryout.value.twk_target = editTarget.value.twk;
    tryout.value.tiu_target = editTarget.value.tiu;
    tryout.value.tkp_target = editTarget.value.tkp;

    showNotification("Komposisi tryout berhasil diperbarui");
  } catch (err) {
    showNotification(
      err.response?.data?.message || "Gagal memperbarui komposisi",
      "error",
    );
  }
}

async function updateMeta() {
  try {
    if (
      tryout.value?.status === "publish" &&
      tryout.value?.type !== "free" &&
      editMeta.value.type === "free"
    ) {
      editMeta.value.type = "premium";
      showNotification(
        "Tryout berbayar yang sudah publish tidak dapat diubah menjadi gratis.",
        "error",
      );
      return;
    }

    await api.put(`/tryouts/${tryoutId}`, {
      title: editMeta.value.title,
      duration: editMeta.value.duration,

      type: editMeta.value.type,
      quota:
        editMeta.value.type === "free" ? editMeta.value.quota || null : null,

      free_start_date:
        editMeta.value.type === "free"
          ? editMeta.value.free_start_date || null
          : null,
      free_valid_until:
        editMeta.value.type === "free"
          ? editMeta.value.free_valid_until || null
          : null,
      info_ig:
        editMeta.value.type === "free" ? editMeta.value.info_ig || null : null,
      info_wa:
        editMeta.value.type === "free" ? editMeta.value.info_wa || null : null,
      price: editMeta.value.price,
      discount: editMeta.value.discount,

      twk_count: tryout.value.twk_target,
      tiu_count: tryout.value.tiu_target,
      tkp_count: tryout.value.tkp_target,

      twk_pg: tryout.value.twk_pg,
      tiu_pg: tryout.value.tiu_pg,
      tkp_pg: tryout.value.tkp_pg,
    });

    tryout.value.title = editMeta.value.title;
    tryout.value.duration = editMeta.value.duration;
    tryout.value.type = editMeta.value.type;
    tryout.value.quota =
      editMeta.value.type === "free" ? editMeta.value.quota || null : null;

    tryout.value.free_start_date =
      editMeta.value.type === "free"
        ? editMeta.value.free_start_date || null
        : null;
    tryout.value.free_valid_until =
      editMeta.value.type === "free"
        ? editMeta.value.free_valid_until || null
        : null;
    tryout.value.info_ig =
      editMeta.value.type === "free" ? editMeta.value.info_ig || null : null;
    tryout.value.info_wa =
      editMeta.value.type === "free" ? editMeta.value.info_wa || null : null;
    tryout.value.price = editMeta.value.price;
    tryout.value.discount = editMeta.value.discount;

    showNotification("Pengaturan tryout berhasil diperbarui");
  } catch (err) {
    showNotification(
      err.response?.data?.message || "Gagal memperbarui pengaturan",
      "error",
    );
  }
}

/* ================= REORDER ================= */

async function reorderQuestion(newList) {
  if (!newList) return;

  questions.value = newList;

  const orders = {};

  newList.forEach((item, index) => {
    orders[item.id] = index + 1;
  });

  try {
    await api.put(`/tryouts/${tryoutId}/reorder`, { orders });

    await fetchTryout();

    showNotification("Urutan soal berhasil diperbarui", "success");
  } catch (err) {
    console.error(err.response?.data || err);

    showNotification("Gagal menyimpan urutan soal", "error");
  }
}

/* ================= ADD SOAL ================= */

async function addQuestion(item) {
  try {
    await api.post(`/tryouts/${tryoutId}/attach`, {
      soal_id: item.id,
    });

    await fetchTryout();

    showNotification("Soal berhasil ditambahkan");
  } catch (err) {
    showNotification(
      err.response?.data?.message || "Gagal menambahkan soal",
      "error",
    );
  }
}

/* ================= REMOVE SOAL ================= */

async function removeQuestion(id) {
  try {
    await api.delete(`/tryouts/${tryoutId}/detach/${id}`);

    await fetchTryout();

    showNotification("Soal berhasil dihapus");
  } catch (err) {
    showNotification(
      err.response?.data?.message || "Gagal menghapus soal",
      "error",
    );
  }
}

/* ================= TOGGLE BANK SOAL ================= */

function toggleBankSoal() {
  showBankSoal.value = !showBankSoal.value;

  if (showBankSoal.value && bankSoal.value.length === 0) {
    fetchBankSoal();
  }
}

function formatDateTimeInput(value) {
  if (!value) return "";

  const raw = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) {
    return raw;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return `${raw}T00:00`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const pad = (num) => String(num).padStart(2, "0");

    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(
      parsed.getHours(),
    )}:${pad(parsed.getMinutes())}`;
  }

  const normalized = raw.replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(normalized)) {
    return normalized.slice(0, 16);
  }

  return "";
}

/* ================= BADGE ================= */

function badge(category) {
  if (category === "TWK") return "bg-blue-100 text-blue-600";
  if (category === "TIU") return "bg-green-100 text-green-600";
  if (category === "TKP") return "bg-orange-100 text-orange-600";
}

/* ================= TOTAL ================= */

const totalTWK = computed(
  () => questions.value.filter((q) => q.category === "TWK").length,
);

const totalTIU = computed(
  () => questions.value.filter((q) => q.category === "TIU").length,
);

const totalTKP = computed(
  () => questions.value.filter((q) => q.category === "TKP").length,
);

const totalTarget = computed(() => {
  if (!tryout.value) return 0;

  return (
    tryout.value.twk_target + tryout.value.tiu_target + tryout.value.tkp_target
  );
});

/* ================= FILTER BANK SOAL ================= */

const filteredBankSoal = computed(() => {
  const list = Array.isArray(bankSoal.value) ? bankSoal.value : [];

  return list
    .filter((soal) =>
      selectedCategory.value ? soal.category === selectedCategory.value : true,
    )
    .filter((soal) => !questions.value.some((q) => q.id === soal.id));
});

/* ================= QUOTA ================= */

function isQuotaFull(category) {
  if (category === "TWK") return totalTWK.value >= editTarget.value.twk;
  if (category === "TIU") return totalTIU.value >= editTarget.value.tiu;
  if (category === "TKP") return totalTKP.value >= editTarget.value.tkp;

  return false;
}

/* ================= INIT ================= */

onMounted(() => {
  fetchTryout();
});
</script>
