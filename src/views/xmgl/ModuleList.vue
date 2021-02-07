<template>
  <div class="xmgl-module-list">
    <an-tree-table
      :pDatas="modules"
      :labelNames="labelNames"
      :keys="keys"
      :widths="widths"
      showCheckbox
      autoExpand
      ref="treeTable"
    >
      <div v-if="canEdit" class="funcs">
        <an-button
          name="添加"
          icon="el-icon-plus"
          color="green"
          letterColor="white"
          @click.native="addClick"
        ></an-button>
        <an-button
          name="修改"
          icon="el-icon-edit"
          @click.native="editClick"
        ></an-button>
        <an-button
          name="删除"
          icon="el-icon-delete"
          @click.native="delClick"
        ></an-button>
      </div>
    </an-tree-table>

    <div class="detail" v-show="showDetail">
      <div class="info">
        <div class="title">模块信息</div>
        <an-label-input name="模块名称" ref="name"></an-label-input>
        <an-label-input
          v-show="chooseModuleId != 0 && operationType == 'add'"
          name="上级模块名称"
          disabled
          ref="parentName"
        ></an-label-input>
        <an-label-popup-select
          name="开发人员"
          :initialValue="developerInitialValue"
          :pData="developerUsers"
          ref="developer"
        ></an-label-popup-select>
        <an-label-popup-select
          name="其他人员"
          :initialValue="othersInitialValue"
          :pData="othersUsers"
          ref="others"
        ></an-label-popup-select>
        <span class="explain"
          >*普通人员中的数据若已在开发人员中存在，对应人员不会被保存</span
        >
        <div class="func">
          <an-button name="取消" @click.native="cancel"></an-button>
          <an-button name="确定" @click.native="assert"></an-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnTreeTable from "components/common/show/AnTreeTable";
import AnLabelPopupSelect from "components/common/form/AnLabelPopupSelect";
import AnLabelInput from "components/common/form/AnLabelInput";
import AnButton from "components/common/basic/AnButton";

import AnMsgbox from "components/common/popup/AnMsgbox";
import { post, put } from "network/request";
import { arrayToTree } from "common/array/arrayprocess";
export default {
  name: "XmglModuleList",
  data() {
    return {
      url: "/api/module", //模块相关数据请求路径

      projectId: null, //查看的项目id
      canEdit: false, //是否可以编辑
      showDetail: false, //是否展示详细信息面板
      modules: [],
      labelNames: ["模块名称", "开发人员", "其他用户"],
      keys: ["name", "developer_names", "others_names"],
      widths: ["20%", "40%", "38%"],

      chooseModuleId: 0, //当前操作的模块id，添加时为0
      operationType: "add", //操作类型，add,edit,del
      delete_ids: "", //所有需要删除的节点，因为是树，所以需要递归遍历所有子节点

      developerUsers: [], //开发人员备选数据
      othersUsers: [], //其他人员备选数据，三个数据实际一样的，因目前select组件没有对数据进行值复制，直接引用的，所以此处三个进行了复制，否则有问题，后续修复select组件后，不用这样处理
      developerInitialValue: "",
      othersInitialValue: "",
    };
  },
  components: {
    AnTreeTable,
    AnButton,
    AnLabelPopupSelect,
    AnLabelInput,
  },
  created() {
    this.projectId = this.$route.query.projectId;
    if (this.$route.query.canEdit) {
      this.canEdit = this.$route.query.canEdit;
    }
    this.getModuleList();
    this.getUserList();
  },
  methods: {
    getModuleList() {
      let params = {
        action: "list_module",
        user_id: localStorage.getItem("user_id"),
        project_id: this.projectId,
      };
      put(this.url, params)
        .then((res) => {
          console.log(res);
          if (res.ret == 0) {
            this.modules = res.retlist;
            this.initModules();
          } else {
            AnMsgbox.msgbox({ message: res.msg });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //根据返回的列表处理项目信息
    initModules() {
      for (let i = 0; i < this.modules.length; i++) {
        let module = this.modules[i];
        if (module.developer && module.developer.length > 0) {
          let names = this.getUserNames(module.developer);
          this.$set(module, "developer_names", names);
        }
        if (module.others && module.others.length > 0) {
          let names = this.getUserNames(module.others);
          this.$set(module, "others_names", names);
        }
      }
      this.modules = arrayToTree(this.modules);
    },
    //获取查询出的用的所有姓名，各姓名之间用,分割
    getUserNames(list) {
      let names = "";
      for (let i = 0; i < list.length; i++) {
        names += list[i].user_name + ",";
      }
      return names.substring(0, names.length - 1);
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
    //点击添加按钮
    addClick() {
      let selected = this.$refs.treeTable.selected;
      if (selected.length > 1) {
        AnMsgbox.msgbox({ message: "若要添加子节点，请选择一个父节点" });
        return;
      }
      this.operationType = "add";
      this.$refs.name.setValue("");
      this.chooseModuleId = 0;
      this.developerInitialValue = "";
      this.othersInitialValue = "";
      if (selected.length == 1) {
        this.chooseModuleId = selected[0].id;
        this.$refs.parentName.setValue(selected[0].name);
        this.developerInitialValue = selected[0].developer_names;
        this.othersInitialValue = selected[0].others_names;
      }
      this.showDetail = true;
    },
    //点击修改按钮
    editClick() {
      let selected = this.$refs.treeTable.selected;
      if (selected.length > 1) {
        AnMsgbox.msgbox({ message: "一次仅能修改一条数据" });
        return;
      }
      if (selected.length == 0) {
        AnMsgbox.msgbox({ message: "请选择需要修改的数据" });
        return;
      }
      this.operationType = "edit";
      this.chooseModuleId = selected[0].id;
      this.$refs.name.setValue(selected[0].name);
      this.developerInitialValue = selected[0].developer_names;
      this.othersInitialValue = selected[0].others_names;
      this.showDetail = true;
    },
    //点击删除按钮
    delClick() {
      this.delete_ids = ""; //先清除之前内容
      let selected = this.$refs.treeTable.selected;
      if (selected.length == 0) {
        AnMsgbox.msgbox({ message: "请选择需要删除的数据" });
        return;
      }
      let childSelectState = this.isChildSelect(selected); //判断选中的节点子节点是否都已经选中，若没有选中提醒将删除所有子节点，是否确认删除
      if (!childSelectState) {
        AnMsgbox.msgbox({
          message:
            "当前选中节点有子节点，不能直接删除，请先删除子节点或一并选中再删除",
        });
        return;
      }
      if (this.delete_ids != "") {
        this.delete_ids = this.delete_ids.substring(1);
        console.log(this.delete_ids);
        let params = {
          action: "delete_module",
          user_id: localStorage.getItem("user_id"),
          delete_module_ids: this.delete_ids,
        };
        post(this.url, params)
          .then((res) => {
            AnMsgbox.msgbox({ message: res.msg });
            if (res.ret == 0) {
              this.getModuleList();
            }
          })
          .catch((err) => {
            AnMsgbox.msgbox({ message: "操作失败，请稍后再试" });
          });
      }
    },

    //判断节点的子节点是否选中,有任何一个下级节点未选中，均返回false
    //同时通过该函数返回所有需要删除的节点id
    isChildSelect(list) {
      let state = true;
      for (let i = 0; i < list.length; i++) {
        this.delete_ids += "," + list[i].id;
        if (list[i].selected == false) {
          return false;
          break;
        }
        if (list[i].childrenList) {
          state = this.isChildSelect(list[i].childrenList);
        }
      }
      return state;
    },

    //点击取消
    cancel() {
      this.showDetail = false;
    },
    //点击保存
    assert() {
      let name = this.$refs.name.value;
      if (!name || name.trim() == "") {
        AnMsgbox.msgbox({ message: "模块名称不能为空" });
        return;
      }
      let data = {};
      data.name = name.trim();
      //判断开发人员和普通人员中是否有重复的数据,若含有重复的,若有删除重复数据
      if (
        this.$refs.developer.selected.length > 0 &&
        this.$refs.others.selected.length > 0
      ) {
        let devs = this.$refs.developer.selected;
        let others = this.$refs.others.selected;
        for (let i = others.length - 1; i >= 0; i--) {
          for (let j = 0; j < devs.length; j++) {
            if (others[i].id == devs.id) {
              others.splice(i, 1);
            }
          }
        }
      }
      let developer_names = "";
      if (this.$refs.developer.selected.length > 0) {
        let ids = "";
        let users = this.$refs.developer.selected;
        for (let i = 0; i < users.length; i++) {
          ids += users[i].id + ",";
          developer_names += users[i].name + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        developer_names = developer_names.substring(
          0,
          developer_names.length - 1
        );
        data.developer = ids;
      }
      let others_names = "";
      if (this.$refs.others.selected.length > 0) {
        let ids = "";
        let users = this.$refs.others.selected;
        for (let i = 0; i < users.length; i++) {
          ids += users[i].id + ",";
          others_names += users[i].name + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        others_names = others_names.substring(0, others_names.length - 1);
        data.others = ids;
      }

      let params = {
        user_id: localStorage.getItem("user_id"),
        data: data,
      };
      //添加
      if (this.operationType == "add") {
        params.action = "add_module";
        data.project_id = this.projectId;
        if (this.chooseModuleId != 0) {
          data.parent_id = this.chooseModuleId;
        }
        post(this.url, params)
          .then((res) => {
            if (res.ret == 0) {
              //直接前端更新页面数据，不通过后台请求，因为树的位置不好确定，且这个模块同时编辑可能性较小
              let item = {
                id: res.module_id,
                name: data.name,
                selected: false,
              };
              if (data.developer) {
                item.developer_names = developer_names;
              }
              if (data.others) {
                item.others_names = others_names;
              }
              //如果没有父节点，直接插入modules列表
              if (this.chooseModuleId == 0) {
                this.modules.push(item);
              } else {
                let selected = this.$refs.treeTable.selected[0];
                if (!selected.childrenList) {
                  this.$set(selected, "children", 0);
                  this.$set(selected, "childrenList", []);
                }
                console.log(selected);
                selected.childrenList.push(item);
                this.$set(selected, "children", selected.children + 1);
              }
              this.showDetail = false;
            } else {
              AnMsgbox.msgbox({ message: res.msg });
            }
          })
          .catch((err) => {
            // AnMsgbox.msgbox({ message: "添加失败，请稍后再试" });
            console.log(err);
          });
      } else if (this.operationType == "edit") {
        params.action = "update_module";
        params.module_id = this.chooseModuleId;
        post(this.url, params)
          .then((res) => {
            console.log(res);
            if (res.ret == 0) {
              //直接前端更新页面数据，不通过后台请求，因为树的位置不好确定，且这个模块同时编辑可能性较小
              let selected = this.$refs.treeTable.selected[0];
              if (data.name) {
                selected.name = data.name;
              }
              if (data.developer) {
                selected.developer_names = developer_names;
              }
              if (data.others) {
                selected.others_names = others_names;
              }
              this.showDetail = false;
            } else {
              AnMsgbox.msgbox({ message: res.msg });
            }
          })
          .catch((err) => {
            AnMsgbox.msgbox({ message: "修改失败，请稍后再试" });
          });
      }
    },
  },
};
</script>

<style scoped>
.funcs {
  display: flex;
}
.funcs > div {
  margin-right: 10px;
}

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
.info .explain {
  align-self: start;
  padding-left: 120px;
  color: #666;
}
.info .func {
  display: flex;
  justify-content: center;
}
</style>
