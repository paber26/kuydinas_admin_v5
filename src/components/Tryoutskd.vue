<template>
  <section class="p-6">
    <!-- Page header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          Daftar Try Out SKD CPNS
        </h1>
        <nav class="text-sm text-slate-400 mt-1">Dashboard • Try Out SKD</nav>
      </div>
      <div>
        <button
          @click="onAdd"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        >
          Tambah
        </button>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100">
      <!-- Card header / filters -->
      <div class="p-6 border-b border-slate-100">
        <div
          class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <h2 class="text-lg font-semibold text-slate-800">Try Out Harian</h2>

          <div class="flex gap-3 items-center w-full md:w-auto">
            <label class="flex items-center gap-2 text-slate-600">
              <span class="text-sm">ID:</span>
              <select
                v-model="filters.id"
                class="border rounded px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option v-for="id in uniqueIds" :key="id" :value="id">
                  {{ id }}
                </option>
              </select>
            </label>

            <label class="flex items-center gap-2 text-slate-600">
              <span class="text-sm">Status:</span>
              <select
                v-model="filters.status"
                class="border rounded px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>

            <button
              @click="onSearch"
              class="px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm"
            >
              Search
            </button>

            <div
              class="flex items-center bg-slate-50 rounded px-3 py-2 w-full md:w-60"
            >
              <svg
                class="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                />
              </svg>
              <input
                v-model="filters.q"
                placeholder="Search"
                class="bg-transparent outline-none text-sm ml-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-slate-500 text-xs text-left bg-slate-50">
            <tr>
              <th class="py-4 px-6">Nomor</th>
              <th class="py-4 px-6">Nama</th>
              <th class="py-4 px-6">Jumlah Pendaftar</th>
              <th class="py-4 px-6">Waktu</th>
              <th class="py-4 px-6">Harga</th>
              <th class="py-4 px-6">Status</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="text-slate-700">
            <tr
              v-for="(item, idx) in pagedData"
              :key="item.id"
              class="border-t hover:bg-slate-50"
            >
              <td class="py-4 px-6">{{ idx + 1 + (page - 1) * perPage }}</td>
              <td class="py-4 px-6 font-medium">{{ item.name }}</td>
              <td class="py-4 px-6">{{ item.registrants }}</td>
              <td class="py-4 px-6">{{ item.duration }}</td>
              <td class="py-4 px-6">{{ item.price }}</td>
              <td class="py-4 px-6">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs',
                    item.status === 'enabled'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600',
                  ]"
                >
                  {{ item.status === "enabled" ? "Enabled" : "Disabled" }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <div
                  class="inline-flex items-center gap-3 justify-end text-slate-400"
                >
                  <button
                    @click="onView(item)"
                    title="Lihat"
                    class="p-2 rounded hover:bg-slate-100"
                  >
                    <!-- eye -->
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="onEdit(item)"
                    title="Edit"
                    class="p-2 rounded hover:bg-slate-100"
                  >
                    <!-- pencil -->
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M15.232 5.232l3.536 3.536M4 20l4-1 9.293-9.293a1 1 0 00-1.414-1.414L6.586 17.586 5 19l-.999 1z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="onDelete(item)"
                    title="Hapus"
                    class="p-2 rounded hover:bg-slate-100 text-slate-400"
                  >
                    <!-- trash -->
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filtered.length === 0">
              <td colspan="7" class="py-8 text-center text-slate-400">
                No data found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="p-6 border-t border-slate-100 flex items-center justify-between"
      >
        <div class="text-sm text-slate-500">
          Showing {{ (page - 1) * perPage + 1 }} -
          {{ Math.min(page * perPage, filtered.length) }} of
          {{ filtered.length }}
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <button
            @click="nextPage"
            :disabled="page >= pageCount"
            class="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

// Dummy data — replace with API later
const data = ref([
  {
    id: "1",
    name: "TRYOUT SKD 2024 BATCH 9",
    registrants: 1024,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "2",
    name: "TRYOUT SKD 2024 BATCH 10",
    registrants: 980,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "3",
    name: "TRYOUT SKD 2024 BATCH 11",
    registrants: 512,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "4",
    name: "TRYOUT SKD 2024 BATCH 12",
    registrants: 300,
    duration: "100 menit",
    price: 100,
    status: "disabled",
  },
  {
    id: "5",
    name: "TRYOUT SKD 2024 BATCH 1",
    registrants: 250,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "6",
    name: "TRYOUT SKD 2024 BATCH 2",
    registrants: 200,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "7",
    name: "TRYOUT SKD 2024 BATCH 3",
    registrants: 150,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  {
    id: "8",
    name: "TRYOUT SKD 2024 BATCH 4",
    registrants: 120,
    duration: "100 menit",
    price: 100,
    status: "enabled",
  },
  // add more sample items if needed
]);

const filters = ref({ id: "all", status: "all", q: "" });

const perPage = ref(8);
const page = ref(1);

const filtered = computed(() => {
  const q = filters.value.q.trim().toLowerCase();
  return data.value.filter((d) => {
    if (filters.value.id !== "all" && d.id !== filters.value.id) return false;
    if (filters.value.status !== "all" && d.status !== filters.value.status)
      return false;
    if (
      q &&
      !(
        `${d.name}`.toLowerCase().includes(q) ||
        `${d.registrants}`.toLowerCase().includes(q)
      )
    )
      return false;
    return true;
  });
});

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / perPage.value))
);

const pagedData = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filtered.value.slice(start, start + perPage.value);
});

const uniqueIds = computed(() => {
  return Array.from(new Set(data.value.map((d) => d.id)));
});

function onSearch() {
  page.value = 1;
}

function onAdd() {
  // open modal or navigate to add page
  alert("Tambah tryout (implementasi modal/navigation)");
}

function onView(item) {
  alert("Lihat " + item.name);
}

function onEdit(item) {
  alert("Edit " + item.name);
}

function onDelete(item) {
  if (confirm("Hapus " + item.name + " ?")) {
    data.value = data.value.filter((d) => d.id !== item.id);
  }
}

function nextPage() {
  if (page.value < pageCount.value) page.value += 1;
}
function prevPage() {
  if (page.value > 1) page.value -= 1;
}
</script>

<style scoped>
/* small styling tweaks if needed */
</style>
