<template>
  <div class="an-search">
    <div class="search-title">
      <slot name="search-title"> </slot>
      <template>
        <div class="btn-cxcz">
          <an-button
            name="查询"
            icon="el-icon-search"
            class="btn-default"
          ></an-button>
          <an-button
            name="重置"
            icon="fa fa-reply"
            class="btn-resert"
          ></an-button>
        </div>
      </template>
      <template>
        <div class="gjss">
          <an-button name="高级搜索" class="btn-gjss"></an-button>
          <an-button
            iconAfter
            :name="expandBtnName"
            :icon="expandBtnIcon"
            class="btn-zk"
            @click.native="toggle"
          ></an-button>
        </div>
      </template>
    </div>
    <div class="search-info" v-if="hasMore" v-show="searchcon">
      <slot name="search-info"></slot>
    </div>
  </div>
</template>
<script>
import AnButton from "components/common/basic/AnButton";
export default {
  name: "Ansearch",
  props: {
    name: {
      type: String,
    },
    hasMore: {
      type: Boolean, //是否有更多搜索条件
      default: true,
    },
  },
  data() {
    return {
      searchcon: false,
      expandBtnName: "展开",
      expandBtnIcon: "el-icon-arrow-down",
    };
  },

  components: {
    AnButton,
  },
  methods: {
    toggle: function () {
      this.expandBtnName = this.expandBtnName == "展开" ? "收起" : "展开";
      this.expandBtnIcon =
        this.expandBtnIcon == "el-icon-arrow-down"
          ? "el-icon-arrow-up"
          : "el-icon-arrow-down";
      this.searchcon = !this.searchcon;
    },
  },
};
</script>
<style scoped>
.search-title {
  width: 100%;
  padding: 10px;
  display: flex;
}
.an-search {
  width: 100%;
  background: #f2f2f2;
}

.search-info {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 15px 15px;
}

.search-info {
  display: flex;
}

/*短输入框*/
.anShort {
  width: 31%;
  margin-right: 1%;
}
/*占整行输入框*/
.anLong {
  width: 95%;
  margin-right: 1%;
}

.btn-default >>> button {
  background-color: #0082fe !important;
  padding: 6px 12px;
  color: #fff;
  border-radius: 5px;
  margin-right: 12px;
  cursor: pointer;
}
.an-button >>> button:hover {
  background-color: #0082fe !important;
  padding: 6px 12px;
  color: #fff;
  border-radius: 5px;
}

.btn-resert >>> button {
  background-color: #fff !important;
  border: 1px solid #0082fe;
  padding: 6px 12px;
  color: #0082fe;
  border-radius: 5px;
  cursor: pointer;
}
.btn-resert >>> button:hover {
  background-color: #fff !important;
  border: 1px solid #0082fe;
  padding: 6px 12px;
  color: #0082fe;
  border-radius: 5px;
}

.btn-default >>> .an-icon {
  color: #fff !important;
}
.btn-resert >>> .an-icon {
  color: #0082fe !important;
}

.btn-zk >>> .an-icon {
  color: #fff !important;
}

.btn-gjss >>> button {
  background-color: rgb(242, 242, 242);
  border-radius: 15px 0px 0px 15px;
  background: white !important;
  color: #0079fe;
  border: #0079fe;
  cursor: pointer;
}
.btn-gjss >>> button:hover {
  background-color: rgb(242, 242, 242);
  border-radius: 15px 0px 0px 15px;
  background: white !important;
  color: #0079fe;
  border: #0079fe;
}

.btn-zk >>> button {
  border-radius: 0px 15px 15px 0px;
  background: #0082fe !important;
  color: #fff;
  border: #0079fe;
  cursor: pointer;
}
.btn-zk >>> button:hover {
  border-radius: 0px 15px 15px 0px;
  background: #0082fe !important;
  color: #fff;
  border: #0079fe;
}

.btn-cxcz {
  display: flex;
}
.gjss {
  display: flex;
  position: absolute;
  right: 0;
  margin-right: 38px;
}
.search-info div {
  margin-bottom: 10px;
}

/* 媒体查询分辨率样式 小于1366分辨率  呈现一行占2个input 框 */
@media screen and (max-width: 1365px) {
  .anShort {
    width: 47% !important;
    margin-right: 1%;
  }
}
</style>