<template>
  <!-- <div class="arrow-left" @click="router.go(-1)"></div> -->
  <div class="panel-container">
    <div class="chat-panel">
      <div class="nav-part">
        <div @click="goChat" class="mt-3.5rem flex-row-start cursor-pointer">
          <SvgImage name="icon_arrow_left.svg" class="w-1.6rem h-1.6rem mr-1.6rem"/>
          <span class="font-500 text-1.4rem color-[var(--text-01)]">主页</span>
        </div>
        <ul class="nav-part-tablist">
          <li @mouseenter="hoverTabItem(index)" @mouseleave="leaveTabItem(index)" @click="clickTabItem(index)"
            v-for="(tabItem, index) in tablist" :key="index" :class="tabItem.status">
            <div>
              <SvgImage :name="tabItemMap(tabItem)" class="w-2.4rem h-2.4rem inline-block vertical-middle mr-8px" />

              <span class="inline-block vertical-middle">{{ tabItem.label }}</span>
            </div>
            <div v-if="tabItem.status === 'disable'">
              <SvgImage name="icon24_lock_on.svg" class="w-1.6rem h-1.6rem" />
            </div>
          </li>
        </ul>
      </div>
      <div class="main-part" ref="targetDiv">
        <div class="wh-full bg-#fff">
          <router-view />
        </div>
      </div>
    </div>
    <div class="absolute left--33.8rem bottom--9.1rem">
      <SvgImage name="animation-cat.svg" class="w-49.6rem h-38rem" />
    </div>
  </div>

</template>

<script setup lang="ts">
const router = useRouter();
const tablistMap = [
  {
    path: 'icon_account_',
    label: '个人信息',
    status: 'press'
  },
  {
    path: 'icon_lockon_',
    label: '修改密码',
    status: 'normal'
  },
  {
    path: 'icon_feedback_',
    label: '帮助与反馈',
    status: 'normal'
  }
]
const tablist = reactive(JSON.parse(JSON.stringify(tablistMap)))

const goChat =() => {
  router.push('/chat')
}
const hoverTabItem = (index:number) =>{
  let status = tablist[index].status
  if(status === 'disable' || status === 'press') return

  tablist[index].status = 'hover'
}

const leaveTabItem = (index:number) =>{
  let status = tablist[index].status
  if(status === 'disable' || status === 'press') return
  
  //const oldStatus = tablistMap[index].status
  tablist[index].status = 'normal'
}

const clickTabItem = (index:number) => {
  let status = tablist[index].status
  if(status === 'disable') return

  for(let i = 0; i < tablist.length; i++){
    tablist[i].status = 'normal'
  }
  tablist[index].status = 'press'

  switch(index){
    case 0:
      router.push('/profileCenter/editProfile')
      break;
    case 1:
      router.push('/profileCenter/editPassword')
      break;
    case 2:
      router.push('/profileCenter/feedBack')
      break;
  }
}
provide('clickTabItem', clickTabItem)


const tabItemMap = (item:any) =>{
  if(item.status === 'hover' || item.status === 'disable'){
    return `${item.path}normal.svg`
  }
  else{
    return `${item.path}${item.status}.svg`
  }
}
</script>

<style scoped>
.more-btn {
  position: absolute;
  top: 0px;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

.panel-container {
  --at-apply:
    w-108rem max-h-72rem h-[calc(100%-88px)] relative z-999 mt-56px
}

.chat-panel {
  --at-apply:
    wh-full flex-row-start rounded-24px bg-[rgba(255, 255, 255, 0.7)] backdrop-blur-11.5px overflow-hidden;
}

.chat-panel>.nav-part {
  --at-apply: self-start px-1.6rem h-full;
}

.chat-panel .nav-part-tablist {
  --at-apply:
    p-0 mb-0 w-full list-none overflow-y-auto h-[calc(100%-88px)] mt-3.2rem;
}

.chat-panel .nav-part-tablist>li {
  --at-apply: rounded-6px text-1.4rem py-1.6rem px-0.8rem flex-row-between cursor-pointer;
}
.chat-panel .nav-part-tablist>li.normal {
  --at-apply: rounded-6px text-1.4rem py-1.6rem px-0.8rem flex-row-between cursor-pointer;
  opacity: 0.5;
}
.chat-panel .nav-part-tablist>li.press {
  background: linear-gradient(90deg, #FCD3FF 22.92%, rgba(255, 255, 255, 0.00) 100%);
  color: #961088;
}

.chat-panel .nav-part-tablist>li:hover:not(.press, .disable) {
  background: linear-gradient(90deg, #FCD3FF 22.92%, rgba(255, 255, 255, 0.00) 100%);
  opacity: 0.5;
}

.chat-panel .nav-part-tablist>li.disable {
  --at-apply: color-#BABABA bg-none cursor-not-allowed;
  opacity: 0.2;
}

.chat-panel>.main-part {
  --at-apply: self-start wh-full flex-col-start;
}

.chat-panel>.main-part>.header {
  --at-apply: w-full py-1.2rem px-2.4rem flex-row-start bg-white;
}

.chat-panel>.main-part>.main {
  --at-apply: w-full h-55.1rem bg-#f2f2f2;
}

.chat-panel>.main-part>.footer {
  --at-apply: w-full h-104px bg-#F8F8F8 shadow-0px-4px-12px-0px flex-row-start px-2.4rem;
  /* background: #F8F8F8;
box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.02); */
}
</style>
<style scoped lang="scss">
.ta-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  border-radius: 0.6rem;
  margin-top: 4rem;
  height: 5.6rem;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
.ta-btn-active:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.ta-btn-active:active {
  background-color: rgba(0, 0, 0, 0.6);
}
.ta-btn-active {
  background-color: rgba(0, 0, 0, 1);
}

.ta-cover {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  left: 0;
  top: 0;
  z-index: 99;
}
.ta-jump {
  display: flex;
  justify-content: flex-end;

  span {
    text-decoration: underline;
    color: rgba(0, 0, 0, 0.4);
    font-size: 1.6rem;
    font-weight: 500;
    cursor: pointer;
  }
}
.date-wrapper {
  display: flex;
  height: 5.6rem;
  font-size: 1.6rem;
  font-weight: 500;
  position: relative;

  .date-picker {
    position: absolute;
    top: 6.5rem;
    width: calc(100% - 10rem - 1rem);
    left: 0;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0 0.6rem 2.7rem;
    border-radius: 0.7rem;
    padding: 2rem 1.5rem;
  }

  .date-box {
    flex: 1;
    border-radius: 6px;
    padding: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(244, 245, 247, 1);
    cursor: pointer;
    border: 1px solid transparent;
  }

  .date-box:hover {
    border-color: #FF6AF0 !important;
  }

  .active {
    border-color: rgba(0, 0, 0, 1) !important;
    background-color: rgba(255, 223, 252, 1) !important;
    color: rgba(0, 0, 0, 1) !important;
  }
  .xz {
    border-radius: 0.6rem;
    width: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(244, 245, 247, 1);
    margin-left: 1rem;
  }
}
.title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 2.4rem;
  padding-left: 0.5rem;
}

.item-title {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.4rem;
  font-weight: 500;
  padding-left: 0.5rem;
}

.ta-btn {
  display: flex;
  justify-content: space-between;

  .ta-btn-item {
    flex: 1;
    height: 5.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(244, 245, 247, 1);
    border: 1px solid transparent;
    font-size: 1.6rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
    border-radius: 0.6rem;

    img {
      margin-right: 0.6rem;
    }
  }

  .btn-girl {
    margin-right: 1.6rem;
  }

  .ta-btn-item:hover {
    border: 1px solid #FF6AF0 !important;
  }

  .btn-girl:active {
    background-color: rgba(255, 223, 252, 1) !important;
  }

  .btn-boy:active {
    background-color: rgba(223, 232, 255, 1) !important;
  }

  .girl-active {
    background-color: rgba(255, 223, 252, 1) !important;
  }

  .boy-active {
    background-color: rgba(223, 232, 255, 1) !important;
  }
}

:deep .el-tabs__item.is-active {
  color: #000;
}
:deep .el-tabs__active-bar {
  background-color: #000;
}
:deep .el-tabs__item {
  color: #b3b3b3;
}
.input-group {
  --at-apply: flex-row-start flex-nowrap;
}
:deep .input-group .ant-select-selector {
  --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none h-5.6rem;
}
:deep .input-group .ant-select-selector .ant-select-selection-item {
  --at-apply: line-height-5.6rem;
}
.normal-input-wrap {
  --at-apply: h-5.6rem min-h-30px bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}
:deep .normal-input-wrap input {
  --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}
</style>