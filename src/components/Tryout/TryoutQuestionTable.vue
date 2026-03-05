<template>
  <div class="space-y-6">
    <CategorySection
      title="TWK"
      :questions="twkQuestions"
      :badge="badge"
      @remove="$emit('remove', $event)"
      @reorder="$emit('reorder', $event)"
    />

    <CategorySection
      title="TIU"
      :questions="tiuQuestions"
      :badge="badge"
      @remove="$emit('remove', $event)"
      @reorder="$emit('reorder', $event)"
    />

    <CategorySection
      title="TKP"
      :questions="tkpQuestions"
      :badge="badge"
      @remove="$emit('remove', $event)"
      @reorder="$emit('reorder', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import CategorySection from "./CategorySection.vue";

const props = defineProps({
  questions: Array,
  badge: Function,
});

const twkQuestions = computed(() =>
  props.questions.filter((q) => q.category === "TWK"),
);

const tiuQuestions = computed(() =>
  props.questions.filter((q) => q.category === "TIU"),
);

const tkpQuestions = computed(() =>
  props.questions.filter((q) => q.category === "TKP"),
);
</script>
