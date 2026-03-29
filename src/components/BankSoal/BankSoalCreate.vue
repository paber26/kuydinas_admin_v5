<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Tambah Soal SKD</h1>
      <p class="text-slate-500 text-sm">
        Tambahkan soal baru untuk TWK, TIU, atau TKP
      </p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border p-6 space-y-6">
      <!-- Kategori -->
      <div>
        <label class="text-sm font-medium text-slate-700">Kategori</label>
        <select
          v-model="form.category"
          class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Pilih Kategori</option>
          <option value="TWK">TWK</option>
          <option value="TIU">TIU</option>
          <option value="TKP">TKP</option>
        </select>
      </div>

      <!-- Subkategori -->
      <div>
        <label class="text-sm font-medium text-slate-700">Subkategori</label>
        <input
          v-model="form.sub_category"
          type="text"
          class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
          placeholder="Contoh: Pancasila"
        />
      </div>

      <!-- Tingkat Kesulitan -->
      <div>
        <label class="text-sm font-medium text-slate-700">
          Tingkat Kesulitan
        </label>
        <select
          v-model="form.difficulty"
          class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Pilih Kesulitan</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <!-- Pertanyaan -->
      <div>
        <label class="text-sm font-medium text-slate-700">Pertanyaan</label>
        <div class="mt-2">
          <ckeditor
            v-model="form.question"
            :editor="ClassicEditor"
            :config="editorConfig"
          />
        </div>
        <div
          v-if="!isRichTextEmpty(form.question)"
          class="mt-3 p-3 bg-slate-50 border rounded text-sm"
          v-html="renderLatex(form.question)"
        ></div>
      </div>

      <!-- Opsi Jawaban -->
      <div>
        <label class="text-sm font-medium text-slate-700 mb-2 block">
          Opsi Jawaban
        </label>

        <div
          v-for="(option, index) in form.options"
          :key="index"
          class="grid grid-cols-12 gap-3 mb-4"
        >
          <div class="col-span-12 sm:col-span-1 font-semibold pt-2">
            {{ option.label }}
          </div>

          <div class="col-span-12 sm:col-span-9">
            <ckeditor
              v-model="option.text"
              :editor="ClassicEditor"
              :config="editorConfig"
            />
            <div
              v-if="!isRichTextEmpty(option.text)"
              class="mt-2 text-xs text-slate-600"
              v-html="renderLatex(option.text)"
            ></div>
          </div>

          <div class="col-span-12 sm:col-span-2 flex items-center gap-2">
            <template v-if="form.category !== 'TKP'">
              <input
                type="radio"
                :value="option.label"
                v-model="form.correct_answer"
              />
              <span class="text-xs text-slate-500">Benar</span>
            </template>

            <template v-else>
              <input
                v-model.number="option.score"
                type="number"
                min="1"
                max="5"
                class="w-20 border rounded-lg px-2 py-1 text-sm"
                placeholder="Skor"
              />
            </template>
          </div>
        </div>

        <p v-if="form.category === 'TKP'" class="text-xs text-slate-500 mt-2">
          Untuk TKP, setiap opsi harus memiliki skor (1–5).
        </p>

        <p v-else class="text-xs text-slate-500 mt-2">
          Pilih satu jawaban yang benar.
        </p>
      </div>

      <!-- Pembahasan -->
      <div>
        <label class="text-sm font-medium text-slate-700">Pembahasan</label>
        <div class="mt-2">
          <ckeditor
            v-model="form.explanation"
            :editor="ClassicEditor"
            :config="editorConfig"
          />
        </div>
        <div
          v-if="!isRichTextEmpty(form.explanation)"
          class="mt-3 p-3 bg-slate-50 border rounded text-sm"
          v-html="renderLatex(form.explanation)"
        ></div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <router-link to="/banksoal" class="px-4 py-2 rounded-lg border text-sm">
          Batal
        </router-link>

        <button
          @click="submitForm"
          :disabled="loading"
          class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm"
        >
          {{ loading ? "Menyimpan..." : "Simpan Soal" }}
        </button>
      </div>
    </div>
    <BaseToast v-model="showToast" :type="toastType" :message="toastMessage" />
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useRouter } from "vue-router";
import api from "../../services/api.js";
import BaseToast from "../Toast/BaseToast.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const router = useRouter();

class Base64UploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.reader = null;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this.reader = new FileReader();
          this.reader.onload = () => resolve({ default: this.reader.result });
          this.reader.onerror = () => reject(this.reader.error);
          this.reader.onabort = () => reject();
          this.reader.readAsDataURL(file);
        }),
    );
  }

  abort() {
    if (this.reader) this.reader.abort();
  }
}

function Base64UploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
    new Base64UploadAdapter(loader);
}

const editorConfig = {
  licenseKey: "GPL",
  extraPlugins: [Base64UploadAdapterPlugin],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "link",
    "imageUpload",
    "|",
    "bulletedList",
    "numberedList",
    "blockQuote",
    "|",
    "undo",
    "redo",
  ],
};

/* ============================
   TOAST STATE
============================ */
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

function showNotification(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}

function renderLatex(text) {
  if (!text) return "";

  return text.replace(/\$(.*?)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false });
    } catch {
      return formula;
    }
  });
}

function isRichTextEmpty(html) {
  if (!html) return true;
  try {
    const doc = new DOMParser().parseFromString(String(html), "text/html");
    const text = (doc.body.textContent || "").replace(/\u00a0/g, " ").trim();
    if (text) return false;
  } catch {
    return String(html).trim() === "";
  }
  return !/<img\b|<figure\b|<table\b|<svg\b|<math\b/i.test(String(html));
}

/* ============================
   FORM STATE
============================ */
const form = reactive({
  category: "TWK",
  sub_category: "",
  difficulty: "",
  question: "",
  correct_answer: "",
  explanation: "",
  options: [
    { label: "A", text: "", score: null },
    { label: "B", text: "", score: null },
    { label: "C", text: "", score: null },
    { label: "D", text: "", score: null },
    { label: "E", text: "", score: null },
  ],
});

const loading = ref(false);

/* ============================
   CATEGORY WATCHER
   Reset correct answer & scores
============================ */
watch(
  () => form.category,
  (newCategory) => {
    form.correct_answer = "";

    form.options = form.options.map((opt) => ({
      label: opt.label,
      text: opt.text,
      score: newCategory === "TKP" ? null : null,
    }));
  },
);

/* ============================
   RESET FORM
============================ */
function resetForm() {
  form.category = "TWK";
  form.sub_category = "";
  form.difficulty = "";
  form.question = "";
  form.correct_answer = "";
  form.explanation = "";
  form.options = [
    { label: "A", text: "", score: null },
    { label: "B", text: "", score: null },
    { label: "C", text: "", score: null },
    { label: "D", text: "", score: null },
    { label: "E", text: "", score: null },
  ];
}

/* ============================
   SUBMIT
============================ */
async function submitForm() {
  // VALIDASI
  if (!form.category) {
    showNotification("Kategori wajib dipilih", "error");
    return;
  }

  if (isRichTextEmpty(form.question)) {
    showNotification("Pertanyaan tidak boleh kosong", "error");
    return;
  }

  const emptyOption = form.options.find((opt) => isRichTextEmpty(opt.text));
  if (emptyOption) {
    showNotification("Semua opsi jawaban wajib diisi", "error");
    return;
  }

  if (form.category !== "TKP" && !form.correct_answer) {
    showNotification("Jawaban benar wajib dipilih", "error");
    return;
  }

  if (form.category === "TKP") {
    const invalidScore = form.options.find(
      (opt) => opt.score === null || opt.score < 1 || opt.score > 5,
    );
    if (invalidScore) {
      showNotification("Setiap opsi TKP wajib memiliki skor 1–5", "error");
      return;
    }
  }

  try {
    loading.value = true;

    let cleanedOptions = [];

    if (form.category === "TKP") {
      cleanedOptions = form.options.map((opt) => ({
        label: opt.label,
        text: opt.text,
        score: opt.score,
      }));
    } else {
      cleanedOptions = form.options.map((opt) => ({
        label: opt.label,
        text: opt.text,
      }));
    }

    const payload = {
      category: form.category,
      sub_category: form.sub_category || null,
      difficulty: form.difficulty || null,
      question: String(form.question || "").trim(),
      options: cleanedOptions,
      correct_answer: form.category === "TKP" ? null : form.correct_answer,
      explanation: form.explanation ? String(form.explanation).trim() : null,
      status: "aktif",
    };

    await api.post("/soal", payload);

    showNotification("Soal berhasil disimpan", "success");

    resetForm();

    // Optional redirect
    setTimeout(() => {
      router.push("/banksoal");
    }, 1200);
  } catch (error) {
    console.error("API ERROR:", error.response?.data);

    showNotification(
      error.response?.data?.message || "Gagal menyimpan soal",
      "error",
    );
  } finally {
    loading.value = false;
  }
}
</script>
