<template>
  <div class="jkgl-index">
    <div class="left-nav" ref="leftNav">
      <an-nav-tree
        :name="project_name"
        :height="treeHeight"
        :pData="moduleInterfaceTreeData"
        @changeFuncClick="selectProject"
        @nodeClick="nodeClick"
      ></an-nav-tree>
    </div>
    <div class="content">
      <!-- 添加或者修改页面 -->
      <div class="add-div" v-if="funcType == 'add' || funcType == 'edit'">
        <div class="title">
          <div class="module">
            <label>所属模块：</label> {{ currentModuleName }}
          </div>
          <div @click="showExample = true">示例</div>
          <div class="state">
            <an-label-dropdown-select
              name="接口状态"
              :options="stateOptions"
              :initialValue="initialState"
              ref="interfaceState"
            ></an-label-dropdown-select>
          </div>
          <!-- 数据格式化按钮 -->
          <div class="format-funcs">
            <an-button
              name="格式化"
              alt="快捷键ctrl+shift+L"
              @click.native="debounceDataFormat"
            ></an-button>
            <an-checkbox
              label="自动"
              :initialChecked="autoFormatState"
              @change="autoFormatStateChange"
              ref="autoCheckbox"
            ></an-checkbox>
          </div>
          <!-- 文本替换按钮 -->
          <div class="repalce-funcs">
            <an-button name="替换" @click.native="replaceClick"></an-button>
          </div>

          <div class="buttons">
            <an-button name="取消" @click.native="cancel"></an-button>
            <an-button
              name="保存"
              @click.native="save"
              class="save"
            ></an-button>
          </div>
        </div>
        <!-- 数据替换窗口 -->
        <div class="replace-div" v-show="showReplaceDiv">
          <an-input placeholder="被替换的字符" ref="dataFrom"></an-input>
          <an-input placeholder="替换为" ref="dataTo"></an-input>
          <an-button
            name="替换"
            @click.native="replaceData('single')"
          ></an-button>
          <an-button
            name="全文替换"
            @click.native="replaceData('all')"
          ></an-button>
          <an-icon
            :icon="closeIcon"
            :size="24"
            @click.native="showReplaceDiv = false"
          ></an-icon>
        </div>
        <!-- 接口数据新增、修改录入 -->
        <div class="info">
          <textarea
            v-model="newInterfaceDetail"
            @keyup="dataInput"
            @keydown.ctrl.shift.76.exact="debounceDataFormat"
          ></textarea>
        </div>
      </div>
      <!-- 接口查看页面 -->
      <div v-else class="detail-div">
        <div class="funcs">
          <an-button
            v-if="showAdd"
            name="新建"
            round
            @click.native="add"
          ></an-button>
          <an-button
            v-if="showEdit"
            name="修改"
            round
            @click.native="edit"
          ></an-button>
          <an-button
            v-if="showDel"
            name="删除"
            round
            @click.native="del"
          ></an-button>
          <an-button
            key="bug"
            name="报错"
            v-if="showError"
            round
            @click.native="updateState('bug')"
          ></an-button>
          <an-button
            key="finish"
            name="完成"
            v-if="showFinish"
            round
            @click.native="updateState('finish')"
          ></an-button>
          <an-button
            key="zoomout"
            name="放大"
            round
            @click.native="zoom('big')"
          ></an-button>
          <an-button
            key="zoomin"
            name="缩小"
            round
            @click.native="zoom('small')"
          ></an-button>
        </div>

        <div class="title">
          <div class="module">
            <label>所属模块：</label> {{ currentModuleName }}
          </div>
          <div class="buttons">
            <an-button
              v-show="currentInterfaceId != 0"
              name="历史记录"
              @click.native="history"
            ></an-button>
            <an-button
              v-show="showPrev"
              name="上一个"
              @click.native="prevInterface"
            ></an-button>
            <an-button
              v-show="showNext"
              name="下一个"
              @click.native="nextInterface"
            ></an-button>
          </div>
        </div>
        <div class="overview" v-if="currentInterfaceId == 0">
          当前模块暂无接口
        </div>
        <div
          class="detail"
          v-if="currentInterface != null && funcType == 'review'"
        >
          <interface-info
            :name="currentInterface.name"
            :description="currentInterface.description"
            :address="currentInterface.address"
            :design="currentInterface.design"
            :params="currentInterface.params"
            :result="currentInterface.result"
          ></interface-info>
        </div>
        <div
          class="state-change"
          v-if="currentInterfaceId != 0 && showStateChange"
        >
          <div class="info">
            <label>详细描述</label>
            <textarea
              v-model="stateChangeDescriptionValue"
              ref="stateChangeDescription"
            ></textarea>
            <div class="funcs">
              <an-button
                name="取消"
                @click.native="cancelUpdataState"
              ></an-button>
              <an-button
                name="确定"
                @click.native="assertUpdateState"
              ></an-button>
            </div>
          </div>
        </div>
        <div class="history-div" v-if="currentInterface != null && showHistory">
          <div class="history-info">
            <div class="title">历史记录</div>

            <history
              :pData="currentInterface.history_list"
              class="historys"
            ></history>
            <an-button
              name="关闭"
              @click.native="showHistory = false"
              class="close"
            ></an-button>
          </div>
        </div>
      </div>
    </div>

    <div class="example" v-show="showExample">
      <div class="info">
        <div class="content">
          ##name 代表名称，<br />必填 ##desc 代表描述，非必填 <br />
          ##design 代表设计，非必填 <br />##address 代表地址，非必填
          <br />##params 代表请求参数，非必填 <br />##result
          代表返回结果，非必填
          <br />
          示例:<br />
          ##name 用户请求接口<br />
          ##desc查询系统内用户信息（仅系统管理员可查看） <br />
          ##design 代表设计，非必填 <br />##address PUT /api/user HTTP/1.1
          <br />##params http 请求消息 body 携带添加客户的信息
          消息体的格式是json，如下示例： { "action":"list_user ", ‘user_id’:32,
          Name:‘张三’,//姓名，非必填， Phone:‘13232’，//电话，非必填
          Delete_state:0,//删除状态，0未删除，1已删除 ‘page_size’:30
          //每页数量，非必填项，不传此参数查满足条件的所有企业 ‘page_num’:5
          //页码，非必填项 } <br />##result http 响应消息 body 中，
          数据以json格式存储， 如果获取信息成功，返回如下 { "ret": 0,
          “msg”:“提示信息”, ‘user_id’:1,//用户ID ‘token’:‘sdsxdsdsdsdjsdssdsd’
          //唯一标识 } ret 为 0
          表示获取成功，ret为1表示失败,此时可以展示提示信息。
        </div>
        <an-button name="关闭" @click.native="showExample = false"></an-button>
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
      @cancel="showSelectProject = false"
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
import AnIcon from "components/common/basic/AnIcon";

import InterfaceInfo from "./InterfaceInfo";
import History from "./History";

import AnMsgbox from "components/common/popup/AnMsgbox";
import { post, put } from "network/request";
import { addKeysToData, twoArrayToTree } from "common/array/arrayprocess";
import { debounce } from "common/other/debounce";
import { transPxtoNumber } from "common/css/cssSet";
import IconConstant from "common/constant/iconConstant";
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
        { id: "0", name: "设计中" },
        { id: "1", name: "未完成" },
        { id: "2", name: "已完成" },
        { id: "3", name: "异常" },
      ],

      funcType: "review", //当前操作，包括add添加,edit编辑,review查看

      currentModule: null, //当前操作信息对应的模块
      currentModuleName: "ssss", //当前选中模块名称
      currentModuleId: 0, //当前选中模块id
      currentFuncRight: 0, //当前所选模块功能权限
      currentInterface: null, //当前选中节点完整信息，包含历史记录
      currrentInterfaceNode: null, //当前选中节点的概要信息，主要对应左侧的树节点
      currentInterfaceId: 0, //当前选中的接口id
      currentInterfaceIndex: 0, //当前选中接口在模块中对应的索引顺序
      initialState: [{ id: "1", name: "未完成" }], //接口初始状态

      tempInterfaceName: "", //用于临时保存接口名称，以便于前端直接替换接口名称数据
      tempInterfaceState: "", //用于临时保存接口状态，以便于前端直接替换接口名称数据

      newInterfaceDetail: "", //最终输入的数据
      lastInterfaceDetail: "",
      autoFormatState: false, //是否自动格式化

      moduleInterfaceTreeData: [], //最终处理后用于展示的树
      treeHeight: 0, //树高度，用于组件展示

      debounceDataFormat: null,

      showReplaceDiv: false, //是否展示数据替换窗口
      closeIcon: IconConstant.CloseIcon, //关闭图标

      showStateChange: false, //是否展示状态变更页面
      stateChangeDescriptionValue: "", //风险状态变更时，完成报错时填的详细信息
      updateStateType: "", //变更状态类型,有两种bug,finish

      showHistory: false, //显示历史记录

      showExample: false, //显示案例
    };
  },
  components: {
    AnNavTree,
    AnTree,
    AnInput,
    AnButton,
    AnLabelDropdownSelect,
    AnCheckbox,
    AnIcon,
    InterfaceInfo,
    History,
    AnButton,
  },
  computed: {
    showPrev() {
      //仅当当前选中模块下已经选中的接口前还有接口时才展示下一个
      if (this.currentInterfaceId != 0 && this.currentModule) {
        for (let i = this.currentInterfaceIndex - 1; i >= 0; i--) {
          let child = this.currentModule.childrenList[i];
          if (child.type == "2") {
            return true;
          }
        }
      } else {
        return false;
      }
    },
    showNext() {
      //仅当当前选中模块下已经选中的接口后有接口时才展示下一个
      if (this.currentInterfaceId != 0 && this.currentModule) {
        for (
          let i = this.currentInterfaceIndex + 1;
          i < this.currentModule.childrenList.length;
          i++
        ) {
          let child = this.currentModule.childrenList[i];
          if (child.type == "2") {
            return true;
          }
        }
      } else {
        return false;
      }
    },
    showAdd() {
      if (
        this.currentFuncRight &&
        this.currentFuncRight.addFlag &&
        this.currentFuncRight.addFlag == "1"
      ) {
        return true;
      }
      return false;
    },
    showEdit() {
      if (
        this.currentFuncRight &&
        this.currentFuncRight.editFlag &&
        this.currentFuncRight.editFlag == "1" &&
        this.currentInterfaceId != 0
      ) {
        return true;
      }
      return false;
    },
    showDel() {
      if (
        this.currentFuncRight &&
        this.currentFuncRight.delFlag &&
        this.currentFuncRight.delFlag == "1" &&
        this.currentInterfaceId != 0
      ) {
        return true;
      }
      return false;
    },
    showError() {
      if (this.currentInterface && this.currentInterface.state == "2") {
        return true;
      }
      return false;
    },
    showFinish() {
      if (
        this.currentFuncRight &&
        this.currentFuncRight.addFlag &&
        this.currentFuncRight.addFlag == "1" &&
        this.currentInterface &&
        this.currentInterface.state != "2"
      ) {
        return true;
      }
      return false;
    },
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
      this.moduleInterfaceTreeData = twoArrayToTree(
        this.modules,
        this.interfaces
      );
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
          if (res.ret == 0 && res.retlist) {
            this.projects = res.retlist;
          } else {
            AnMsgbox.msgbox({ message: res.msg });
          }
        })
        .catch((err) => {
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
          if (res.ret == 0) {
            if (res.ret_module_list) {
              this.modules = res.ret_module_list;
              for (let i = 0; i < this.modules.length; i++) {
                this.$set(this.modules[i], "type", "1"); //type:1表示模块
              }
            }
            if (res.ret_interface_list) {
              this.interfaces = res.ret_interface_list;
              for (let i = 0; i < this.interfaces.length; i++) {
                this.$set(this.interfaces[i], "type", "2"); //type:1表示接口
              }
            }
            //将数据格式化为树形结构
            this.initTreeData();
            //默认展示第一个模块的接口
            if (this.moduleInterfaceTreeData.length > 0) {
              this.nodeClick(this.moduleInterfaceTreeData[0]);
            }
          } else {
            AnMsgbox.msgbox({ message: res.msg });
          }
        })
        .catch((err) => {
          // console.log(err);
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

    //点击左侧功能
    nodeClick(item) {
      //如果点击的是模块
      if (item.type == "1") {
        this.currentModule = item;
        this.currentModuleName = item.name;
        this.currentModuleId = item.id;
        this.currentFuncRight = item.funcRight;
        //如果有子接口，默认展示第一个接口
        let hasInterface = false;
        if (item.childrenList) {
          for (let i = 0; i < item.childrenList.length; i++) {
            let child = item.childrenList[i];
            if (child.type == "2") {
              this.currentInterfaceId = child.id;
              this.currentInterfaceIndex = i;
              this.currrentInterfaceNode = child;
              hasInterface = true;
              break;
            }
          }
        }
        if (!hasInterface) {
          this.currentInterfaceId = 0;
          this.currentInterfaceIndex = -1;
          this.currentInterface = null;
          this.currrentInterfaceNode = null;
        }
      }
      //如果点击的是接口
      else {
        this.currentModuleId = item.module_id;
        this.currentModule = this.getModuleNode(
          this.moduleInterfaceTreeData,
          this.currentModuleId
        );
        this.currentModuleName = this.currentModule.name;
        this.currentFuncRight = this.currentModule.funcRight;
        this.currentInterfaceId = item.id;
        this.currrentInterfaceNode = item;
        //判断当前点击接口在模块中的索引号，用于上一个下一个操作
        for (let i = 0; i < this.currentModule.childrenList.length; i++) {
          let child = this.currentModule.childrenList[i];
          if (child.id == item.id) {
            this.currentInterfaceIndex = i;
            break;
          }
        }
      }
      //获取接口相信信息
      this.getInterfaceInfo();
    },

    getInterfaceInfo() {
      //获取接口相信信息
      if (this.currentInterfaceId != 0) {
        let params = {
          action: "get_info",
          user_id: localStorage.getItem("user_id"),
          interface_id: this.currentInterfaceId,
        };
        put("/api/interface", params)
          .then((res) => {
            this.currentInterface = res.data;
            this.funcType = "review";
            console.log(this.currentInterface);
          })
          .catch((err) => {
            AnMsgbox.msgbox({ message: "暂时无法获取，请稍后再试" });
          });
      }
    },

    //根据模块id获取对应的模块item,其中list是树形列表结果
    getModuleNode(list, moduleId) {
      for (let i = 0; i < list.length; i++) {
        let node = list[i];
        if (node.id == moduleId && node.type == "1") {
          return node;
        }
        if (node.childrenList) {
          let child = this.getModuleNode(node.childrenList, moduleId);
          if (child != null) {
            return child;
          }
        }
      }
      return null;
    },

    //对输入数据进行处理
    dataInput(event) {
      //如果是在结尾进行回车，且是自动格式化状态，则进行格式化
      if (event.keyCode == 13) {
        let temp = this.lastInterfaceDetail + "\n";
        if (this.newInterfaceDetail == temp && this.autoFormatState) {
          this.debounceDataFormat();
        }
        localStorage.setItem("newInterfaceDetail", this.newInterfaceDetail);
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
      detailValue = " " + detailValue; //最后处理完再把第一个给切掉
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
              newValue += code;
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

      newValue += detailValue[detailValueLength];
      newValue = newValue.substring(1); //剪掉之前加的第一个字符
      if (newValue[0] == "\n") {
        newValue = newValue.substring(1);
      }
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
    autoFormatStateChange(value) {
      this.autoFormatState = value;
      localStorage.setItem("autoFormatState", this.autoFormatState);
    },

    //点击替换数据图标
    replaceClick() {
      this.showReplaceDiv = !this.showReplaceDiv;
    },

    //替换数据
    replaceData(type) {
      let dataFrom = this.$refs.dataFrom.value;
      let dataTo = this.$refs.dataTo.value;
      if (dataFrom && dataTo) {
        if (type == "all") {
          this.newInterfaceDetail = this.newInterfaceDetail.replaceAll(
            dataFrom,
            dataTo
          );
        } else {
          this.newInterfaceDetail = this.newInterfaceDetail.replace(
            dataFrom,
            dataTo
          );
        }
      }
    },
    //取消保存
    cancel() {
      this.funcType = "review";
    },
    //保存
    save() {
      if (!this.newInterfaceDetail) {
        AnMsgbox.msgbox({ message: "必须填入接口名称" });
        return;
      }
      let inputInterfaceDetail = this.newInterfaceDetail.replaceAll(" ", "");
      inputInterfaceDetail = inputInterfaceDetail.replaceAll("    ", "");

      let nameIndex = inputInterfaceDetail.indexOf("##name");
      if (nameIndex == -1) {
        AnMsgbox.msgbox({ message: "必须填入接口名称" });
        return;
      }
      let indexArr = [];
      indexArr.push({ index: nameIndex, name: "key_name", length: 6 });
      let descriptionIndex = inputInterfaceDetail.indexOf("##desc");
      if (descriptionIndex != -1) {
        indexArr.push({
          index: descriptionIndex,
          name: "key_description",
          length: 6,
        });
      }
      let addressIndex = inputInterfaceDetail.indexOf("##address");
      if (addressIndex != -1) {
        indexArr.push({ index: addressIndex, name: "key_address", length: 9 });
      }
      let designIndex = inputInterfaceDetail.indexOf("##design");
      if (designIndex != -1) {
        indexArr.push({ index: designIndex, name: "key_design", length: 8 });
      }
      let paramsIndex = inputInterfaceDetail.indexOf("##params");
      if (paramsIndex != -1) {
        indexArr.push({ index: paramsIndex, name: "key_params", length: 8 });
      }
      let resultIndex = inputInterfaceDetail.indexOf("##result");
      if (resultIndex != -1) {
        indexArr.push({ index: resultIndex, name: "key_result", length: 8 });
      }
      indexArr.sort((a, b) => a.index - b.index);

      //获取需要保存的参数
      let data = {};
      for (let i = 0; i < indexArr.length - 1; i++) {
        let ele = indexArr[i];
        data[ele.name] = inputInterfaceDetail
          .substring(ele.index + ele.length, indexArr[i + 1].index)
          .trim();
      }
      let lastEle = indexArr[indexArr.length - 1];
      data[lastEle.name] = inputInterfaceDetail
        .substring(lastEle.index + lastEle.length)
        .trim();
      if (this.$refs.interfaceState.value != null) {
        data.key_state = this.$refs.interfaceState.value;
      } else if (this.initialState.length > 0) {
        data.key_state = this.initialState[0].id;
      }
      data.module_id = this.currentModuleId;
      this.tempInterfaceName = data.key_name;
      this.tempInterfaceState = data.key_state ? data.key_state : "1";
      if (this.funcType == "add") {
        let params = {
          action: "add_interface",
          user_id: this.user_id,
          data: data,
        };
        post("/api/interface", params)
          .then((res) => {
            //保存成功后，删除缓存，同时将数据直接在前端插入对应的树中
            if (res.ret == 0) {
              localStorage.removeItem("newInterfaceDetail");
              //产生数据节点，插入对应的模块
              let interfaceNode = {
                id: res.interface_id,
                name: this.tempInterfaceName,
                show: true,
                state: this.tempInterfaceState,
                type: "2",
                module_id: this.currentModuleId,
                parent_id: this.currentModuleId,
              };
              if (!this.currentModule.childrenList) {
                this.$set(this.currentModule, "childrenList", []);
                this.$set(this.currentModule, "children", 0);
              }
              this.currentModule.childrenList.splice(
                this.currentInterfaceIndex,
                0,
                interfaceNode
              );
              this.currentModule.children = this.currentModule.children + 1;

              //设置当前选中接口为最新添加的接口
              this.currentInterfaceId = res.interface_id;
              this.currentInterfaceIndex++;
              //查询当前接口信息用于展示
              this.getInterfaceInfo();
            } else {
              AnMsgbox.msgbox({ message: res.msg });
            }
          })
          .catch((err) => {
            // console.log(err);
          });
      } else if (this.funcType == "edit") {
        //修改信息
        //先判断修改后的信息是否和之前的相同，仅保存不相同的部分
        let modData = {};
        if (data.key_name && data.key_name != this.currentInterface.name) {
          modData.key_name = data.key_name;
        }
        if (
          data.key_design &&
          data.key_design != this.currentInterface.design
        ) {
          modData.key_design = data.key_design;
        } else if (this.currentInterface.design && !data.key_design) {
          modData.key_design = ""; //如果之前有数据，但是修改后删掉后，清空数据库对应内容
        }
        if (
          data.key_description &&
          data.key_description != this.currentInterface.description
        ) {
          modData.key_description = data.key_description;
        } else if (this.currentInterface.description && !data.key_description) {
          modData.key_description = ""; //如果之前有数据，但是修改后删掉后，清空数据库对应内容
        }
        if (
          data.key_address &&
          data.key_address != this.currentInterface.address
        ) {
          modData.key_address = data.key_address;
        } else if (this.currentInterface.address && !data.key_address) {
          modData.key_address = ""; //如果之前有数据，但是修改后删掉后，清空数据库对应内容
        }
        if (
          data.key_params &&
          data.key_params != this.currentInterface.params
        ) {
          modData.key_params = data.key_params;
        } else if (this.currentInterface.params && !data.key_params) {
          modData.key_params = ""; //如果之前有数据，但是修改后删掉后，清空数据库对应内容
        }
        if (
          data.key_result &&
          data.key_result != this.currentInterface.result
        ) {
          modData.key_result = data.key_result;
        } else if (this.currentInterface.result && !data.key_result) {
          modData.key_result = ""; //如果之前有数据，但是修改后删掉后，清空数据库对应内容
        }
        if (data.key_state && data.key_state != this.currentInterface.state) {
          modData.key_state = data.key_state;
        }

        let params = {
          action: "update_interface",
          user_id: localStorage.getItem("user_id"),
          interface_id: this.currentInterfaceId,
          data: modData,
        };
        post("/api/interface", params)
          .then((res) => {
            //保存成功后，删除缓存，同时将数据直接在前端修改对应数据
            if (res.ret == 0) {
              localStorage.removeItem("newInterfaceDetail");
              //修改对应数据节点内容
              this.currrentInterfaceNode.name = this.tempInterfaceName;
              this.currrentInterfaceNode.state = this.tempInterfaceState;
              //查询当前接口信息用于展示
              this.getInterfaceInfo();
            } else {
              AnMsgbox.msgbox({ message: res.msg });
            }
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    },

    //变更状态取消
    cancelUpdataState() {
      this.updateStateType = "";
      this.showStateChange = false;
    },

    //变更状态完成，暂时只有报错和完成两种
    assertUpdateState() {
      let params = {
        action: "update_state",
        user_id: localStorage.getItem("user_id"),
        interface_id: this.currentInterfaceId,
      };
      let data = {};
      //报错时，描述为必填
      if (this.updateStateType == "bug") {
        if (this.stateChangeDescriptionValue == "") {
          AnMsgbox.msgbox({ message: "请填写bug详细信息" });
          return;
        }
        data.state = "3";
        this.tempInterfaceState = "3";
        data.description = this.stateChangeDescriptionValue;
      } else {
        data.state = "2";
        this.tempInterfaceState = "2";
        if (this.stateChangeDescriptionValue != "") {
          data.description = this.stateChangeDescriptionValue;
        }
      }
      params.data = data;
      post("/api/interface", params)
        .then((res) => {
          if (res.ret == 0) {
            AnMsgbox.msgbox({ message: "操作成功" });
            this.getInterfaceInfo();
            this.currrentInterfaceNode.state = this.tempInterfaceState;
            this.showStateChange = false;
            this.updateStateType = "";
          } else {
            AnMsgbox.msgbox({ message: res.msg });
          }
        })
        .catch((err) => {});
    },

    //点击新增按钮
    add() {
      this.funcType = "add";
      this.newInterfaceDetail = "";
      this.initialState = [{ id: "1", name: "未完成" }];
      if (localStorage.getItem("newInterfaceDetail")) {
        this.newInterfaceDetail = localStorage.getItem("newInterfaceDetail");
      }
    },
    //点击修改按钮
    edit() {
      this.newInterfaceDetail = "";
      if (this.currentInterface.name) {
        this.newInterfaceDetail += "##name " + this.currentInterface.name;
      }
      if (this.currentInterface.description) {
        this.newInterfaceDetail +=
          "##desc " + this.currentInterface.description;
      }
      if (this.currentInterface.address) {
        this.newInterfaceDetail += "##address " + this.currentInterface.address;
      }
      if (this.currentInterface.design) {
        this.newInterfaceDetail += "##design " + this.currentInterface.design;
      }

      if (this.currentInterface.params) {
        this.newInterfaceDetail += "##params " + this.currentInterface.params;
      }
      if (this.currentInterface.result) {
        this.newInterfaceDetail += "##result " + this.currentInterface.result;
      }
      if (this.currentInterface.state) {
        this.initialState.splice(0, 1);
        if (this.currentInterface.state == "0") {
          this.initialState.splice(0, 0, { id: "0", name: "设计中" });
        } else if (this.currentInterface.state == "1") {
          this.initialState.splice(0, 0, { id: "1", name: "未完成" });
        } else if (this.currentInterface.state == "2") {
          this.initialState.splice(0, 0, { id: "2", name: "已完成" });
        } else {
          this.initialState.splice(0, 0, { id: "3", name: "异常" });
        }
      }
      this.debounceDataFormat();
      this.funcType = "edit";
    },
    //点击删除按钮
    del() {
      if (this.currentInterfaceId != 0) {
        AnMsgbox.confirm({ message: "是否确认删除？" })
          .then((res) => {
            let params = {
              action: "delete_interface",
              user_id: localStorage.getItem("user_id"),
              delete_interface_id: this.currentInterfaceId,
            };
            post("/api/interface", params).then((res) => {
              if (res.ret == 0) {
                //删除当前模块中对应的节点
                let tempIndex = this.currentInterfaceIndex;
                //如果有下一个节点，跳转至下一个节点,没有的话，如有有上一个节点，就跳转至上一个节点,都没有就说明没有接口了
                if (this.showNext) {
                  this.nextInterface();
                  this.currentInterfaceIndex--; //因为后面要在列表中删除一个节点
                } else if (this.showPrev) {
                  this.prevInterface();
                } else {
                  this.currentInterfaceId = 0;
                  this.currrentInterfaceNode = null;
                  this.currentInterface = null;
                  this.currentInterfaceIndex = 0;
                }
                this.currentModule.childrenList.splice(tempIndex, 1);
              } else {
                AnMsgbox.msgbox({ message: res.msg });
              }
            });
          })
          .catch((err) => {});
      }
    },
    //点击报错和完成按钮，报错type为wrong,完成为finish
    updateState(type) {
      if (this.currentInterfaceId != 0) {
        this.updateStateType = type;
        this.showStateChange = true;
      }
    },
    //点击历史记录
    history() {
      this.showHistory = true;
    },

    //点击上一个
    prevInterface() {
      if (this.currentInterfaceIndex > 0) {
        for (let i = this.currentInterfaceIndex - 1; i >= 0; i--) {
          let child = this.currentModule.childrenList[i];
          if (child.type == "2") {
            this.currentInterfaceIndex = i;
            this.currentInterfaceId = child.id;
            this.currrentInterfaceNode = child;
            this.getInterfaceInfo();
            break;
          }
        }
      }
    },

    //点击下一个
    nextInterface() {
      if (this.currentInterfaceIndex >= 0) {
        for (
          let i = this.currentInterfaceIndex + 1;
          i < this.currentModule.childrenList.length;
          i++
        ) {
          let child = this.currentModule.childrenList[i];
          if (child.type == "2") {
            this.currentInterfaceIndex = i;
            this.currentInterfaceId = child.id;
            this.currrentInterfaceNode = child;
            this.getInterfaceInfo();
            break;
          }
        }
      }
    },
    //点击放大、缩小
    zoom(type) {
      const styles = getComputedStyle(document.querySelector(":root"));
      let interfaceFontSize = transPxtoNumber(
        String(styles.getPropertyValue("--interfaceContentFontSize")).trim()
      );
      //设置字体大小
      interfaceFontSize =
        type == "big" ? interfaceFontSize + 2 : interfaceFontSize - 2;
      interfaceFontSize = interfaceFontSize < 10 ? 10 : interfaceFontSize;
      interfaceFontSize = interfaceFontSize > 30 ? 30 : interfaceFontSize;
      //设置行高
      let interfaceLineHeight = Math.ceil(interfaceFontSize * 1.414);
      document.documentElement.style.setProperty(
        "--interfaceContentFontSize",
        interfaceFontSize + "px"
      );
      document.documentElement.style.setProperty(
        "--interfaceContentLineHeight",
        interfaceLineHeight + "px"
      );
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
  width: 260px;
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
  padding-left: 10px;
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
.replace-div {
  position: fixed;
  right: 10px;
  top: 95px;
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border: 1px solid #ccc;
}
.replace-div > div {
  margin-right: 20px;
}
.content .info {
  width: calc(100% - 20px);
  margin: 0 10px;
}
.add-div .info textarea {
  width: 100%;
  height: calc(100vh - 100px);
  border: 1px solid #ccc;
  outline: none;
}
textarea:focus {
  border: 1px solid #ccc;
}

/* 查看接口相关样式 */
.detail-div {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
}
.detail-div .title {
  height: 35px;
  line-height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.detail-div > .funcs {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 30px;
  top: 200px;
  z-index: 1;
}
.detail-div .funcs > div {
  margin-bottom: 10px;
}
.detail-div .title .buttons > div {
  margin-left: 15px;
}
.detail-div .detail {
  width: 100%;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.state-change {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.2);
}
.state-change .info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 600px;
  height: 340px;
  background-color: white;
  border: 1px solid #ccc;
}
.state-change .info label,
.state-change .info textarea {
  margin: 10px 10px 0 10px;
}
.state-change .info textarea {
  width: 575px;
  height: 240px;
  outline: none;
  border: 1px solid #ccc;
}
.state-change .info > .funcs {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
}
.state-change .info > .funcs > div {
  margin: 0 10px;
}
.history-div,
.example {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.2);
}

.history-info,
.example .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 600px;

  background-color: white;
  border: 1px solid #ccc;
}
.history-info .title {
  width: 100%;
  text-align: center;
  color: white;
  background-color: var(--mainColor);
}
.history-info .historys,
.example .info .content {
  width: 100%;

  height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
