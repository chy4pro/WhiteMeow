<template>
  <object type="image/svg+xml" :data="getImageUrl(props.name)" style="pointer-events:none"></object>
</template>

<script setup lang="ts">
  import { getImageUrl } from '../../utils/index.ts'

  const props = defineProps({
    name: {
      type: String,
      required: true,
    }
  });
</script>
