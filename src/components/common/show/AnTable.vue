<template>
  <div class="an-table">
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
        <an-button
          v-if="moreButtons.length > 0"
          icon="el-icon-more"
          name="更多"
          @click.native="moreBtnClick"
          class="more-btn"
          ref="moreBtn"
        ></an-button>
        <ul
          v-if="moreButtons.length > 0"
          v-show="showMoreFunc"
          class="more-funcs"
          ref="moreFuncs"
        >
          <li
            v-for="moreBtn in moreButtons"
            :key="moreBtn.code"
            @click="funcClick(moreBtn)"
          >
            {{ moreBtn.name }}
          </li>
        </ul>
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
          v-for="(item, itemIndex) in pDatas"
          :key="item.id"
          @dblclick="dblClick(item)"
        >
          <td
            v-if="showCheckbox"
            style="width: 2%"
            @click.prevent="trCheckboxClick(itemIndex)"
          >
            <an-checkbox
              :initialChecked="trCheckboxStates[itemIndex]"
              ref="trCheckbox"
            ></an-checkbox>
          </td>
          <td style="width: 3%">{{ item.num }}</td>
          <td
            v-for="(keyName, index) in keys"
            :key="item.id + keyName"
            :class="{ hide: isHide(index) }"
            @mouseenter.stop="mouseenter($event, item[keyName])"
            @click="click(item, index)"
          >
            {{ item[keyName] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="tips" ref="tips">{{ currentValue }}</div>
  </div>
</template>

<script>
import AnCheckbox from "components/common/basic/AnCheckbox";
import AnPagination from "components/common/basic/AnPagination";
import AnButton from "components/common/basic/AnButton";

import AnMsgbox from "components/common/popup/AnMsgbox";
export default {
  name: "AnTable",
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
    },
    initialPage: {
      type: Number, //初始页面
    },

    //功能按钮相关参数
    showFuncs: {
      type: Boolean,
      default: true,
    },
    funcRight: {
      type: Object,
      // {
      //   addFlag:1,
      //   delFlag:1,
      // }
    },
    mergeButtons: {
      type: Array, //需要合并的按钮，数据格式如['audit','appoint','repair','accept','start','pause']
    },
  },
  data() {
    return {
      colWidths: this.widths,
      funcButtons: [], //根据权限判断的功能按钮,若超过5个，将会把5个之后的按钮放入更多按钮里
      moreButtons: [], //更多按钮里的内容，为根据权限判断超过5个之后的内容
      showMoreFunc: false, //更多按钮面板显示状态
      currentValue: "", //鼠标当前所在表格对应的内容
      targetTd: null, //用于提示
      targetTable: null, //用于提示

      thCheckboxState: false, //表头复选框选中状态
      trCheckboxStates: Array(this.pDatas.length).fill(false), //各行复选框选中状态
      selectedItem: [], //选中数据对应的数组
    };
  },

  components: {
    AnCheckbox,
    AnPagination,
    AnButton,
  },
  watch: {
    funcRight: function () {
      this.funcButtons.splice(0, this.funcButtons.length);
      this.initFuncButtons();
    },
    //数据变化时需要更新各行的选中状态，否则表头的复选框无法判断是否该自动选中
    pDatas: function () {
      this.trCheckboxStates = Array(this.pDatas.length).fill(false);
      for (let i = this.selectedItem.length - 1; i >= 0; i--) {
        let index = this.pDatas.findIndex(
          (ele) => ele.id == this.selectedItem[i].id
        );
        if ((index = -1)) {
          this.selectedItem.splice(i, 1); //删除selectedItem中存在但在pDatas中不存在的数据
        } else {
          this.trCheckboxStates[index] = true; //初始化各行选中状态
        }
      }
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
    },

    initFuncButtons() {
      if (this.showFuncs && this.funcRight) {
        if (this.funcRight.addFlag && this.funcRight.addFlag == "1") {
          this.funcButtons.push({
            code: "add",
            name: "新增",
            icon: "el-icon-plus",
          });
        }
        if (this.funcRight.editFlag && this.funcRight.editFlag == "1") {
          this.funcButtons.push({
            code: "edit",
            name: "修改",
            icon: "el-icon-edit",
          });
        }

        if (this.funcRight.auditFlag && this.funcRight.auditFlag == "1") {
          this.funcButtons.push({
            code: "audit",
            name: "审批",
            icon: "el-icon-s-check",
          });
        }
        if (this.funcRight.reAuditFlag && this.funcRight.reAuditFlag == "1") {
          this.funcButtons.push({
            code: "reAudit",
            name: "撤回审批",
            icon: "el-icon-back",
          });
        }
        if (this.funcRight.appointFlag && this.funcRight.appointFlag == "1") {
          this.funcButtons.push({
            code: "appoint",
            name: "指定",
            icon: "el-icon-bottom",
          });
        }
        if (this.funcRight.repairFlag && this.funcRight.repairFlag == "1") {
          this.funcButtons.push({
            code: "repair",
            name: "整改",
            icon: "el-icon-check",
          });
        }
        if (this.funcRight.acceptFlag && this.funcRight.acceptFlag == "1") {
          this.funcButtons.push({
            code: "accept",
            name: "验收",
            icon: "el-icon-finished",
          });
        }
        if (this.funcRight.startFlag && this.funcRight.startFlag == "1") {
          this.funcButtons.push({
            code: "start",
            name: "启动",
            icon: "el-icon-video-play",
          });
        }
        if (this.funcRight.pauseFlag && this.funcRight.pauseFlag == "1") {
          this.funcButtons.push({
            code: "pause",
            name: "暂停",
            icon: "el-icon-video-pause",
          });
        }
        if (this.funcRight.stopFlag && this.funcRight.stopFlag == "1") {
          this.funcButtons.push({
            code: "stop",
            name: "结束",
            icon: "el-icon-circle-close",
          });
        }

        if (this.funcRight.reuseFlag && this.funcRight.reuseFlag == "1") {
          this.funcButtons.push({
            code: "reuse",
            name: "复用",
            icon: "el-icon-document-copy",
          });
        }
        if (this.funcRight.delFlag && this.funcRight.delFlag == "1") {
          this.funcButtons.push({
            code: "del",
            name: "删除",
            icon: "el-icon-delete",
          });
        }
        if (
          this.funcRight.resetPassFlag &&
          this.funcRight.resetPassFlag == "1"
        ) {
          this.funcButtons.push({
            code: "resetPass",
            name: "重置密码",
            icon: "el-icon-refresh-left",
          });
        }
      }

      //处理需要合并的按钮和第一个按钮颜色
      if (this.mergeButtons && this.funcButtons.length > 0) {
        let mergeBtn = {
          code: "dispose",
          name: "处置",
          icon: "el-icon-s-claim",
        };
        let minIndex = this.funcButtons.length;
        let insert = false;
        for (let i = 0; i < this.mergeButtons.length; i++) {
          let index = this.funcButtons.findIndex(
            (ele) => ele.code == this.mergeButtons[i]
          );
          if (index != -1) {
            insert = true;
            this.funcButtons.splice(index, 1);
            minIndex = minIndex < index ? minIndex : index;
          }
        }
        this.funcButtons.splice(minIndex, 0, mergeBtn);
      }
      if (this.funcButtons.length > 0) {
        //处理第一个按钮颜色
        this.funcButtons[0].color = "green";
        this.funcButtons[0].letterColor = "white";
      }

      //如果功能按钮超过5个，将5个以后的功能放在更多按钮里
      if (this.funcButtons.length > 5) {
        this.moreButtons = this.funcButtons.slice(5);
        this.funcButtons = this.funcButtons.slice(0, 5);
      }
    },

    initStyle() {
      //初始化表头颜色
      if (this.labelBgColor) {
        this.$refs.thead.style.backgroundColor = this.labelBgColor;
      }
      //初始化更多按钮位置
      if (this.moreButtons.length > 0) {
        this.$refs.moreFuncs.style.left =
          this.$refs.moreBtn.$el.offsetLeft + "px";
        this.$refs.moreFuncs.style.top =
          this.$refs.moreBtn.$el.offsetTop +
          this.$refs.moreBtn.$el.offsetHeight +
          "px";
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
    //表格点击事件
    click(item, index) {
      this.$emit("tdClick", item, index);
    },
    //页码切换
    pageChange(page) {
      this.$emit("pageChange", page);
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
      this.selectedItem = [];
      if (value) {
        //如果是选中
        //将选中的内容放入selectedItem
        for (let i = 0; i < this.trCheckboxStates.length; i++) {
          if (this.trCheckboxStates[i]) {
            this.selectedItem.push(this.pDatas[i]);
          }
        }
      }
    },

    //点击各条前复选框
    trCheckboxClick(itemIndex) {
      let value = !this.$refs.trCheckbox[itemIndex].checked;
      this.$refs.trCheckbox[itemIndex].checked = value;
      this.trCheckboxStates[itemIndex] = value;
      if (!this.trCheckboxStates.includes(false)) {
        this.$refs.thCheckbox.checked = true;
      } else {
        this.$refs.thCheckbox.checked = false;
      }
      //更新选中内容
      if (value) {
        this.selectedItem.push(this.pDatas[itemIndex]);
      } else {
        for (let i = 0; i < this.selectedItem.length; i++) {
          if (this.selectedItem[i].id == this.pDatas[itemIndex].id) {
            this.selectedItem.splice(i, 1);
            break;
          }
        }
      }
    },

    //点击更多按钮，显示更多功能
    moreBtnClick() {
      this.showMoreFunc = !this.showMoreFunc;
    },

    //点击各个功能按钮，根据点击的功能判断是否需要选中内容或是否选中了多个等情况
    funcClick(btn) {
      //如果是新增或导入等不需要选中数据再操作的相关功能，直接向父组件发送对应点击事件
      //目前功能不全，如导入等还没有
      if (btn.code == "add") {
        this.$emit("funcClick", btn.code, this.selectedItem);
      } else {
        //需要判断是否有选中相关需要操作的数据或者是否选中了多条
        //如果未选中，直接提示需要选中相关数据
        if (this.selectedItem.length == 0) {
          AnMsgbox.msgbox({ type: "info", message: "请选择需要操作的数据" });
        }
        //如果大于1,需要判断是否是批量审批\导出\删除等功能，如果不是，也需要进行提示仅能选择一条数据进行操作
        else if (this.selectedItem.length > 1) {
          //目前功能列表不全，后续需要完善
          if (btn.code == "export" || btn.code == "del") {
            this.$emit("funcClick", btn.code, this.selectedItem);
          } else {
            AnMsgbox.msgbox({ type: "info", message: "一次仅能操作一条数据" });
          }
        } else {
          this.$emit("funcClick", btn.code, this.selectedItem);
        }
      }

      //隐藏更多面板里面的按钮，因为可能是点击的更多模块里面的功能
      this.showMoreFunc = false;
    },
  },
};
</script>

<style scoped>
:focus {
  outline: none;
}
.an-table {
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
