<template>
  <div class="an-checkbox">
    <el-checkbox
      v-model="checked"
      :disabled="disabled"
      :border="border"
      @change="change"
      >{{ label }}</el-checkbox
    >
  </div>
</template>

<script>
export default {
  name: "AnCheckbox",
  props: {
    initialChecked: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String, //选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效）
    },
    disabled: {
      type: Boolean,
      default: false, //是否禁用
    },
    border: {
      type: Boolean,
      default: false, //是否显示边框
    },
  },
  data() {
    return {
      checked: this.initialChecked,
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
