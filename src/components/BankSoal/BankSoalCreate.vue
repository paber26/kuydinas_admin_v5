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

      <div>
        <label class="text-sm font-medium text-slate-700">Status</label>
        <select
          v-model="form.status"
          class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
        >
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
      </div>

      <!-- Pertanyaan -->
      <div>
        <label class="text-sm font-medium text-slate-700">Pertanyaan</label>
        <div class="mt-2 bank-soal-editor">
          <ckeditor
            v-model="form.question"
            :editor="ClassicEditor"
            :config="editorConfig"
          />
        </div>
        <div
          v-if="!isRichTextEmpty(form.question)"
          class="mt-3 p-3 bg-slate-50 border rounded text-sm rich-preview ck-content"
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
            <div class="bank-soal-editor">
              <ckeditor
                v-model="option.text"
                :editor="ClassicEditor"
                :config="editorConfig"
              />
            </div>
            <div
              v-if="!isRichTextEmpty(option.text)"
              class="mt-2 text-xs text-slate-600 rich-preview ck-content"
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
        <div class="mt-2 bank-soal-editor">
          <ckeditor
            v-model="form.explanation"
            :editor="ClassicEditor"
            :config="editorConfig"
          />
        </div>
        <div
          v-if="!isRichTextEmpty(form.explanation)"
          class="mt-3 p-3 bg-slate-50 border rounded text-sm rich-preview ck-content"
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
import BankSoalEditor from "./BankSoalEditor.js";

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
  image: {
    resizeUnit: "%",
    resizeOptions: [
      {
        name: "resizeImage:original",
        value: null,
        label: "Original",
      },
      {
        name: "resizeImage:25",
        value: "25",
        label: "25%",
      },
      {
        name: "resizeImage:50",
        value: "50",
        label: "50%",
      },
      {
        name: "resizeImage:75",
        value: "75",
        label: "75%",
      },
    ],
    toolbar: [
      "imageStyle:inline",
      "imageStyle:wrapText",
      "imageStyle:breakText",
      "|",
      "resizeImage",
      "|",
      "toggleImageCaption",
      "imageTextAlternative",
    ],
  },
};

const ClassicEditor = BankSoalEditor;

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

function createDefaultOptions() {
  return ["A", "B", "C", "D", "E"].map((label) => ({
    label,
    text: "",
    score: null,
  }));
}

function createDebugOptions() {
  const image = createDebugImageDataUri();

  return [
    { label: "A", text: "<p>Pancasila sebagai dasar negara</p>", score: null },
    { label: "B", text: "<p>UUD 1945 sebagai dasar negara</p>", score: null },
    {
      label: "C",
      text: `
        <p>Pembukaan UUD 1945 alinea keempat</p>
        <figure class="image">
          <img src="${image}" alt="Debug image opsi jawaban" />
        </figure>
      `,
      score: null,
    },
    {
      label: "D",
      text: "<p>Tap MPR tentang garis besar haluan negara</p>",
      score: null,
    },
    {
      label: "E",
      text: "<p>Peraturan presiden tentang pendidikan</p>",
      score: null,
    },
  ];
}

function createDebugImageDataUri() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="240" viewBox="0 0 640 240">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="640" height="240" rx="24" fill="url(#bg)"/>
      <circle cx="130" cy="120" r="56" fill="rgba(255,255,255,0.18)"/>
      <path d="M110 132 L130 108 L150 132 L170 100" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="220" y="108" fill="#ffffff" font-size="30" font-family="Arial, sans-serif" font-weight="700">Debug Image</text>
      <text x="220" y="148" fill="#dbeafe" font-size="18" font-family="Arial, sans-serif">Prefilled base64/SVG image for testing upload preview</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function createDebugQuestionHtml() {
  const image = createDebugImageDataUri();

  return `
    <p>Nilai dasar yang menjadi sumber dari segala sumber hukum di Indonesia adalah?</p>
    <figure class="image">
      <img src="${image}" alt="Debug image soal" />
    </figure>
    <p>Lihat gambar di atas sebagai tes render image di CKEditor.</p>
  `;
}

function createInitialFormState() {
  const useDebugSeed = import.meta.env.DEV;

  return {
    category: "TWK",
    sub_category: useDebugSeed ? "Pancasila" : "",
    difficulty: useDebugSeed ? "Easy" : "",
    status: "aktif",
    question: useDebugSeed ? createDebugQuestionHtml() : "",
    correct_answer: useDebugSeed ? "C" : "",
    explanation: useDebugSeed
      ? `
          <p>Jawaban yang benar adalah <strong>C</strong> karena Pembukaan UUD 1945 alinea keempat memuat dasar negara dan tujuan bernegara.</p>
          <figure class="image">
            <img src="${createDebugImageDataUri()}" alt="Debug image pembahasan" />
          </figure>
        `
      : "",
    options: useDebugSeed ? createDebugOptions() : createDefaultOptions(),
  };
}

function normalizeHtml(value) {
  return String(value || "").trim();
}

function normalizeOptionalText(value) {
  const text = String(value || "").trim();
  return text || null;
}

function normalizeOptions() {
  return form.options.map((option) => {
    const normalized = {
      label: option.label,
      text: normalizeHtml(option.text),
    };

    if (form.category === "TKP") {
      normalized.score = Number(option.score);
    }

    return normalized;
  });
}

function buildPayload() {
  return {
    category: form.category,
    sub_category: normalizeOptionalText(form.sub_category),
    difficulty: normalizeOptionalText(form.difficulty),
    question: normalizeHtml(form.question),
    options: normalizeOptions(),
    correct_answer:
      form.category === "TKP"
        ? null
        : String(form.correct_answer || "")
            .trim()
            .toUpperCase(),
    explanation: normalizeOptionalText(form.explanation),
    status: form.status,
  };
}

function extractErrorMessage(error) {
  const responseData = error?.response?.data;

  if (responseData?.errors && typeof responseData.errors === "object") {
    const firstError = Object.values(responseData.errors).flat()[0];
    if (firstError) return firstError;
  }

  if (
    typeof responseData?.message === "string" &&
    responseData.message.trim()
  ) {
    return responseData.message;
  }

  return "Gagal menyimpan soal";
}

/* ============================
   FORM STATE
============================ */
const form = reactive(createInitialFormState());

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
      score: newCategory === "TKP" ? opt.score : null,
    }));
  },
);

/* ============================
   RESET FORM
============================ */
function resetForm() {
  Object.assign(form, createInitialFormState());
}

/* ============================
   SUBMIT
============================ */
async function submitForm() {
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
      (opt) =>
        opt.score === null ||
        opt.score === "" ||
        !Number.isInteger(Number(opt.score)) ||
        Number(opt.score) < 1 ||
        Number(opt.score) > 5,
    );
    if (invalidScore) {
      showNotification("Setiap opsi TKP wajib memiliki skor 1-5", "error");
      return;
    }
  }

  try {
    loading.value = true;

    const payload = buildPayload();

    await api.post("/soal", payload);

    showNotification("Soal berhasil disimpan", "success");

    resetForm();

    setTimeout(() => {
      router.push("/banksoal");
    }, 1200);
  } catch (error) {
    console.error("API ERROR:", error.response?.data);
    showNotification(extractErrorMessage(error), "error");
  } finally {
    loading.value = false;
  }
}
</script>

<style>
.bank-soal-editor .ck-content .image {
  max-width: 100%;
}

.bank-soal-editor .ck-content .image img {
  display: block;
  height: auto;
  max-width: 100%;
}

.bank-soal-editor .ck-content .image.image_resized {
  box-sizing: border-box;
  max-width: 100%;
}

.rich-preview figure.image {
  box-sizing: border-box;
  margin: 1rem auto;
  max-width: 100%;
}

.rich-preview figure.image img {
  display: block;
  height: auto;
  max-width: 100%;
}

.rich-preview figure.image.image_resized {
  box-sizing: border-box;
  max-width: 100%;
}

.rich-preview .image.image-style-block {
  margin-left: auto;
  margin-right: auto;
}

.rich-preview .image.image-style-side,
.rich-preview .image.image-style-align-left {
  clear: none;
  float: left;
  margin-left: 0;
  margin-right: 1rem;
}

.rich-preview .image.image-style-align-right {
  clear: none;
  float: right;
  margin-left: 1rem;
  margin-right: 0;
}

.rich-preview .image.image-style-align-center {
  clear: both;
  float: none;
  margin-left: auto;
  margin-right: auto;
}

.rich-preview .image.image-style-inline {
  display: inline-block;
  margin: 0 1rem 0 0;
  vertical-align: middle;
}

.rich-preview::after {
  clear: both;
  content: "";
  display: block;
}
</style>
