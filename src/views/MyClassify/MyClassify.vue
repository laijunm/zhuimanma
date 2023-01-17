<template>
  <div class="classify-page" :class="{ nightItem: ifNightSwitch == true }">
    <div class="loading" v-show="(loadShow == true)"><van-loading size="60px" color="#ddd" vertical>加载中...</van-loading>
    </div>
    <div class="classify-header">
      <div class="classify-header-title">漫画分类</div>
      <div class="classify-title-box">
        <div class="classify-one-box">
          <div class="classify-one">
            <div class="classify-one-item" :class="{ oneActive: activeIndex == -1 }"
              @click="classifyTitleClickHandel(-1)">
              全部</div>
            <div class="classify-one-item" v-for="i in headTitle" :key="i.id"
              :class="{ oneActive: activeIndex == i.id }" @click="classifyTitleClickHandel(i.id)">
              {{ i.name }}
            </div>
          </div>
        </div>
        <div class="classify-two-box">
          <div class="classify-two">
            <div class="classify-two-item" :class="{ twoActive: areasActive == -1 }"
              @click="classifyRegionClickHandel(-1)">全部</div>
            <div class="classify-two-item" v-for="a in areas" :key="a.id" @click="classifyRegionClickHandel(a.id)"
              :class="{ twoActive: areasActive == a.id }">
              {{ a.name }}
            </div>
          </div>
        </div>
        <div class="classify-three-box">
          <div class="classify-two">
            <div class="classify-two-item" v-for="o in orders" :key="o.id" @click="classifyItClickHandel(o.id)"
              :class="{ twoActive: ordersActive == o.id }">
              {{ o.name }}
            </div>
          </div>
        </div>
        <div class="classify-four-box">
          <!-- classify-two-item-active -->
          <div class="classify-two">
            <div class="classify-two-item" :class="{ twoActive: statusActive == -1 }"
              @click="classifyIsFinshClickHandel(-1)">全部</div>
            <div class="classify-two-item " v-for="s in status" :key="s.id" @click="classifyIsFinshClickHandel(s.id)"
              :class="{ twoActive: statusActive == s.id }">
              {{ s.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="classify-content" :class="{ nightItem: ifNightSwitch == true }">
      <div class="classify-content-item" v-for="d in dataList" :key="d.season_id" @click="clickPassValue(d.season_id)">
        <img class="classify-content-item-img" :src="d.vertical_cover" alt="" />
        <div class="classify-content-item-title">{{ d.title }}</div>
        <div class="classify-content-item-introduce">{{ d.bottom_info }}</div>
      </div>
    </div>
    <Transition name="router">
      <CartoonDetailsPage v-if="showCartoonPage == true" @clickReturn="clickReturnHandel" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Api } from "../../apis";
import type { ClassifyTitleData } from "../../typings"
import { useMainStore } from '@/stores/counter'
import CartoonDetailsPage from "@/components/CartoonDetailsPage.vue";


const mainStore = useMainStore()

const headTitle = ref();
const areas = ref();
const orders = ref();
const status = ref();

const loadShow = ref<boolean>(false)
const ifNightSwitch = ref<boolean>(false)


const activeIndex = ref<number>(-1)
const areasActive = ref<number>(-1)
const ordersActive = ref<number>(0)
const statusActive = ref<number>(-1)

const dataList = ref<Array<ClassifyTitleData>>()

const showCartoonPage = ref<boolean>(false)

function clickPassValue(id: number) {
  mainStore.routerCartoonPage(id)
  showCartoonPage.value = true;
}
const clickReturnHandel = (val: boolean) => {
  showCartoonPage.value = val;
};

onMounted(() => {
  let isNight: any = localStorage.getItem("nightModel")
  ifNightSwitch.value = JSON.parse(isNight)
  getClassifyTitleData();
  getClassifyData()
});

async function getClassifyTitleData() {
  let { data }: any = await Api.getClassifyTitleData();
  headTitle.value = data.styles;
  areas.value = data.areas;
  orders.value = data.orders;
  status.value = data.status;
}

function classifyTitleClickHandel(id: number) {
  activeIndex.value = id
  getClassifyData()
  loadShow.value = true
}
function classifyRegionClickHandel(id: number) {
  areasActive.value = id
  getClassifyData()
  loadShow.value = true
}
function classifyItClickHandel(id: number) {
  ordersActive.value = id
  getClassifyData()
  loadShow.value = true
}
function classifyIsFinshClickHandel(id: number) {
  statusActive.value = id
  getClassifyData()
  loadShow.value = true
}


// 获取数据
async function getClassifyData() {

  let classifyData: any = await Api.getClassifyResult(activeIndex.value, areasActive.value, ordersActive.value, statusActive.value)
  dataList.value = classifyData.data
  loadShow.value = false
}
</script>

<style scoped>
.classify-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 210px;
}

.classify-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
background-color: #fff;
}

.classify-header-title {
  text-align: center;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: rgb(192, 18, 192);

}

.classify-title-box {
  padding: 0px 10px;

}

.classify-one-box {
  overflow: auto;
}

.classify-one {
  width: 282%;
  display: flex;
  padding: 10px 0px;
  border-bottom: 1px solid #ddd;
}

.classify-one-item {
  margin-right: 20px;
}

.classify-two {
  display: flex;
  padding: 10px 0px;
  border-bottom: 1px solid #ddd;
}

.classify-two-item {
  margin-right: 20px;
}

.oneActive {
  color: rgb(192, 18, 192);
  border-bottom: 2px solid rgb(192, 18, 192);
  transform: scale(1.2);
}

.twoActive {
  color: rgb(192, 18, 192);
}

.classify-content {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  padding: 0px 20px 50px;
  box-sizing: border-box;
  ;
}

.classify-content-item {
  width: 30%;
  margin-bottom: 20px;
  margin-left: 10px;
}

.classify-content-item:first-child {
  margin-left: 0;
}

.classify-content-item-img {
  width: 100%;
  height: 120px;
  border-radius: 15px;
  box-shadow: 1px 2px 6px #ddd;
}

.classify-content-item-title {
  font-weight: bold;
  margin: 6px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.classify-content-item-introduce {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .6);
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>