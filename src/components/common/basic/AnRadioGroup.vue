<template>
  <div class="an-radio-group">
    <el-radio-group
      v-if="type == 'radio'"
      v-model="value"
      :disabled="disabled"
      :text-color="textColor"
      :fill="fill"
      @change="change"
    >
      <el-radio
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :border="border"
        >{{ item.label }}</el-radio
      >
    </el-radio-group>

    <el-radio-group
      v-else
      v-model="value"
      :disabled="disabled"
      :text-color="textColor"
      :fill="fill"
      @change="change"
    >
      <el-radio-button
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        >{{ item.label }}</el-radio-button
      >
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: "AnRadioGroup",
  props: {
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
      value: this.initialValue, //选中的值
    };
  },
  components: {},
  methods: {
    //设置数据
    setValue(value) {
      this.value = value;
    },
    //绑定值变化时触发的事件,选中的 Radio 值
    change(value) {
      this.$emit("change", value);
    },
  },
};
</script>

<style scoped>
</style>
