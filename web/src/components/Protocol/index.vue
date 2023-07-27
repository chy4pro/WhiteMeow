<template>
  <div class="flex-row-start">
    <a-checkbox class="self-start">
    </a-checkbox>

    <div class="ml-0.8rem text-1.4rem">
      <span>我已阅读并同意</span>
      <a class="inline-block color-#374AF5" href="javascript:;" @click="openDialog('1')">《用户协议》</a>
      <span>和</span>
      <a class="inline-block color-#374AF5" href="javascript:;" @click="openDialog('2')">《隐私协议》</a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {

}
const props = defineProps<Props>()

const emit = defineEmits(['openDialog'])

const openDialog = (theType: string) => {  
  emit('openDialog', theType)
}
</script>
