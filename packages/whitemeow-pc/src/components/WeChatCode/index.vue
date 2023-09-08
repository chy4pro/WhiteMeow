<template>
  <div class="w-80 mx-a mt-50 static right-55 bottom-55" :class="initialObj">
    <div class="text-center color-white text-14 mb-10">白小喵在wx</div>
    <div class="w-full h-80 text-center relative overflow-hidden">
      <Image name="123.png" :width="70" :height="70"/>
    </div>
  </div>

</template>
<script setup>
const initialObj = computed(()=>({
  static: props.position === 'static',
  'md:fixed': props.position === 'fixed'
}))

const props = defineProps({
  position: {
    type: String,
    default: 'fixed',
    validator(value) {
      return ['fixed', 'static'].includes(value)
    }
  }
});


</script>