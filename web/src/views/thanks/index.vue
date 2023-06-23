<template>
  <div class="bg-box feedback-bg">
    <NavBar/>

    <div class="center-wrap">
      <h1 class="title">感谢提交！</h1>
    </div>
    <WeChatCode position="initial"/>

  </div>
</template>

<style lang="scss" scoped>
.center-wrap{
  margin-top: 100px;
  @include flex-center($flexWrap:wrap);
  .title{
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    margin-top: 20px;
  }
}

</style>