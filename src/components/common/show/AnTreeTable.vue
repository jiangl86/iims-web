<template>
  <div class="an-tree-table">
    <!--留放的按钮区域 -->
    <div class="funcs-page">
      <slot></slot>
    </div>
    <!--留放的按钮区域 -->

    <!-- ul  li制作的表格 -->
    <ul>
      <!-- 表格的头部  start-->
      <li class="thead">
        <div>
          <div v-show="showCheckbox" style="width: 2%">
            <span></span>
          </div>
          <div
            v-for="(label, index) in labelNames"
            :key="label"
            :style="{ width: colWidths[index] }"
          >
            {{ label }}
          </div>
        </div>
      </li>
      <!-- 表格的头部  end-->

      <!--引用组建：表格的tbody部分 start  -->
      <an-tree-table-node
        v-for="item in pDatas"
        :key="item.id"
        :pData="item"
        :keys="keys"
        :widths="colWidths"
        :autoExpand="autoExpand"
        :level="1"
        :showCheckbox="showCheckbox"
        :eventKey="eventKey"
      ></an-tree-table-node>
      <!--引用组建： 表格的tbody部分 end  -->
    </ul>
  </div>
</template>

<script>
import AnTreeTableNode from "./child/AnTreeTableNode"; //引入组件
import AnCheckbox from "components/common/basic/AnCheckbox";
export default {
  name: "AnTreeTable",
  props: {
    pDatas: {
      type: Array, //需要展示的数据集合，每一个元素为一个对象,每一个元素可能会有childrenList对象
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
      type: Array, //当屏幕低于1365时，每一列对应的宽度，若为0，则隐藏，子节点暂未实现
    },
    showCheckbox: {
      type: Boolean, //显示复选框
      default: false,
    },
    autoExpand: {
      type: Boolean, //树是否默认展开
      default: false,
    },
    total: {
      type: Number, //数据总条数,暂时不用
    },
  },
  data() {
    return {
      colWidths: this.widths, //传每列的宽度
      selected: [], //选中的元素，有复选框时使用

      eventKey: Math.random() + "" + Math.random(), //每一个树改数据唯一，非常重要的参数
    };
  },
  components: {
    AnTreeTableNode,
    AnCheckbox,
  },
  created() {
    this.initData(); //调用初始化每列的宽度
  },
  mounted() {
    this.initStyle();
    //通过$on监听事件
    this.$bus.$on("loadMore", (item, eventKey) => {
      if (this.eventKey == eventKey) {
        this.$emit("loadMore", item); //通过$emit触发事件
      }
    });
    this.$bus.$on("dblclick", (item, eventKey) => {
      if (this.eventKey == eventKey) {
        this.$emit("dblclick", item);
      }
    });
    this.$bus.$on("trCheckboxClick", (item, eventKey) => {
      this.trCheckboxClick(item, eventKey);
    });
  },
  destroyed() {
    this.$bus.$off();
  },
  methods: {
    initData() {
      //初始化每列宽度
      if (!this.widths) {
        let total = 100;
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
    initStyle() {
      //初始化表头颜色
      if (this.labelBgColor) {
        console.log(this.labelBgColor);
        this.$refs.thead.style.backgroundColor = this.labelBgColor;
      }
    },
    //点击表头复选框,暂未实现
    thCheckboxClick() {},

    //子节点点击事件
    trCheckboxClick(item, eventKey) {
      //如果是当前树的子节点触发的事件才处理
      if (this.eventKey == eventKey) {
        if (item.selected) {
          this.selected.push(item);
        } else {
          let index = this.selected.findIndex((ele) => ele.id == item.id);
          if (index != -1) {
            this.selected.splice(index, 1);
          }
        }
        console.log(this.selected);
      }
    },
  },
};
</script>

<style scoped>
.thead {
  background-color: #5787eb;
  color: #fff;
  font-size: var(--font-size-sm);
  height: 32px;
  line-height: 32px;
  text-align: center;
}

li > div {
  display: flex;
  width: 100%;
}
li > div > div {
  border-right: 1px solid #fff;
}
.funcs-page {
  display: flex;
  justify-content: flex-start;
  margin: 10px 0;
}
</style>
