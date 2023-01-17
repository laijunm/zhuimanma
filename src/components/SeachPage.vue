<template>
    <div class="seach-page" :class="{ night: ifNightSwitch == true }">
        <div class="seach-header">
            <div class="seach-header-left">
                <div class="seach-icon"><van-icon name="search" size="18px" /></div>
                <input type="text" placeholder="请输入关键字" v-model="inputText">

            </div>
            <div class="seach-header-right" v-show="(showSeach == false)" @click="onClickLeft">取消</div>
            <div class="seach-header-right" v-show="(showSeach == true)" @click="submitSeach">搜索</div>
        </div>
        <div class="seach-history" v-show="(historyData && seachResult == false)">
            <div class="title-icon"> 搜索历史：<span @click="clickDeteleHistory"><van-icon name="delete-o" /></span></div>
            <div class="seach-history-content">
                <div class="seach-history-item" v-for=" h in historyData" @click="(inputText = h)">{{ h }}</div>
            </div>

        </div>
        <div class="recommend" v-show="(seachResult == false)">
            <div class="recommend-title">大家都在搜</div>
            <div class="recommend-content">
                <div class="recommend-content-item" v-for="s in seachRecommendList" :key="s.item_id"
                    @click="(inputText = s.title)">{{ s.title }}</div>
            </div>
        </div>
        <div class="seach-result" v-show="(seachResult == true)">
            <div class="seach-result-item" v-for="r in seachResultList" :key="r.id" @click="clickPassValue(r.id)"
                :class="{ nightItem: ifNightSwitch == true }">
                <img class="seach-result-item-img" :src="r.vertical_cover">
                <div class="seach-result-item-content">
                    <div class="seach-result-item-title">{{ r.org_title }}</div>
                    <div class="seach-result-item-author">
                        <div class="author">
                            {{ r.author_name[0] }}
                        </div>
                        <div class="isfinish">
                            {{ (r.is_finish == 0 ? '连载中' : '完结') }}
                        </div>
                    </div>
                    <div class="seach-result-item-type">{{ r.styles[0] }}</div>

                </div>
            </div>
        </div>

        <div class="loading" v-show="(showLoading == true)"><van-loading size="60px" color="rgb(156, 53, 252)"
                text-size="20px" vertical>搜索中......</van-loading></div>

        <Transition name="router">
            <CartoonDetailsPage v-if="showCartoonPage == true" @clickReturn="clickReturnHandel" />
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue"
import { Api } from "@/apis"
import type { getSeachResultList } from "@/typings"
import { useMainStore } from '@/stores/counter'
import CartoonDetailsPage from "@/components/CartoonDetailsPage.vue";


const mainStore = useMainStore()
const emit = defineEmits(["clickReturnSeach"]);

const seachRecommendList = ref()
const inputText = ref()
const seachResultList = ref<Array<getSeachResultList>>()

const showSeach = ref<boolean>(false)
const seachResult = ref<boolean>(false)
const showLoading = ref<boolean>(false)
const ifNightSwitch = ref<boolean>(false)
const historyData = ref<Array<string>>()

onMounted(() => {
    let isNight: any = localStorage.getItem("nightModel")
    ifNightSwitch.value = JSON.parse(isNight)

    let historySeach: any = localStorage.getItem("seachHistory")
    historyData.value = JSON.parse(historySeach)


    getSeachRecommendList()
})
// 监听输入
watch(inputText, (newx, old) => {
    if (newx && newx != '' && newx != " " && newx != "  " && newx != "   " && newx != "    ") {
        showSeach.value = true

    } else {
        showSeach.value = false
    }

})

const clickDeteleHistory = () => {
    localStorage.removeItem("seachHistory")
    let historySeach: any = localStorage.getItem("seachHistory")
    historyData.value = JSON.parse(historySeach)
}
// 提交搜索
const submitSeach = async () => {
    showLoading.value = true
    let result: any = await Api.getSeachResultData(inputText.value)
    seachResultList.value = result.data.list
    seachResult.value = true
    showLoading.value = false
    let arrList: Array<string> = []
    let dataList: any = localStorage.getItem("seachHistory")
    dataList = JSON.parse(dataList)
    if (dataList) {
        dataList.push(inputText.value)
        localStorage.setItem("seachHistory", JSON.stringify(dataList))
        return
    }
    arrList.push(inputText.value)


    localStorage.setItem("seachHistory", JSON.stringify(arrList))

    inputText.value = ''



}

// 搜索推荐

const getSeachRecommendList = async () => {
    let seach: any = await Api.getSeachRecommendData()

    seachRecommendList.value = seach.data
}

// 跳转
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
    emit("clickReturnSeach", false);
}
</script>

<style scoped>
.seach-page {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 12;
    background-color: rgb(251, 249, 245);
    overflow: auto;
    padding-top: 60px;

}

.seach-header {
    width: 100%;
    height: 60px;
    background-color: rgb(156, 53, 252);
    display: flex;
    padding: 10px 20px 10px 10px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;

}

.seach-header-left {
    width: 300px;
    padding: 8px 10px;
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    box-sizing: border-box;
    align-items: center;
}

.seach-header-right {
    color: #fff;
    margin-left: 10px;
}

.seach-icon {
    margin-right: 10px;
}

input {
    width: 250px;
    outline-style: none;
    background-color: transparent;
    border: none;
}

.recommend {
    width: 100%;
    padding: 10px 30px;
    box-sizing: border-box;
}

.recommend-title {
    color: #999;
    font-size: 15px;
}

.recommend-content {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
}

.recommend-content-item {
    margin: 0px 10px 10px;
    padding: 8px 10px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, .1);
}

.seach-result {
    width: 100%;
    padding: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    padding-bottom: 70px;
}

.seach-result-item {
    border-top: 1px solid #ddd;
    display: flex;
    padding: 6px 0px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}

.seach-result-item-img {
    width: 80px;
    height: 100px;
    border-radius: 8px;
    margin-right: 10px;
    box-shadow: 1px 2px 6px #ddd;
}

.seach-result-item-content {
    width: calc(100% - 100px);
    padding: 10px 0px;
    box-sizing: border-box;
}

.seach-result-item-title {
    font-size: 17px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.seach-result-item-author {
    font-size: 14px;
    color: #999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0px;
}

.author {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.isfinish {
    color: red;
}

.seach-result-item-type {
    font-size: 15px;
    color: #999;
}

.loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 12;
}

.seach-history {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.seach-history-content {
    display: flex;
    flex-wrap: wrap;
}

.title-icon {
    display: flex;
    justify-content: space-between;
}

.seach-history-item {
    padding: 6px 16px;
    border-radius: 999px;
    background-color: rgba(230, 230, 230, .8);
    color: #999;
    text-align: center;
    margin: 10px 20px;
    min-width: 30px;
}
</style>