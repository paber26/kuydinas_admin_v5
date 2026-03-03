<template>
  <Transition name="toast">
    <div v-if="show" class="fixed top-6 right-6 z-50 w-[320px]">
      <div
        class="relative overflow-hidden rounded-xl shadow-xl px-5 py-4 text-white"
        :class="toastClass"
      >
        <div class="flex items-start gap-3">
          <!-- ICON -->
          <div class="text-xl">
            <span v-if="type === 'success'">✔</span>
            <span v-else>✖</span>
          </div>

          <!-- MESSAGE -->
          <div class="flex-1 text-sm font-medium">
            {{ message }}
          </div>

          <!-- CLOSE -->
          <button
            @click="closeToast"
            class="text-white/70 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        <!-- PROGRESS BAR -->
        <div
          class="absolute bottom-0 left-0 h-1 bg-white/40"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
  type: {
    type: String,
    default: "success", // success | error
  },
  message: String,
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(["update:modelValue"]);

const show = ref(false);
const progress = ref(100);

let timer = null;
let interval = null;

watch(
  () => props.modelValue,
  (val) => {
    show.value = val;
    if (val) startTimer();
  },
);

function startTimer() {
  progress.value = 100;

  const step = 100 / (props.duration / 50);

  interval = setInterval(() => {
    progress.value -= step;
  }, 50);

  timer = setTimeout(() => {
    closeToast();
  }, props.duration);
}

function closeToast() {
  clearTimeout(timer);
  clearInterval(interval);
  emit("update:modelValue", false);
}

onUnmounted(() => {
  clearTimeout(timer);
  clearInterval(interval);
});

/* ✅ Reactive class */
const toastClass = computed(() => {
  return props.type === "success" ? "bg-green-600" : "bg-red-600";
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
