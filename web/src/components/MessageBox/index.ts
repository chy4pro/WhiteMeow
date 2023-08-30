import { message } from 'ant-design-vue';
import SvgImage from '@/components/SvgImage/index.vue'

//自定义
message.config({
  top: `40.6rem`,
  duration: 3,
  maxCount: 3,
  rtl: true,
  prefixCls: 'my-message'
});

const iconMap = (type:string='info') =>{
  if(type){
    return h(
      SvgImage,
      { name: `message_${type}.svg`, class: 'w-2.4rem h-2.4rem mr-8px' }
    )
  }
}
const messageBox = {
  open(type: string, content: string) {
    message.open({
      key: type,
      content: content,
      icon: iconMap(type),
      class: `customer-message-${type}`
    });
  }
};

export default messageBox;