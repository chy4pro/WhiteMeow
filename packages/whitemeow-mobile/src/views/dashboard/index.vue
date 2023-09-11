<script setup>
import { ref } from "vue";

import Icon1 from "~/tab/icon1.png";
import Icon1Active from "~/tab/icon1-active.png";
import Icon2 from "~/tab/icon2.png";
import Icon2Active from "~/tab/icon2-active.png";
import Icon3 from "~/tab/icon3.png";
import Icon3Active from "~/tab/icon3-active.png";
import Icon4 from "~/tab/icon4.png";
import Icon4Active from "~/tab/icon4-active.png";

import { useRouter } from "vue-router";

const router = useRouter();

const tab = ref([
  {
    path: "/dashboard",
    label: "测试喵",
    icon: Icon1,
    iconActive: Icon1Active,
    active: true,
  },
  {
    path: "/dashboard/chat",
    label: "聊愈喵",
    icon: Icon2,
    iconActive: Icon2Active,
    active: false,
  },
  {
    path: "/dashboard/adventure",
    label: "冒险喵",
    icon: Icon3,
    iconActive: Icon3Active,
    active: false,
  },
  {
    path: "/dashboard/my",
    label: "我的喵",
    icon: Icon4,
    iconActive: Icon4Active,
    active: false,
  },
]);

const handleLink = (path, idx) => {
  if (tab.value[idx].active) {
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
        <img :src="item.active ? item.iconActive : item.icon" alt="" />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-index {
  width: 100vw;
  height: 100vh;

  .children {
    height: calc(100vh - 5.6rem);
    overflow-y: auto;
  }

  .tab-index {
    height: 5.6rem;
    display: flex;

    .item {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
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
