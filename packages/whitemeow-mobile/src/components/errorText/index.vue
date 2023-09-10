<script setup>
const props = defineProps({
  text: {
    type: String,
  },
});
</script>

<template>
  <div class="error">{{ props.text }}</div>
</template>

<style scoped lang="scss">
.error {
  font-size: 1.4rem;
  color: rgba(255, 9, 9, 1);
  font-weight: 500;
  margin-top: 0.8rem;
}
</style>
