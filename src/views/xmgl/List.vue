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
      @dblClick="dblClick"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
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
          :initialValue="adminInitialValue"
          :pData="adminUsers"
          ref="admin"
        ></an-label-popup-select>
        <an-label-popup-select
          name="开发人员"
          :initialValue="developerInitialValue"
          :pData="adminUsers"
          ref="developer"
        ></an-label-popup-select>
        <an-label-popup-select
          name="其他人员"
          :initialValue="othersInitialValue"
          :pData="othersUsers"
          ref="others"
        ></an-label-popup-select>
        <an-label-radio-group
          v-show="chooseProjectId != 0"
          name="状态"
          :options="stateOptions"
          ref="state"
        ></an-label-radio-group>
        <div class="func">
          <an-button name="取消" @click.native="cancel"></an-button>
          <an-button name="确定" @click.native="assert"></an-button>
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

import AnMsgbox from "components/common/popup/AnMsgbox";
import { post, put } from "network/request";
export default {
  name: "XmList",
  data() {
    return {
      url: "/api/project",
      showDetail: false,
      chooseProjectId: 0,
      adminInitialValue: "",
      developerInitialValue: "",
      othersInitialValue: "",
      adminUsers: [], //管理员备选数据
      developerUsers: [], //开发人员备选数据
      othersUsers: [], //其他人员备选数据，三个数据实际一样的，因目前select组件没有对数据进行值复制，直接引用的，所以此处三个进行了复制，否则有问题，后续修复select组件后，不用这样处理
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
        "state_name",
        "create_time",
      ],
      widths: ["10%", "20%", "25%", "25%", "5%", "10%"],
      stateOptions: [
        { label: "未完成", value: "0" },
        { label: "已完成", value: "1" },
      ],
      funcRight: null,
    };
  },
  components: {
    AnTable,
    AnLabelInput,
    AnLabelPopupSelect,
    AnLabelRadioGroup,
    AnButton,
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.getUserList();
      this.getProjectList();
    },

    //获取用户数据
    getUserList() {
      //获取可选择的用户
      let userParams = {
        action: "list_user",
        user_id: localStorage.getItem("user_id"),
        delete_state: "0",
      };
      post("/api/user", userParams)
        .then((res) => {
          if (res.ret == 0) {
            for (let i = 0; i < res.retlist.length; i++) {
              let ele = res.retlist[i];
              this.adminUsers.push({ id: ele.id, name: ele.name });
              this.developerUsers.push({
                id: ele.id,
                name: ele.name,
              });
              this.othersUsers.push({ id: ele.id, name: ele.name });
            }
          }
        })
        .catch((err) => {
          AnMsgbox.msgbox({ message: "暂时无法获取数据" });
        });
    },

    //获取项目列表数据
    getProjectList() {
      let projectParams = {
        user_id: localStorage.getItem("user_id"),
        action: "list_project",
        page_size: this.pageSize,
        page_num: this.page,
      };
      post(this.url, projectParams)
        .then((res) => {
          console.log(res);
          if (res.ret == 0) {
            this.funcRight = res.funcRight;
            this.totalNum = res.total_count;
            this.projects = res.retlist;
            this.initProject();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //切换页面
    pageChange(page) {
      this.page = page;
      this.getProjectList();
    },

    //变化每页数量
    sizeChange(size) {
      this.pageSize = size;
      this.getProjectList();
    },
    //根据返回的列表处理项目信息
    initProject() {
      for (let i = 0; i < this.projects.length; i++) {
        let project = this.projects[i];
        if (project.admin && project.admin.length > 0) {
          let names = this.getUserNames(project.admin);
          this.$set(project, "admin_names", names);
        }
        if (project.developer && project.developer.length > 0) {
          let names = this.getUserNames(project.developer);
          this.$set(project, "developer_names", names);
        }
        if (project.others && project.others.length > 0) {
          let names = this.getUserNames(project.others);
          this.$set(project, "others_names", names);
        }
        this.$set(
          project,
          "state_name",
          project.state == "0" ? "未完成" : "已完成"
        );
      }
    },

    //获取查询出的用的所有姓名，各姓名之间用,分割
    getUserNames(list) {
      let names = "";
      for (let i = 0; i < list.length; i++) {
        names += list[i].user_name + ",";
      }
      return names.substring(0, names.length - 1);
    },
    //双击项目，进入模块列表页面
    dblClick(item) {
      let queryInfo = { projectId: item.id };
      if (
        (this.funcRight &&
          this.funcRight.editFlag &&
          this.funcRight.editFlag == "1") ||
        (item.editFlag && item.editFlag == "1")
      ) {
        queryInfo.canEdit = true;
      }
      this.$router.push({ name: "XmglModuleList", query: queryInfo });
    },
    //点击功能按钮
    funcClick(code, selected) {
      if (code == "add") {
        this.chooseProjectId = 0;
        this.$refs.name.setValue("");
        this.$refs.description.setValue("");
        this.adminInitialValue = "";
        this.developerInitialValue = "";
        this.othersInitialValue = "";
        this.$refs.state.setValue("0");
        this.showDetail = true;
      } else if (code == "edit") {
        let project = selected[0];
        this.chooseProjectId = project.id;
        this.$refs.name.setValue(project.name);
        this.$refs.description.setValue(project.description);
        this.adminInitialValue = project.admin_names;
        this.developerInitialValue = project.developer_names;
        this.othersInitialValue = project.others_names;
        this.$refs.state.setValue(project.state);
        this.showDetail = true;
      } else if (code == "del") {
        //获取选中的id进行删除
        let ids = "";
        for (let i = 0; i < selected.length; i++) {
          ids += selected[i].id + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        let data = {
          action: "delete_project",
          user_id: localStorage.getItem("user_id"),
          delete_project_ids: ids,
        };
        post(this.url, data)
          .then((res) => {
            AnMsgbox.msgbox({ message: res.msg });
            this.getProjectList();
          })
          .catch((err) => {
            AnMsgbox.msgbox({ message: "删除失败", type: "warning" });
          });
      }
    },

    //点击取消按钮
    cancel() {
      this.showDetail = false;
    },

    //确认保存
    assert() {
      let name = this.$refs.name.value;
      let description = this.$refs.description.value;
      if (!name || name.trim() == "") {
        AnMsgbox.msgbox({ message: "项目名称不能为空" });
        return;
      }
      let data = {};
      data.name = name.trim();
      if (description && description.trim() != "") {
        data.description = description.trim();
      }
      if (this.$refs.admin.selected.length > 0) {
        let ids = "";
        let users = this.$refs.admin.selected;
        for (let i = 0; i < users.length; i++) {
          ids += users[i].id + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        data.admin = ids;
      }
      if (this.$refs.developer.selected.length > 0) {
        let ids = "";
        let users = this.$refs.developer.selected;
        for (let i = 0; i < users.length; i++) {
          ids += users[i].id + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        data.developer = ids;
      }
      if (this.$refs.others.selected.length > 0) {
        let ids = "";
        let users = this.$refs.others.selected;
        for (let i = 0; i < users.length; i++) {
          ids += users[i].id + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        data.others = ids;
      }
      let params = {
        user_id: localStorage.getItem("user_id"),
        data: data,
      };
      //新增保存
      if (this.chooseProjectId == 0) {
        params.action = "add_project";
      } else {
        //修改保存
        data.state = this.$refs.state.value;
        params.action = "update_project";
        params.project_id = this.chooseProjectId;
      }
      //保存
      post(this.url, params)
        .then((res) => {
          AnMsgbox.msgbox({ message: res.msg });
          this.showDetail = false;
          this.getProjectList();
          if (res.ret == 2) {
            this.$router.replace({ name: "Login" });
          }
        })
        .catch((err) => {
          AnMsgbox.msgbox({ message: "操作失败，请稍后重试" });
        });
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
