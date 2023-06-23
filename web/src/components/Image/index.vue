<template>
  <img class="image" :src="imgUrl" :style="{width: props.width+'px', height: props.height + 'px'}"/>
</template>

<script setup lang="ts">
  const props = defineProps({
    fullPath: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 40,
    },
    height: {
      type: [Number, String],
      default: 40,
    },
  });

  const imgUrl = computed(() => {
    return new URL(props.fullPath ? props.fullPath : `/src/assets/images/${props.name}`, import.meta.url).href;
  });
</script>
