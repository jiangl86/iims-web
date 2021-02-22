<template>
  <div class="rzgl-list">
    <an-search @search="search">
      <template #search-title>
        <an-label-input type="text" name="操作人" ref="user"></an-label-input>
      </template>
      <template #search-info>
        <an-label-input
          name="日志类型"
          ref="type"
          class="an-short"
        ></an-label-input>
        <an-label-input
          name="日志内容"
          ref="description"
          class="an-short"
        ></an-label-input>
        <an-label-date-picker
          name="操作时间"
          ref="createTime"
          type="daterange"
          class="anLong"
        ></an-label-date-picker>
      </template>
    </an-search>
    <an-table
      v-if="logs"
      :pDatas="logs"
      :labelNames="labelNames"
      :keys="keys"
      :widths="widths"
      :total="total"
      :showCheckbox="false"
      :showFuncs="false"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    ></an-table>
  </div>
</template>

<script>
import AnLabelInput from "components/common/form/AnLabelInput";
import AnLabelDatePicker from "components/common/form/AnLabelDatePicker";
import AnSearch from "components/content/search/AnSearch";
import AnTable from "components/common/show/AnTable";
import AnButton from "components/common/basic/AnButton";
import AnMsgbox from "components/common/popup/AnMsgbox";
import { put } from "network/request";
export default {
  name: "RzglList",
  data() {
    return {
      logs: null,
      total: 0, //总数据条数
      currentPage: 1, //当前页面
      pageSize: 15, //每页条数
      labelNames: [
        "操作人",
        "操作类型",
        "内容",
        "操作结果",
        "ip地址",
        "操作时间",
      ],
      keys: ["name", "action", "detail", "action_state", "ip", "create_time"],
      widths: ["10%", "15%", "42%", "5%", "10%", "15%"],
    };
  },
  components: {
    AnLabelInput,
    AnLabelDatePicker,
    AnSearch,
    AnTable,
    AnButton,
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
      let params = {
        action: "list_log",
        user_id: localStorage.getItem("user_id"),
        page_num: this.currentPage,
        page_size: this.pageSize,
      };
      //初始化查询时间段
      let createTime = this.$refs.createTime.value;
      if (createTime && createTime.length > 0) {
        params.begin_date = createTime[0];
        params.end_date = createTime[1];
      }
      //初始化操作人
      let user_name = this.$refs.user.value;
      if (user_name && user_name.trim() != "") {
        params.user_name = user_name.trim();
      }
      //初始化操作类型
      let type = this.$refs.type.value;
      if (type && type.trim() != "") {
        params.type = type.trim();
      }
      //初始化详细内容
      let description = this.$refs.description.value;
      if (description && description.trim() != "") {
        params.description = description.trim();
      }
      //发起请求进行查询
      put("/api/log", params)
        .then((data) => {
          if (data.ret == 0 && data.retlist) {
            this.logs = data.retlist;
            this.total = data.total_count;
          } else {
            AnMsgbox.msgbox({ message: data.msg });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //切换页面
    pageChange(page) {
      this.currentPage = page;
      this.search();
    },
    //调整每页显示条数
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search();
    },
  },
};
</script>

<style scoped>
</style>
