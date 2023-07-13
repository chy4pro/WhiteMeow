<template>
  <div class="bg-box wh-full">
    <div class="container-box">
      <NavBar showLogo/>

      <div class="w-full max-w-500 text-center">
        <h1 class="text-30 font-700 color-white">联系铲屎官</h1>
        <div class="input-container mb-10 bg-white">
          <input
            type="text"
            class="chat-input"
            placeholder="欢迎尽情向铲屎官吐槽白小喵！"
            v-model="commentTitle"
          />
        </div>
        <div class="input-container h-a bg-white">
          <textarea
            type="textarea"
            class="chat-input"
            rows="10"
            placeholder=""
            v-model="commentContent"
          ></textarea>
        </div>
        <div class="mt-20">
          <el-button color="#fff" size="large" class="w-200 color-[--green-1] border-3 border-solid border-color-[--gray-1] border-rd-10 hover:border-color-[--gray-1]" @click="submit">提交</el-button>
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
