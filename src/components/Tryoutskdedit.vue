<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Edit Tryout</h1>
          <p class="text-sm text-gray-500">
            Perbarui informasi tryout dan soal-soalnya.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="$router.back()"
            class="px-4 py-2 bg-white border rounded-md text-sm shadow-sm hover:shadow"
          >
            Batal
          </button>
          <button
            @click="save"
            :disabled="loading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {{ loading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </div>

      <!-- Meta -->
      <section class="bg-white rounded-2xl shadow p-6 mb-8 border">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">
          Informasi Tryout
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Judul -->
          <div class="p-4 border border-gray-100 rounded-lg bg-white">
            <label class="label">Judul Tryout</label>
            <input v-model="meta.title" type="text" class="input" />
          </div>

          <!-- Kode -->
          <div class="p-4 border border-gray-100 rounded-lg bg-white">
            <label class="label">Kode Tryout</label>
            <input v-model="meta.code" type="text" class="input" />
          </div>

          <!-- Durasi -->
          <div class="p-4 border border-gray-100 rounded-lg bg-white">
            <label class="label">Durasi (menit)</label>
            <input
              v-model.number="meta.duration"
              type="number"
              min="0"
              class="input"
            />
          </div>

          <!-- Passing Grade -->
          <div class="p-4 border border-gray-100 rounded-lg bg-white">
            <label class="label">Passing Grade</label>
            <input
              v-model.number="meta.passingScore"
              type="number"
              min="0"
              max="100"
              class="input"
            />
          </div>

          <!-- Gambar Tryout (full width) -->
          <div
            class="col-span-1 md:col-span-2 p-4 border border-gray-100 rounded-lg bg-white"
          >
            <label class="label">Gambar Tryout</label>
            <div class="flex items-center gap-4">
              <label
                class="inline-flex items-center px-4 py-2 bg-white border rounded-md shadow-sm text-sm cursor-pointer hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0016.586 6L13 2.414A2 2 0 0011.586 2H4z"
                  />
                </svg>
                <span class="text-sm text-gray-700">Pilih file</span>
                <input type="file" @change="onImageUpload" class="sr-only" />
              </label>

              <div
                v-if="previewImage"
                class="w-40 h-24 rounded overflow-hidden border"
              >
                <img :src="previewImage" class="object-cover w-full h-full" />
              </div>

              <div v-else class="text-sm text-gray-500">No file chosen</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Questions list: single-column design -->
      <div class="space-y-6">
        <section
          v-for="(q, index) in questions"
          :key="q.id"
          class="bg-white rounded-2xl shadow p-6 border"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-700">
                Soal Nomor {{ index + 1 }}
              </h3>
              <p class="text-sm text-gray-500">
                Atur soal, opsi, poin, jawaban, dan pembahasan.
              </p>
            </div>
          </div>

          <!-- Pertanyaan -->
          <div class="mb-4 border border-gray-300 rounded-lg p-4">
            <label class="label">Pertanyaan</label>
            <textarea
              v-model="q.prompt"
              rows="4"
              class="input textarea w-full"
            ></textarea>
          </div>

          <!-- Opsi jawaban (single column) -->
          <div class="mb-4">
            <label class="label">Opsi Jawaban</label>
            <div class="space-y-3">
              <div
                v-for="(opt, i) in q.options"
                :key="i"
                class="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div class="w-6 text-gray-700 font-semibold">
                  {{ optionLabel(i) }}.
                </div>
                <input
                  v-model="q.options[i]"
                  type="text"
                  class="input flex-1"
                  :placeholder="`Isi opsi ${optionLabel(i)}`"
                />
                <div class="w-24 text-right">
                  <label class="text-xs text-gray-500 block text-right"
                    >Poin</label
                  >
                  <input
                    v-model.number="q.points[i]"
                    type="number"
                    class="input w-full text-right"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Jawaban Benar -->
          <div class="mb-4">
            <label class="label">Jawaban Benar</label>
            <div class="p-3 bg-gray-50 border rounded">
              <div
                v-for="(opt, i) in q.options"
                :key="i"
                class="flex items-center gap-3 mb-2"
              >
                <input
                  type="radio"
                  :id="`ans-${q.id}-${i}`"
                  :value="optionLabel(i)"
                  v-model="q.answer"
                  class="form-radio"
                />
                <label :for="`ans-${q.id}-${i}`" class="text-sm text-gray-700"
                  >{{ optionLabel(i) }} —
                  <span class="text-gray-600">{{
                    opt || "Kosong"
                  }}</span></label
                >
                <span class="ml-auto w-16 text-right text-sm text-gray-500"
                  >Poin: {{ q.points[i] || 0 }}</span
                >
              </div>
            </div>
          </div>

          <!-- Pembahasan -->
          <div class="border border-gray-300 rounded-lg p-4 mt-4">
            <label class="label">Pembahasan</label>
            <textarea
              v-model="q.explanation"
              rows="4"
              class="input textarea w-full"
            ></textarea>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api.js";

let uid = 1;
function createEmptyQuestion() {
  return {
    id: uid++,
    prompt: "",
    options: ["", "", "", "", ""],
    points: [0, 0, 0, 0, 0],
    answer: "",
    explanation: "",
  };
}
export default {
  data() {
    return {
      loading: false,
      meta: {
        title: "",
        code: "",
        duration: 120,
        passingScore: 70,
        startAt: "",
        endAt: "",
        image: "",
      },
      previewImage: "",
      questions: [createEmptyQuestion()],
    };
  },
  async mounted() {
    // try to load existing tryout if `eid` provided in route params or query
    const eid = this.$route?.params?.eid || this.$route?.query?.eid || null;
    if (eid) await this.loadTryout(eid);
  },
  methods: {
    optionLabel(i) {
      return ["A", "B", "C", "D", "E"][i] || String.fromCharCode(65 + i);
    },

    async loadTryout(eid) {
      try {
        this.loading = true;
        // Endpoint mirrors tryoutskdlihat route in backend
        const res = await api.get(`/tryoutskd/info/${eid}`);
        const data = res.data;

        // Try multiple possible response shapes
        const payload = data.data || data.payload || data.tryout || data;

        // Map meta if available
        if (payload.meta) {
          Object.assign(this.meta, payload.meta);
        } else {
          // fallback common fields
          this.meta.title = payload.title || payload.judul || this.meta.title;
          this.meta.code = payload.code || payload.kode || this.meta.code;
          this.meta.duration =
            payload.duration || payload.durasi || this.meta.duration;
          this.meta.passingScore =
            payload.passingScore || payload.passing || this.meta.passingScore;
          this.meta.startAt =
            payload.startAt || payload.mulai || this.meta.startAt;
          this.meta.endAt = payload.endAt || payload.selesai || this.meta.endAt;
          this.meta.image = payload.image || payload.gambar || this.meta.image;
        }

        if (this.meta.image) this.previewImage = this.meta.image;

        // Fetch full question list for editing
        const soalRes = await api.get(`/tryoutskd/lihat/${eid}`);

        const fullSoal = soalRes.data || [];
        if (Array.isArray(fullSoal) && fullSoal.length) {
          this.questions = fullSoal.map((s) => {
            const q = createEmptyQuestion();
            q.id = s.id ?? s.soal_no ?? s.no ?? uid++;
            q.qid = s.qid ?? s.q_id ?? s.quiz_id ?? null;
            q.prompt = s.question || s.pertanyaan || s.prompt || "";

            // build options from option_a..option_e (fallback to options array)
            const optA = s.option_a ?? s.opsi_a ?? null;
            const optB = s.option_b ?? s.opsi_b ?? null;
            const optC = s.option_c ?? s.opsi_c ?? null;
            const optD = s.option_d ?? s.opsi_d ?? null;
            const optE = s.option_e ?? s.opsi_e ?? null;
            const builtOptions = [optA, optB, optC, optD, optE].map((o) =>
              o == null ? "" : String(o)
            );

            // if API provided an array-style options field, prefer that when non-empty
            if (Array.isArray(s.options) && s.options.length) {
              q.options = s.options
                .slice(0, 5)
                .concat(new Array(Math.max(0, 5 - s.options.length)).fill(""))
                .slice(0, 5);
            } else {
              q.options = builtOptions;
            }

            // build option ids (if provided) to resolve correct_optionid
            const optIdA =
              s.optionid_a ?? s.option_id_a ?? s.option_a_id ?? null;
            const optIdB =
              s.optionid_b ?? s.option_id_b ?? s.option_b_id ?? null;
            const optIdC =
              s.optionid_c ?? s.option_id_c ?? s.option_c_id ?? null;
            const optIdD =
              s.optionid_d ?? s.option_id_d ?? s.option_d_id ?? null;
            const optIdE =
              s.optionid_e ?? s.option_id_e ?? s.option_e_id ?? null;
            const optionIds = [optIdA, optIdB, optIdC, optIdD, optIdE];

            // points per option (if provided as point_a etc.)
            const pA = s.point_a ?? s.poin_a ?? s.poin_a ?? s.points_a ?? null;
            const pB = s.point_b ?? s.poin_b ?? s.points_b ?? null;
            const pC = s.point_c ?? s.poin_c ?? s.points_c ?? null;
            const pD = s.point_d ?? s.poin_d ?? s.points_d ?? null;
            const pE = s.point_e ?? s.poin_e ?? s.points_e ?? null;
            const builtPoints = [pA, pB, pC, pD, pE].map((v) =>
              typeof v === "number" ? v : v ? Number(v) : 0
            );
            q.points = builtPoints;

            // determine correct answer: either provided as correct_optionid (matches optionIds) or as letter
            const correctId =
              s.correct_optionid ?? s.correct_option_id ?? s.correct;
            let answerLetter = "";
            if (correctId) {
              const idx = optionIds.findIndex(
                (id) => id && String(id) === String(correctId)
              );
              if (idx >= 0) answerLetter = ["A", "B", "C", "D", "E"][idx];
              // also handle case where correctId already is a letter
              if (
                !answerLetter &&
                typeof correctId === "string" &&
                /^[A-Ea-e]$/.test(correctId)
              ) {
                answerLetter = correctId.toUpperCase();
              }
            }
            // fallback: some APIs send 'answer' as letter or index
            if (!answerLetter && (s.answer || s.jawaban)) {
              const cand = s.answer || s.jawaban;
              if (typeof cand === "number")
                answerLetter = ["A", "B", "C", "D", "E"][cand] || "";
              else if (typeof cand === "string" && /^[A-Ea-e]$/.test(cand))
                answerLetter = cand.toUpperCase();
            }
            q.answer = answerLetter;

            q.explanation = s.explanation || s.pembahasan || s.keterangan || "";
            return q;
          });
        }

        // Map questions
        const qs = payload.questions || payload.soal || payload.items || [];
        if (Array.isArray(qs) && qs.length) {
          this.questions = qs.map((s) => {
            const q = createEmptyQuestion();
            q.id = s.id ?? s.no ?? uid++;
            q.qid = s.qid ?? s.q_id ?? s.quiz_id ?? null;
            q.prompt = s.prompt || s.pertanyaan || s.question || "";

            // normalize options and points
            const options = s.options || s.opsi || s.choices || [];
            q.options = Array.isArray(options)
              ? options
                  .slice(0, 5)
                  .concat(new Array(Math.max(0, 5 - options.length)).fill(""))
                  .slice(0, 5)
              : ["", "", "", "", ""];

            const points = s.points || s.poin || s.scores || [];
            q.points = Array.isArray(points)
              ? points
                  .slice(0, 5)
                  .concat(new Array(Math.max(0, 5 - points.length)).fill(0))
                  .slice(0, 5)
              : [0, 0, 0, 0, 0];

            q.answer = s.answer || s.jawaban || "";
            q.explanation = s.explanation || s.pembahasan || "";
            return q;
          });
        }
      } catch (err) {
        console.error("loadTryout error", err);
        alert("Gagal memuat data tryout. Cek console.");
      } finally {
        this.loading = false;
      }
    },

    onImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        this.meta.image = reader.result;
      };
      reader.readAsDataURL(file);
    },

    async save() {
      if (!this.meta.title) return alert("Judul Tryout wajib diisi");

      // prepare payload (include eid so backend knows which tryout to update)
      const payload = {
        eid:
          this.meta.code ||
          this.meta.eid ||
          this.$route?.params?.eid ||
          this.$route?.query?.eid ||
          null,
        meta: this.meta,
        questions: this.questions.map((q) => ({
          id: q.id,
          qid: q.qid ?? null,
          prompt: q.prompt,
          options: q.options,
          points: q.points,
          answer: q.answer,
          explanation: q.explanation,
        })),
      };

      try {
        this.loading = true;
        // send request
        const resp = await api.post("/tryoutskd/edit", payload);

        // handle response
        if (
          resp &&
          resp.data &&
          (resp.data.success || resp.data.status === "ok")
        ) {
          alert("Perubahan berhasil disimpan");
          // navigate to view page — ensure we use the correct eid source
          const targetEid =
            this.meta.code ||
            this.meta.eid ||
            this.$route?.params?.eid ||
            this.$route?.query?.eid ||
            null;
          // this.$router
          //   .push({
          //     name: "Tryoutskdlihat",
          //     params: { eid: targetEid || "" },
          //   })

          this.$router.push(`/tryoutskd/lihat/${targetEid}`).catch(() => {});
        } else {
          // show server-provided message if present
          const msg =
            (resp && resp.data && (resp.data.message || resp.data.error)) ||
            "Simpan selesai, periksa respon server";
          console.warn("[save] non-ok response:", resp && resp.data);
          alert(msg);
        }
      } catch (err) {
        // detailed error logging
        console.error("[save] error", err);
        // axios error with response
        if (err && err.response) {
          console.error("[save] error response status:", err.response.status);
          console.error("[save] error response data:", err.response.data);
          const serverMsg =
            err.response.data &&
            (err.response.data.message ||
              err.response.data.error ||
              JSON.stringify(err.response.data));
          alert(`Gagal menyimpan: ${serverMsg || err.message}`);
        } else if (err && err.request) {
          // request was made but no response
          console.error("[save] no response received", err.request);
          alert(
            "Gagal menyimpan: tidak ada respon dari server (network/CORS). Cek console network."
          );
        } else {
          alert(`Gagal menyimpan: ${err.message}`);
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 0.375rem; /* rounded-md */
  font-size: 1rem;
  line-height: 1.5;
  background: transparent;
}
.input:focus {
  outline: none;
  border-color: #6366f1; /* indigo-500 */
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12); /* subtle focus ring */
}
.textarea {
  width: 100%;
  min-height: 120px;
  resize: vertical;
}
.label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #4b5563; /* gray-600 */
  margin-bottom: 0.5rem;
}
.input-file-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  font-size: 0.875rem;
  cursor: pointer;
}
.sr-only {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}
.w-20 {
  width: 5rem;
}
.min-w-0 {
  min-width: 0;
}
.form-radio {
  width: 1rem;
  height: 1rem;
  accent-color: #6366f1;
}
</style>
