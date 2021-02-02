<template>
  <div class="an-data-picker">
    <el-date-picker
      v-model="value"
      :type="type"
      :range-separator="rangeSeparator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :format="format"
      :clearable="clearable"
      @change="change"
      @blur="blur"
      @focus="focus"
    >
    </el-date-picker>
  </div>
</template>
<script>
export default {
  name: "AnDatePicker",
  props: {
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
      default: "选择日期",
    },
    rangeSeparator: {
      //选择范围时的分隔符  ，默认'-' 可填别的字符
      type: String,
      default: "-",
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
  methods: {
    //用户确认选定的值时触发
    change(value) {
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
  },
};
</script>
<style scoped>
.el-date-editor >>> .el-input__icon {
  line-height: 0px !important;
}

.an-data-picker >>> .el-date-editor {
  height: 30px;
}

.el-date-editor >>> .el-range-separator {
  line-height: 23px;
}
</style>