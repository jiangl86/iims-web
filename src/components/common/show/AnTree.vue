<template>
  <div class="an-tree">
    <div class="main">
      <div class="title">
        {{ name }} <span @click="selectAll">全选</span
        ><span @click="selectInvert">反选</span>
      </div>
      <div class="search" v-if="showSearch">
        <an-input
          placeholder="输入名称进行搜索"
          @input="inputChange"
        ></an-input>
      </div>
      <ul class="tree-area" ref="treeArea">
        <an-tree-node
          v-for="item in pData"
          :pData="item"
          :key="item.id"
          :autoExpandSelect="autoExpandSelect"
          :eventKey="eventKey"
        ></an-tree-node>
      </ul>
      <div class="funs">
        <an-button
          name="取消"
          :height="35"
          :width="80"
          @click.native="cancel"
          class="btn"
        ></an-button>
        <an-button
          name="确定"
          color="#406dfc"
          letterColor="white"
          :height="35"
          :width="80"
          @click.native="assert"
          class="btn"
        ></an-button>
      </div>
    </div>
  </div>
</template>

<script>
import AnTreeNode from "./child/AnTreeNode";
import AnInput from "components/common/basic/AnInput";
import AnButton from "components/common/basic/AnButton";

import AnMsgbox from "components/common/popup/AnMsgbox";

import { debounce } from "common/other/debounce";
export default {
  name: "AnTree",
  props: {
    multiSelect: {
      type: Boolean,
      default: true, //是否支持多选，默认为否
    },
    selectAssert: {
      type: Boolean,
      default: false, //是否支持点击就确认，仅单选时支持
    },
    chainSelect: {
      type: Boolean,
      default: true, //是否支持父子节点联动选择，默认为否
    },
    onlyLeaf: {
      type: Boolean,
      default: false, //是否仅允许选中叶子节点，默认为否
    },
    showSelected: {
      type: Boolean,
      default: false, //是否在该页面展示搜素结果，默认为否
    },
    showSearch: {
      type: Boolean,
      default: true, //是否展示搜索框，默认为否
    },
    autoExpandSelect: {
      type: Boolean,
      default: true, //是否自动展开选中的节点，默认是
    },
    //点击返回时，是否由上级处理还是直接返回
    backTip: {
      type: Boolean,
      default: true,
    },
    //标题名称
    name: {
      type: String,
      default: "选择部门",
    },
    //树的列表，每个元素必须包含id,和name元素，其中有子节点的必须包含children子列表
    pData: {
      type: Array,
      default: function () {
        return [
          {
            name: "一级节点1",
            id: 1,
            children: [
              {
                name: "二级节点11",
                id: 11,
                children: [
                  {
                    name: "三级节点111",
                    id: 111,
                  },
                  {
                    name: "三级节点112",
                    id: 112,
                  },
                ],
              },
              {
                name: "二级节点12",
                id: 12,
                children: [
                  {
                    name: "三级节点121",
                    id: 121,
                  },
                ],
              },
            ],
          },
          {
            name: "一级节点2",
            id: 2,
            children: [
              {
                name: "二级节点21",
                id: 21,
                children: [
                  {
                    name: "三级节点211",
                    id: 211,
                  },
                  {
                    name: "三级节点212",
                    id: 212,
                  },
                ],
              },
              {
                name: "二级节点22",
                id: 22,
              },
            ],
          },
          {
            name: "一级节点3",
            id: 3,
          },
          {
            name: "一级节点4",
            id: 4,
            children: [
              {
                name: "二级节点41",
                id: 41,
                children: [
                  {
                    name: "三级节点411",
                    id: 411,
                  },
                  {
                    name: "三级节点412",
                    id: 412,
                    children: [
                      {
                        name: "四级节点4121",
                        id: 4121,
                      },
                      {
                        name: "四级节点4122",
                        id: 4122,
                      },
                      {
                        name: "四级节点4123",
                        id: 4123,
                      },
                      {
                        name: "四级节点4124",
                        id: 4124,
                      },
                    ],
                  },
                ],
              },
              {
                name: "二级节点42",
                id: 42,
              },
            ],
          },
          {
            name: "一级节点5",
            id: 5,
            children: [
              {
                name: "二级节点51",
                id: 51,
                children: [
                  {
                    name: "三级节点511",
                    id: 511,
                  },
                  {
                    name: "三级节点512",
                    id: 512,
                    children: [
                      {
                        name: "四级节点5121",
                        id: 5121,
                      },
                      {
                        name: "四级节点5122",
                        id: 5122,
                      },
                      {
                        name: "四级节点5123",
                        id: 5123,
                      },
                      {
                        name: "四级节点5124",
                        id: 5124,
                      },
                      {
                        name: "四级节点5125",
                        id: 5125,
                      },
                    ],
                  },
                  {
                    name: "三级节点513",
                    id: 513,
                    children: [
                      {
                        name: "四级节点5131",
                        id: 5131,
                      },
                      {
                        name: "四级节点5132",
                        id: 5132,
                      },
                    ],
                  },
                ],
              },
              {
                name: "二级节点22",
                id: 22,
              },
            ],
          },
          {
            name: "一级节点6",
            id: 6,
          },
          {
            name: "一级节点7",
            id: 7,
          },
          {
            name: "一级节点8",
            id: 8,
          },
          {
            name: "一级节点9",
            id: 9,
            children: [
              {
                name: "二级节点91",
                id: 91,
                children: [
                  {
                    name: "三级节点911",
                    id: 911,
                  },
                  {
                    name: "三级节点912",
                    id: 912,
                    children: [
                      {
                        name: "四级节点9121",
                        id: 9121,
                      },
                      {
                        name: "四级节点9122",
                        id: 9122,
                      },
                      {
                        name: "四级节点9123",
                        id: 9123,
                      },
                      {
                        name: "四级节点9124",
                        id: 9124,
                      },
                      {
                        name: "四级节点9125",
                        id: 9125,
                      },
                    ],
                  },
                ],
              },
              {
                name: "二级节点22",
                id: 22,
              },
            ],
          },
        ];
      },
    },
    //加载页面时选中的元素
    initialSelect: {
      type: Array,
    },
  },
  data() {
    return {
      selected: [],
      showSelectedTree: false,
      searchNode: null,
      eventKey: Math.random() + "" + Math.random(), //每一个树改数据唯一，非常重要的参数
    };
  },
  components: {
    AnTreeNode,
    AnInput,
    AnButton,
  },
  watch: {
    //初始化加载选项变化后，把选中信息修改为初始化内容
    initialSelect: function () {
      this.selected = [];
      for (let i = 0; i < this.initialSelect.length; i++) {
        this.selected.push(this.initialSelect[i]);
      }
    },
    pData: function () {
      this.selected = [];
      this.initData(this.pData); //EditTable加的内容，会导致性能问题，另可能导致labelpopupselect出问题
    },
  },
  created() {
    this.initData(this.pData);
    this.searchNode = debounce(this.search);
  },
  mounted() {
    console.log(this.eventKey);
    this.$bus.$on("nodeClick", (node, eventKey) => {
      this.nodeClick(node, eventKey);
    });
  },
  destroyed() {
    this.$bus.$off();
  },
  methods: {
    //对树列表进行数据初始化，判断各节点及其子节点的选中状态
    //传进来的数据后续需要进行复制处理，直接复制数据，不能复制地址，否则当一个页面有多个调用多个控件，引用相同的数据源时，会相互影响
    initData(itemList) {
      for (let i = 0; i < itemList.length; i++) {
        let item = itemList[i];
        let state = this.getSelectState(item);

        this.$set(item, "show", true); //设置是否展示，主要用于后面进行搜索展示
        if (state == 0) {
          this.$set(item, "selected", false);
          this.$set(item, "childSelected", false);
        } else if (state == 1) {
          this.$set(item, "selected", true);
          this.$set(item, "childSelected", false);
          this.pushToSelected(item);
        } else if (state == 2) {
          this.$set(item, "selected", false);
          this.$set(item, "childSelected", true);
        } else {
          this.$set(item, "selected", true);
          this.$set(item, "childSelected", true);
        }
        if (item.children) {
          this.initData(item.children);
        }
      }
    },

    //获取节点及子节点选中状态，若未选中返回0，当前节点选中返回1，子节点（所有子节点）有选中的返回2，当前节点和子节点均选中返回3
    getSelectState(item, selectedList = this.initialSelect) {
      if (selectedList && selectedList.length > 0) {
        let childState = 0;
        if (item.children) {
          for (let j = 0; j < item.children.length; j++) {
            let state = this.getSelectState(item.children[j], selectedList);
            if (state != 0) {
              childState = state;
              break;
            }
          }
        }
        let i = 0;
        for (; i < selectedList.length; i++) {
          if (item.id == selectedList[i].id) {
            if (childState != 0) {
              return 3;
            } else {
              return 1;
            }
          }
        }
        if (i == selectedList.length) {
          if (childState != 0) {
            return 2;
          } else {
            return 0;
          }
        }
      }

      return 0;
    },

    //跳转至第一个选中的选项,选中项在若产生的移动则在页面最下方，需要调用该组件对象每次调用该方法才会生效，建议第一次显示时才调用，后面可能由于树的展开收起导致定位有问题
    ScrollToSelect() {
      let pos = 0;
      if (this.selected) {
        pos = this.getFirstSelectPos(this.pData);
        let yPos = (pos - 1) * 41;
        let ele = this.$refs.treeArea;

        //目前直接调用scroll不生效，使用setTimout和setInterval时正常，后续再研究
        setTimeout(
          function (ele, yPos) {
            ele.scroll(0, yPos);
          },
          200,
          ele,
          yPos
        );
      }

      //   this.$refs.treeArea.scroll(0, 300);

      //   setInterval(
      //     function (aa) {
      //       aa.scroll(0, 200);
      //     },
      //     200,
      //     this.$refs.treeArea
      //   );
    },

    //计算第一个选中点在树种的顺序
    getFirstSelectPos(itemList) {
      for (let i = 0; i < itemList.length; i++) {
        let child = itemList[i];
        if (child.children) {
          let pos = this.getFirstSelectPos(child.children);
          if (pos > 0) {
            return pos + i + 1;
          }
        }
        let j = 0;
        for (; j < this.selected.length; j++) {
          if (child.id == this.selected[j].id) {
            break;
          }
        }
        if (j < this.selected.length) {
          return i + 1;
        }
      }
      return 0;
    },

    //将数组中所有节点均设置为选中状态,包含子节点,若为chainSelect会导致重复插入，后续得去重
    setAllToSelect(itemList) {
      for (let i = 0; i < itemList.length; i++) {
        this.pushToSelected(itemList[i]);
        if (itemList[i].children) {
          this.setAllToSelect(itemList[i].children);
        }
      }
    },

    //插入选中的节点，根据是否多选，是否级联选择来确定选中的信息
    pushToSelected(item) {
      //多选
      if (this.multiSelect) {
        //仅能选择叶子节点
        if (this.onlyLeaf) {
          if (!item.children) {
            item.selected = true;
            this.selected.push(item);
          }
        }
        //所有节点都可以选择
        else {
          item.selected = true;
          this.selected.push(item);
          //如果是级联选择
          if (this.chainSelect) {
            if (item.children) {
              for (let i = 0; i < item.children.length; i++) {
                this.pushToSelected(item.children[i]);
              }
            }
          }
        }
      }
      //单选
      else {
        if (this.onlyLeaf && item.children) {
          return;
        }
        //先删除之前所有已选择项
        for (let i = 0; i < this.selected.length; i++) {
          this.deleteFromSelected(this.selected[i], i);
        }
        item.selected = true;
        this.selected.push(item);
      }
    },

    // 从已选列表中移除选项,source用于判断数据来源，若是点击产生的，则级别删除所有下级子节点，
    // 若是由于取消某个子节点导致父节点删除，则仅删除父节点，这个时候source不用click,默认为点击产生
    deleteFromSelected(item, index, source = "click") {
      item.selected = false;
      this.selected.splice(index, 1);
      //若是父子联动选择，针对父子联动进行操作
      if (this.chainSelect) {
        //移除该节点对应父节点的选中状态
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i].children) {
            for (let j = 0; j < this.selected[i].children.length; j++) {
              if (this.selected[i].children[j].id == item.id) {
                this.deleteFromSelected(this.selected[i], i, "other");
                break;
              }
            }
          }
        }
        //若有子节点，移除其对应子节点的选中状态
        if (item.children && source == "click") {
          for (let i = 0; i < item.children.length; i++) {
            for (let j = 0; j < this.selected.length; j++) {
              if (item.children[i].id == this.selected[j].id) {
                this.deleteFromSelected(item.children[i], j);
              }
            }
          }
        }
      }
    },

    //根据搜索关键字,设置节点展示
    setNameShowState(item, name) {
      //如果是展示的已选择树且该节点处于不可展示状态（没被选中或子节点没被选中），则直接返回
      if (this.showSelectedTree && !item.show) {
        return;
      }
      if (item.name.indexOf(name) != -1) {
        item.show = true;
        if (item.children && !this.showSelectedTree) {
          this.recoverShowState(item.children);
        }
        return 1;
      } else {
        let childState = 0;
        if (item.children) {
          for (let i = 0; i < item.children.length; i++) {
            let state = this.setNameShowState(item.children[i], name);
            if (state != 0) {
              childState = state;
            }
          }
        }
        if (childState != 0) {
          item.show = true;
          return 2;
        } else {
          item.show = false;
          return 0;
        }
      }
    },

    //根据已选择元素来展示列表
    setSelectedShowState(item) {
      let childState = 0;
      if (item.children) {
        for (let i = 0; i < item.children.length; i++) {
          let state = this.setSelectedShowState(item.children[i]);
          if (state != 0) {
            childState = state;
          }
        }
      }
      if (item.selected) {
        item.show = true;
        return 1;
      } else {
        if (childState != 0) {
          item.show = true;
          return 2;
        } else {
          item.show = false;
          return 0;
        }
      }
    },

    //恢复完整树展示
    recoverShowState(itemList) {
      for (let i = 0; i < itemList.length; i++) {
        itemList[i].show = true;
        if (itemList[i].children) {
          this.recoverShowState(itemList[i].children);
        }
      }
    },
    //点击节点事件
    nodeClick(item, eventKey) {
      //只接受当前树子节点发送的事件
      if (this.eventKey == eventKey) {
        let exist = false;
        for (let i = 0; i < this.selected.length; i++) {
          if (item.id == this.selected[i].id) {
            exist = true;
            this.deleteFromSelected(item, i);
            break;
          }
        }
        //如果是单选且设置为选择及确认
        if (!this.multiSelect && this.selectAssert) {
          this.pushToSelected(item);
          this.assert();
        } else {
          if (!exist && !this.showSelectedTree) {
            this.pushToSelected(item);
          }
        }
      }
    },

    //搜素框变化时，根据输入内容检索树
    inputChange(value) {
      if (value) {
        this.searchNode(value);
      } else {
        this.searchNode();
      }
    },
    //根据搜素关键字显示树
    search(value = "") {
      if (value && value.trim() != "") {
        //如果是展示的已选择列表，则每次搜素前，初始化已选择树列表，否则搜索会出问题
        if (this.showSelectedTree) {
          for (let i = 0; i < this.pData.length; i++) {
            this.setSelectedShowState(this.pData[i]);
          }
        }
        //按名称进行搜索
        let name = value.trim();
        for (let i = 0; i < this.pData.length; i++) {
          this.setNameShowState(this.pData[i], name);
        }
      }
      //取消搜索结果
      else {
        this.recover();
      }
    },
    //恢复完整树显示
    recover() {
      this.recoverShowState(this.pData);
      this.showSelectedTree = false;
    },

    //显示已选择的数列表
    showSelectedDiv() {
      this.showSelectedTree = !this.showSelectedTree;
      if (this.showSelectedTree) {
        for (let i = 0; i < this.pData.length; i++) {
          this.setSelectedShowState(this.pData[i]);
        }
      }
      //展示完整树
      else {
        this.recover();
      }
    },

    cancelSelect() {
      //删除新选中的项
      for (let i = this.selected.length - 1; i >= 0; i--) {
        let j = 0;
        let ele = this.selected[i];
        if (this.initialSelect) {
          for (; j < this.initialSelect.length; j++) {
            if (ele.id == this.initialSelect[j].id) {
              break;
            }
          }
          if (j == this.initialSelect.length) {
            ele.selected = false;
            this.selected.splice(i, 1);
          }
        } else {
          ele.selected = false;
          this.selected.splice(i, 1);
        }
      }
      this.$emit("cancel");
    },

    //点击全选按钮
    selectAll() {
      //先删除所有已选择项
      this.selected = [];
      //然后把所有节点加入已选择内容,
      this.setAllToSelect(this.pData);

      //若为chainSelect,这样插入可能导致selected中有很多重复数据，需要去重,先对selected进行排序
      if (this.chainSelect) {
        this.selected.sort(function (a, b) {
          if (a.id > b.id) {
            return 1;
          } else if (a.id < b.id) {
            return -1;
          } else {
            return 0;
          }
        });
        //去重
        for (let i = this.selected.length - 1; i > 0; i--) {
          if (this.selected[i].id == this.selected[i - 1].id) {
            this.selected.splice(i, 1);
          }
        }
      }
    },

    //点击反选按钮
    selectInvert() {
      let orginSelected = this.selected;
      //全部选中
      this.selectAll();
      //然后将之前选中的内容设置为未选中
      for (let i = 0; i < orginSelected.length; i++) {
        let index = this.selected.findIndex(
          (ele) => ele.id == orginSelected[i].id
        );
        orginSelected[i].selected = false;
        this.selected.splice(index, 1);
      }
    },

    //取消选择
    cancel() {
      if (this.backTip) {
        AnMsgbox.confirm({
          title: "提示！",
          message: "是否确认取消，取消后选中节点不会保存",
          options: { type: "warning" },
        })
          .then(() => {
            this.cancelSelect();
          })
          .catch(() => {});
      } else {
        this.cancelSelect();
      }
    },

    assert() {
      this.$emit("assert", this.selected);
    },
  },
};
</script>

<style scoped>
.an-tree {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
.main {
  background-color: white;
  width: 25%;
  min-width: 260px;
  height: 65%;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}
.title {
  position: relative;
  height: var(--liHeight);
  line-height: var(--liHeight);
  font-size: var(--font-size-md);
  background-color: var(--mainColor);
  color: white;
  text-align: left;
  padding-left: 10px;
}
.title span {
  position: absolute;
  right: 10px;
  color: #eee;
  font-size: var(--font-size-sm);
}
.title span:nth-child(2) {
  position: absolute;
  right: 60px;
  color: #eee;
  font-size: var(--font-size-sm);
}
.search {
  position: relative;
}
.search >>> input[type="text"] {
  height: 40px;
  line-height: 40px;
  border-radius: 0;
}
.searchBtn {
  position: absolute;
  right: 0;
  top: 0;
}
.tree-area {
  flex: 1;
  overflow-y: auto;
}
.funs {
  height: var(--liHeight);
  line-height: var(--liHeight);
  background-color: #e2e2e2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.funs .btn {
  margin: 0 10px;
}
</style>
