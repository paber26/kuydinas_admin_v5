<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Kelola Tryout</h1>

        <p class="text-slate-500 text-sm mt-1">
          ID Tryout: {{ route.params.id }}
        </p>
      </div>

      <router-link
        to="/tryout-builder"
        class="px-4 py-2 rounded-lg bg-white border hover:bg-slate-100"
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

    <!-- BUTTON TAMBAH -->
    <div class="flex justify-end mb-6">
      <button
        @click="toggleBankSoal"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
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
      class="mt-10 bg-white rounded-2xl shadow-sm border p-6"
    >
      <h2 class="text-xl font-semibold mb-6">Pilih Soal</h2>

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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../../services/api";

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

/* ================= TOAST ================= */

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

async function reorderQuestion({ category, list }) {
  const others = questions.value.filter((q) => q.category !== category);

  questions.value = [...others, ...list];

  const orders = {};

  questions.value.forEach((q, index) => {
    orders[q.id] = index + 1;
  });

  try {
    await api.post(`/tryouts/${tryoutId}/reorder`, {
      orders: orders,
    });

    toastMessage.value = "Urutan soal diperbarui";
    toastType.value = "success";
    showToast.value = true;
  } catch (err) {
    toastMessage.value = "Gagal menyimpan urutan";
    toastType.value = "error";
    showToast.value = true;
  }
}

/* ================= FETCH TRYOUT ================= */

async function fetchTryout() {
  const res = await api.get(`/tryouts/${tryoutId}`);

  tryout.value = res.data.data;

  questions.value = res.data.data.soals || [];

  editTarget.value = {
    twk: tryout.value.twk_target,
    tiu: tryout.value.tiu_target,
    tkp: tryout.value.tkp_target,
  };
}

/* ================= FETCH BANK SOAL ================= */

async function fetchBankSoal() {
  const res = await api.get("/soal");

  bankSoal.value = res.data.data || [];
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

    toastMessage.value = "Komposisi tryout berhasil diperbarui";
    toastType.value = "success";
    showToast.value = true;
  } catch (err) {
    toastMessage.value =
      err.response?.data?.message || "Gagal memperbarui komposisi";

    toastType.value = "error";
    showToast.value = true;
  }
}

/* ================= ADD SOAL ================= */

async function addQuestion(item) {
  try {
    await api.post(`/tryouts/${tryoutId}/attach`, {
      soal_id: item.id,
    });

    questions.value.push(item);

    toastMessage.value = "Soal berhasil ditambahkan";
    toastType.value = "success";
    showToast.value = true;
  } catch (err) {
    toastMessage.value = "Gagal menambahkan soal";
    toastType.value = "error";
    showToast.value = true;
  }
}

/* ================= REMOVE SOAL ================= */

async function removeQuestion(id) {
  try {
    await api.delete(`/tryouts/${tryoutId}/detach/${id}`);

    questions.value = questions.value.filter((q) => q.id !== id);

    toastMessage.value = "Soal berhasil dihapus";
    toastType.value = "success";
    showToast.value = true;
  } catch (err) {
    toastMessage.value = "Gagal menghapus soal";
    toastType.value = "error";
    showToast.value = true;
  }
}

/* ================= TOGGLE BANK SOAL ================= */

function toggleBankSoal() {
  showBankSoal.value = !showBankSoal.value;

  if (showBankSoal.value && bankSoal.value.length === 0) {
    fetchBankSoal();
  }
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
  return bankSoal.value
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
