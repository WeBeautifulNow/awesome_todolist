<template>
  <div class="newItemWrap">
    <el-input
      placeholder="what are you going to do next?"
      v-model="newToDoItemValue"
      class="newItemInput"
      @keyup.enter="addNewItem"
    >
    </el-input>
    <el-button type="success" plain @click="addNewItem">add</el-button>
  </div>
  <el-tooltip placement="top">
    <template #content>
      Long press the pie chart for three seconds to delete all items<br />
      Long press the task for one second to delete the current task <br />
      Double click the pie chart can delete all finished task
    </template>
    <el-progress
      class="finishRate"
      type="circle"
      :percentage="this.finishRate"
      @mousedown="mouseDownPie"
      @mouseup="mouseUpPie"
      @dblclick="doubleClick"
    >
    </el-progress>
  </el-tooltip>
  <div class="itemsDisplayArea">
    <div>
      <div class="workItemWrap" v-for="item in workItems" :key="item.key">
        <el-alert
          class="workItem"
          v-if="item.status === this.workItemStatus.needToBeDone"
          type="error"
          :closable="false"
          @mousedown="mouseDownItem"
          @mouseup="mouseupItem(item, $event)"
        >
          {{ item.value }}
        </el-alert>
      </div>
    </div>
    <div>
      <div class="workItemWrap" v-for="item in workItems" :key="item.key">
        <el-alert
          class="workItem"
          v-if="item.status === this.workItemStatus.finished"
          type="success"
          :closable="false"
          @mousedown="mouseDownItem"
          @mouseup="mouseupItem(item, $event)"
        >
          {{ item.value }}
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script>
import { workItemStatus } from "../constant";
import fs from "fs";

export default {
  name: "TodayIsEverything",
  props: {},
  created() {
    const newProcess = JSON.parse(JSON.stringify(process));
    const USER_HOME = newProcess.env.HOME || newProcess.env.USERPROFILE;
    this.dataStoredPath = `${USER_HOME}\\AppData\\Local\\todolistStore.txt`;
    this.workItemStatus = workItemStatus;
    try {
      const data = fs.readFileSync(this.dataStoredPath, "utf8");
      this.workItems = JSON.parse(data);
      this.toDoItemCount = this.workItems.filter(
        (item) => item.status == workItemStatus.needToBeDone
      ).length;
      this.finishedItemCount = this.workItems.filter(
        (item) => item.status == workItemStatus.finished
      ).length;
    } catch (err) {
      console.error(err);
    }
  },
  updated() {
    try {
      const data = fs.writeFileSync(
        this.dataStoredPath,
        JSON.stringify(this.workItems)
      );
      //文件写入成功。
    } catch (err) {
      console.error(err);
    }
  },
  data() {
    return {
      newToDoItemValue: "",
      workItems: [],
      toDoItemCount: 0,
      finishedItemCount: 0,
    };
  },
  computed: {
    finishRate() {
      if (this.toDoItemCount + this.finishedItemCount === 0) {
        return 0;
      } else {
        return +(
          (100 * this.finishedItemCount) /
          (this.toDoItemCount + this.finishedItemCount)
        ).toFixed(2);
      }
    },
  },
  methods: {
    addNewItem(event) {
      if (this.newToDoItemValue.trim() === "") {
        return;
      }
      this.workItems.push({
        key: new Date().getTime(),
        value: this.newToDoItemValue,
        status: this.workItemStatus.needToBeDone,
      });
      this.newToDoItemValue = "";
      this.toDoItemCount++;
    },
    mouseDownItem() {
      this.lastestMouseDownTime = new Date();
    },
    mouseDownPie() {
      this.lastestMouseDownPieTime = new Date();
    },
    mouseupItem(item, event) {
      this.lastestMouseUpTime = new Date();
      //长按删除，点击切换状态
      if (this.lastestMouseUpTime - this.lastestMouseDownTime > 1000) {
        if (item.status === this.workItemStatus.needToBeDone) {
          this.toDoItemCount--;
        } else {
          this.finishedItemCount--;
        }
        item.status = this.workItemStatus.deleted;
        item.key = new Date().getTime();
        this.$message({
          message: `Delete task -- ${item.value} -- success`,
          type: "success",
        });
      } else {
        if (item.status === this.workItemStatus.needToBeDone) {
          item.status = this.workItemStatus.finished;
          this.toDoItemCount--;
          this.finishedItemCount++;
        } else {
          item.status = this.workItemStatus.needToBeDone;
          this.finishedItemCount--;
          this.toDoItemCount++;
        }
        item.key = new Date().getTime();
        event.preventDefault();
      }
    },
    mouseUpPie() {
      if (new Date() - this.lastestMouseDownPieTime > 3000) {
        this.toDoItemCount = 0;
        this.finishedItemCount = 0;
        if (this.workItems.length > 0) {
          this.$message({
            message: "All tasks have been deleted",
            type: "success",
          });
        }
        this.workItems = [];
      }
    },
    doubleClick() {
      this.$confirm("All finished tasks will be deleted", "warning", {
        confirmButtonText: "delete",
        cancelButtonText: "cancel",
        type: "warning",
      })
        .then(() => {
          this.workItems.forEach((item) => {
            if (item.status === this.workItemStatus.finished) {
              item.status = this.workItemStatus.deleted;
              item.key = new Date().getTime();
            }
          });
          this.finishedItemCount = 0;
          this.$message({
            type: "success",
            message: "All finished tasks have been deleted!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Canceled",
          });
        });
    },
  },
};
</script>

<style scoped>
.newItemWrap {
  display: flex;
}
.newItemInput {
  padding: 0 20px 0 0;
}
.finishRate {
  margin: 30px auto;
  display: table;
}
.itemsDisplayArea {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 300px);
  overflow: auto;
}
.workItemWrap {
  display: flex;
}
.workItem {
  margin: 0 0 10px 0;
}
</style>