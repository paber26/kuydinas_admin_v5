<template>
  <section class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Detail Try Out</h1>
        <div class="text-sm text-slate-500 mt-1">
          Lihat informasi lengkap & soal
        </div>
      </div>
      <div class="flex gap-3">
        <button @click="goBack" class="px-3 py-2 border rounded text-sm">
          Kembali
        </button>
        <button
          @click="printPage"
          class="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
        >
          Cetak
        </button>
      </div>
    </div>

    <!-- Info card (expanded with more fields) -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="space-y-4">
          <div>
            <div class="text-xs text-slate-500">Nama Try Out</div>
            <div class="font-medium text-slate-800">{{ info.name || "-" }}</div>
          </div>

          <div>
            <div class="text-xs text-slate-500">Jumlah TWK</div>
            <div class="font-medium text-slate-800">
              {{ info.jumlah_twk ?? info.twk ?? "-" }}
            </div>
          </div>

          <div>
            <div class="text-xs text-slate-500">Jumlah TIU</div>
            <div class="font-medium text-slate-800">
              {{ info.jumlah_tiu ?? info.tiu ?? "-" }}
            </div>
          </div>

          <div>
            <div class="text-xs text-slate-500">Jumlah TKP</div>
            <div class="font-medium text-slate-800">
              {{ info.jumlah_tkp ?? info.tkp ?? "-" }}
            </div>
          </div>

          <div>
            <div class="text-xs text-slate-500">Waktu Pengerjaan (menit)</div>
            <div class="font-medium text-slate-800">
              {{ info.duration || info.waktu || "-" }}
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <div class="text-xs text-slate-500">Harga</div>
            <div class="font-medium text-slate-800">
              {{ info.price ?? "-" }}
            </div>
          </div>

          <div>
            <div class="text-xs text-slate-500">Postingan Instagram</div>
            <div
              v-if="info.instagram || info.postingan"
              class="font-medium text-indigo-600 truncate max-w-full"
            >
              <a :href="info.instagram || info.postingan" target="_blank">{{
                info.instagram || info.postingan
              }}</a>
            </div>
            <div class="text-slate-400" v-else>-</div>
          </div>

          <div>
            <div class="text-xs text-slate-500">Grup WhatsApp</div>
            <div
              v-if="info.whatsapp || info.grupwa"
              class="font-medium text-indigo-600 truncate max-w-full"
            >
              <a :href="info.whatsapp || info.grupwa" target="_blank">{{
                info.whatsapp || info.grupwa
              }}</a>
            </div>
            <div class="text-slate-400" v-else>-</div>
          </div>

          <div>
            <div class="text-xs text-slate-500">Informasi</div>
            <div
              v-if="info.informasi"
              class="font-medium text-indigo-600 truncate max-w-full"
            >
              <a :href="info.informasi" target="_blank">
                {{ info.informasi || "-" }}
              </a>
            </div>
          </div>

          <div>
            <div class="text-xs text-slate-500">Status</div>
            <div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs',
                  info.status === 'enabled'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-600',
                ]"
              >
                {{ info.status === "enabled" ? "Enabled" : "Disabled" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Questions -->
    <div v-if="loading" class="text-slate-500">Memuat data...</div>

    <div v-else>
      <div
        v-for="(q, idx) in questions"
        :key="q.id"
        class="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 p-6"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="text-sm text-slate-500">Soal Nomor {{ idx + 1 }}</div>
            <div class="mt-2 text-slate-800" v-html="q.question"></div>
          </div>
        </div>

        <div class="mt-4">
          <!-- Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(opt, k) in q.options"
              :key="k"
              class="p-3 rounded border relative"
              :class="
                opt.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-white'
              "
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-medium text-slate-800">{{ opt.key }}.</span>
                  <span class="font-normal text-slate-800">
                    {{ opt.text }}</span
                  >
                </div>
                <div class="text-sm text-slate-500">
                  Poin: {{ opt.point ?? 0 }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div class="text-xs text-slate-500">Pembahasan</div>
            <div
              class="mt-2 text-sm text-slate-700"
              v-html="q.explanation || '-'"
            />
          </div>
        </div>
      </div>

      <div v-if="questions.length === 0" class="text-slate-400">
        Tidak ada soal untuk tryout ini.
      </div>
    </div>
    <button
      @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
    >
      ↑
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api.js";

const route = useRoute();
const router = useRouter();
const eid = route.params.eid || route.query.eid || "";
console.log("Tryout ID from route:", eid);

const info = ref({});
const questions = ref([]);
const loading = ref(false);

async function fetchInfoSKD() {
  try {
    const res = await api.get(`/tryoutskd/info/${eid}`);
    const data = res.data;

    info.value = {
      name: data.title ?? data.name ?? "-",
      jumlah_twk: data.twk ?? data.jumlah_twk ?? "-",
      jumlah_tiu: data.tiu ?? data.jumlah_tiu ?? "-",
      jumlah_tkp: data.tkp ?? data.jumlah_tkp ?? "-",
      duration: data.time ?? data.duration ?? data.waktu ?? "-",
      price: data.harga ?? data.price ?? "-",
      instagram: data.postingan ?? data.instagram ?? "-",
      whatsapp: data.grupwa ?? data.whatsapp ?? "-",
      informasi: data.informasi ?? data.description ?? "-",
      status: data.status ?? "disabled",
    };
  } catch (err) {
    console.error("Error fetch info SKD:", err);
  }
}

async function fetchDetail() {
  loading.value = true;
  try {
    // Try the pivot endpoint (Eloquent controller that returns pivoted options)
    // Adjust the path if your API route is different. Example: /api/tryout/{eid}/pivot
    let res;
    try {
      res = await api.get(`/tryoutskd/lihat/${eid}`);
    } catch (e) {
      console.error("Gagal memuat tryouts:", e);
    }

    const payload = res.data;

    // If payload is an array of pivoted rows (one row per question)
    if (Array.isArray(payload)) {
      // try to get basic info from first row if available
      info.value.name =
        route.params.name || payload[0]?.title || info.value.name;

      questions.value = payload.map((row) => {
        // build options from pivot columns option_a..option_e
        const labels = ["a", "b", "c", "d", "e"];
        const opts = [];
        const correct =
          row.correct_optionid ?? row.correct_option_id ?? row.correct;

        labels.forEach((lbl, idx) => {
          const optId = row[`optionid_${lbl}`];
          const optText = row[`option_${lbl}`];
          // try several possible point column names
          const optPoint =
            row[`point_${lbl}`] ??
            row[`poin_${lbl}`] ??
            row[`points_${lbl}`] ??
            0;
          if (optText != null) {
            opts.push({
              key: String.fromCharCode(65 + idx),
              text: optText,
              point:
                typeof optPoint === "number" ? optPoint : Number(optPoint) || 0,
              isCorrect:
                optId && correct ? String(optId) === String(correct) : false,
            });
          }
        });

        return {
          id: row.qid ?? row.id ?? Math.random().toString(36).slice(2, 9),
          question: row.question ?? row.qns ?? "",
          options: opts,
          explanation: row.explanation ?? row.exp ?? "",
        };
      });
    } else if (payload && payload.info) {
      // if backend returns { info: {...}, questions: [...] }
      info.value = payload.info;
      questions.value = (payload.questions || []).map((q) => {
        // normalize existing structure
        const opts = (q.options || q.choices || []).map((o, i) => {
          const key = o.key ?? String.fromCharCode(65 + i);
          const text = o.text ?? o.label ?? o.option ?? o;
          const point = o.point ?? o.poin ?? o.score ?? o.points ?? null;
          const isCorrect =
            o.isCorrect ||
            (q.ans ? o.optionid === q.ans || key === q.ans : false);
          return {
            key,
            text,
            point:
              typeof point === "number" ? point : point ? Number(point) : 0,
            isCorrect,
          };
        });
        return {
          id: q.id ?? q.qid ?? Math.random().toString(36).slice(2, 9),
          question: q.question ?? q.qns ?? q.title ?? "",
          options: opts,
          explanation: q.explanation ?? q.exp ?? q.pembahasan ?? "",
        };
      });
    } else if (Array.isArray(payload.questions)) {
      // some APIs return { questions: [...] }
      questions.value = payload.questions.map((q) => {
        const opts = (q.options || []).map((o, i) => ({
          key: o.key ?? String.fromCharCode(65 + i),
          text: o.text ?? o.option ?? o,
          point: o.point ?? o.poin ?? o.score ?? 0,
          isCorrect: !!o.isCorrect,
        }));
        return {
          id: q.id ?? q.qid ?? Math.random().toString(36).slice(2, 9),
          question: q.question ?? q.qns ?? "",
          options: opts,
          explanation: q.explanation ?? q.exp ?? "",
        };
      });
    } else {
      // fallback: try mapping top-level array
      console.warn("Unexpected payload shape for tryout detail", payload);
      questions.value = [];
    }
  } catch (err) {
    console.error("Error fetch detail:", err);
    info.value = {
      name: "TRYOUT SKD SAMPLE",
      duration: "100 menit",
      price: 100,
      status: "enabled",
      pembahasan: "",
    };
    questions.value = [];
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.back();
}

function printPage() {
  window.print();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  if (!eid) console.warn("No id provided in route. Showing sample data.");
  fetchDetail();
  fetchInfoSKD();
});
</script>

<style scoped>
/* small print-friendly styling */
@media print {
  body {
    background: white;
  }
  .rounded-xl {
    box-shadow: none !important;
  }
}
</style>
