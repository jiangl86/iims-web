<template>
  <div class="an-label-checkbox-group">
    <label>{{ name }}:</label>
    <an-checkbox-group
      :type="type"
      :initialValue="initialValue"
      :options="options"
      :disabled="disabled"
      :textColor="textColor"
      :fill="fill"
      :border="border"
      @change="change"
    ></an-checkbox-group>
  </div>
</template>

<script>
import AnCheckboxGroup from "components/common/basic/AnCheckboxGroup";
export default {
  name: "AnLabelCheckboxGroup",
  props: {
    name: {
      type: String,
    },
    type: {
      type: String,
      default: "checkbox", //radio类型，默认为checkbox,可选包括checkbox和hcheckboxbutton
    },
    initialValue: {
      type: Array, //初始选中的值,数组
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
      value: [],
    };
  },
  components: {
    AnCheckboxGroup,
  },
  methods: {
    change(value) {
      this.value = value;
      this.$emit("change", value);
    },
  },
};
</script>

<style scoped>
.an-label-checkbox-group {
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
