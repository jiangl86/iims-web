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
              mul
            ></an-label-dropdown-select>
          </div>
          <div class="format-funcs">
            <an-button
              name="格式化"
              alt="快捷键ctrl+shift+L"
              @click.native="debounceDataFormat"
            ></an-button>
            <an-checkbox
              label="自动"
              :initialChecked="autoFormatState"
              @change="autoFormateStateChange"
              ref="autoCheckbox"
            ></an-checkbox>
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
            @keyup="dataInput"
            @keydown.ctrl.shift.76.exact="debounceDataFormat"
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
import AnCheckbox from "components/common/basic/AnCheckbox";

import AnMsgbox from "components/common/popup/AnMsgbox";
import { post, put } from "network/request";
import { arrayToTree, addKeysToData } from "common/array/arrayprocess";
import { debounce } from "common/other/debounce";
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

      newInterfaceDetail: "", //最终输入的数据
      lastInterfaceDetail: "",
      autoFormatState: false, //是否自动格式化

      moduleInterfaceTreeData: [], //最终处理后用于展示的树
      treeHeight: 0, //树高度，用于组件展示

      debounceDataFormat: null,
    };
  },
  components: {
    AnNavTree,
    AnTree,
    AnInput,
    AnButton,
    AnLabelDropdownSelect,
    AnCheckbox,
  },
  created() {
    this.initData();

    if (localStorage.getItem("autoFormatState") == "true") {
      this.autoFormatState = true;
    }
    this.debounceDataFormat = debounce(this.dataFormat, 300);
  },
  mounted() {
    this.treeHeight = this.$refs.leftNav.offsetHeight;
  },
  //   @keyup.219="addTextIndent"
  // @keyup.221="minusTextIndent"
  // @keyup.229="processTextIndent"
  methods: {
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
      //首先将modules和Interfaces组合成一个数组
      let moduleAndInterfaces = [];
      moduleAndInterfaces.push(...this.modules);
      moduleAndInterfaces.push(...this.interfaces);
      console.log(moduleAndInterfaces);
      //转换成树结构
      this.moduleInterfaceTreeData = arrayToTree(moduleAndInterfaces);
      console.log(this.moduleInterfaceTreeData);
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
            console.log(res);
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

    //对输入数据进行处理
    dataInput(event) {
      console.log(event.keyCode);
      //如果是在结尾进行回车，且是自动格式化状态，则进行格式化
      if (event.keyCode == 13) {
        console.log("aa");
        let temp = this.lastInterfaceDetail + "\n";
        if (this.newInterfaceDetail == temp && this.autoFormatState) {
          this.debounceDataFormat();
        }
      }
      this.lastInterfaceDetail = this.newInterfaceDetail;
    },

    //数据格式化处理
    dataFormat() {
      let textIndentNum = 0; //需要缩进的符号数量，为{和[符号数量,}和]符号数量之差
      let annotation = false; //标识当前code是否是注释，系统内注释符号只有'//'
      let detailValue = this.newInterfaceDetail;
      //先删除数据里面的空格和tab(包括中文和英文的），后续由格式化自动产生
      detailValue = detailValue.replaceAll(" ", "");
      detailValue = detailValue.replaceAll("	", "");

      //产生新的格式化数据
      let newValue = detailValue[0];
      //从一开始，到最后一个直接结束是为了减少循环内部的越界判断
      let detailValueLength = detailValue.length - 1;
      for (let i = 1; i < detailValueLength; i++) {
        let code = detailValue[i];
        let nextCode = detailValue[i + 1];
        let lastCodeOfNewValueIndex = newValue.length - 1;
        let lastCodeOfNewValue = newValue[lastCodeOfNewValueIndex]; //新数据的最后一个字符

        //先判断内容是否是注释，如果是注释内容不做任何格式化处理
        if (code == "/" && nextCode == "/" && !annotation) {
          annotation = true;
          //如果注释前无空格，在注释前加一个空格将数据分隔开
          if (lastCodeOfNewValue != "") {
            newValue += " ";
          }
        }
        //如果遇到回车，则注释结束
        if (code == "\n" && annotation) {
          annotation = false;
        }
        //如果是在注释部分，直接复制其内容
        if (annotation) {
          newValue += code;
        }
        //如果是正文，开启格式化处理
        else {
          //如果连续多个回车键，则仅保留一个，并处理下一行数据前的缩进
          if (code == "\n") {
            if (lastCodeOfNewValue != "\n") {
              console.log(lastCodeOfNewValue);

              newValue += code;
              console.log(newValue);
              //如果下一个字符是普通字符，输入之前先进行缩进
              if (
                nextCode != "\n" &&
                nextCode != "{" &&
                nextCode != "[" &&
                nextCode != "}" &&
                nextCode != "]"
              ) {
                for (let j = 0; j < textIndentNum; j++) {
                  newValue += "  "; //每次缩进两字符
                }
              }
            }
          } else if (code == "{" || code == "[") {
            //如果格式化数据中最后一个不是换行符，先进行换行
            if (lastCodeOfNewValue != "\n") {
              newValue += "\n";
            }
            //采用空格进行缩进
            for (let j = 0; j < textIndentNum; j++) {
              newValue += "  "; //每次缩进两字符
            }
            newValue += code;

            textIndentNum++;
            newValue = this.procssNextLineIndex(
              nextCode,
              newValue,
              textIndentNum
            );
          } else if (code == "}" || code == "]") {
            textIndentNum = textIndentNum > 0 ? textIndentNum - 1 : 0;
            //如果格式化数据最后一个字符不是换行，先换行
            if (lastCodeOfNewValue != "\n") {
              newValue += "\n";
            }
            //进行数据缩进
            for (let j = 0; j < textIndentNum; j++) {
              newValue += "  "; //每次缩进两字符
            }
            newValue += code;
            //如果下一个是，直接处理该字符，跳过下一个循环
            if (nextCode == "," || nextCode == "，") {
              newValue += nextCode;
              i++;
              nextCode = detailValue[i + 1];
            }
            newValue = this.procssNextLineIndex(
              nextCode,
              newValue,
              textIndentNum
            );
          } else {
            newValue += code;
          }
        }
      }
      //处理##name,##desc等数据，在前面加换行隔开，在后面加空格
      newValue = newValue.replace("##name", "\n##name ");
      newValue = newValue.replace("##desc", "\n##desc ");
      newValue = newValue.replace("##address", "\n##address ");
      newValue = newValue.replace("##design", "\n##design ");
      newValue = newValue.replace("##params", "\n##params ");
      newValue = newValue.replace("##result", "\n##result ");
      if (newValue[0] == "\n") {
        newValue = newValue.substring(1);
      }
      newValue += detailValue[detailValueLength];
      this.newInterfaceDetail = newValue;
    },

    //处理{[}]等符号后下一行缩进，及换行符后的缩进如果下一个字符是普通字符，输入之前先进行缩进
    procssNextLineIndex(nextCode, newValue, textIndentNum) {
      if (
        nextCode != "\n" &&
        nextCode != "{" &&
        nextCode != "[" &&
        nextCode != "}" &&
        nextCode != "]"
      ) {
        newValue += "\n";
        for (let j = 0; j < textIndentNum; j++) {
          newValue += "  "; //每次缩进两字符
        }
      }
      return newValue;
    },

    //自动更新状态变更
    autoFormateStateChange(value) {
      this.autoFormatState = value;
      console.log(this.autoFormatState);
      localStorage.setItem("autoFormatState", this.autoFormatState);
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
.title .format-funcs {
  display: flex;
  align-items: center;
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
