<script setup>
import { ref, watch } from "vue";

import Icon1 from "~/tab/icon1.png";
import Icon1Active from "~/tab/icon1-active.png";
import Icon2 from "~/tab/icon2.png";
import Icon2Active from "~/tab/icon2-active.png";
import Icon3 from "~/tab/icon3.png";
import Icon3Active from "~/tab/icon3-active.png";
import Icon4 from "~/tab/icon4.png";
import Icon4Active from "~/tab/icon4-active.png";
import Lock from "~/tab/lock.png";

import { useRouter } from "vue-router";

const router = useRouter();

const tab = ref([
  {
    path: "/chat/testChat/dailyHome",
    label: "测试喵",
    type: "test",
    icon: Icon1,
    iconActive: Icon1Active,
    active: true,
    lock: false,
  },
  {
    path: "/chat",
    label: "聊愈喵",
    type: "chat",
    icon: Icon2,
    iconActive: Icon2Active,
    active: false,
    lock: false,
  },
  {
    path: "/chat/adventure",
    label: "冒险喵",
    icon: Icon3,
    type: "adventure",
    iconActive: Icon3Active,
    active: false,
    lock: true,
  },
  {
    path: "/chat/my",
    label: "我的",
    icon: Icon4,
    type: "my",
    iconActive: Icon4Active,
    active: false,
    lock: true,
  },
]);

const handleLink = (path, idx) => {
  if (tab.value[idx].lock) {
    return;
  }

  for (const item of tab.value) {
    item.active = false;
  }
  tab.value[idx].active = true;

  router.push({
    path,
  });
};

const initStatus = () => {
  const type = router.currentRoute.value.meta.type;

  for (const item of tab.value) {
    item.active = false;
    if (item.type === type) {
      item.active = true;
    }
  }
};

watch(
  () => router.currentRoute.value,
  () => {
    initStatus();
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="dashboard-index">
    <div class="children">
      <router-view></router-view>
    </div>
    <div class="tab-index">
      <div
        :class="['item', item.active && 'active']"
        v-for="(item, idx) in tab"
        :key="idx"
        @click="handleLink(item.path, idx)"
      >
        <div class="normal">
          <img :src="item.active ? item.iconActive : item.icon" alt="" />
          <span>{{ item.label }}</span>
        </div>

        <img v-if="item.lock" class="lock" :src="Lock" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-index {
  width: 100%;
  height: 100%;

  .children {
    height: calc(100% - 5.6rem);
    overflow-y: auto;
  }

  .tab-index {
    height: 5.6rem;
    display: flex;
    z-index: 10;
    position: relative;

    .item {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(0, 0, 0, 0.4);
      font-size: 1.2rem;

      img {
        width: 2.4rem;
        height: 2.4rem;
      }

      span {
        height: 1.6rem;
        line-height: 1.6rem;
        margin-top: 0.2rem;
      }

      .lock {
        width: 1.8rem;
        height: 1.8rem;
      }

      .normal {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }

    .active {
      font-weight: 700;
      color: rgba(255, 106, 240, 1);
      border-top-color: rgba(255, 106, 240, 1);
      border-top-width: 2px;
    }
  }
}
</style>
