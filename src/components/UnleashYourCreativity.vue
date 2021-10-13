<template>
  <div class="block">
    <div class="left">Opacity</div>
    <el-slider
      class="right"
      v-model="opacityValue"
      :min="10"
      :format-tooltip="formatTooltip"
      @change="handleOpacityChange"
    ></el-slider>
  </div>
</template>

<script>
export default {
  name: "UnleashYourCreativity",
  created() {
    const { ipcRenderer } = require("electron");
    this.ipcRenderer = ipcRenderer;
  },
  data() {
    return {
      opacityValue: 100,
      ipcRenderer: null,
    };
  },
  methods: {
    formatTooltip(val) {
      return val / 100;
    },
    handleOpacityChange() {
      console.log(this.opacityValue);
      this.ipcRenderer.send("changeOpacity", this.opacityValue / 100);
    },
  },
};
</script>

<style scoped>
.block {
  display: flex;
}
.left {
  width: 25%;
  line-height: 38px;
}
.right {
  width: 75%;
}
</style>