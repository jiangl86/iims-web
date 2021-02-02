<template>
  <div class="an-checkbox-group">
    <el-checkbox-group
      v-if="type === 'checkbox'"
      v-model="value"
      :disabled="disabled"
      :textColor="textColor"
      :fill="fill"
      @change="change"
    >
      <el-checkbox
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        :border="border"
        >{{ item.label }}</el-checkbox
      >
    </el-checkbox-group>

    <el-checkbox-group
      v-else
      v-model="value"
      :disabled="disabled"
      :textColor="textColor"
      :fill="fill"
      @change="change"
    >
      <el-checkbox-button
        v-for="item in options"
        :key="item.value"
        :label="item.value"
        >{{ item.label }}</el-checkbox-button
      >
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: "AnCheckboxGroup",
  props: {
    type: {
      type: String,
      default: "checkbox", //radio类型，默认为checkbox,可选包括checkbox和checkboxbutton
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
      value: this.initialValue,
    };
  },
  components: {},
  methods: {
    change(value) {
      this.$emit("change", value);
    },
  },
};
</script>

<style scoped>
</style>
