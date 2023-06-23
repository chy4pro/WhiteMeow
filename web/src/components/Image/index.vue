<template>
  <img class="image" :src="getImageUrl(props.name)" :style="styleObj"/>
</template>

<script setup lang="ts">
  import { getImageUrl } from '@/utils/index.ts'

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

  const styleObj = () =>{
    if(props.width){
      return {width: props.width+'px'}
    }
    if(props.height){
      return {height: props.height + 'px'}
    }
    if(props.width && props.height){
      return {width: props.width+'px', height: props.height + 'px'}
    }
  }
</script>
