import { defineStore } from 'pinia';

export const useTextAdventureStore = defineStore('textAdventure', {
  state: () => ({
    story: [{content: ''}] as any,
    pageIndex: 0,
    chatLog: [] as any
  }),
  getters: {
    canShowLeft: (state) => state.pageIndex > 0,

    canShowRight: (state) => state.pageIndex < state.story.length - 1
  },
  actions: {
    reset(){
      this.pageIndex = 0;
      this.story = [{content: ''}];
    },
    goLeft() {
      if (this.pageIndex > 0) {
        this.pageIndex--
      }
    },
    goRight() {
      if (this.pageIndex < this.story.length - 1) { 
        this.pageIndex++
      }
    },
    addContent(content:string){
      if(this.story.length > this.pageIndex || this.pageIndex === 0){
        let currentContent = this.story[this.pageIndex].content
        if(currentContent === ''){
          this.story[this.pageIndex].content = content
        }
        else{
          this.story[this.pageIndex].content += content
        }
      }
      else{
        this.story.push({content: ''})
      }
    }
  }
});