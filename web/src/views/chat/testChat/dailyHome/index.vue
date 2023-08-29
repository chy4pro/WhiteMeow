<template>
  <div class="wh-full">
    <div class="w-full box-border flex flex-items-start px-1.6rem mt-2.4rem">
      <div class="w-28rem flex-shrink-0 mr-1.6rem">
        <div class="text-2rem font-600 line-height-normal mb-0.8rem">今日运势</div>
        <div class="
          flex
          flex-justify-between
          rounded-10.8px
          bg-white
          uno-shadow-[0px,0px,8px,0px]+[rgba(164,164,164,0.50)]
            h-24rem
          ">
          <div class="text-center mt-2.6rem ml-0.8rem">
            <SvgImage name="icon_good.svg" class="w-3.6rem h-3.6rem mb-1.3rem"/>
            <ul class="p-0">
              <li v-for="item in goodArr" class="list-none color-#005D09 text-12px font-400 mb-0.7rem">{{ item }}</li>
            </ul>
          </div>

          <div class="mt-2.4rem">
            <div class="text-center text-1.6rem font-700 line-height-normal mb-1.8rem">{{ todayZhCn }}</div>
            <div class="
            w-14rem
            h-14rem
            bg-[url(@/assets/images/bg_mi.svg)]
            bg-cover
            bg-no-repeat
            bg-center
            flex-col-center
            ">
              <div class="text-3.8rem font-700 indent-1.6rem tracking-1.6rem line-height-normal text-center">{{ lunarMonth }}</div>
              <div class="text-3.8rem font-700 indent-1.6rem tracking-1.6rem line-height-normal text-center">{{ lunarDay }}</div>
            </div>
          </div>


          <div class="text-center mt-2.6rem mr-0.8rem">
            <SvgImage name="icon_bad.svg" class="w-3.6rem h-3.6rem mb-1.3rem"/>
            <ul class="p-0">
              <li v-for="item in badArr" class="list-none color-#E80000 text-12px font-400 mb-0.7rem">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="w-55.2rem">
        <div class="text-2rem font-600 line-height-normal mb-0.8rem">每日测测</div>
        <div class="
          bg-white
            w-full
            h-24rem
          ">
          <a-carousel :after-change="onChange" dotsClass="customer-dots">
            <div>
              <div class="
              w-full
              rounded-10.8px
              overflow-hidden
              h-24rem" style="background: linear-gradient(180deg, #000 0%, #B4179E 100%);">
                <div class="wh-full flex-row-between">
                  <div class="relative px-5rem">
                    <div @click="$router.push('/chat/testChat/tarot')">
                      <Image name="card_back.png" class="w-12.3rem h-21.3rem hover:scale-110 transition-transform ease-in-out cursor-pointer duration-1000 relative"/>
                    </div>

                    <div class="absolute right-0 top-1.2rem">
                      <SvgImage name="star.svg" class="w-2.9rem"/>
                    </div>
                    <div class="absolute left-2rem top-3rem">
                      <SvgImage name="star.svg" class="w-2rem"/>
                    </div>
                    <div class="absolute right-2rem top-7.4rem">
                      <SvgImage name="star.svg" class="w-1rem"/>
                    </div>
                    <div class="absolute left-2rem bottom-4.6rem">
                      <SvgImage name="star.svg" class="w-1rem"/>
                    </div>
                  </div>
                  <SvgImage name="cat_red2.svg" class="w-34rem self-end"/>
                </div>
              </div>
            </div>
          </a-carousel>
        </div>
      </div>
    </div>

    <div class="mt-1.6rem">
      <div class="text-2rem px-1.6rem font-600 line-height-normal mb-0.8rem">更多测试</div>

      <div class="flex-row-start overflow-auto px-1.6rem py-1.6rem">
        <div v-for="item in testList" class="
        w-24rem
        text-center
        mr-1.6rem
        uno-shadow-[0px,0px,8px,0px]+[rgba(164,164,164,0.50)]
        rounded-10.8px
        overflow-hidden
        flex-shrink-0
        ">
          <div class="px-1.6rem py-1.6rem">
            <Image :name="item.imgPath" class="w-20.8rem h-18.2rem "/>

            <div class="text-1.6rem font-600 line-height-2.4rem mt-1.6rem">{{ item.title }}</div>
            <div class="
            text-1.4rem
            font-400
            line-height-1.6rem
            color-#475467
            truncate
            ">{{ item.content }}</div>
          </div>

          <div class="w-full h-4.8rem bg-black color-white flex-col-center cursor-pointer" @click="$router.push(item.path)">
            点击解梦
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { getEvaluation } from '@/apis/testChat.ts';
import { useLoginStore } from '@/store/index.js';

import lunisolar from 'lunisolar'
import zhCn from 'lunisolar/locale/zh-cn' 
lunisolar.config({
  lang: 'zhCn' // 设换默认语言
})
import theGods from 'lunisolar/plugins/theGods'
import theGodsZhCn from 'lunisolar/plugins/theGods/locale/zh-cn'
lunisolar.locale(zhCn).locale(theGodsZhCn)
lunisolar.extend(theGods)

const lsr = lunisolar()
const todayZhCn = lsr.format('YYYY年MM月DD日');

// 取神煞
console.log(lsr.theGods.query('good act 1'));
console.log(lsr.theGods.query('bad act 1'));
console.log(lsr.theGods.query('good act 2'));
console.log(lsr.theGods.query('bad act 2'));
console.log(lsr.theGods.query('good act 3'));
console.log(lsr.theGods.query('bad act 3'));

const lunarMonth = lsr.lunar.getMonthName();
const lunarDay = lsr.lunar.getDayName();
const todayGood= lsr.theGods.query('good act 3');
const todayBad = lsr.theGods.query('bad act 3');
//将数组限定为长度为最大为7的数组
const splitArr = (arr:any, size = 7) => {
  let result = [];
  if(arr.length <= size) return arr;

  result = arr.slice(0,7);
  return result;
}
console.log('123----',splitArr(todayBad))
console.log('123----',splitArr(todayGood))

const goodArr = ref(splitArr(todayGood))
console.log(goodArr);

const badArr = ref(splitArr(todayBad))


const loginStore = useLoginStore();

const router = useRouter();

const onChange = (current: number) => {
  console.log(current);
};

const testList = reactive([
  {
    'imgPath': 'test_preview1.png',
    'title': '小喵解梦',
    'content': '好梦还是恶兆？',
    'path': '/chat/testChat/interpretationDream'
  },
  {
    'imgPath': 'test_preview1.png',
    'title': '心理沙盘',
    'content': '感应性的治愈机制',
    'path': '/chat/testChat/sandPlay'
  },
  // {
  //   'imgPath': 'test_preview1.png',
  //   'title': '肠道健康测试',
  //   'content': '肥胖、抑郁、慢性病等风险评估',
  //   'path': '/chat/testChat/interpretationDream'
  // }
])

</script>

<style scoped>
:deep .ant-carousel {
  height: 100%;
}
:deep(.ant-carousel .slick-slider) {
  text-align: center;
  height: 100%;
  /* background: #364d79; */
  overflow: hidden;
}

:deep(.slick-slide h3) {
  color: #fff;
}

.customer-dots li{
  width: 8px;
}
:deep .ant-carousel .slick-dots.customer-dots li{
  width: 8px;
}
:deep .ant-carousel .slick-dots.customer-dots li button{
  height: 8px;
  border-radius: 100%;
  overflow: hidden;
}
</style>

