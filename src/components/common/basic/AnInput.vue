<template>
  <div class="an-input">
    <el-input
      v-model="value"
      :type="type"
      :maxlength="maxlength"
      :show-word-limit="showWordLimit"
      :placeholder="placeholder"
      :disabled="disabled"
      clearable
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :rows="rows"
      autosize
      :autofocus="autofocus"
      :readonly="readonly"
      @blur="blur"
      @focus="focus"
      @change="change"
      @input="input"
      @clear="clear"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "AnInput",
  props: {
    type: {
      type: String,
      default: "text", //输入框类型，text，textarea 和其他 原生 input 的 type 值
    },
    initialValue: {
      type: String,
    },
    maxlength: {
      type: Number, //原生属性，最大输入长度
    },
    showWordLimit: {
      type: Boolean,
      default: false, //是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
    },
    placeholder: {
      type: String,
      default: "请输入", //输入框占位文本
    },
    disabled: {
      type: Boolean,
      default: false, //禁用
    },
    prefixIcon: {
      type: String, //输入框头部图标
    },
    suffixIcon: {
      type: String, //输入框尾部图标
    },
    rows: {
      type: Number,
      default: 1, //输入框行数，只对 type="textarea" 有效
    },
    autofocus: {
      type: Boolean,
      default: false, //原生属性，自动获取焦点
    },
    readonly: {
      type: Boolean,
      default: false, //原生属性，是否只读
    },
  },
  data() {
    return {
      value: this.initialValue,
    };
  },
  components: {},
  methods: {
    //设置value值
    setValue(value) {
      this.value = value;
    },
    //在 Input 失去焦点时触发,e是Event事件
    blur(e) {
      this.$emit("blur", e);
    },
    //在 Input 获得焦点时触发,e是Event事件
    focus(e) {
      this.$emit("focus", e);
    },
    //仅在输入框失去焦点或用户按下回车时触发,value为当前控件输入内容
    change(value) {
      this.$emit("change", value);
    },
    //在 Input 值改变时触发,value为当前控件输入内容
    input(value) {
      this.$emit("input", value);
    },
    //在点击由 clearable 属性生成的清空按钮时触发
    clear() {
      this.$emit("clear");
    },
  },
};
</script>

<style scoped>
</style>
