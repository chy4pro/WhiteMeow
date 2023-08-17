<template>
  <div class="wh-full box-border overflow-y-auto relative bg-white">
    <div class="card" :class="{flipped: isFlipped}" @click="isFlipped = !isFlipped">
    <div class="card-inner">
      <div class="card-front">
        <img src="./card-front.png">
      </div>
      <div class="card-back">
        <img src="./card-back.png">
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
// import * as lunisolar from 'lunisolar'
import lunisolar from 'lunisolar'
import zhCn from 'lunisolar/locale/zh-cn' 
lunisolar.config({
  lang: 'zhCn' // 设换默认语言为繁体中文
})
import theGods from 'lunisolar/plugins/theGods'
import theGodsZhCn from 'lunisolar/plugins/theGods/locale/zh-cn'
lunisolar.locale(zhCn).locale(theGodsZhCn)

lunisolar.extend(theGods)

const lsr = lunisolar('2018-10-04')
// 取神煞
console.log(lsr.theGods.query('good act 1'));
console.log(lsr.theGods.query('good act 2'));
console.log(lsr.theGods.query('good act 3'));
console.log(lsr.theGods.query('bad act 3'));


const isFlipped = ref(false)



</script>
<style>
  .card {
    perspective: 1000px;
  }
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }
  
  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }
  
  .card-back {
    transform: rotateY(180deg);
  }
  
  .card.flipped .card-inner {
    transform: rotateY(180deg);
  }
  </style>
