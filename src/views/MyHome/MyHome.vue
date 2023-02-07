<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { Api } from "../../apis";
import type {
  RecommendListData,
  NoMoneyData,
  DataType,
  SwiperData,
} from "../../typings";
import CartoonDetailsPage from "@/components/CartoonDetailsPage.vue";
import TheListPage from "@/components/TheListPage.vue"
import SeachPage from "@/components/SeachPage.vue"

import { useMainStore } from '@/stores/counter'
import { unknownProp } from "vant/lib/utils";

const mainStore = useMainStore()

// 头部随滚动变化

// 数据

const dataList = ref<RecommendListData[]>([]);
const swiperList = ref<NoMoneyData[]>([]);
const riMan = ref<NoMoneyData[]>([]);
const nomoney = ref<NoMoneyData[]>([]);
const warmBlood = ref<NoMoneyData[]>([]);
const wanjie = ref<NoMoneyData[]>([]);
const man = ref<NoMoneyData[]>([]);
const woman = ref<NoMoneyData[]>([]);
const baozang = ref<NoMoneyData[]>([]);
const ifNightSwitch = ref<boolean>(false)

//跳转页面
const routerId = ref()
const showCartoonPage = ref<boolean>(false);
const showTheListPage = ref<boolean>(false)
const showSeachPage = ref<boolean>(false)

onMounted(() => {
  let isNight = localStorage.getItem("nightModel")
  if (isNight) {
    ifNightSwitch.value = JSON.parse(isNight)
  }

  gerRecommend();
  getRiman();
  getNoMoney();
  getWarmBlood();
  getWanJie();
  getMan();
  getWoMan();
  getTreasure();
});
// 推荐
async function gerRecommend() {
  // 推荐
  let swiper: any = await Api.getRecommendSwiperList();
  let res = await Api.getRecommendData();

  swiperList.value = swiper.data


  for (let i = 0; i < res.data.list.length; i++) {
    if (i < 6) {
      dataList.value.push(res.data.list[i]);
    }
  }
}

// 免费
async function getNoMoney() {
  let noMoney: any = await Api.getNoMoneyData();
  nomoney.value = noMoney.data.list;
}
// 日漫
async function getRiman() {
  let riman: any = await Api.getRimanData();
  for (let i = 0; i < riman.data.list.length; i++) {
    if (i < 4) {
      riMan.value.push(riman.data.list[i]);
    }
  }
}

// 热血
async function getWarmBlood() {
  let warmblood: any = await Api.getWarmBloodData();
  warmBlood.value = warmblood.data;
}
// 完结
async function getWanJie() {
  let wanJie: any = await Api.getWanJieData();
  for (let i = 0; i < wanJie.data.list.length; i++) {
    if (i < 6) {
      wanjie.value.push(wanJie.data.list[i]);
    }
  }
}

// 男生
async function getMan() {
  let nan: any = await Api.getManData();
  man.value = nan.data.list;
}
// 女生
async function getWoMan() {
  let nv: any = await Api.getWoManData();
  for (let i = 0; i < nv.data.list.length; i++) {
    if (i < 6) {
      woman.value.push(nv.data.list[i]);
    }
  }
}

// 排行榜
async function getTreasure() {
  let bao: any = await Api.getTreasureData();
  for (let i = 0; i < bao.data.list.length; i++) {
    if (i < 10) {
      baozang.value.push(bao.data.list[i]);
    }
  }
}

// 滚动条
const myDiv = ref<any>(null)
const num = ref<number>(0)
function handleScroll() {
  var scrollTop = Math.floor(myDiv.value.scrollTop)
  headOpacity(scrollTop)
}
function headOpacity(nums: number) {
  let o = Math.floor((nums / 500) * 100) / 100;
  o = o >= 0 ? o : 0;

  num.value = o

}


//页面跳转方法
function routerCartoonPage(id: number) {

  mainStore.routerCartoonPage(id)
  showCartoonPage.value = true;
}



const clickReturnHandel = (val: boolean) => {
  showCartoonPage.value = val;
};
const clickReturnTheList = (val: boolean) => {
  showTheListPage.value = val;
};
const clickReturnSeach = (val: boolean) => {
  showSeachPage.value = val;
};

components: {
  CartoonDetailsPage;
  TheListPage
}
</script>
<template>
  <div class="home-page" ref="myDiv" @scroll.passive="handleScroll" :class="{ night: ifNightSwitch == true }">
    <div class="home-header" ref="myHeader" :style="'background-color: rgba(140, 41, 233,' + num + ')'">
      <div class="home-header-left">
        <div class="the-list" @click="(showTheListPage = !showTheListPage)">
          <i class="fa fa-trophy" aria-hidden="true"></i>
          榜单
        </div>

      </div>
      <div class="home-header-right" @click="(showSeachPage = !showSeachPage)">
        <van-icon name="search" size="26px" />
      </div>
    </div>

    <div class="set-box">
      <div class="swiper-images-box">
        <div class="swiper-arc-box">
          <div class="swiper-arc">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
              <van-swipe-item v-for="it in swiperList" :key="it.season_id" @click="routerCartoonPage(it.season_id)">
                <img :src="it.horizontal_cover" alt="" />
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>
      </div>
    </div>
    <!-- 精品 -->
    <div class="fine-works">
      <div class="fine-works-up">精品·那些惊艳的巨作~</div>
      <div class="fine-works-down">
        <div class="fine-works-down-item" v-for="a in dataList" :key="a.comic_id"
          @click="routerCartoonPage(a.comic_id)">
          <img class="item-img" :src="a.img" />
          <div class="item-title">{{ a.title }}</div>
          <div class="item-introduce">{{ a.introduction }}</div>
        </div>

        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          查看更多 <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 推荐 -->
    <div class="fine-works">
      <div class="fine-works-up">为你推荐</div>
      <div class="fine-works-down">
        <div class="recommend-item" @click="routerCartoonPage(dataList[2]?.comic_id)">
          <!-- comic_id: 31443 -->
          <img class="recommend-img" :src="dataList[2]?.vertical_cover" />
          <div class="item-title">{{ dataList[2]?.title }}</div>
          <div class="item-introduce">{{ dataList[2]?.styles[0].name }}</div>
        </div>
        <div class="recommend-item-box">
          <div class="recommend-item-box-content" @click="routerCartoonPage(dataList[4]?.comic_id)">
            <img class="content-img" :src="dataList[4]?.vertical_cover" />
            <div class="item-title">{{ dataList[4]?.title }}</div>
            <div class="item-introduce">{{ dataList[4]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(dataList[5]?.comic_id)">
            <img class="content-img" :src="dataList[5]?.vertical_cover" />
            <div class="item-title">{{ dataList[5]?.title }}</div>
            <div class="item-introduce">{{ dataList[5]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(dataList[3]?.comic_id)">
            <img class="content-img" :src="dataList[3]?.vertical_cover" />
            <div class="item-title">{{ dataList[3]?.title }}</div>
            <div class="item-introduce">{{ dataList[3]?.styles[0].name }}</div>
          </div>
        </div>
        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          查看更多 <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 热门 -->
    <div class="fine-works">
      <div class="fine-works-up">热门·不可错过的漫画</div>
      <div class="fine-works-down">
        <div class="recommend-item" @click="routerCartoonPage(dataList[2]?.comic_id)">
          <img class="recommend-img" :src="dataList[2]?.vertical_cover" />
          <div class="item-title">{{ dataList[2]?.title }}</div>
          <div class="item-introduce">{{ dataList[2]?.styles[0].name }}</div>
        </div>
        <div class="recommend-item-box">
          <div class="recommend-item-box-content" @click="routerCartoonPage(riMan[2]?.comic_id)">
            <img class="content-img" :src="riMan[2]?.vertical_cover" />
            <div class="item-title">{{ riMan[2]?.title }}</div>
            <div class="item-introduce">{{ riMan[2]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(warmBlood[0]?.season_id)">
            <img class="content-img" :src="warmBlood[0]?.vertical_cover" />
            <div class="item-title">{{ warmBlood[0]?.title }}</div>
            <div class="item-introduce">{{ warmBlood[0]?.bottom_info }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(warmBlood[4]?.season_id)">
            <img class="content-img" :src="warmBlood[4]?.vertical_cover" />
            <div class="item-title">{{ warmBlood[4]?.title }}</div>
            <div class="item-introduce">{{ warmBlood[4]?.bottom_info }}</div>
          </div>
        </div>
        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          查看更多 <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 免费 -->
    <div class="fine-works">
      <div class="fine-works-up">热门·免费佳作不看错亿！</div>
      <div class="fine-works-down">
        <div class="recommend-item" @click="routerCartoonPage(nomoney[0]?.comic_id)">
          <!-- comic_id: 31443 -->
          <img class="recommend-img" :src="nomoney[0]?.vertical_cover" />
          <div class="item-title">{{ nomoney[0]?.title }}</div>
          <div class="item-introduce">{{ nomoney[0]?.styles[0].name }}</div>
        </div>
        <div class="recommend-item-box">
          <div class="recommend-item-box-content" @click="routerCartoonPage(nomoney[1]?.comic_id)">
            <img class="content-img" :src="nomoney[1]?.vertical_cover" />
            <div class="item-title">{{ nomoney[1]?.title }}</div>
            <div class="item-introduce">{{ nomoney[1]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(nomoney[2]?.comic_id)">
            <img class="content-img" :src="nomoney[2]?.vertical_cover" />
            <div class="item-title">{{ nomoney[2]?.title }}</div>
            <div class="item-introduce">{{ nomoney[2]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(nomoney[3]?.comic_id)">
            <img class="content-img" :src="nomoney[3]?.vertical_cover" />
            <div class="item-title">{{ nomoney[3]?.title }}</div>
            <div class="item-introduce">{{ nomoney[3]?.styles[0].name }}</div>
          </div>
        </div>
        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          查看更多 <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 日韩 -->
    <div class="fine-works">
      <div class="fine-works-up">日韩·哪位是你心中的NO.1(✪ω✪)</div>
      <div class="fine-works-down">
        <div class="recommend-item" @click="routerCartoonPage(riMan[0]?.comic_id)">
          <!-- comic_id: 31443 -->
          <img class="recommend-img" :src="riMan[0]?.vertical_cover" />
          <div class="item-title">{{ riMan[0]?.title }}</div>
          <div class="item-introduce">{{ riMan[0]?.styles[0].name }}</div>
        </div>
        <div class="recommend-item-box">
          <div class="recommend-item-box-content" @click="routerCartoonPage(riMan[1]?.comic_id)">
            <img class="content-img" :src="riMan[1]?.vertical_cover" />
            <div class="item-title">{{ riMan[1]?.title }}</div>
            <div class="item-introduce">{{ riMan[1]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(riMan[2]?.comic_id)">
            <img class="content-img" :src="riMan[2]?.vertical_cover" />
            <div class="item-title">{{ riMan[2]?.title }}</div>
            <div class="item-introduce">{{ riMan[2]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(riMan[3]?.comic_id)">
            <img class="content-img" :src="riMan[3]?.vertical_cover" />
            <div class="item-title">{{ riMan[3]?.title }}</div>
            <div class="item-introduce">{{ riMan[3]?.styles[0].name }}</div>
          </div>
        </div>
        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          查看更多 <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 热血 -->
    <div class="fine-works">
      <div class="fine-works-up">热血·才是男人的信条</div>
      <div class="fine-works-down">
        <div class="recommend-item" @click="routerCartoonPage(warmBlood[1]?.season_id)">
          <!-- comic_id: 31443 -->
          <img class="recommend-img" :src="warmBlood[1]?.vertical_cover" />
          <div class="item-title">{{ warmBlood[1]?.title }}</div>
          <div class="item-introduce">{{ warmBlood[1]?.bottom_info }}</div>
        </div>
        <div class="recommend-item-box">
          <div class="recommend-item-box-content" @click="routerCartoonPage(warmBlood[0]?.season_id)">
            <img class="content-img" :src="warmBlood[0]?.vertical_cover" />
            <div class="item-title">{{ warmBlood[0]?.title }}</div>
            <div class="item-introduce">{{ warmBlood[0]?.bottom_info }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(warmBlood[2]?.season_id)">
            <img class="content-img" :src="warmBlood[2]?.vertical_cover" />
            <div class="item-title">{{ warmBlood[2]?.title }}</div>
            <div class="item-introduce">{{ warmBlood[2]?.bottom_info }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(warmBlood[3]?.season_id)">
            <img class="content-img" :src="warmBlood[3]?.vertical_cover" />
            <div class="item-title">{{ warmBlood[3]?.title }}</div>
            <div class="item-introduce">{{ warmBlood[3]?.bottom_info }}</div>
          </div>
        </div>
        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          进入战场 <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 女生 -->
    <div class="fine-works">
      <div class="fine-works-up">女生·言情还是古装？</div>
      <div class="fine-works-down">
        <div class="recommend-item-box item-it">
          <div class="recommend-item-box-content" v-for="n in woman" :key="n.comic_id"
            @click="routerCartoonPage(n.comic_id)">
            <img class="content-img" :src="n.vertical_cover" />
            <div class="item-title">{{ n.title }}</div>
            <div class="item-introduce">{{ n.styles[0]?.name }}</div>
          </div>
        </div>
        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          Pong！&nbsp; <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 男生 -->
    <div class="fine-works">
      <div class="fine-works-up">男生·仙侠还是游戏？</div>
      <div class="fine-works-down">
        <div class="recommend-item" @click="routerCartoonPage(man[0]?.comic_id)">
          <!-- comic_id: 31443 -->
          <img class="recommend-img" :src="man[0]?.vertical_cover" />
          <div class="item-title">{{ man[0]?.title }}</div>
          <div class="item-introduce">{{ man[0]?.styles[0].name }}</div>
        </div>
        <div class="recommend-item-box">
          <div class="recommend-item-box-content" @click="routerCartoonPage(man[1]?.comic_id)">
            <img class="content-img" :src="man[1]?.vertical_cover" />
            <div class="item-title">{{ man[1]?.title }}</div>
            <div class="item-introduce">{{ man[1]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(man[2]?.comic_id)">
            <img class="content-img" :src="man[2]?.vertical_cover" />
            <div class="item-title">{{ man[2]?.title }}</div>
            <div class="item-introduce">{{ man[2]?.styles[0].name }}</div>
          </div>
          <div class="recommend-item-box-content" @click="routerCartoonPage(man[3]?.comic_id)">
            <img class="content-img" :src="man[3]?.vertical_cover" />
            <div class="item-title">{{ man[3]?.title }}</div>
            <div class="item-introduce">{{ man[3]?.styles[0].name }}</div>
          </div>
        </div>
        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          查看更多 <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 完结 -->
    <div class="fine-works">
      <div class="fine-works-up">完结·一口气看完真是爽(*≥ ▽ ≤)ツ</div>
      <div class="fine-works-down">
        <div class="recommend-item-box item-it">
          <div class="recommend-item-box-content" v-for="item in wanjie" :key="item.comic_id"
            @click="routerCartoonPage(item.comic_id)">
            <img class="content-img" :src="item.vertical_cover" />
            <div class="item-title">{{ item.title }}</div>
            <div class="item-introduce">{{ item.author[0] }}</div>
          </div>
        </div>
        <div class="read-more" :class="{ nightItem: ifNightSwitch == true }">
          <img class="read-more-icon" src="../../assets/images/la.png" alt="" />
          Pong！&nbsp; <i class="fa fa-angle-right" aria-hidden="true"></i>
        </div>
      </div>
    </div>
    <!-- 排行榜 -->
    <div class="popularity-list">
      <div class="popularity-list-background">
        <div class="popularity-list-background-more" @click="(showTheListPage = !showTheListPage)">
          <van-icon name="bars" /> 更多排行
        </div>
      </div>
      <div class="popularity-list-content">
        <div class="popularity-list-content-item" v-for="(b, index) in baozang" :key="b.comic_id"
          @click="routerCartoonPage(b.comic_id)">
          <img class="popularity-list-item-img" :src="b.vertical_cover" alt="" />
          <div class="popularity-list-right-content">
            <div class="popularity-list-item-title">{{ b.title }}</div>
            <div class="popularity-list-item-introduce">
              更新至{{ b.last_short_title }}
            </div>
            <div class="popularity-list-item-update">{{ b.author[0] }}</div>
          </div>
          <div class="popularity-list-number" :class="{ first: index == 0, two: index == 1, three: index == 2 }">
            <div class="text-number">
              <span v-show="index < 9">0</span><span>{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="router">
      <CartoonDetailsPage v-if="showCartoonPage == true" @clickReturn="clickReturnHandel" :id="routerId" />
    </Transition>
    <Transition name="router">
      <TheListPage v-if="showTheListPage == true" @clickReturnTheList=clickReturnTheList />
    </Transition>

    <Transition name="router">

      <SeachPage v-if="showSeachPage == true" @clickReturnSeach=clickReturnSeach />

    </Transition>
  </div>
</template>




<style  scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  padding-bottom: 50px;
  box-sizing: border-box;
  overflow: auto;
}

.home-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  font-size: 18px;
  align-items: center;
  box-sizing: border-box;
  z-index: 4;
  color: #fff;

}

.home-header-left {
  display: flex;
  width: 70%;
  justify-content: left;
}

.set-box {
  width: 100vw;
  height: 280px;
  overflow: hidden;
  position: relative;
}

.swiper-images-box {
  width: 100%;
  height: 240px;
  position: relative;
  background-image: linear-gradient(60deg, red, blue);
}

.swiper-arc-box {
  width: 170%;
  height: 280px;
  position: absolute;
  left: -35%;
  top: 0;
  content: "";
  border-radius: 0 0 50% 50%;
  backdrop-filter: blur(100px);
  overflow: hidden;
}

.swiper-arc {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 50%;
  height: 220px;
}

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  text-align: center;
  height: 100%;
}

img {
  width: 100%;
  height: 220px;
  display: block;
}

.fine-works {
  margin-top: 30px;
  width: 100%;
}

.fine-works-up {
  border-left: 5px solid purple;
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
}

.fine-works-down {
  width: 100%;
  padding: 20px;
  display: flex;

  flex-wrap: wrap;
  box-sizing: border-box;
}

.fine-works-down-item {
  margin: 0px auto 20px;
}

.item-img {
  border-radius: 10px;
  width: 150px;
  height: 120px;
  margin-bottom: 10px;
  margin-right: 0 !important;
  box-shadow: 1px 2px 6px #aaa;
}

.item-title {
  font-weight: bold;
  margin-bottom: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item-introduce {
  width: 120px;
  font-size: 14px;
  color: #999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 20px;
}

.read-more {
  width: 100%;
  padding: 8px 0px;
  text-align: center;
  line-height: 30px;
  border-radius: 999px;
  background-color: rgb(248, 248, 248);
  font-size: 14px;
  margin-top: 20px;
}

.recommend-item {
  width: 100%;
}

.recommend-img {
  width: 100%;
  height: 220px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 1px 2px 6px #aaa;
}

.recommend-item-box {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.recommend-item-box-content {
  width: 31%;
}

.content-img {
  width: 100%;
  height: 140px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 1px 2px 6px #aaa;
}

.item-it {
  margin-top: 0;
}

.read-more-icon {
  width: 13px;
  height: 13px;
  display: inline-block;
  transform: translateY(1px);
}

.popularity-list {
  margin-top: 20px;
  width: 100%;
}

.popularity-list-background {
  width: 100%;
  height: 60px;
  background-image: url(../../assets/images/aj.png);
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.popularity-list-background-more {
  position: absolute;
  top: 30%;
  right: 30px;
  font-size: 12px;
  color: #aaa;
  background-color: rgb(251, 251, 251);
  border-radius: 7px;
  box-shadow: 1px 2px 6px #ddd;
  padding: 2px 5px;
}

.popularity-list-content {
  padding: 20px;
}

.popularity-list-content-item {
  display: flex;
  margin-bottom: 20px;
}

.popularity-list-item-img {
  width: 80px;
  height: 100px;
  border-radius: 10px;
  box-shadow: 1px 2px 6px #ddd;
  margin-right: 10px;
}

.popularity-list-right-content {
  width: 200px;
  padding: 10px 0px;
}

.popularity-list-item-introduce {
  margin: 8px 0px 12px;
  font-size: 13px;
  color: #999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.popularity-list-item-title {
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.popularity-list-item-update {
  font-size: 14px;
  color: #999;
}

.popularity-list-number {
  width: 85px;
  height: 100px;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}

.first {
  background-image: url(../../assets/images/Zh.png);
  background-color: #fff;
}

.two {
  background-image: url(../../assets/images/ZL.png);
  background-color: #fff;
}

.three {
  background-image: url(../../assets/images/Zp.png);
  background-color: #fff;
}

.text-number {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 30px;
  font-weight: bold;
  color: rgba(17, 17, 17, 0.896);
  z-index: -1;
}








.router-enter-from,
.router-leave-to {
  transform: translateX(100%);
}

.router-enter-active,
.router-leave-active {
  transition: all 0.3s ease-out;
}

.router-enter-to,
.router-leave-from {
  transform: translateX(0);
}
</style>