<template>
  <div style="height: 100%" @click="notify">
    <el-alert
      title="never leave today's work for tomorrow"
      type="error"
      center
      show-icon
      :closable="false"
    >
    </el-alert>
  </div>
</template>

<script>
export default {
  name: "FutureFullOfPossibilities",
  methods: {
    notify() {
      this.$notify.error({
        title: "What are you doing?",
        message: "Never never never leave today's work for tomorrow",
        duration: 2000,
      });
    },
  },
};
</script>