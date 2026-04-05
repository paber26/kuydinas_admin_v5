<template>
  <div
    v-if="modelValue && localForm"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    @click.self="$emit('update:modelValue', false)"
  >
    <div
      class="flex w-full max-w-6xl max-h-[94vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
    >
      <div class="shrink-0 border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Bank Soal
            </p>
            <h2 class="mt-1 text-2xl font-bold text-slate-800">Edit Soal</h2>
            <p class="mt-2 text-sm text-slate-500">
              Rapikan isi soal, jawaban, dan pembahasan dengan pola editor seperti detail tryout.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
              :disabled="saving"
              @click="submit"
            >
              {{ saving ? "Menyimpan..." : submitLabel }}
            </button>

            <button
              type="button"
              class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saving"
              @click="$emit('update:modelValue', false)"
            >
              Tutup
            </button>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="categoryBadgeClass(localForm.category)"
          >
            {{ localForm.category || "-" }}
          </span>
          <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
            {{ localForm.sub_category || "Tanpa subkategori" }}
          </span>
          <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
            {{ localForm.difficulty || "Tanpa level" }}
          </span>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-6">
        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div class="space-y-6">
            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-lg font-semibold text-slate-800">Pertanyaan</h3>
                  <p class="text-sm text-slate-500">Perbarui naskah utama soal beserta gambar dan rumus.</p>
                </div>
              </div>

              <div class="bank-soal-editor">
                <ckeditor
                  v-model="localForm.question"
                  :editor="ClassicEditor"
                  :config="editorConfig"
                  @ready="handleEditorReady('question', $event)"
                />
              </div>

              <div
                v-if="getResizeState('question').visible"
                class="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <span class="text-slate-600">Lebar gambar</span>
                <input
                  v-model="getResizeState('question').value"
                  type="number"
                  min="1"
                  max="99"
                  class="w-24 rounded-lg border border-slate-300 px-2 py-1"
                  placeholder="1-99"
                  @keydown.enter.prevent="applySelectedImageResize('question')"
                />
                <span class="text-slate-500">%</span>
                <button
                  type="button"
                  class="rounded-lg bg-slate-900 px-3 py-1 text-white"
                  @click="applySelectedImageResize('question')"
                >
                  Terapkan
                </button>
                <button
                  type="button"
                  class="rounded-lg border border-slate-300 px-3 py-1 text-slate-700"
                  @click="resetSelectedImageResize('question')"
                >
                  Original
                </button>
              </div>

              <div
                v-if="!isRichTextEmpty(localForm.question)"
                class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 rich-preview ck-content"
                v-html="renderLatex(localForm.question)"
              ></div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-slate-800">Opsi Jawaban</h3>
                <p class="text-sm text-slate-500">
                  {{ localForm.category === "TKP" ? "Atur skor tiap opsi dari 1 sampai 5." : "Pilih satu jawaban yang benar." }}
                </p>
              </div>

              <div class="space-y-4">
                <article
                  v-for="(option, index) in localForm.options || []"
                  :key="index"
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div class="flex flex-wrap items-center gap-3">
                    <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {{ option.label }}
                    </span>

                    <div class="text-sm text-slate-500">
                      Opsi {{ option.label }}
                    </div>

                    <div class="ml-auto flex items-center gap-3">
                      <template v-if="localForm.category !== 'TKP'">
                        <label class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                          <input
                            type="radio"
                            :value="option.label"
                            v-model="localForm.correct_answer"
                          />
                          Jawaban benar
                        </label>
                      </template>

                      <template v-else>
                        <label class="flex items-center gap-2 text-sm text-slate-600">
                          Skor
                          <input
                            v-model.number="option.score"
                            type="number"
                            min="1"
                            max="5"
                            class="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1"
                          />
                        </label>
                      </template>
                    </div>
                  </div>

                  <div class="mt-3 bank-soal-editor">
                    <ckeditor
                      v-model="option.text"
                      :editor="ClassicEditor"
                      :config="editorConfig"
                      @ready="handleEditorReady(`option-${option.label}`, $event)"
                    />
                  </div>

                  <div
                    v-if="getResizeState(`option-${option.label}`).visible"
                    class="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  >
                    <span class="text-slate-600">Lebar gambar</span>
                    <input
                      v-model="getResizeState(`option-${option.label}`).value"
                      type="number"
                      min="1"
                      max="99"
                      class="w-20 rounded-lg border border-slate-300 px-2 py-1"
                      placeholder="1-99"
                      @keydown.enter.prevent="
                        applySelectedImageResize(`option-${option.label}`)
                      "
                    />
                    <span class="text-slate-500">%</span>
                    <button
                      type="button"
                      class="rounded-lg bg-slate-900 px-2 py-1 text-white"
                      @click="applySelectedImageResize(`option-${option.label}`)"
                    >
                      Terapkan
                    </button>
                    <button
                      type="button"
                      class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700"
                      @click="resetSelectedImageResize(`option-${option.label}`)"
                    >
                      Original
                    </button>
                  </div>

                  <div
                    v-if="!isRichTextEmpty(option.text)"
                    class="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 rich-preview ck-content"
                    v-html="renderLatex(option.text)"
                  ></div>
                </article>
              </div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-slate-800">Pembahasan</h3>
                <p class="text-sm text-slate-500">Tambahkan alasan atau langkah penyelesaian agar mudah dicek.</p>
              </div>

              <div class="bank-soal-editor">
                <ckeditor
                  v-model="localForm.explanation"
                  :editor="ClassicEditor"
                  :config="editorConfig"
                  @ready="handleEditorReady('explanation', $event)"
                />
              </div>

              <div
                v-if="getResizeState('explanation').visible"
                class="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <span class="text-slate-600">Lebar gambar</span>
                <input
                  v-model="getResizeState('explanation').value"
                  type="number"
                  min="1"
                  max="99"
                  class="w-24 rounded-lg border border-slate-300 px-2 py-1"
                  placeholder="1-99"
                  @keydown.enter.prevent="applySelectedImageResize('explanation')"
                />
                <span class="text-slate-500">%</span>
                <button
                  type="button"
                  class="rounded-lg bg-slate-900 px-3 py-1 text-white"
                  @click="applySelectedImageResize('explanation')"
                >
                  Terapkan
                </button>
                <button
                  type="button"
                  class="rounded-lg border border-slate-300 px-3 py-1 text-slate-700"
                  @click="resetSelectedImageResize('explanation')"
                >
                  Original
                </button>
              </div>

              <div
                v-if="!isRichTextEmpty(localForm.explanation)"
                class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 rich-preview ck-content"
                v-html="renderLatex(localForm.explanation)"
              ></div>
            </section>
          </div>

          <aside class="space-y-6">
            <section class="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <h3 class="text-lg font-semibold text-slate-800">Informasi Soal</h3>
              <div class="mt-4 space-y-4">
                <div>
                  <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Kategori</label>
                  <input
                    :value="localForm.category"
                    type="text"
                    disabled
                    class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  />
                </div>

                <div>
                  <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Subkategori</label>
                  <input
                    v-model="localForm.sub_category"
                    type="text"
                    class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tingkat Kesulitan</label>
                  <select
                    v-model="localForm.difficulty"
                    class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div>
                  <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
                  <select
                    v-model="localForm.status"
                    class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 class="text-lg font-semibold text-slate-800">Ringkasan Jawaban</h3>
              <div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <template v-if="localForm.category === 'TKP'">
                  Soal TKP menggunakan skor per opsi. Pastikan nilai paling tinggi ada pada opsi terbaik.
                </template>
                <template v-else>
                  Jawaban benar saat ini:
                  <span class="font-semibold text-slate-900">
                    {{ localForm.correct_answer || "-" }}
                  </span>
                </template>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="option in localForm.options || []"
                  :key="option.label"
                  class="rounded-full border border-slate-200 px-3 py-1 text-xs"
                  :class="answerChipClass(option)"
                >
                  <template v-if="localForm.category === 'TKP'">
                    {{ option.label }} · skor {{ option.score ?? "-" }}
                  </template>
                  <template v-else>
                    {{ option.label }}{{ localForm.correct_answer === option.label ? " · benar" : "" }}
                  </template>
                </span>
              </div>
            </section>
          </aside>
        </div>
      </div>

      <div class="shrink-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="saving"
          @click="$emit('update:modelValue', false)"
        >
          Batal
        </button>

        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
          :disabled="saving"
          @click="submit"
        >
          {{ saving ? "Menyimpan..." : submitLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import "katex/dist/katex.min.css";
import api from "../../services/api.js";
import BankSoalEditor from "./BankSoalEditor.js";
import { renderRichHtmlWithLatex } from "../../utils/richText.js";

const props = defineProps({
  modelValue: Boolean,
  soal: Object,
  saving: {
    type: Boolean,
    default: false,
  },
  submitLabel: {
    type: String,
    default: "Simpan Perubahan",
  },
});

const emit = defineEmits(["update:modelValue", "update"]);

const localForm = ref(null);
const ClassicEditor = BankSoalEditor;
const editorInstances = new Map();

class LaravelImageUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.abortController = new AbortController();
  }

  upload() {
    return this.loader.file.then(async (file) => {
      const formData = new FormData();
      formData.append("upload", file);

      const response = await api.post("/uploads/images", formData, {
        signal: this.abortController.signal,
      });

      const url = response?.data?.default || response?.data?.url;
      if (!url)
        throw new Error("Upload gagal: URL tidak ditemukan di response");

      return { default: url };
    });
  }

  abort() {
    this.abortController.abort();
  }
}

function LaravelUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
    new LaravelImageUploadAdapter(loader);
}

const editorConfig = {
  licenseKey: "GPL",
  extraPlugins: [LaravelUploadAdapterPlugin],
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
      { name: "resizeImage:original", value: null, label: "Original" },
      { name: "resizeImage:25", value: "25", label: "25%" },
      { name: "resizeImage:50", value: "50", label: "50%" },
      { name: "resizeImage:75", value: "75", label: "75%" },
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

function createResizeUiState() {
  return { visible: false, value: "" };
}

const imageResizeState = reactive({
  question: createResizeUiState(),
  explanation: createResizeUiState(),
  optionStates: {},
});

function getResizeState(key) {
  if (key === "question" || key === "explanation") return imageResizeState[key];
  if (!imageResizeState.optionStates[key]) {
    imageResizeState.optionStates[key] = createResizeUiState();
  }
  return imageResizeState.optionStates[key];
}

function getSelectedImageElement(editor) {
  const selectedElement =
    editor?.model?.document?.selection?.getSelectedElement();
  if (!selectedElement) return null;
  if (
    selectedElement.name === "imageBlock" ||
    selectedElement.name === "imageInline"
  ) {
    return selectedElement;
  }
  return null;
}

function syncResizeState(key) {
  const editor = editorInstances.get(key);
  const state = getResizeState(key);
  const selectedImage = getSelectedImageElement(editor);

  if (!selectedImage) {
    state.visible = false;
    state.value = "";
    return;
  }

  state.visible = true;
  state.value = selectedImage.getAttribute("width") || "";
}

function handleEditorReady(key, editor) {
  editorInstances.set(key, editor);
  syncResizeState(key);

  const selection = editor.model.document.selection;
  selection.on("change:range", () => syncResizeState(key));
  selection.on("change:attribute", () => syncResizeState(key));
}

function applySelectedImageResize(key) {
  const editor = editorInstances.get(key);
  const state = getResizeState(key);
  const selectedImage = getSelectedImageElement(editor);
  if (!editor || !selectedImage) return;

  const value = Number(state.value);
  if (!Number.isInteger(value) || value < 1 || value > 99) return;

  editor.model.change((writer) => {
    writer.setAttribute("width", String(value), selectedImage);
  });

  syncResizeState(key);
}

function resetSelectedImageResize(key) {
  const editor = editorInstances.get(key);
  const selectedImage = getSelectedImageElement(editor);
  if (!editor || !selectedImage) return;

  editor.model.change((writer) => {
    writer.removeAttribute("width", selectedImage);
  });

  syncResizeState(key);
}

function renderLatex(text) {
  return renderRichHtmlWithLatex(text);
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

function categoryBadgeClass(category) {
  if (category === "TWK") return "bg-blue-100 text-blue-700";
  if (category === "TIU") return "bg-emerald-100 text-emerald-700";
  if (category === "TKP") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function answerChipClass(option) {
  if (localForm.value?.category === "TKP") {
    return "bg-white text-slate-700";
  }

  return localForm.value?.correct_answer === option.label
    ? "border-emerald-200 bg-emerald-50 font-semibold text-emerald-700"
    : "bg-white text-slate-600";
}

watch(
  () => props.soal,
  (newVal) => {
    if (newVal) {
      localForm.value = JSON.parse(JSON.stringify(newVal));
    }
  },
  { immediate: true },
);

function submit() {
  emit("update", localForm.value);
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
  margin: 1rem 0;
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

.rich-preview .image.image-style-wrap-text {
  clear: none;
  float: right;
  margin-left: 1rem;
  margin-right: 0;
}

.rich-preview .image.image-style-break-text {
  clear: both;
  float: none;
  margin-left: auto;
  margin-right: 0;
}

.rich-preview::after {
  clear: both;
  content: "";
  display: block;
}
</style>
