<template>
  <div class="an-edit-table">
    <div class="funcs-page">
      <div class="funcs" v-if="showFuncs">
        <an-button
          v-for="btn in funcButtons"
          :key="btn.code"
          :icon="btn.icon"
          :name="btn.name"
          :color="btn.color"
          :letterColor="btn.letterColor"
          @click.native="funcClick(btn)"
          class="btn"
        ></an-button>
      </div>
      <div class="page" v-if="showPagination">
        <an-pagination
          :total="total"
          :initialPage="initialPage"
          @pageChange="pageChange"
          @sizeChange="sizeChange"
        ></an-pagination>
      </div>
    </div>
    <table @mouseleave.stop="mouseleave" ref="table">
      <thead ref="thead">
        <tr>
          <th
            v-if="showCheckbox"
            style="width: 2%"
            @click.prevent="thCheckboxClick"
          >
            <an-checkbox
              :initialChecked="thCheckboxState"
              ref="thCheckbox"
            ></an-checkbox>
          </th>
          <th style="width: 3%">序号</th>
          <th
            v-for="(labelName, index) in labelNames"
            :key="labelName"
            :style="'width:' + colWidths[index]"
            :class="{ hide: isHide(index) }"
          >
            {{ labelName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, itemIndex) in dataList"
          :key="item.id"
          @dblclick="dblClick(item)"
        >
          <td v-if="showCheckbox" style="width: 2%">
            <an-checkbox
              :initialChecked="trCheckboxStates[itemIndex]"
              @change="trCheckboxChange($event, itemIndex)"
              ref="trCheckbox"
            ></an-checkbox>
          </td>
          <td style="width: 3%">
            <an-icon
              v-if="item.editType != 'none'"
              :icon="item.editIcon"
              :size="12"
            ></an-icon>
            {{ item.num }}
          </td>
          <td
            v-for="(keyName, index) in keys"
            :key="item.id + keyName"
            :class="{ hide: isHide(index) }"
            @mouseenter.stop="mouseenter($event, item[keyName])"
          >
            <an-input
              v-if="showFuncs"
              :initialValue="String(item[keyName])"
              :type="inputType(index)"
              :disabled="item.editType == 'del'"
              @focus="tdFocus($event, itemIndex, index)"
              @change="tdChange($event, itemIndex, index)"
            ></an-input>
            <div v-else>{{ item[keyName] }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="tips" ref="tips">{{ currentValue }}</div>
    <an-tree
      v-if="hasSelect"
      v-show="showSelect"
      :pData="treeData"
      :initialSelect="treeInitialSelect"
      :multiSelect="multiSelect"
      :chainSelect="chainSelect"
      :selectAssert="selectAssert"
      :backTip="false"
      @cancel="cancelSelect"
      @assert="assertSelect"
    ></an-tree>
  </div>
</template>

<script>
import AnIcon from "components/common/basic/AnIcon";
import AnInput from "components/common/basic/AnInput";
import AnCheckbox from "components/common/basic/AnCheckbox";
import AnButton from "components/common/basic/AnButton";
import AnPagination from "components/common/basic/AnPagination";
import AnTree from "components/common/show/AnTree";

import AnMsgbox from "components/common/popup/AnMsgbox";
export default {
  name: "AnEditTable",
  props: {
    pDatas: {
      type: Array, //需要展示的数据集合，每一个元素为一个对象
      required: true,
    },
    labelNames: {
      type: Array, //表第一行名称集团，如['隐患名称','隐患编号']
      required: true,
    },
    keys: {
      type: Array, //需要展示的数据key集合，对应pData里每一个元素的key值['dangername','dangerno']
      required: true,
    },
    types: {
      type: Array, //各列对应的数据类型，不传时默认为text,每一个元素必须包含name属性，格式：[{name:'text'},{name:'select',datas:data}]
      //若为select,必需包含datas属性（数据选择范围），其他可选属性包括multiSelect,chainSelect,selectAssert,均为true或false
    },
    labelBgColor: {
      type: String, //表第一行颜色（表头颜色），不传该值时默认用系统主颜色
    },
    widths: {
      type: Array, //每一列对应的宽度，不设置时，平均分布，按百分比设置，格式为[‘5%‘,’5%’,‘5%’],各列加起来等于100%，其中checkbox占用宽度（2%）,序号占3%
    },
    scaleWidth: {
      type: Array, //当屏幕低于1365时，每一列对应的宽度，若为0，则隐藏，
    },
    showCheckbox: {
      type: Boolean,
      default: true,
    },

    //分页相关参数
    showPagination: {
      type: Boolean, //是否显示分页
      default: true,
    },
    total: {
      type: Number, //数据总条数
      required: true,
    },
    initialPage: {
      type: Number, //初始页面
    },

    //是否显示增加、删除、恢复删除及撤回等功能
    showFuncs: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dataList: this.pDatas,
      changeDatas: [], //该数据用于保存所有修改过的数据，通过每个元素中的editType标识，add表示添加、edit修改、del删除。若是选择的数据，对应的元素会增加selected属性，selected对应一个对象，里面的key值为对应的列的key，值为选择的数据

      colWidths: this.widths,
      funcButtons: [], //根据权限判断的功能按钮,若超过5个，将会把5个之后的按钮放入更多按钮里

      currentValue: "", //鼠标当前所在表格对应的内容
      targetTd: null, //用于提示
      targetTable: null, //用于提示

      thCheckboxState: false, //表头复选框选中状态
      trCheckboxStates: Array(this.pDatas.length).fill(false), //各行复选框选中状态
      selectedItem: [], //选中数据对应的数组

      //选择框相关的参数
      hasSelect: false, //是否有选择组件
      showSelect: false, //是否展示树形选择框
      treeData: [], //树形选择的备选数据
      treeInitialSelect: [], //树形选择的初始选择数据
      multiSelect: false, //是否支持多选
      chainSelect: true, //是否支持chainSelect
      selectAssert: false, //是否支持选择即确认

      focusEle: null, //点击选择框时激活的选择框
      focusItemIndex: 0, //点击选择框时激活的行
      focusColIndex: 0, //点击选择框时激活的列
    };
  },

  components: {
    AnInput,
    AnCheckbox,
    AnButton,
    AnPagination,
    AnIcon,
    AnTree,
  },
  computed: {
    inputType() {
      return (colIndex) => {
        if (
          this.types &&
          (this.types[colIndex].name == "text" ||
            this.types[colIndex].name == "number" ||
            this.types[colIndex].name == "textarea")
        ) {
          return this.types[colIndex].name;
        }
        return "text";
      };
    },
  },
  created() {
    this.initData();
    this.initFuncButtons();
  },
  mounted() {
    this.initStyle();
    this.targetTable = this.$refs.table;
  },
  methods: {
    initData() {
      //初始化每列宽度
      if (!this.widths) {
        let total = 97;
        if (this.showCheckbox) {
          total -= 2;
        }
        let perCol = total / this.labelNames.length;
        this.colWidths = [];
        for (let i = 0; i < this.labelNames.length; i++) {
          this.colWidths.push(perCol + "%");
        }
      }

      //初始化各行数据前显示的图标
      this.dataList.map((ele) => {
        this.$set(ele, "editType", "none");
        return ele;
      });

      //初始化是否有选择组件
      this.hasSelect =
        this.types.findIndex((ele) => ele.name == "select") == -1
          ? false
          : true;
    },

    initFuncButtons() {
      this.funcButtons.push({
        code: "add",
        name: "新增",
        icon: "el-icon-plus",
      });

      this.funcButtons.push({
        code: "del",
        name: "删除",
        icon: "el-icon-delete",
      });
      this.funcButtons.push({
        code: "recover",
        name: "撤销删除",
        icon: "el-icon-back",
      });
      this.funcButtons.push({
        code: "import",
        name: "导入",
        icon: "el-icon-s-fold",
      });

      //处理第一个按钮颜色
      this.funcButtons[0].color = "green";
      this.funcButtons[0].letterColor = "white";
    },

    initStyle() {
      //初始化表头颜色
      if (this.labelBgColor) {
        this.$refs.thead.style.backgroundColor = this.labelBgColor;
      }
    },

    //是否隐藏
    isHide(index) {
      if (
        this.scaleWidth &&
        (this.scaleWidth[index] == "0" || this.scaleWidth[index] == "0%")
      ) {
        return true;
      }
      return false;
    },
    //双击事件
    dblClick(item) {
      this.$emit("dblClick", item);
    },
    //页码切换
    pageChange(page) {
      this.$emit("pageChagne", page);
    },
    //调整每页显示数量时，num为设置的每页数量
    sizeChange(pageSize) {
      this.$emit("sizeChange", pageSize);
    },

    //显示隐藏的内容
    mouseenter(e, value) {
      //仅当有隐藏内容时，才展示所有内容
      if (e.target.scrollWidth > e.target.offsetWidth) {
        this.currentValue = value;
        let left = e.clientX;
        let top = e.clientY;
        if (e.clientX > document.body.clientWidth - 300) {
          left = document.body.clientWidth - 300;
        }

        if (e.clientY > window.screen.availHeight - 200) {
          top = window.screen.availHeight - 200;
        }
        this.$refs.tips.style.left = left + "px";
        this.$refs.tips.style.top = top + "px";
        if (this.targetTd != e.target) {
          this.targetTd = e.target;
          this.$refs.tips.style.display = "block";
        }
      } else {
        this.$refs.tips.style.display = "none";
      }
    },

    //隐藏提示框
    mouseleave(e) {
      //目前leave和enter事件因在元素内部也会触发，暂采用该方案
      if (e.target != this.targetTable) {
        this.$refs.tips.style.display = "none";
      }
    },

    //点击表头复选框
    thCheckboxClick() {
      let value = !this.$refs.thCheckbox.checked;
      this.$refs.thCheckbox.checked = value;
      for (let i = 0; i < this.$refs.trCheckbox.length; i++) {
        this.$refs.trCheckbox[i].checked = value;
        this.trCheckboxStates[i] = value;
      }
    },

    //数据内各行选中状态变化
    trCheckboxChange(value, itemIndex) {
      this.trCheckboxStates[itemIndex] = value;
      if (!this.trCheckboxStates.includes(false)) {
        this.$refs.thCheckbox.checked = true;
      } else {
        this.$refs.thCheckbox.checked = false;
      }
    },
    //输入框获取焦点，若为选择框需要弹出选项进行选择
    tdFocus(e, itemIndex, index) {
      if (this.types[index].name == "select") {
        this.focusEle = e.target;
        this.focusItemIndex = itemIndex;
        this.focusColIndex = index;
        let colType = this.types[index];
        this.treeData = colType.datas; //可能会有问题，数据变化会导致树频繁刷新，所以数据没有变化时，需要不变化treeData
        // this.treeData.splice(0, this.treeData.length, ...colType.datas);
        this.multiSelect = colType.multiSelect ? colType.multiSelect : false;
        this.chainSelect = colType.chainSelect ? colType.chainSelect : true;
        this.selectAssert = colType.selectAssert ? colType.selectAssert : false;

        if (this.treeData) {
          this.refreshIntialSelected(String(this.focusEle.value));
          this.showSelect = true;
        }
      }
    },

    //根据填写的内容，刷新选中情况
    refreshIntialSelected(value) {
      this.treeInitialSelect = [];
      if (value != "") {
        //首先替换中文字符
        value = value.replaceAll("，", ",");
        let valueArr = value.split(",");
        //在选中列表中添加名字存在的item
        for (let i = 0; i < valueArr.length; i++) {
          let item = this.findItem(this.treeData, valueArr[i]);
          if (item) {
            this.$set(item, "selected", true);
            this.treeInitialSelect.push(item);
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
    //取消弹框选择
    cancelSelect() {
      this.treeInitialSelect.forEach((ele) => (ele.selected = false));
      this.showSelect = false;
    },
    //确认选择框
    assertSelect(selected) {
      let value = "";
      for (let i = 0; i < selected.length; i++) {
        value += selected[i].name + ",";
        selected[i].selected = false;
      }
      value = value.substring(0, value.length - 1);
      this.focusEle.value = value;
      this.tdChange(value, this.focusItemIndex, this.focusColIndex, selected);
      this.showSelect = false;
    },
    //数据发生变化后，根据输入内容是否变化，将修改后的数据保存进变化的数组中,selected仅在选择框选择时才传入
    tdChange(value, itemIndex, keyIndex, selected = null) {
      let item = this.dataList[itemIndex];
      let key = this.keys[keyIndex];
      //如果数据和原数据相比发生了变化
      if (item[key] != value) {
        //首先判断该变化的item是否已经在changeDatas中存在
        let changeItem = this.changeDatas.find((ele) => ele.id == item.id);
        //如果不存在，则一定是修改的已有数据
        if (!changeItem) {
          this.$set(item, "editType", "edit");
          this.$set(item, "editIcon", "el-icon-edit");
          changeItem = {
            id: item.id,
            editType: "edit",
            editIcon: "el-icon-edit",
          };
          for (let index in this.keys) {
            this.$set(changeItem, this.keys[index], item[this.keys[index]]);
          }
          //保存selected的信息

          this.changeDatas.push(changeItem);
        }
        //如果是选择框选择的信息，保存选择的完整内容
        if (selected) {
          let selectedInfo = {};
          //首先判断changeItem是否有selected信息
          if (changeItem.selected) {
            selectedInfo = changeItem.selected;
          }
          this.$set(selectedInfo, key, selected);
          this.$set(changeItem, "selected", selectedInfo);
        }
        changeItem[key] = value;
      } else if (item.editType == "edit") {
        this.$set(item, "editType", "none");
        let changeIndex = this.changeDatas.findIndex(
          (ele) => ele.id == item.id
        );
        this.changeDatas.splice(changeIndex, 1);
      }
    },

    //点击各个功能按钮，根据点击的功能判断是否需要选中内容或是否选中了多个等情况
    funcClick(btn) {
      //如果是新增
      if (btn.code == "add") {
        //初始化要添加的新元素包含的key键
        let newData = {
          id: "add" + this.changeDatas.length + 1,
          editType: "add",
          editIcon: "el-icon-plus",
        };
        for (let index in this.keys) {
          this.$set(newData, this.keys[index], "");
        }
        this.dataList.splice(0, 0, newData);
        //将元素插入变化的数组中
        this.changeDatas.push(newData);
        //针对新元素插入初始化选中状态
        this.trCheckboxStates.splice(0, 0, false);
      } else if (btn.code == "del" || btn.code == "recover") {
        //先初始化选中了多少条
        this.selectedItem = [];
        for (let i = 0; i < this.trCheckboxStates.length; i++) {
          if (this.trCheckboxStates[i]) {
            this.selectedItem.push(this.dataList[i]);
          }
        }

        //如果未选中，直接提示需要选中相关数据
        if (this.selectedItem.length == 0) {
          AnMsgbox.msgbox({ type: "info", message: "请选择需要操作的数据" });
        } else {
          if (btn.code == "del") {
            for (let i = 0; i < this.selectedItem.length; i++) {
              let item = this.selectedItem[i];

              //判断该条数据在修改的数据列表里面是否存在，如果不存在，则插入修改的数据中，
              //如果已经存在，判断是否是新添加的数据，是的则直接删除，否则把修改标识改为del
              let exsitIndex = this.changeDatas.findIndex(
                (ele) => ele.id == item.id
              );
              if (exsitIndex == -1) {
                //如果不存在,则标识操作的数据是已经存在的列表，将数据插入修改数，并把datalist中对应元素edittype修改为del
                item.editType = "del"; //把展示数据里面的editType标识为del
                this.$set(item, "editIcon", "el-icon-delete");
                let changeItem = {
                  id: item.id,
                  editType: "del",
                  editIcon: "el-icon-delete",
                };
                for (let index in this.keys) {
                  this.$set(
                    changeItem,
                    this.keys[index],
                    item[this.keys[index]]
                  );
                }
                this.changeDatas.push(changeItem);
              } else {
                let exsitItem = this.changeDatas[exsitIndex];
                if (exsitItem.editType == "add") {
                  //新添加的数据，删除修改列表中对应数据
                  this.changeDatas.splice(exsitIndex, 1);
                  let dataIndex = this.dataList.findIndex(
                    (ele) => ele.id == item.id
                  );
                  //删除dataList中对应数据
                  this.dataList.splice(dataIndex, 1);
                  //删除trCheckboxStates中对应元素
                  this.trCheckboxStates.splice(dataIndex, 1);
                } else if (exsitItem.editType == "edit") {
                  item.editType = "del";
                  this.$set(item, "editIcon", "el-icon-delete");
                  exsitItem.editType = "del";
                  this.$set(exsitItem, "editIcon", "el-icon-delete");
                }
              }
            }
          } else {
            //如果是撤销删除，
            for (let i = 0; i < this.selectedItem.length; i++) {
              let item = this.selectedItem[i];
              //仅处理已经删除的数据
              if (item.editType == "del") {
                //或者item在changeDatas中索引
                let exsitIndex = this.changeDatas.findIndex(
                  (ele) => ele.id == item.id
                );

                let changeItem = this.changeDatas[exsitIndex];
                //判断撤销删除的数据之前是否修改过
                let isChange = false;
                for (let keyIndex in this.keys) {
                  if (
                    item[this.keys[keyIndex]] != changeItem[this.keys[keyIndex]]
                  ) {
                    isChange = true;
                    break;
                  }
                }
                //如果未修改，则直接删除changeDatas中数据，并将editType修改为none
                if (!isChange) {
                  this.changeDatas.splice(exsitIndex, 1);
                  item.editType = "none";
                } else {
                  //如果有修改，则直接将对应的数据表示为修改
                  item.editType = "edit";
                  changeItem.editType = "edit";
                  this.$set(item, "editIcon", "el-icon-edit");
                  this.$set(changeItem, "editIcon", "el-icon-edit");
                }
              }
            }
          }
        }
      } else if (btn.code == "import") {
        //如果是数据导入
      }
      this.$emit(btn.code, this.changeDatas);
    },
  },
};
</script>

<style scoped>
.an-edit-table {
  width: 100%;
}
.funcs-page {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.funcs {
  display: flex;
  justify-content: flex-start;
}
.funcs .btn {
  margin-right: 5px;
}
.more-funcs {
  position: absolute;
  width: 120px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
}
.more-funcs li {
  line-height: 30px;
}
.more-funcs li:hover {
  background-color: lightblue;
}
table {
  width: 100%;
  table-layout: fixed;
  background: #fff;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
  background-color: var(--table-bg-color);
}
thead {
  background-color: #5787eb;
  color: #fff;
  font-size: var(--font-size-sm);
  height: 30px;
  line-height: 30px;
  text-align: center;
}
td,
th {
  height: 30px;
  line-height: 30px;
  border: 1px solid #ccc;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/*绿色按钮*/
.btn_add {
  width: 80px;
  background-color: #009900;
  border: 1px solid #058505;
  color: #fff;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
}

.tips {
  position: fixed;
  display: none;
  width: 240px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  line-height: 1.3;
  z-index: 2;
}

@media screen and (max-width: 1365px) {
  .hide {
    display: none !important;
  }
}
</style>
