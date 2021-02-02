<template>
  <div class="an-label-popup-select">
    <label><span v-if="required">*</span>{{ name }}:</label>
    <an-input
      type="textarea"
      :placeholder="placeholder"
      :initialValue="value"
      :rows="rows"
      :suffixIcon="suffixIcon"
      :readonly="readonly"
      :disabled="disabled"
      @focus="focusTextarea"
      @input="changeTextarea"
      ref="textarea"
      class="textarea"
    ></an-input>
    <span v-if="canInput" class="select-btn" @click="showSelectPicker"
      >选择</span
    >

    <an-tree
      v-show="showSelect"
      :name="selectName"
      :pData="pData"
      :initialSelect="selected"
      :multiSelect="multiSelect"
      :selectAssert="selectAssert"
      :chainSelect="chainSelect"
      :onlyLeaf="onlyLeaf"
      :showSelected="showSelected"
      :showSearch="showSearch"
      :autoExpandSelect="autoExpandSelect"
      :backTip="backTip"
      @assert="assertSelect"
      @cancel="cancelSelect"
      ref="tree"
    ></an-tree>
  </div>
</template>

<script>
import AnTree from "components/common/show/AnTree";
import AnInput from "components/common/basic/AnInput";

import { debounce } from "common/other/debounce";
export default {
  name: "AnLabelPopupSelect",
  props: {
    name: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean, //是否必填项，若为真会标识必填项标识
      default: false,
    },
    canInput: {
      type: Boolean, //是否支持手动输入
      default: false,
    },

    //树列表选择相关信息
    selectName: {
      type: String,
      default: function () {
        return "请选择" + this.name;
      },
    }, //弹框的标题名称
    pData: {
      type: Array, //数组中每个选项为一个item,必须包含name和id属性
    },
    initialSelect: {
      type: Array, //数组中每个选项为一个item,必须包含name和id属性
    },
    multiSelect: {
      type: Boolean, //是否多选
      default: true,
    },
    selectAssert: {
      type: Boolean,
      default: false, //是否支持点击就确认，仅单选时支持
    },
    chainSelect: {
      type: Boolean,
      default: false, //是否支持父子节点联动选择，默认为否
    },
    onlyLeaf: {
      type: Boolean,
      default: false, //是否仅允许选中叶子节点，默认为否
    },
    showSelected: {
      type: Boolean,
      default: false, //是否展示选中的结果树，目前暂不支持
    },
    showSearch: {
      type: Boolean,
      default: true, //是否展示搜索框，默认为否
    },
    autoExpandSelect: {
      type: Boolean,
      default: true, //是否自动展开选中的节点，默认是
    },
    backTip: {
      type: Boolean,
      default: false, //点击返回时，是否由上级处理还是直接返回
    },

    // textarea相关属性
    initialValue: {
      type: String, //在选择框中初始化的显示值，一般显示的是initialSelect的name
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    suffixIcon: {
      type: String, //输入框尾部图标
      default: "el-icon-plus",
    },
    rows: {
      type: Number,
      default: 1, //输入框行数，只对 type="textarea" 有效
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: this.initialSelect, //选中的内容数组
      value: this.initialValue, //在输入框中显示的值，如果可输入，还包含自己输入且可能不在selected中的值（若输入的内容在可选列表中存在，会加入selected中）
      showSelect: false, //控制是否显示弹框
      isFirstShow: true, //首次显示时，滚动到默认选中的节点
      refreshSelectedDebounce: null,
    };
  },
  components: {
    AnTree,
    AnInput,
  },
  mounted() {
    //若selected为空，则初始化为空数据
    if (!this.selected) {
      this.selected = [];
    }

    //通过防抖动，防止输入频繁刷新选中列表
    this.refreshSelectedDebounce = debounce(this.refreshSelected);
    this.initData();
  },
  methods: {
    initData() {
      //如果传了initialSelect,没有传initialvalue，用initialSelect的值初始化value
      if (!this.value && this.selected.length > 0) {
        this.assertSelect(this.selected);
      }
      //如果传了initialvalue没有传initialSelect，用initialvalue初始化selected
      if (this.value && this.value != "" && !this.initialSelect) {
        this.refreshSelectedDebounce(this.value);
      }
    },
    //输入框获得焦点
    focusTextarea() {
      //若不可以输入，则显示选择框
      if (!this.canInput) {
        this.showSelectPicker();
      }
    },

    //输入框内容修改，判断输入的内容和选项是否有相同的，有则设置为选中状态,没有就设置为未选中
    changeTextarea(value) {
      this.refreshSelectedDebounce(value);
    },

    //根据填写的内容，刷新选中情况
    refreshSelected(value) {
      if (value != "") {
        //首先替换中文字符
        value = value.replaceAll("，", ",");
        let valueArr = value.split(",");
        //在选中列表中添加名字存在的item
        for (let i = 0; i < valueArr.length; i++) {
          let exist = false;
          //首先在已选中的数组中查找是否存在
          for (let j = 0; j < this.selected.length; j++) {
            if (valueArr[i] == this.selected[j].name) {
              exist = true;
              break;
            }
          }
          //如果不存在，再到pData中查找
          if (!exist) {
            let item = this.findItem(this.pData, valueArr[i]);
            if (item) {
              item.selected = true; //设置为选中状态
              this.selected.push(item);
            }
          }
        }

        //删除selected中多余的项
        for (let i = this.selected.length - 1; i >= 0; i--) {
          let j = 0;
          for (; j < valueArr.length; j++) {
            if (this.selected[i].name == valueArr[j]) {
              break;
            }
          }
          if (j == valueArr.length) {
            this.selected[i].selected = false;
            this.selected.splice(i, 1);
          }
        }
      }
    },

    //在一个数组中查找对应的name是否存在，数组每一项为未一个对象，都包含name属相，可能含有children属相,存在则返回item,否则返回null
    findItem(list, name) {
      let i = 0;
      let childItem = null;
      for (; i < list.length; i++) {
        if (list[i].name == name) {
          return list[i];
        }
        if (list[i].children) {
          let item = this.findItem(list[i].children, name);
          if (item) {
            childItem = item;
          }
        }
      }
      return childItem;
    },

    //显示选择框
    showSelectPicker() {
      this.showSelect = true;
      if (this.isFirstShow) {
        this.$refs.tree.ScrollToSelect();
        this.isFirstShow = false;
      }
    },

    //弹框选择确认
    assertSelect(selected) {
      this.selected = selected;
      this.value = "";
      for (let i = 0; i < this.selected.length; i++) {
        this.value += "," + this.selected[i].name;
      }
      if (this.value != "") {
        this.value = this.value.substring(1);
      }
      this.$refs.textarea.setValue(this.value);
      this.showSelect = false;
    },

    // 取消选择
    cancelSelect() {
      this.showSelect = false;
    },
  },
};
</script>

<style scoped>
.an-label-popup-select {
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
label span {
  color: red;
}
.textarea {
  flex: 1;
}
.select-btn {
  color: var(--mainColor);
  font-size: var(--font-size-sm);
}
</style>
