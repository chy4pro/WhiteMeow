<template>
  <div class="wechat-wrap" :class="initialObj">
    <div class="title">白小喵在wx</div>
    <div class="code-box">
      <Image name="123.png" width="40" height="40"/>
    </div>
  </div>

</template>
<script setup>
const initialObj = computed(()=>({
  initial: props.position === 'initial'
}))

const props = defineProps({
  position: {
    type: String,
    default: 'fixed',
    validator(value) {
      return ['fixed', 'initial'].includes(value)
    }
  }
});


</script>
<style lang="scss" scoped>
.wechat-wrap{
  width: 80px;
  position: fixed;
  right: 55px;
  bottom: 55px;
  &.initial{
    position: initial;
    margin: 20px auto;
  }
  @include phone{
    position: initial;
    margin: 20px auto;
  }
  .title{
    text-align: center;
    /* margin-bottom: 10px; */
    color: #fff;
  }
  .code-box{
    width: 100%;
    height: 80px;

    @include centerBox;
    img{
      width: 70px;
      height: 70px;
    }
  }
}

</style>