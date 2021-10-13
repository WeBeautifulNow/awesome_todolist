<template>
  <el-tabs v-model="activeTab" class="tabWrap">
    <el-tab-pane label="Today" name="first">
      <TodayIsEverything/>
    </el-tab-pane>
    <el-tab-pane label="Future" name="second">
      <FutureFullOfPossibilities/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import TodayIsEverything from './components/TodayIsEverything.vue'
import FutureFullOfPossibilities from './components/FutureFullOfPossibilities.vue'

export default {
  name: 'App',
  components: {
    TodayIsEverything,
    FutureFullOfPossibilities
  },
  data() {
    return {
      activeTab: 'first',
    }
  },
}
</script>

<style scoped>
  .tabWrap {
    padding: 0 20px;
  }
</style>
