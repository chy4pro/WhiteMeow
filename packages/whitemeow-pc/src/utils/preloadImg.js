// preloadImg.js
import { render, h } from 'vue';
import Image from '@/components/Image/index.vue';

export const hImage = (name) =>{
  const handleDestroy = () => {
    //从body上移除组件
    render(null, document.body);
  }

  //使用h函数创建虚拟节点
  const vnode = h(Image, {
    name,
    onDestroy: handleDestroy,
  });
  //将虚拟节点渲染为真实节点
  render(vnode, document.body);
  handleDestroy()
}