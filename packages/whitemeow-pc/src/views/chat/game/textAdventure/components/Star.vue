<template>
  <div class="absolute top--10rem left-50% translate-x--50% z-666">
    <SvgImage name="cat_white.svg" class="w-26.1rem h-30.8rem"></SvgImage>
  </div>
  <transition
    name="slide-fade"
    enter-active-class="custom-enter-active-class"
    leave-active-class="custom-leave-active-class"
  >
    <div class="absolute" :class="{'s1-star1': props.status === 1,'s2-star1': props.status==2}" v-if="show">
      <SvgImage name="star.svg" class="w-2.9rem" />
    </div>
  </transition>
  <transition
    name="slide-fade"
    enter-active-class="custom-enter-active-class"
    leave-active-class="custom-leave-active-class"
  >
    <div class="absolute" :class="{'s1-star2': props.status === 1,'s2-star2': props.status==2}" v-if="show">
      <SvgImage name="star.svg" class="w-2rem" />
    </div>
  </transition>
  <transition
    name="slide-fade"
    enter-active-class="custom-enter-active-class"
    leave-active-class="custom-leave-active-class"
  >
    <div class="absolute" :class="{'s1-star3': props.status === 1,'s2-star3': props.status==2}" v-if="show">
      <SvgImage name="star.svg" class="w-1rem" />
    </div>
  </transition>
  <transition
    name="slide-fade"
    enter-active-class="custom-enter-active-class"
    leave-active-class="custom-leave-active-class"
  >
    <div class="absolute" :class="{'s1-star4': props.status === 1,'s2-star4': props.status==2}" v-if="show">
      <SvgImage name="star.svg" class="w-1rem" />
    </div>
  </transition>
</template>

<script setup lang="ts">
const show = ref(true)
const props = defineProps({
  status: {
    type: Number,
    default: 1,// 1,2
  }
});
</script>

<style scoped>
.custom-enter-active-class {
  animation: bounce-in .5s;
}
.custom-leave-active-class {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.s1-star1{
  --at-apply: right-5rem top--9.7rem;
}
.s1-star2{
  --at-apply: right--7rem top-16.6rem;
}
.s1-star3{
  --at-apply: left-5rem top--5.6rem;
}
.s1-star4{
  --at-apply: left--5.4rem top-10.8rem;
}

.s2-star1{
  --at-apply: right-5rem top--9.7rem;
}
.s2-star2{
  --at-apply: right--11.7rem top--1rem;
}
.s2-star3{
  --at-apply: left--14.5rem top--2rem;
}
.s2-star4{
  --at-apply: right--14.9rem top--5rem;
}
</style>