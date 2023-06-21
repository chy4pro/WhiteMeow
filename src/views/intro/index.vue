<template>
  <div class="bg-box intro-bg">
    <div class="container-box">
      <NavBar showLogo/>
    
      <div class="intro-wrap">

        <h1 class="intro-title">白小喵每天陪着你哦</h1>
        <div class="intro-btn-list">
          <el-popover
          :width="200"
          trigger="hover"
          content="有人欺负你或者心情不好，请尽管告诉本喵，本喵专治各种不开心"
          placement="top"
          >
            <template #reference>
              <el-button color="#fff" round class="intro-btn">喵喵聊愈</el-button>
            </template>
          </el-popover>
          <el-popover
          :width="200"
          trigger="hover"
          content="有人欺负你或者心情不好，请尽管告诉本喵，本喵专治各种不开心"
          placement="top"
          >
            <template #reference>
              <el-button color="#fff" round class="intro-btn">喵答百科</el-button>
            </template>
          </el-popover>
          <el-popover
          :width="200"
          trigger="hover"
          content="有人欺负你或者心情不好，请尽管告诉本喵，本喵专治各种不开心"
          placement="top"
          >
            <template #reference>
              <el-button color="#fff" round class="intro-btn">喵写作业</el-button>
            </template>
          </el-popover>
          <el-popover
          :width="200"
          trigger="hover"
          content="有人欺负你或者心情不好，请尽管告诉本喵，本喵专治各种不开心"
          placement="top"
          >
            <template #reference>
              <el-button color="#fff" round class="intro-btn">职场答喵</el-button>
            </template>
          </el-popover>
        </div>

        <WeChatCode position="initial"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.intro-wrap{
  width: 100%;
  height: 100%;
  margin: 0 auto;
  @include flex-center;
  flex-direction: column;
  .intro-title{
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    margin-top: 20px;
  }
  
  .intro-btn-list{
    margin-top: 20px;
    @include flex-between($flexWrap: wrap);
    .intro-btn{
      margin: 10px 10px;
      font-family: KuaiLe;
      color: $green_1;
    }
  }


}
</style>