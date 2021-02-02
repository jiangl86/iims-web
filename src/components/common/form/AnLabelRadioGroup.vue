<template>
  <div class="an-label-radio-group">
    <label>{{ name }}:</label>
    <an-radio-group
      :type="type"
      :initialValue="initialValue"
      :options="options"
      :disabled="disabled"
      :textColor="textColor"
      :fill="fill"
      :border="border"
      @change="change"
      ref="radioGroup"
    ></an-radio-group>
  </div>
</template>

<script>
import AnRadioGroup from "components/common/basic/AnRadioGroup";
export default {
  name: "AnLabelRadioGroup",
  props: {
    name: {
      type: String,
    },
    type: {
      type: String,
      default: "radio", //radio类型，默认为radio,可选包括radio和radiobutton
    },
    initialValue: {
      type: String, //初始选中的值
    },
    options: {
      type: Array, //备选项，数组每一个元素包含label和value属性，label用于显示，value是选中的值
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false, //是否禁用
    },
    textColor: {
      type: String,
      default: "#ffffff", //按钮形式的 Radio 激活时的文本颜色
    },
    fill: {
      type: String,
      default: "##409EFF", //按钮形式的 Radio 激活时的填充色和边框色
    },
    border: {
      type: Boolean, //是否显示边框
      default: false,
    },
  },
  data() {
    return {
      value: "",
    };
  },
  components: {
    AnRadioGroup,
  },
  methods: {
    //设置数据
    setValue(value) {
      this.value = value;
      this.$refs.radioGroup.setValue(value);
    },
    change(value) {
      this.value = value;
      this.$emit("change", value);
    },
  },
};
</script>

<style scoped>
.an-label-radio-group {
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
