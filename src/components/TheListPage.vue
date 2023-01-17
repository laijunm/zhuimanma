<template>
    <div class="the-list" :class="{ night: ifNightSwitch == true }">
        <div class="login-head-nav">
            <div class="login-return" @click="onClickLeft"><van-icon name="arrow-left" /></div>
            <div class="login-title">本月热门排行</div>
        </div>
        <div class="this-list-box" :class="{ night: ifNightSwitch == true }">
            <div class="the-list-title">
                <div class="the-list-title-item" :class="{ active: defaultVal == r.id, night: ifNightSwitch == true }"
                    v-for="r in ranking" :key="r.id" @click="getRankingListDetails(r.id)">{{ r.name }}</div>
            </div>
        </div>


        <div class="popularity-list-content">
            <div class="popularity-list-content-item" v-for="(b, index) in rankingList" :key="b.comic_id"
                @click="clickPassValue(b.comic_id)">
                <img class="popularity-list-item-img" :src="b.vertical_cover" alt="" />
                <div class="popularity-list-right-content">
                    <div class="popularity-list-item-title">{{ b.title }}</div>
                    <div class="popularity-list-item-introduce">
                        更新至{{ b.last_short_title }}
                    </div>
                    <div class="popularity-list-item-update">{{ b.author[0] }}</div>
                </div>
                <div class="popularity-list-number" :class="{ first: index == 0, two: index == 1, three: index == 2 }">
                    <div class="text-number" :class="{ colo: ifNightSwitch == true }">
                        <span v-show="index < 9">0</span><span>{{ index + 1 }}</span>
                    </div>
                </div>
            </div>
        </div>



        <Transition name="router">
            <CartoonDetailsPage v-if="showCartoonPage == true" @clickReturn="clickReturnHandel" />
        </Transition>
        <div class="loading" v-show="(showPopup == true)"><van-loading size="80px"
                text-color="skybule">加载中...</van-loading></div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue"
import type { rankingListData, rankingListDetailsData } from "@/typings"
import { Api } from "@/apis";
import { useMainStore } from '@/stores/counter'
import CartoonDetailsPage from "@/components/CartoonDetailsPage.vue";


const mainStore = useMainStore()

const emit = defineEmits(["clickReturnTheList"]);
const ranking = ref<Array<rankingListData>>()
const defaultVal = ref<number>(7)
const rankingList = ref<Array<rankingListDetailsData>>()
const ifNightSwitch = ref<boolean>(false)
const showPopup = ref<boolean>(false)

onMounted(() => {
    let isNight: any = localStorage.getItem("nightModel")
    ifNightSwitch.value = JSON.parse(isNight)
    showPopup.value = true
    getRankingListData()
    getRankingListDetails(defaultVal.value)

})

const getRankingListData = async () => {
    let rank: any = await Api.getRankingListData()
    ranking.value = rank.data.list
}
const getRankingListDetails = async (id: number) => {
    showPopup.value = true
    defaultVal.value = id
    let rankData: any = await Api.getRankingListDetailsData(id)
    rankingList.value = rankData.data.list
    showPopup.value = false
}

const showCartoonPage = ref<boolean>(false)

function clickPassValue(id: number) {
    mainStore.routerCartoonPage(id)
    showCartoonPage.value = true;
}
const clickReturnHandel = (val: boolean) => {
    showCartoonPage.value = val;
};



// 返回
function onClickLeft() {
    emit("clickReturnTheList", false);
}
</script>

<style scoped>
.the-list {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgb(255, 254, 250);
    z-index: 11;
    overflow: auto;
    padding-top: 45px;
}

.login-head-nav {
    width: 100vw;
    height: 45px;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: purple;
    color: #fff;
    font-size: 18px;
    padding: 0px 20px;
    box-sizing: border-box;
    z-index: 11;
}

.login-return {
    position: absolute;
    left: 10px;
}

.this-list-box {
    width: 100vw;
    height: 45px;
    position: sticky;
    top: 0;
    left: 0;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 6;
    padding: 0px 20px;
    overflow: auto;

}

.the-list-title {
    width: 180%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.the-list-title-item {
    width: 10%;
    height: 45px;
    color: #999;
    box-sizing: border-box;
    line-height: 45px;
    text-align: center;
}

.active {
    color: #000;
    transform: scale(1.2);
    position: relative;
}

.active::after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: #000;
    position: absolute;
    bottom: 6px;
    left: 0;
}

.popularity-list-content {
    padding: 20px;
    padding-bottom: 50px;
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
    width: 165px;
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
    background-image: url(@/assets/images/Zh.png);
    background-color: #fff;
}

.two {
    background-image: url(@/assets/images/ZL.png);
    background-color: #fff;
}

.three {
    background-image: url(@/assets/images/Zp.png);
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

.colo {
    color: #fff;
}

.loading {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 160px;
    height: 100px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;

}
</style>