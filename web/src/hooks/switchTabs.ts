import {ref, Ref} from 'vue'
import { useRouter } from "vue-router";
import { useChatStore, useLoginStore } from "@/store";


interface TabItem {
  iconName: string;
  path: string;
  label: string;
  status: 'press' | 'disable' | 'hover' | 'normal';
}

export function useTabs(initialTabs: TabItem[]) {
  const router = useRouter();

  const tabs = ref<TabItem[]>(initialTabs)
  const currentTab = ref(0)

  function setTab(index: number) {
    if (tabs.value[index].status !== 'disable' && index !== currentTab.value) {
      tabs.value.forEach(tab => {
        tab.status = 'normal' 
      })

      tabs.value[index].status = 'press'
    }

    currentTab.value = index;
    router.push(tabs.value[index].path);
  }


  const hoverTabItem = (index:number) =>{
    let status = tabs.value[index].status
    if(status === 'disable' || status === 'press') return
  
    tabs.value[index].status = 'hover'
  }
  
  const leaveTabItem = (index:number) =>{
    let status = tabs.value[index].status
    if(status === 'disable' || status === 'press') return
    
    tabs.value[index].status = 'normal'
  }
  
  const tabItemMap = (item:any) =>{
    return `${item.iconName}${item.status}.svg`
  }

  return {
    tabs,
    currentTab,
    setTab,
    hoverTabItem,
    leaveTabItem,
    tabItemMap
  }

}
