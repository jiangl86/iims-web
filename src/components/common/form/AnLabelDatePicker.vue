<template>
  <div class="an-label-data-picker">
    <label>{{ name }}</label>
    <an-date-picker
      :type="type"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :format="format"
      :valueFormat="valueFormat"
      :clearable="clearable"
      :initialValue="initialValue"
      @change="change"
      @blur="blur"
      @focus="focus"
    ></an-date-picker>
  </div>
</template>
<script>
import AnDatePicker from "components/common/basic/AnDatePicker";
export default {
  name: "AnLabelDatePicker",
  props: {
    name: {
      type: String,
      required: true,
    },
    initialValue: {
      type: Array,
    },
    readonly: {
      //完全只读
      type: Boolean,
      default: false,
    },
    disabled: {
      //禁用
      type: Boolean,
      default: false,
    },
    editable: {
      //文本框可输入
      type: Boolean,
      default: true,
    },
    size: {
      //输入框尺寸
      type: String,
    },
    clearable: {
      //是否显示清除按钮
      type: Boolean,
      default: true,
    },
    placeholder: {
      //非范围选择时的占位内容
      type: String,
    },
    rangeSeparator: {
      //选择范围时的分隔符  ，默认'至' 可填别的字符
      type: String,
      default: "至",
    },
    startPlaceholder: {
      //范围选择时结束日期的占位内容
      type: String,
    },
    endPlaceholder: {
      type: String,
    },
    type: {
      //显示类型
      type: String, //year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange
      default: "daterange",
    },
    format: {
      //显示在输入框中的格式
      type: String,
    },
    valueFormat: {
      //value格式
      type: String,
    },
    align: {
      //对齐方式
      type: String,
      default: "left",
    },
    popperclass: {
      //DatePicker 下拉框的类名
    },
  },
  data() {
    return {
      value: "",
    };
  },
  components: {
    AnDatePicker,
  },
  methods: {
    //用户确认选定的值时触发
    change(value) {
      this.value = value;
      this.$emit("change", value);
    },
    //当 input 失去焦点时触发
    blur(value) {
      this.$emit("blur", value);
    },
    //当 input 获得焦点时触发
    focus(value) {
      this.$emit("focus", value);
    },

    getValue() {
      return this.value;
    },
  },
};
</script>
<style scoped>
.an-label-data-picker {
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

.an-label-data-picker >>> .an-data-picker {
  width: 75% !important;
}

.an-data-picker >>> .el-date-editor {
  width: 100% !important;
}
</style>