<template>
    <div class="read-history">
        <div class="login-head-nav">
            <div class="login-return" @click="onClickLeft"><van-icon name="arrow-left" /></div>
            <div class="login-title">阅读历史</div>
            <div class="edit" v-show="(editShow == false)" @click="(editShow = !editShow)">编辑</div>
            <div class="edit" v-show="(editShow == true)" @click="(editShow = !editShow)">取消</div>
        </div>
        <div class="history-list">
            <div class="history-list-item" v-for="h in historyData" :key="h.id" @click="clickPassValue(h.id)">
                <img class="history-item-img" :src="h.img" alt="" />
                <div class="history-item-content">
                    <div class="history-item-title">{{ h.name }}</div>
                    <div class="history-item-finsh">{{ (h.isFinish == 0 ? '连载中' : '完结') }}</div>
                    <div class="history-item-name">{{ h.author }}</div>
                    <div class="history-item-char">更新：{{ h.upDate }}</div>
                </div>
                <div class="history-delete" v-show="editShow == true">
                    <div class="history-delete-icon" @click="clickHistory(h.id)">
                        <van-icon name="delete-o" size="30px" color="red" />
                    </div>

                </div>
            </div>

        </div>
        <Transition name="router">
        <CartoonDetailsPage v-if="showCartoonPage == true" @clickReturn="clickReturnHandel" />
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import type { readHistory } from "@/typings"
import { showToast } from 'vant';
import CartoonDetailsPage from "@/components/CartoonDetailsPage.vue";
import { useMainStore } from '@/stores/counter'
const mainStore = useMainStore()

const emit = defineEmits(["clickReturnRead"]);

const editShow = ref<boolean>(false)

const historyData = ref<Array<readHistory>>([])

onMounted(() => {
    getHistoryData()
})
const showCartoonPage = ref<boolean>(false)

function clickPassValue(id: number) {
    mainStore.routerCartoonPage(id)
    showCartoonPage.value = true;
}
const clickReturnHandel = (val: boolean) => {
    showCartoonPage.value = val;
};
// 历史
function getHistoryData() {

    let history: any = localStorage.getItem("history")
    historyData.value = JSON.parse(history)
}

function clickHistory(id: number) {

    let data: any = localStorage.getItem("history")
    let historyDatas: Array<readHistory> = JSON.parse(data)

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



// 返回
function onClickLeft() {
    emit("clickReturnRead", false);
}
</script>

<style scoped>
.read-history {
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
    justify-content: space-between;
    background-color: purple;
    color: #fff;
    font-size: 18px;
    padding: 0px 20px;
    box-sizing: border-box;
    z-index: 11;
}

.edit {
    font-size: 14px;
    color: #eee;
}

.history-list {
    width: 100%;
    padding-bottom: 50px;
    
   
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
</style>