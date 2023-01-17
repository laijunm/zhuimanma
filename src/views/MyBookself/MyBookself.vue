<template>
  <div class="bookself-page"  :class="{ nightItem: ifNightSwitch == true }">
    <div class="bookself-header">
      <div class="bookself-header-left">
        <div class="collect" :class="{ selectActive: headActive == 0 }" @click="headActive = 0">收藏</div>
        <div class="history" :class="{ selectActive: headActive == 1 }" @click="getHistoryData">历史</div>
      </div>
      <div class="bookself-header-right" v-show="(isEdit == false)" @click="(isEdit = !isEdit)">编辑</div>
      <div class="bookself-header-right" v-show="(isEdit == true)" @click="(isEdit = !isEdit)">取消</div>
    </div>

    <div class="big-box" >
      <div class="iflogin" v-show="(isLogin == false)" @click="clickRouter">
        <div class="bg"></div>
      </div>


      <div>
        <div class="ifkong" v-show="(!collectData || collectData == undefined || collectData.length == 0)">
          <div class="kk"></div>
        </div>
        <div class="collect-list" v-show="headActive == 0">
          <div class="collect-list-item" v-for="c in collectData" :key="c.id" @click="clickPassValue(c.id)">
            <div class="img-and-delete">
              <img class="collect-item-img" :src="c.img" />
              <div class="delete-key" v-show="isEdit == true">
                <div class="delete-select">
                  <div class="select-item" @click.stop="clickDeleteCollect(c.id)"><van-icon name="clear" color="red"
                      size="24px" />
                  </div>
                </div>
              </div>
            </div>

            <div class="collect-item-title">{{ c.name }}</div>
            <div class="collect-item-char">{{ c.author }}</div>
          </div>
        </div>
        <div class="history-list" v-show="headActive == 1"  :class="{ nightItem: ifNightSwitch == true }">
          <div class="history-list-item" v-for="h in historyData" :key="h.id" @click="clickPassValue(h.id)">
            <img class="history-item-img" :src="h.img" alt="" />
            <div class="history-item-content">
              <div class="history-item-title">{{ h.name }}</div>
              <div class="history-item-finsh">{{ (h.isFinish == 0 ? '连载中' : '完结') }}</div>
              <div class="history-item-name">{{ h.author }}</div>
              <div class="history-item-char">更新：{{ h.upDate }}</div>
            </div>
            <div class="history-delete" v-show="isEdit == true"  :class="{ nightItem: ifNightSwitch == true }">
              <div class="history-delete-icon" @click.stop="clickHistory(h.id)">
                <van-icon name="delete-o" size="30px" color="red" />
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>




    <div class="check-all-delete" v-show="(isEdit == true && headActive == 0)">
      <div class="delect" @click="clickAllDelete"><van-icon name="delete-o" color="red" /> 全部删除</div>
    </div>
    <Transition name="router">
      <CartoonDetailsPage v-if="showCartoonPage == true" @clickReturn="clickReturnHandel" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { collectManHua, readHistory } from "@/typings"
import { showToast, showLoadingToast, showSuccessToast } from 'vant';
import { useMainStore } from '@/stores/counter'
import CartoonDetailsPage from "@/components/CartoonDetailsPage.vue";
import router from "@/router";


const mainStore = useMainStore()

const headActive = ref<number>(0);
const isEdit = ref<boolean>(false);
const isLogin = ref<boolean>(false)

const collectData = ref<Array<collectManHua>>([])
const historyData = ref<Array<readHistory>>([])
const showCartoonPage = ref<boolean>(false)
const ifNightSwitch = ref<boolean>(false)

function clickPassValue(id: number) {
  mainStore.routerCartoonPage(id)
  showCartoonPage.value = true;
}
const clickReturnHandel = (val: boolean) => {
  showCartoonPage.value = val;
};

onMounted(() => {
  let iflogin: any = localStorage.getItem("ifLogin")
  isLogin.value = JSON.parse(iflogin)

  let isNight: any = localStorage.getItem("nightModel")
  ifNightSwitch.value = JSON.parse(isNight)
  getCollectData()
})

function clickRouter() {
  router.push("/login")
}
// 收藏数据
function getCollectData() {
  let collect: any = localStorage.getItem("collect")
  collectData.value = JSON.parse(collect)
}

// 收藏删除
function clickDeleteCollect(id: number) {

  let data: any = localStorage.getItem("collect")
  let collectManHua: Array<collectManHua> = JSON.parse(data)

  if (collectManHua) {

    let isExist = collectManHua.map<boolean>(item => item.id == id)
    let isTrue = isExist.filter(i => i)


    if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
      var index = collectManHua.findIndex((v) => {
        return v.id == id
      })
      collectManHua.splice(index, 1)
      collectData.value = collectManHua
      showToast('已取消收藏');
      localStorage.setItem("collect", JSON.stringify(collectManHua))

    }
  }
}


function clickAllDelete() {
  if (collectData.value != []) {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 1000,
      onClose: (() => {
        localStorage.removeItem("collect")
        collectData.value = []
        showSuccessToast({
          message: '已清空',
          forbidClick: true,
          onClose: (() => {
            isEdit.value == false
          })
        });
      })
    });
    return
  }

}

// 历史
function getHistoryData() {
  headActive.value = 1
  let history: any = localStorage.getItem("history")
  historyData.value = JSON.parse(history)
}

function clickHistory(id: number) {

  let data: any = localStorage.getItem("history")
  let historyDatas: Array<collectManHua> = JSON.parse(data)

  if (historyDatas) {

    let isExist = historyDatas.map<boolean>(item => item.id == id)
    let isTrue = isExist.filter(i => i)


    if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
      var index = historyDatas.findIndex((v) => {
        return v.id == id
      })
      historyDatas.splice(index, 1)
      console.log(historyDatas);

      showToast('已删除');
      historyData.value = historyDatas

      localStorage.setItem("history", JSON.stringify(historyData.value))

    }
  }
}

</script>

<style scoped>
.bookself-page {
  width: 100%;
 min-height: 100vh;
  box-sizing: border-box;
  padding-top: 45px;
}

.bookself-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  background-color: rgb(211, 25, 244);
  color: #fff;
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  box-sizing: border-box;
  z-index: 6;
}

.bookself-header-left {
  font-size: 16px;
  display: flex;
}

.selectActive {
  position: relative;
  font-weight: bold;
  transform: scale(1.2);
}

.selectActive::after {
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  margin: 0 auto;
  content: '';
  display: block;
  width: 15px;
  height: 4px;
  border-radius: 999px;
  background-color: #fff;
}

.collect,
.history {
  margin-right: 20px;
  position: relative;
}

.collect-list {
  display: flex;
  padding: 10px;
  flex-wrap: wrap;
}

.collect-list-item {
  position: relative;
  width: 30%;
  margin-left: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.collect-item-img {
  width: 100%;
  height: 120px;
  box-shadow: 1px 2px 6px #eee;
  border-radius: 10px;
}

.collect-item-title {
  width: 100%;
  font-weight: bold;
  margin: 10px 0px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collect-item-char {
  width: 100%;
  font-size: 14px;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-list {
  position: relative;
  width: 100%;
  padding-bottom: 50px;
  background-color: #fff;
  z-index: 1;
}

.history-list-item {
  position: relative;
  display: flex;
  margin: 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.history-item-img {
  width: 100px;
  height: 120px;
  box-shadow: 1px 2px 6px #eee;
  border-radius: 10px;
  margin-right: 10px;
}

.history-item-content {
  padding: 8px 0px;
  width: calc(100% - 110px);
}

.history-item-title {
  font-weight: bold;
}

.history-item-finsh {
  font-size: 14px;
  margin: 8px 0px;
}

.history-item-char {
  margin: 10px 0px 0px;
  color: #888;
  font-size: 14px;
}

.history-item-name {
  color: green;
  font-size: 15px;
}

.delete-key {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.5);
}

.select-item {
  position: absolute;
  top: 0;
  right: 0;
}

.history-delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 100%;
  background-color: rgba(0, 0, 0, .05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-all-delete {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-evenly;
  z-index: 10;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
}

.iflogin,
.ifkong {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #fff;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg {
  width: 120px;
  height: 160px;
  background-image: url("../../assets/images/6-.png");
  background-size: cover;
  background-repeat: no-repeat;

}

.kk {
  width: 240px;
  height: 240px;
  background-image: url("../../assets/images/kk.webp");
  background-size: cover;
  background-repeat: no-repeat;

}
</style>