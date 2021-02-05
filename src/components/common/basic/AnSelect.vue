<template>
  <div class="an-select">
    <el-select
      v-model="value"
      :placeholder="placeholder"
      :multiple="multiple"
      :filterable="filterable"
      :allow-create="allowCreate"
      :remote="remote"
      :remote-method="remoteMethod"
      :loading="loading"
      :disabled="disabled"
      clearable
      @change="change"
      @visible-change="visibleChange"
      @clear="clear"
      @focus="focus"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "anSelect",
  props: {
    initialValue: {
      type: Array, //初始选中值，每个元素为选中的id值
    },
    options: {
      type: Array, //备选项，每个元素包含id和name属性
      required: true,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    multiple: {
      type: Boolean,
      default: false, //是否多选
    },
    disabled: {
      type: Boolean,
      default: false, //是否禁用
    },
    filterable: {
      type: Boolean,
      default: false, //是否可搜索
    },
    allowCreate: {
      type: Boolean,
      default: false, //是否允许用户创建新条目，需配合 filterable 使用
    },
    remote: {
      type: Boolean,
      default: false, //是否为远程搜索
    },
    remoteMethod: {
      type: Function, //远程搜索方法
    },
    loading: {
      type: Boolean,
      default: false, //是否正在加载
    },
  },
  data() {
    return {
      value: this.initialValue ? this.initialValue : [], //选中的结果，为一个数组，每个选项包含label和value两个数值
    };
  },
  components: {},
  created() {
    if (!this.multiple && this.initialValue && this.initialValue.length > 0) {
      this.value = this.initialValue[0].id;
    }
  },
  methods: {
    //选中值发生变化时触发,value为目前的选中值
    change(value) {
      console.log("sdssdssd");
      console.log(value);
      this.$emit("change", value);
    },
    //下拉框出现/隐藏时触发	,state出现则为 true，隐藏则为 false
    visibleChange(state) {
      this.$emit("visibleChange", state);
    },
    //可清空的单选模式下用户点击清空按钮时触发
    clear() {
      this.$emit("clear");
    },
    //当 input 获得焦点时触发	,e为Event事件
    focus(e) {
      this.$emit("focus", e);
    },
  },
};
</script>

<style scoped>
.el-input__suffix >>> .el-input__icon {
  line-height: 29px !important;
}
</style>
