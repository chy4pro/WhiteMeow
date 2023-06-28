<template>
  <div class="feedback-bg bg-box">
    <div class="container-box">
      <NavBar showLogo/>

      <div class="feedback-wrap">
        <h1 class="feedback-title">联系铲屎官</h1>
        <div class="input-container mb-10">
          <el-input
            type="text"
            class="chat-input"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="欢迎尽情向铲屎官吐槽白小喵！"
            v-model="commentTitle"
          />
        </div>
        <div class="input-container">
          <el-input
            type="textarea"
            class="chat-input textarea"
            :autosize="{ minRows: 8, maxRows: 10}"
            placeholder=""
            v-model="commentContent"
          />
        </div>
        <div class="feedback-btn-list">
          <el-button color="#fff" round size="large" class="submit-btn" @click="submit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from '@/utils/http/index';
import GenId from 'cherry-id';
import { storage } from '@/utils/index.ts'

const commentTitle = ref('');
const commentContent = ref('');
const router = useRouter();

const submit = async() => {
  console.log(commentTitle.value, commentContent.value);
  let params = {
      'user': storage.getItem('userId'),
      'message_id': new GenId({ WorkerId: 1, SeqBitLength: 14 }).NextId().toString(),
      'open_kf_id': 'wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA',
      'title': commentTitle.value,
      'content': commentContent.value
  }

  const result:any = await axios.post('/feedback/save', params);
  if(result.message === 'ok'){
    console.log('提交成功');
    router.push({path: '/feedbackSuccess'});
  }
}
</script>

<style lang="scss" scoped>

.feedback-wrap{
  width: 100%;
  height: 100%;
  @include flex-center;
  flex-direction: column;
  .feedback-title{
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    margin-top: 20px;
  }
  
  .feedback-btn-list{
    margin-top: 20px;
    .feedback-btn{
      margin-right: 20px;
      /* font-family: KuaiLe; */
      color: $green_1;
    }
  }

  .input-container{
    background-color: #fff;
  }
}

.submit-btn{
  width: 200px;
  /* font-family: KuaiLe; */
  color: $green_1;
  border: 3px solid $gray_1;
  border-radius: 10px;
}
</style>