<template>
  <li class="an-tree-table-node">
    <div v-if="showCheckbox" style="width: 2%" @click.prevent="thCheckboxClick">
      <an-checkbox ref="thCheckbox"></an-checkbox>
    </div>
    <div @dblclick="dblclick">
      <div :style="{ width: colWidths[0] }">
        <!-- 点击展开子节点 -->
        <div @click="expand" class="expand">
          <span
            v-for="levelIndex in level"
            :key="pData.id + '' + levelIndex"
            class="text-indent"
          ></span>
          <!-- icon 图标 -->

          <!-- 是否展开子节点：如果有子节点展示下图标：没有展示右侧图标 -->
          <an-icon
            v-if="pData.children"
            :icon="isOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
          ></an-icon>
          <!-- 如果没有子节点，前面设置了宽度 -->
          <span v-else class="wids"></span>
        </div>

        {{ pData[firstKey] }}
      </div>
      <!-- 每一行的数据 -->
      <div
        v-for="(keyName, index) in dataKeys"
        :key="pData.id + keyName"
        :style="{ width: colWidths[index] }"
      >
        {{ pData[keyName] }}
      </div>
    </div>

    <!--如果有子节点  显示展开-->
    <ul v-if="pData.childrenList" v-show="isOpen">
      <!-- 调用自己组件 ，遍历数据的子节点-->
      <an-tree-table-node
        v-for="item in pData.childrenList"
        :key="item.id"
        :pData="item"
        :keys="keys"
        :level="level + 1"
      ></an-tree-table-node>
      <!-- 调用自己组件 -->
    </ul>
  </li>
</template>

<script>
import AnTreeTableNode from "./AnTreeTableNode"; //自己调用自己就是递归
import AnIcon from "components/common/basic/AnIcon";
export default {
  name: "AnTreeTableNode",
  data() {
    return {
      colWidths: this.widths, //返回当前的宽度
      firstKey: this.keys[0], //返回当前key值
      isOpen: this.autoExpand, //若当前节点有子节点，标识当前节点是否处于展开状态
    };
  },
  props: {
    pData: {
      //展示每列的数据，每个一个元素是个对象，每个一个元素可能会有children对象，children对象可能会有childrenList
      type: Object,
    },
    keys: {
      //需要展示的数据key集合，对应pData里每一个元素的key值 pData.id + keyName
      type: Array,
    },
    widths: {
      //每列的宽度
      type: Array,
    },
    autoExpand: {
      //树是否默认展开
      type: Boolean,
      default: false,
    },
    showCheckbox: {
      type: Boolean, //暂未使用，后期根据需求实现
      default: false,
    },
    level: {
      //层级
      type: Number,
    },
  },

  components: {
    AnTreeTableNode,
    AnIcon,
  },
  computed: {
    dataKeys: function () {
      return this.keys.slice(1);
    },
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      //初始化每列宽度
      if (!this.widths) {
        let total = 100;
        if (this.showCheckbox) {
          total -= 2;
        }
        let perCol = total / this.keys.length;
        this.colWidths = [];
        for (let i = 0; i < this.keys.length; i++) {
          this.colWidths.push(perCol + "%");
        }
      }
    },
    expand() {
      //判断是否显示子节点
      if (this.pData.children) {
        if (!this.pData.childrenList) {
          this.$bus.$emit("loadMore", this.pData);
        }
        this.isOpen = !this.isOpen;
      }
    },
    dblclick() {
      this.$bus.$emit("dblclick", this.pData);
    },

    //点击每行前的复选框
    thCheckboxClick() {},
  },
};
</script>

<style scoped>
li > div {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ccc;
  height: 32px;
  line-height: 32px;
}

li > div:hover {
  background: #f4f4f4;
}
li > div > div:nth-child(1) {
  display: flex;
  text-align: left;
  border-left: 1px solid #ccc;
}
li > div > div {
  border-right: 1px solid #ccc;
}
.expand {
  display: flex;
}
.text-indent {
  width: 12px;
}
.wids {
  width: 14px;
}
</style>
