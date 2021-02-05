<template>
  <div class="an-nav-tree">
    <div class="main">
      <div class="search" v-if="showSearch">
        <an-input
          placeholder="输入名称进行搜索"
          @input="inputChange"
        ></an-input>
      </div>
      <div v-if="name" class="title">
        {{ name }}
        <span class="change-func" @click="changeFuncClick">切换</span>
      </div>
      <ul class="tree-area" ref="treeArea">
        <an-nav-tree-node
          v-for="item in pData"
          :pData="item"
          :key="item.id"
          :autoExpand="autoExpand"
          :eventKey="eventKey"
        ></an-nav-tree-node>
      </ul>
    </div>
  </div>
</template>

<script>
import AnNavTreeNode from "./child/AnNavTreeNode";
import AnInput from "components/common/basic/AnInput";

import AnMsgbox from "components/common/popup/AnMsgbox";

import { debounce } from "common/other/debounce";
export default {
  name: "AnNavTree",
  props: {
    height: {
      type: Number, //组件总的高度
    },
    name: {
      type: String, //名称
    },
    showSearch: {
      type: Boolean,
      default: true, //是否展示搜索框，默认为否
    },
    autoExpand: {
      type: Boolean,
      default: true, //是否自动展开选中的节点，默认是
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
  },
  data() {
    return {
      debounceSearch: null,
      eventKey: Math.random() + "" + Math.random(), //每一个树改数据唯一，非常重要的参数
    };
  },
  components: {
    AnNavTreeNode,
    AnInput,
  },
  created() {
    this.initData(this.pData);
  },
  mounted() {
    this.debounceSearch = debounce(this.search);
    this.$bus.$on("nodeClick", (node, eventKey) => {
      this.nodeClick(node, eventKey);
    });
  },
  watch: {
    height() {
      this.initStyle();
    },
  },
  methods: {
    //对树列表进行数据初始化，判断各节点及其子节点的选中状态
    initData(itemList) {
      for (let i = 0; i < itemList.length; i++) {
        let item = itemList[i];
        this.$set(item, "show", true); //设置是否展示，主要用于后面进行搜索展示
        if (item.children) {
          this.initData(item.children);
        }
      }
    },
    initStyle() {
      if (this.height) {
        console.log(this.height);
        let treeHeight = this.height;
        if (this.showSearch) {
          treeHeight -= 37;
        }
        if (this.name) {
          treeHeight -= 35;
        }
        this.$refs.treeArea.style.height = treeHeight + "px";
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
        this.debounceSearch(value);
      } else {
        this.debounceSearch();
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
    //点击切换按钮
    changeFuncClick() {
      this.$emit("changeFuncClick");
    },
  },
};
</script>

<style scoped>
.main {
  background-color: white;
  width: 200px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.search >>> input[type="text"] {
  height: 35px;
  line-height: 35px;
  border-radius: 0;
}
.title {
  width: 100%;
  line-height: 35px;
  text-align: left;
  position: relative;
  text-indent: 10px;
  font-size: 700;
}
.change-func {
  position: absolute;
  right: 18px;
  color: var(--mainColor);
}
.change-func:hover {
  cursor: pointer;
}
.tree-area {
  overflow-y: auto;
}
</style>
