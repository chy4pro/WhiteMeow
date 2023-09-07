<template>
  <main class="min-h-screen overflow-hidden">
    <div class="bg-box wh-full relative overflow-y-auto">
      <NavBar showLogo/>
      <div class="
        fixed
        w-111rem
        h-111rem
        rounded-50%
        bottom--60rem
        left--35rem
        bg-[rgba(241,143,219,0.21)]">
      </div>

      <div class="
        fixed
        w-42rem
        h-42rem
        rounded-50%
        top--12rem
        right-15.9rem
        bg-[rgba(241,143,219,0.21)]">
      </div>

      <div id="mainContent" class="panel-container" :style="{ top: divTop + 'px' }">
        <router-view />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { throttle } from 'lodash-es'
const divTop = ref(0)

function handleResize() {
  const height = window.innerHeight
  const target = document.getElementById('mainContent')
  if(target){
    let targetHeight = target.clientHeight
    console.log(height);
    console.log(targetHeight);
    let minTopDistance = 66
    if(height < 656){
      divTop.value = 66
    }
    else{
      minTopDistance = (height - targetHeight) / 2
      // 如果居中top过小就设置为66
      if(minTopDistance < 66){
        divTop.value = 66
      }
      else{
        divTop.value = minTopDistance
      }
    }
  }

  //divTop.value = height / 2 - 200 // center a 200px tall div
}


onMounted(()=>{
  handleResize()
  window.addEventListener('resize', throttle(handleResize, 500))
})
</script>
<script lang='ts'>
export default {
  name:'mainLayout'
}
</script>