<template>
  <div class="jkgl-index">
    <div class="left-nav" ref="leftNav">
      <an-nav-tree
        :name="project_name"
        :height="treeHeight"
        :pData="moduleInterfaceTreeData"
        @changeFuncClick="selectProject"
      ></an-nav-tree>
    </div>
    <div class="content">
      <div class="add-div">
        <div class="title">
          <div class="state">
            <an-label-dropdown-select
              name="接口状态"
              :options="stateOptions"
              :initialValue="initialState"
            ></an-label-dropdown-select>
          </div>
          <div class="buttons">
            <an-button name="取消" @click.native="cancelAdd"></an-button>
            <an-button
              name="保存"
              @click.native="save"
              class="save"
            ></an-button>
          </div>
        </div>
        <div class="info">
          <textarea
            v-model="newInterfaceDetail"
            @keyup.enter="dataProcess"
          ></textarea>
        </div>
      </div>
      <div class="detail-div">
        <div class="funcs">
          <an-button name=""></an-button>
        </div>
      </div>
    </div>

    <an-tree
      v-show="showSelectProject"
      name="请选择项目"
      :pData="projects"
      :multiSelect="false"
      selectAssert
      :backTip="false"
      @assert="assertProject"
    ></an-tree>
  </div>
</template>

<script>
import AnNavTree from "components/content/nav/AnNavTree";
import AnTree from "components/common/show/AnTree";
import AnInput from "components/common/basic/AnInput";
import AnButton from "components/common/basic/AnButton";
import AnLabelDropdownSelect from "components/common/form/AnLabelDropdownSelect";

import AnMsgbox from "components/common/popup/AnMsgbox";
import { post, put } from "network/request";
import { arrayToTree, addKeysToData } from "common/array/arrayprocess";
export default {
  name: "JkglIndex",
  data() {
    return {
      user_id: localStorage.getItem("user_id"),
      project_id: localStorage.getItem("project_id"), //当前用户正在查看的项目
      project_name: localStorage.getItem("project_name"), //
      projects: [], //当前用户可以处理的所有项目
      modules: [], //当前用户针对所选择项目所有处理的所有模块
      interfaces: [], //当前用户针对所选择的项目可以处理的所有模块
      moduleRight: {}, //各模块对应权限的map,key值为m+moduleid,如m211
      showSelectProject: false, //是否展示选择项目的弹框
      stateOptions: [
        { id: 0, name: "设计中" },
        { id: 1, name: "未完成" },
        { id: 2, name: "已完成" },
        { id: 3, name: "异常" },
      ],
      initialState: [{ id: 1, name: "未完成" }],

      newInterfaceDetail: "",
      detailLength: 0, //字符长度，用于中文字符输入时判断是否实际输入了字符，因为中文keycode都是229
      textIndent: 0, //回车时，默认的缩进数量

      moduleInterfaceTreeData: [], //最终处理后用于展示的树

      treeHeight: 0,
    };
  },
  components: {
    AnNavTree,
    AnTree,
    AnInput,
    AnButton,
    AnLabelDropdownSelect,
  },
  created() {
    this.initData();
    console.log(this.modules);
  },
  mounted() {
    this.treeHeight = this.$refs.leftNav.offsetHeight;
  },
  //   @keyup.219="addTextIndent"
  // @keyup.221="minusTextIndent"
  // @keyup.229="processTextIndent"
  methods: {
    aaa(event) {
      console.log(event.keyCode);
    },
    //初始化数据
    initData() {
      //首先判断之前有没有缓存过查看的项目，先选择要查看的项目
      if (!this.project_id || this.project_id == 0) {
        this.selectProject();
      }
      //否则直接查看以前已经查看过的项目
      else {
        this.getModulesInterfaces();
      }
    },
    //初始化各模块对应权限的map
    initModuleRight() {
      for (let i = 0; i < this.modules.length; i++) {
        let key = "m" + this.modules[i].id;
        this.moduleRight[key] = this.modules[i].funcRight;
      }
    },
    //根据modules和interfaces初始化要展示的树结构
    initTreeData() {
      //先给interface加上Parent_id属性
      addKeysToData(this.interfaces, ["parent_id"], ["module_id"]);
      console.log(this.interfaces);
      //首先将modules和Interfaces组合成一个数组
      let moduleAndInterfaces = [];
      moduleAndInterfaces.push(...this.modules);
      moduleAndInterfaces.push(...this.interfaces);
      //转换成树结构
      this.moduleInterfaceTreeData = arrayToTree(moduleAndInterfaces);
    },
    //获取所有可以查看的项目
    getProjects() {
      let params = {
        action: "list_project",
        user_id: this.user_id,
        state: "0",
      };
      put("/api/project", params)
        .then((res) => {
          console.log(res);
          if (res.ret == 0 && res.retlist) {
            this.projects = res.retlist;
          } else {
            AnMsgbox.msgbox({ message: res.msg });
          }
        })
        .catch((err) => {
          console.log(err);
          AnMsgbox.msgbox({ message: "服务器错误，请稍后再试" });
        });
    },
    //获取要查看项目下的所有模块和接口
    getModulesInterfaces() {
      let params = {
        action: "list_interface",
        user_id: this.user_id,
        project_id: this.project_id,
      };
      put("/api/interface", params)
        .then((res) => {
          console.log(res);
          if (res.ret == 0) {
            if (res.ret_module_list) {
              this.modules = res.ret_module_list;
            }
            if (res.ret_interface_list) {
              this.interfaces = res.ret_interface_list;
            }
            this.initModuleRight();
            this.initTreeData();
          } else {
            AnMsgbox.msgbox({ message: res.msg });
          }
        })
        .catch((err) => {
          console.log(err);
          AnMsgbox.msgbox({ message: "服务器错误，请稍后再试" });
        });
    },

    //点击切换项目
    selectProject() {
      if (!this.projects || this.projects.length == 0) {
        this.getProjects();
      }
      this.showSelectProject = true;
    },
    //确认选择项目
    assertProject(selected) {
      this.project_id = selected[0].id;
      this.project_name = selected[0].name;
      localStorage.setItem("project_id", this.project_id);
      localStorage.setItem("project_name", this.project_name);
      this.getModulesInterfaces();
      this.showSelectProject = false;
    },
    dataProcess(event) {
      //   console.log(event);
      //   console.log(event.keyCode);
      //   console.log(event.key);
      //   let code = event.keyCode;
      //   let character = event.key;
      //   //如果是{或者[符号
      //   if (code == 219) {
      //     this.addTextIndent();
      //   }
      //   //如果是}或者]符号
      //   else if (code == 221) {
      //     this.minusTextIndent();
      //   }
      //   //如果是#符号
      //   else if (code == 51 && character == "#") {
      //   }
      //   if (this.textIndent > 0) {
      //     for (let i = 0; i < this.textIndent; i++) {
      //       this.newInterfaceDetail += " ";
      //     }
      //   }
      let textIndentNum = 0; //需要缩进的符号数量，为{和[符号数量,}和]符号数量之差
      let rightBraceNum = 0; //
      let newValue = this.newInterfaceDetail[0];
      for (let i = 1; i < this.newInterfaceDetail.length; i++) {
        let code = this.newInterfaceDetail[i];
        //如果是code符，进行换行并缩进
        if (code == "{" || code == "[") {
          newValue += "\n";
          for (let j = 0; j < textIndentNum; j++) {
            newValue += "  "; //每次缩进两字符
          }
          newValue += code;
          newValue += "\n";
          for (let j = 0; j < textIndentNum; j++) {
            newValue += "  "; //每次缩进两字符
          }
          textIndentNum++;
        } else if (code == "}" || code == "]") {
          textIndentNum = textIndentNum > 0 ? textIndentNum - 1 : 0;
          newValue += "\n";
          for (let j = 0; j < textIndentNum; j++) {
            newValue += "  "; //每次缩进两字符
          }
          newValue += code;
          newValue += "\n";
          for (let j = 0; j < textIndentNum; j++) {
            newValue += "  "; //每次缩进两字符
          }
        } else {
          newValue += code;
        }
        if (code == "\n") {
          console.log("11");
        }
      }
      this.newInterfaceDetail = newValue;
    },
    processTextIndent(event) {
      //仅实际输入了字符才处理
      if (this.newInterfaceDetail.length != this.detailLength) {
        let index = this.newInterfaceDetail.length - 1;
        let character = this.newInterfaceDetail[index];
        if (character == "{" || character == "{") {
          this.addTextIndent();
        } else if (character == "}" || character == "}") {
          this.minusTextIndent();
        }
      }
    },
    addTextIndent() {
      this.textIndent += 2;
      this.detailLength = this.newInterfaceDetail.length;
    },
    minusTextIndent() {
      if (this.textIndent > 0) {
        this.newInterfaceDetail =
          this.newInterfaceDetail.substring(
            0,
            this.newInterfaceDetail.length - 3
          ) + "}";
        this.textIndent -= 2;
      }
      this.detailLength = this.newInterfaceDetail.length;
    },
    //取消保存
    cancelAdd() {},
    //保存
    save() {
      let nameIndex = this.newInterfaceDetail.indexOf("##name");
      if (nameIndex == -1) {
        AnMsgbox.msgbox({ message: "必须填入接口名称" });
        return;
      }
      let indexArr = [];
      indexArr.push({ index: nameIndex, name: "key_name", length: 6 });
      let descriptionIndex = this.newInterfaceDetail.indexOf("##desc");
      if (descriptionIndex != -1) {
        indexArr.push({
          index: descriptionIndex,
          name: "key_description",
          length: 6,
        });
      }
      let designIndex = this.newInterfaceDetail.indexOf("##design");
      if (designIndex != -1) {
        indexArr.push({ index: designIndex, name: "key_design", length: 8 });
      }
      let paramsIndex = this.newInterfaceDetail.indexOf("##params");
      if (paramsIndex != -1) {
        indexArr.push({ index: paramsIndex, name: "key_params", length: 8 });
      }
      let resultIndex = this.newInterfaceDetail.indexOf("##result");
      if (resultIndex != -1) {
        indexArr.push({ index: resultIndex, name: "key_result", length: 8 });
      }
      indexArr.sort((a, b) => a.index - b.index);

      //获取需要保存的参数
      let data = {};
      for (let i = 0; i < indexArr.length - 1; i++) {
        let ele = indexArr[i];
        data[ele.name] = this.newInterfaceDetail
          .substring(ele.index + ele.length, indexArr[i + 1].index)
          .trim();
      }
      let lastEle = indexArr[indexArr.length - 1];
      data[lastEle.name] = this.newInterfaceDetail
        .substring(lastEle.index + lastEle.length)
        .trim();
      data.module_id = 12;
      console.log(data);
      let params = {
        action: "add_interface",
        user_id: this.user_id,
        data: data,
      };
      post("/api/interface", params)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.jkgl-index {
  display: flex;
  height: calc(100vh - 60px);
}
.left-nav {
  width: 200px;
  background-color: blue;
}
.content {
  flex: 1;
}
.add-div {
  display: flex;
  flex-direction: column;
}
.add-div .title {
  height: 35px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.title .buttons {
  display: flex;
}
.title .save {
  margin: 0 10px;
}

.content .info {
  width: calc(100% - 20px);
  margin: 0 10px;
}
textarea {
  width: 100%;
  height: calc(100vh - 95px);
  border: 1px solid #ccc;
  outline: none;
}
textarea:focus {
  border: 1px solid #ccc;
}
</style>
