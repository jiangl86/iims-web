<template>
  <div class="an-button">
    <button
      :style="{ backgroundColor: color, color: letterColor }"
      ref="button"
    >
      <an-icon
        v-if="icon && !iconAfter"
        :icon="icon"
        :color="iconColor ? iconColor : letterColor"
        :size="iconSize"
        class="icon"
        ref="icon"
      ></an-icon>
      {{ name }}
      <an-icon
        v-if="icon && iconAfter"
        :icon="icon"
        :color="iconColor ? iconColor : letterColor"
        :size="iconSize"
        class="icon-after"
        ref="icon"
      ></an-icon>
    </button>
  </div>
</template>

<script>
import AnIcon from "./AnIcon";
import { getEleWidth, getEleHeight } from "common/css/csscompute";
export default {
  name: "AnButton",
  data() {
    return {
      btnShow: true,
    };
  },
  props: {
    name: {
      type: String, //图标名字
    },
    width: {
      type: Number, //图标宽度，单位为px,正常情况下不传该值，由内容自动扩充，若传该值将以该值为主
    },
    height: {
      type: Number, //图标高度，单位为px,正常情况下不传该值，由内容自动扩充，若传该值将以该值为主
    },
    round: {
      type: Boolean, //是否为圆形按钮
      default: false,
    },
    color: {
      type: String,
      default: "#F2F2F2", //图标主颜色
    },
    letterColor: {
      type: String,
    },
    icon: {
      type: String, //图标内容
    },
    iconColor: {
      type: String, //图标颜色
    },
    iconSize: {
      type: Number, //图标大小
    },
    iconAfter: {
      type: Boolean, //图标是否放在文字后面，默认在文字前
      default: false,
    },
  },
  data() {
    return {};
  },
  components: {
    AnIcon,
  },
  mounted() {
    if (this.width) {
      this.$refs.button.style.width = this.width + "px";
    }
    if (this.height) {
      this.$refs.button.style.height = this.height + "px";
    }
    if (this.round) {
      this.$refs.button.style.padding = "5px";
      let width = Math.ceil(getEleWidth(this.$refs.button));
      this.$refs.button.style.height = width + "px";
      this.$refs.button.style.width = width + "px";
      this.$refs.button.style.borderRadius = width / 2 + "px";
      if (!this.name) {
        this.$refs.icon.$el.style.marginRight = "0";
      }
    }
  },
};
</script>

<style scoped>
button {
  height: 30px;
  display: flex;
  padding: 5px 15px;
  border-radius: 3px;
  border: 1px solid #ccc;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
button:hover {
  color: var(--mainColor);
  border-color: var(--mainColor);
}
.icon {
  margin-right: 3px;
}
.icon-after {
  margin-left: 3px;
}
</style>
