<template>
  <div class="an-label-dropdown-select">
    <label>{{ name }}:</label>
    <an-select
      :placeholder="placeholder"
      :initialValue="initialValue"
      :multiple="multiple"
      :filterable="filterable"
      :allow-create="allowCreate"
      :remote="remote"
      :remote-method="remoteMethod"
      :loading="loading"
      :disabled="disabled"
      :options="options"
      clearable
      @change="change"
      @visible-change="visibleChange"
      @clear="clear"
      @focus="focus"
    >
    </an-select>
  </div>
</template>

<script>
import AnSelect from "components/common/basic/AnSelect";
export default {
  name: "AnLabelDropdownSelect",
  props: {
    name: {
      type: String,
      required: true,
    },
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
      value: null,
    };
  },
  components: { AnSelect },
  methods: {
    //选中值发生变化时触发,value为目前的选中值
    change(value) {
      this.value = value;
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
.an-label-select {
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
.select {
  flex: 1;
}

.anShort {
  width: 31%;
  margin-right: 1%;
}
.an-label-dropdown-select {
  display: flex;
  align-items: center;
}
.el-select {
  flex: 1;
}
.el-input__suffix >>> .el-input__icon {
  line-height: 31px !important;
}
</style>
