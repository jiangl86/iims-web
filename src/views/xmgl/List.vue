<template>
  <div class="xm-list">
    <an-table
      :pDatas="projects"
      :labelNames="labelNames"
      :keys="keys"
      :widths="widths"
      :total="totalNum"
      :intialPage="page"
      :funcRight="funcRight"
      showFuncs
      showPagination
      @funcClick="funcClick"
    ></an-table>

    <div class="detail" v-show="showDetail">
      <div class="info">
        <div class="title">项目信息</div>
        <an-label-input name="项目名称" ref="name"></an-label-input>
        <an-label-input
          type="textarea"
          name="详细信息"
          ref="description"
        ></an-label-input>
        <an-label-popup-select
          name="管理员"
          :pData="users"
          ref="admin"
        ></an-label-popup-select>
        <an-label-popup-select
          name="开发人员"
          :pData="users"
          ref="developer"
        ></an-label-popup-select>
        <an-label-popup-select
          name="其他人员"
          :pData="users"
          ref="others"
        ></an-label-popup-select>
        <an-label-radio-group
          name="状态"
          :options="stateOptions"
        ></an-label-radio-group>
        <div class="func">
          <an-button name="取消"></an-button>
          <an-button name="确定"></an-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnTable from "components/common/show/AnTable";
import AnLabelInput from "components/common/form/AnLabelInput";
import AnLabelPopupSelect from "components/common/form/AnLabelPopupSelect";
import AnLabelRadioGroup from "components/common/form/AnLabelRadioGroup";
import AnButton from "components/common/basic/AnButton";
import { post, put } from "network/request";
export default {
  name: "XmList",
  data() {
    return {
      showDetail: false,
      users: [],
      projects: [],
      page: 1,
      pageSize: 15,
      totalNum: 0,
      labelNames: [
        "项目名称",
        "管理员",
        "开发人员",
        "其他用户",
        "状态",
        "添加时间",
      ],
      keys: [
        "name",
        "admin_names",
        "developer_names",
        "others_names",
        "state",
        "create_time",
      ],
      widths: ["10%", "20%", "25%", "25%", "5%", "10%"],
      stateOptions: [
        { label: "未完成", value: 0 },
        { label: "已完成", value: 1 },
      ],
      funcRight: {
        addFlag: 1,
        editFlag: 1,
        delFlag: 1,
      },
    };
  },
  components: {
    AnTable,
    AnLabelInput,
    AnLabelPopupSelect,
    AnLabelRadioGroup,
    AnButton,
  },
  created() {},
  methods: {
    funcClick(code, selected) {
      if (code == "add") {
      }
    },
  },
};
</script>

<style scoped>
.detail {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.detail .info {
  width: 70%;
  border: 1px solid #ccc;
  background-color: white;
  display: flex;
  flex-direction: column;
}
.info > div {
  padding: 0 10px;
  margin-bottom: 10px;
}

.info .title {
  height: 40px;
  line-height: 40px;
  color: white;
  font-size: var(--font-size-md);
  background-color: var(--mainColor);
}
.info .func {
  display: flex;
  justify-content: center;
}
</style>
