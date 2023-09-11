// toggleButtons.ts
import {ref} from 'vue'
import {useToggle} from '@vueuse/core'

export function useToggleButtons(btns: string[]) {
  const current = ref('')
  let buttons:any = reactive([])
  buttons = btns.map(button => {
    const toggle = useToggle(button === current.value) as any
    
    return {
      value: button,
      isActive: toggle.value,
      toggle: toggle.toggle
    }
  })

  function handleButtonClick(value: string) {
    current.value = value
  }

  return {
    current,
    buttons,
    handleButtonClick
  }
}