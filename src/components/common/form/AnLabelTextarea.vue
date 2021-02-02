<template>
  <div class="an-label-textarea">
    <label>{{ name }}:</label>
    <an-input
      type="textarea"
      :placeholder="placeholder"
      :initialValue="initialValue"
      :rows="rows"
      :maxlength="maxlength"
      :showWordLimit="showWordLimit"
      :prefixIcon="prefixIcon"
      :suffixIcon="suffixIcon"
      :readonly="readonly"
      :disabled="disabled"
      @focus="focus"
      @change="change"
      @input="input"
      @clear="clear"
      class="input"
    ></an-input>
  </div>
</template>

<script>
import AnInput from "components/common/basic/AnInput";
export default {
  name: "AnLabelTextarea",
  props: {
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "请输入", //输入框占位文本
    },
    initialValue: {
      type: String,
    },
    rows: {
      type: Number,
      default: 2, //输入框行数，只对 type="textarea" 有效
    },
    maxlength: {
      type: Number, //原生属性，最大输入长度
    },
    showWordLimit: {
      type: Boolean,
      default: true, //是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
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
.an-label-textarea {
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
/*整行文本域 子级   这里引用到了element ui里的框架样式，所以需要父元素穿透element 原有的子元素样式并且增加权重*/
.el-textarea >>> .el-textarea__inner {
  min-height: 90px;
  height: 90px !important;
}
</style>
