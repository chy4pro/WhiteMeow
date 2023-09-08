<template>
  <!-- <van-config-provider theme="dark" :theme-vars-dark="themeVarsDark">
    <van-nav-bar
      title="表单"
      left-text="返回"
      left-arrow
      theme="dark"
      @click-left="onClickLeft"
    />

  </van-config-provider> -->
  <div class="p-15px mt-10px">
    <FormKit type="form" v-model="data" :actions="false">
      <FormKitSchema :schema="fields" />
    </FormKit>
  </div>
</template>

<script>
import { onMounted, ref, reactive, getCurrentInstance, defineComponent, defineExpose } from "vue";
import { useRoute } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant';
import 'vant/es/toast/style';

export default defineComponent({
  name: "SmartForm",
  props: {
    id: {
      type: String,
      default: ''
    },
    fieldsArray: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const data = ref({});
    const states = ref([]);
    const fields = reactive([]);
    const route = useRoute();
    const instance = getCurrentInstance();
    const $axios = instance.appContext.config.globalProperties.$axios;

    onMounted(() => {
      if(hasFieldsArray()){
        toFormKitData(props.fieldsArray);
      }
      else{
        fetchForm();
      }
    });

    // 返回
    const onClickLeft = () => history.back();
    const test = () => alert();
    // 主题
    const themeVarsDark = reactive({
      navBarBackground: '#444654'
    });

    // 转换数据
    const toFormKitData = (fieldsData) => {
      if(fieldsData){
        // let fieldsData = JSON.parse(route.query.data)
        fieldsData.forEach((item) => {
          if(item.type === 'radio' || 'select'){
            fields.push({
              '$formkit': item.type,
              'field_id': item.field_id,
              'name': item.name,
              'label': item.label,
              'options': item.options,
            });
          }
          else{
            fields.push({
              '$formkit': item.type,
              'field_id': item.field_id,
              'name': item.name,
              'label': item.label,
            });
          }
        });
      }
    }

    // 是否有数据用于显示表单
    const hasFieldsArray = () => {
      return props.fieldsArray.length>0 ? true : false;
    };

    // 获取表单数据
    const fetchForm = async () => {
      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      });
      try {
        if(props.id){
          const result = await $axios.get(`/v1/form/${props.id}`);

          if(result.code === 1){
            toFormKitData(result.data.fields);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        // loader hide
        closeToast();
      }
    };

    return { data, states, fields, themeVarsDark, onClickLeft , toFormKitData};
  }
});
</script>

<style lang="scss" scoped>
:deep .formkit-wrapper, :deep .formkit-fieldset, :deep .formkit-form {
  margin: 0 auto;
}
</style>