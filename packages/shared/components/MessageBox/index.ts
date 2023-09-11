import { message } from 'ant-design-vue';
import SvgImage from '../SvgImage/index.vue'

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
  },
  info(content: string) {
    message.open({
      key: 'info',
      content: content,
      icon: iconMap('info'),
      class: 'customer-message-info'
    });
  },
  success(content: string) {
    message.open({
      key: 'success',
      content: content,
      icon: iconMap('success'),
      class: 'customer-message-success'
    });
  },
  warning(content: string) {
    message.open({
      key: 'warning',
      content: content,
      icon: iconMap('warning'),
      class: 'customer-message-warning'
    });
  },
  error(content: string) {
    message.open({
      key: 'error',
      content: content,
      icon: iconMap('error'),
      class: 'customer-message-error'
    });
  },
};

export default messageBox;