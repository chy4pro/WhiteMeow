<template>
  <img class="image" :src="getImageUrl(props.name)" :style="styleObj"/>
</template>

<script setup lang="ts">
  import { getImageUrl } from '../../utils/index.ts'

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
      
    },
    height: {
      type: [Number, String],
      
    },
  });

  const styleObj = reactive({
    width: props.width+'px',
    height: typeof props.height == 'number' ?  props.height + 'px' : props.height,
  })
</script>
