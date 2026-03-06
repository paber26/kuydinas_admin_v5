<template>
  <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
    <!-- HEADER -->
    <div
      class="flex justify-between items-center px-6 py-4 border-b bg-slate-50"
    >
      <div class="flex items-center gap-3">
        <span
          class="px-3 py-1 text-xs font-semibold rounded-full"
          :class="badge(title)"
        >
          {{ title }}
        </span>

        <span class="text-sm text-slate-500"> {{ list.length }} soal </span>
      </div>
    </div>

    <!-- TABLE -->
    <table class="w-full text-sm">
      <thead class="bg-slate-100 text-slate-700">
        <tr>
          <th class="px-6 py-3 text-left w-16">No</th>
          <th class="px-6 py-3 text-left">Pertanyaan</th>
          <th class="px-6 py-3 text-left w-24">Aksi</th>
        </tr>
      </thead>

      <draggable
        v-model="list"
        item-key="id"
        tag="tbody"
        @end="onDragEnd"
        ghost-class="bg-purple-100"
        animation="200"
      >
        <template #item="{ element, index }">
          <tr class="border-t hover:bg-purple-50 cursor-move">
            <td class="px-6 py-3">
              {{ index + 1 }}
            </td>

            <td class="px-6 py-3 max-w-xl truncate">
              {{ element.question }}
            </td>

            <td class="px-6 py-3">
              <button
                @click="$emit('remove', element.id)"
                class="text-red-600 hover:underline text-xs"
              >
                Hapus
              </button>
            </td>
          </tr>
        </template>
      </draggable>
    </table>

    <div v-if="list.length === 0" class="text-center py-6 text-slate-400">
      Belum ada soal {{ title }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import draggable from "vuedraggable";

const props = defineProps({
  title: String,
  questions: {
    type: Array,
    default: () => [],
  },
  badge: Function,
});

const emit = defineEmits(["remove", "reorder"]);

const list = ref([]);

/* sync props ke local state */

watch(
  () => props.questions,
  (val) => {
    list.value = Array.isArray(val) ? [...val] : [];
  },
  { immediate: true },
);

/* drag selesai */

function onDragEnd() {
  if (!list.value) return;

  emit("reorder", list.value);
}
</script>
