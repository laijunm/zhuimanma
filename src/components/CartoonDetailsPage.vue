<template>
  <div class="cartoon-details" ref="myDiv" @scroll.passive="handleScroll"
    :class="{ nightModel: ifNightSwitch == true }">
    <div class="loading" v-show="(isLoading == true)"><van-loading size="50px" vertical>加载中...</van-loading></div>
    <div class="cartonn-details-header" :style="'background-color: rgba(0,0,0,' + num + ')'">
      <div class="header-box">
        <div class="header-left" @click="onClickLeft">
          <van-icon name="arrow-left" />
        </div>

        <div class="header-center">{{ details?.title }}</div>
        <div class="header-rigth" @click="showShare = true"><van-icon name="ellipsis" /></div>
      </div>
    </div>

    <div class="head-background-img" :style="'background-image: url(' + details?.vertical_cover + ');'">
      <div class="zao-zi"></div>
      <div class="head-cartoon-conteng">
        <img class="cartoon-img" :src="details?.vertical_cover" alt="" />
        <div class="cartoon-text-content">
          <div class="cartoon-title">{{ details?.title }}</div>
          <div class="cartoon-text">{{ (details?.is_finish == 0 ? '完结' : '连载中') }}</div>
          <div class="cartoon-text">{{ details?.author_name[0] }}</div>
          <div class="cartoon-text">{{ details?.styles[0] }}</div>
        </div>
      </div>
    </div>

    <div class="collect-start">
      <div class="collect" v-show="isCollect == false" @click="clickCollect">
        <van-icon name="like-o" color="red" size="20px" /> 收藏
      </div>
      <div class="collect" v-show="isCollect == true" @click="clickCollect">
        <van-icon name="like" color="red" size="20px" /> 已收藏
      </div>
      <div class="start" @click="clickPassId(details?.id)">开始阅读</div>
    </div>

    <div class="cartoon-content-text">
      {{ details?.classic_lines }}
    </div>
    <div class="charters">
      <div class="charters-head">
        <div class="charters-head-left">章节</div>
        <div class="charters-head-right">更新至{{ details?.last_short_title }}</div>

      </div>
      <div class="charters-main" :class="{ showall: showAll == false }">
        <div class="charters-main-item" v-for="i in details?.ep_list" :key="i.id"
          :class="{ nightItem: ifNightSwitch == true }" @click="clickChapRouter(details?.id, i.id)">{{ i.short_title }}
          <div class="extra" v-show="(i.pay_mode != 0)"><van-icon name="lock" /></div>
        </div>

      </div>
      <div class="charters-all" v-show="(showAll == false)" @click="(showAll = !showAll)"
        :class="{ nightItem: ifNightSwitch == true }">展开全部</div>
      <div class="charters-all" v-show="(showAll == true)" @click="showAll = !showAll"
        :class="{ nightItem: ifNightSwitch == true }">关闭全部</div>
    </div>
    <van-share-sheet v-model:show="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <Transition name="login">
      <ManHuaContentVue v-if="(manHuaDetails == true)" @clickReturn=clickReturnHandel :id="idValue" :num="numValue" />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { Api } from "../apis";
import { showToast, showLoadingToast, showSuccessToast } from 'vant';
import type { ManHuaDetails, readHistory, collectManHua } from "../typings";
import { useRouter } from "vue-router"
import ManHuaContentVue from "./ManHuaContent.vue";


const isCollect = ref(false);
const router = useRouter()
const emit = defineEmits(["clickReturn"]);

const details = ref<ManHuaDetails>();
const isLoading = ref<boolean>(true)
const showAll = ref<boolean>(false)
const ifNightSwitch = ref<boolean>(false)
const manHuaDetails = ref<boolean>(false)
const ifSort = ref<boolean>(false)

const arr = ref<Array<readHistory>>([])
const arrCollect = ref<Array<collectManHua>>([])



const id = ref<number>()
const num = ref<number>(0)


const showShare = ref(false);
const options = [
  { name: '微信', icon: 'wechat' },
  { name: '微博', icon: 'weibo' },
  { name: '复制链接', icon: 'link' },
  { name: '分享海报', icon: 'poster' },
  { name: '二维码', icon: 'qrcode' },
];
const onSelect = (option: any) => {
  showToast(option.name);
  showShare.value = false;
};
// 滚动条
const myDiv = ref<any>(null)

function handleScroll() {
  var scrollTop = Math.floor(myDiv.value.scrollTop)
  headOpacity(scrollTop)
}
function headOpacity(nums: number) {
  let o = Math.floor((nums / 500) * 100) / 100;
  o = o >= 0 ? o : 0;

  num.value = o
}

//使用父组件传递过来的值


onMounted(() => {
  let num: any = localStorage.getItem("bookId")
  id.value = JSON.parse(num)

  let isNight: any = localStorage.getItem("nightModel")
  ifNightSwitch.value = JSON.parse(isNight)


  getManHuaDetails();

});

// 点击传参
const idValue = ref<number>()
const numValue = ref<number>()
const clickPassId = (id: any, num?: any) => {
  idValue.value = id
  numValue.value = details.value?.ep_list[0].id
  manHuaDetails.value = true

}

const clickChapRouter = (id: any, num: any) => {

  clickPassId(id, num)
}


async function getManHuaDetails() {

  let { data }: any = await Api.getManHuaData(id?.value);
  details.value = data
  isLoading.value = false
  details.value?.ep_list.sort((a, b): any => {
    return a.ord - b.ord
  })

  readHistory()
  getIsCollect()
}
// 阅读历史
function readHistory() {

  if (details.value != undefined) {

    let history: readHistory = {
      name: details.value?.title,
      author: details.value?.author_name[0],
      img: details.value?.vertical_cover,
      upDate: details.value?.last_short_title,
      id: details.value?.id,
      isFinish: details.value?.is_finish
    }
    let data: any = localStorage.getItem("history")
    let readHistory: Array<readHistory> = JSON.parse(data)

    if (readHistory) {
      let isExist = readHistory.map<boolean>(item => item.id == history.id)
      let isTrue = isExist.filter(i => i)
      if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
        return
      } else {
        readHistory.push(history)
        localStorage.setItem("history", JSON.stringify(readHistory))
        return
      }
    }
    arr.value.push(history)
    localStorage.setItem("history", JSON.stringify(arr.value))
  }

}
// 点击收藏
function clickCollect() {
  let isLogin: any = localStorage.getItem("ifLogin")
  isLogin = JSON.parse(isLogin)

  if (isLogin == false) {


    router.push('/login')
    return
  }

  if (details.value != undefined) {

    let collect: collectManHua = {
      name: details.value?.title,
      author: details.value?.author_name[0],
      img: details.value?.vertical_cover,
      upDate: details.value?.last_short_title,
      id: details.value?.id,
      isFinish: details.value?.is_finish,
      isCollect: true
    }

    let data: any = localStorage.getItem("collect")
    let collectManHua: Array<collectManHua> = JSON.parse(data)


    if (collectManHua) {

      let isExist = collectManHua.map<boolean>(item => item.id == collect.id)
      let isTrue = isExist.filter(i => i)


      if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
        var index = collectManHua.findIndex((v) => {
          return v.id == collect.id
        })


        showLoadingToast({
          message: '加载中...',
          forbidClick: true,
          duration: 1000,
          onClose: (() => {
            collectManHua.splice(index, 1)
            localStorage.setItem("collect", JSON.stringify(collectManHua))
            isCollect.value = false
            showSuccessToast({
              message: '已取消收藏',
              forbidClick: true,
              onClose: (() => {

              })
            });
          })
        });
        return
      }

      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 1000,
        onClose: (() => {
          collectManHua.push(collect)
          isCollect.value = true
          localStorage.setItem("collect", JSON.stringify(collectManHua))
          showSuccessToast({
            message: '已收藏',
            forbidClick: true,
            onClose: (() => {

            })
          });
        })
      });
      return

    }


    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 1000,
      onClose: (() => {
        arrCollect.value.push(collect)
        isCollect.value = true
        localStorage.setItem("collect", JSON.stringify(arrCollect.value))
        showSuccessToast({
          message: '已收藏',
          forbidClick: true,
          onClose: (() => {

          })
        });
      })
    });
  }

}
// 获取是否收藏
function getIsCollect() {
  let isHandel: any = localStorage.getItem("collect")
  let collectData: Array<collectManHua> = JSON.parse(isHandel)


  if (collectData) {
    let isExist = collectData.map<boolean>(item => item.id == id?.value)
    let isTrue = isExist.filter(i => i)
    if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
      var index = collectData.findIndex((v) => {
        return v.id == id?.value
      })
      isCollect.value = collectData[index].isCollect
      return
    }
  }
}
// 返回
function onClickLeft() {
  emit("clickReturn", false);
}

// 详情页
const clickReturnHandel = (val: boolean) => {
  manHuaDetails.value = val;
};



</script>


<style scoped>
.cartoon-details {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #fff;
  overflow: auto;
  z-index: 12;
}

.cartonn-details-header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0px 20px;
  box-sizing: border-box;
  z-index: 12;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  z-index: 13;
}

.header-box {
  display: flex;
  justify-content: space-between;
  padding: 10px 0px;
  font-size: 20px;
  color: #fff;
}

.head-background-img {
  position: relative;
  width: 100%;
  height: 180px;
  background-size: cover;
  background-repeat: no-repeat;
}

.zao-zi {
  width: 100%;
  height: 100%;
  backdrop-filter: blur(20px);
}

.head-cartoon-conteng {
  position: absolute;
  bottom: -20px;
  left: 20px;
  right: 20px;
  display: flex;
}

.cartoon-img {
  width: 100px;
  height: 130px;
  box-shadow: 1px 2px 6px #ddd;
  border-radius: 6px;
  margin-right: 10px;
}

.cartoon-text-content {
  padding: 8px;
  box-sizing: border-box;
}

.cartoon-title {
  width: 200px;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cartoon-text {
  width: 200px;
  color: #444;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cartoon-text:nth-child(2) {
  margin: 8px 0px;
}

.cartoon-text:nth-child(3) {
  margin: 0px 0px 8px;
}

.collect-start {
  display: flex;
  font-size: 18px;
  margin-top: 40px;
  justify-content: space-evenly;
  align-items: center;
  font-weight: bold;
}

.start {
  width: 40%;
  padding: 10px 0px;
  border-radius: 999px;
  background-color: red;
  text-align: center;
  color: #fff;
  box-shadow: 1px 2px 5px #ddd;
}

.cartoon-content-text {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  word-wrap: break-word;
  line-height: 25px;
}

.charters {
  margin-top: 30px;
  width: 100%;
  padding: 0px 20px 50px;
  box-sizing: border-box;
}

.charters-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
}

.charters-head-right {
  font-size: 14px;
  color: #888;
}

.charters-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;

}

.showall {
  height: 100px;
  overflow: hidden;
}

.charters-main-item {
  width: 88px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #eee;
  margin: 0px 35px 10px 0px;
  position: relative;
}

.charters-main-item:nth-child(3n) {
  margin-right: 0;
}

.charters-all {
  margin-top: 10px;
  padding: 15px 0px;
  width: 100%;
  background-color: #eee;
  border-radius: 2px;
  text-align: center;
}

.extra {
  position: absolute;
  bottom: -15px;
  right: 0;
}
</style>
