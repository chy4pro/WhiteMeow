<template>
  <div class="wh-full box-border overflow-y-auto relative bg-[url(@/assets/images/tarot-bg.png)]">
    <div class="wh-full flex-col-center">
      <div class="card" :class="{ flipped: isFlipped }" @click="isFlipped = !isFlipped">
        <div class="card-inner">
          <div class="card-front">
            <Image name="tarot/card-back.png" class="wh-full" />
          </div>
          <div class="card-back">
            <Image name="tarot/card-back.png" class="wh-full" />
          </div>
        </div>
      </div>
      <div class="text-2.4rem color-white font-700 text-center mt-3.2rem">
        抽牌中...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isFlipped = ref(false)

</script>

<style>
.card {
  width: 20rem;
  height: 34.7rem;
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

.card-front,
.card-back {
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

.card {
  animation-duration: 5s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-name: flipped;
  animation-iteration-count: infinite;
}

@keyframes flipped {

  from {
    transform: rotateY(0deg)
  }
  to {
    transform: rotateY(360deg)
  }
  /* 0% {
      transform: rotateY(0deg);
    }
    33%{
      transform: rotateY(45deg);
    }
    66%{
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(135deg);
    } */
}
</style>

