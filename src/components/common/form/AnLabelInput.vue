<template>
  <div class="an-label-input">
    <label>{{ name }}:</label>
    <an-input
      :maxlength="200"
      :type="type"
      :placeholder="placeholder"
      :initialValue="initialValue"
      :prefixIcon="prefixIcon"
      :suffixIcon="suffixIcon"
      :readonly="readonly"
      :disabled="disabled"
      @focus="focus"
      @change="change"
      @input="input"
      @clear="clear"
      class="input"
      ref="input"
    ></an-input>
  </div>
</template>

<script>
import AnInput from "components/common/basic/AnInput";
export default {
  name: "AnLabelInput",
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text", //输入框类型，text，textarea 和其他 原生 input 的 type 值
    },
    placeholder: {
      type: String,
      default: "请输入", //输入框占位文本
    },
    initialValue: {
      type: String,
    },
    prefixIcon: {
      type: String, //输入框头部图标
    },
    suffixIcon: {
      type: String, //输入框尾部图标
    },
    readonly: {
      type: Boolean,
      default: false, //原生属性，是否只读
    },
    disabled: {
      type: Boolean,
      default: false, //禁用
    },
  },
  data() {
    return {
      value: this.initialValue,
    };
  },
  components: {
    AnInput,
  },
  methods: {
    //设置value值
    setValue(value) {
      this.value = value;
      this.$refs.input.setValue(value);
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
      this.value = value;
      this.$emit("change", value);
    },
    //在 Input 值改变时触发,value为当前控件输入内容
    input(value) {
      this.value = value;
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
.an-label-input {
  display: flex;
  align-items: center;
}
label {
  width: var(--labelWidth);
  text-align: right;
  margin-right: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.input {
  flex: 1;
}
</style>
