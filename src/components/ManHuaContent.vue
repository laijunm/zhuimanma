<template>
    <div class="man-hua" :class="{ nightDetails: nightModel == true }" @click="clickOffNo">

        <img :src="imgString" alt="">
        <div class="bg" v-for="u in urlString"><img :src="u.path"></div>

        <van-popup v-model:show="show" position="top" :style="{ height: '6%', backgroundColor: 'rgba(0,0,0,.5)' }"
            :overlay="false" z-index="3">
            <div class="header-box">
                <div class="header-box-left" @click="clickReturn"><van-icon name="arrow-left" size="22px" /></div>
                <div class="header-box-center">{{ titleString == undefined ? manHua[index]?.title : titleString }}</div>
            </div>
        </van-popup>
        <van-popup v-model:show="show" position="bottom" :style="{ height: '10%', backgroundColor: 'rgba(0,0,0,.5)' }"
            :overlay="false" z-index="3">
            <div class="bottom-box">
                <div class="bottom-box-up">
                    <div class="bottom-box-up-item" @click="upOneWord"><van-icon name="arrow-left" /> 上一话</div>
                    <div class="bottom-box-up-item" @click="downOneWord">下一话 <van-icon name="arrow" /></div>
                </div>
                <div class="bottom-box-bot">
                    <div class="bottom-box-bot-item" @click.stop="(charShow = !charShow)"><van-icon name="bars" /> 目录
                    </div>
                    <div class="bottom-box-bot-item" @click.stop="clickNight">
                        <div class="night-model moon" v-show="(nightModel == true)"><i class="fa fa-moon-o"
                                aria-hidden="true"> 夜间模式</i></div>
                        <div class="night-model sun" v-show="(nightModel == false || nightModel == undefined)"><i
                                class="fa fa-sun-o" aria-hidden="true"> 日间模式</i></div>
                    </div>
                </div>
            </div>
        </van-popup>
        <van-popup v-model:show="charShow" position="left"
            :style="{ width: '80%', height: '100%', backgroundColor: 'rgba(0,0,0,.8)' }" z-index="4" :overlay="false">
            <div class="catalogue">
                <div class="header-cata">
                    <div class="header-cata-left">{{ (isFinish == 0 ? '连载中' : '已完结') }}</div>
                    <div class="header-cata-right" v-show="(ifFinish == false)" @click.stop="clickToggleSort"><van-icon
                            name="descending" />降序</div>
                    <div class="header-cata-right" v-show="(ifFinish == true)" @click.stop="clickToggleSort"><van-icon
                            name="ascending" />升序</div>
                </div>
                <div class="catalogue-item" :class="{ active: itemIndex == index }" v-for="m, index in arrList"
                    :key="m.id" @click="clickChap(m.id, m.title)">
                    <img class="catalogue-item-img" :src="m.cover" alt="">
                    <div class="catalogue-item-content">
                        <div class="chapters">{{ m.short_title }}</div>
                        <div class="introduce">{{ m.title }}</div>
                        <div class="uptime">{{ m.pub_time }}{{ index }}</div>
                    </div>
                </div>
            </div>
        </van-popup>
        <div class="loading" v-show="(showPopup == true)"><van-loading size="80px"
                text-color="skybule">加载中...</van-loading></div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { Api } from "@/apis";
import { showToast } from 'vant';


const emit = defineEmits(["clickReturn"]);
const { id, num } = defineProps({
    id: {
        type: Number
    },
    num: {
        type: Number
    }
})

const show = ref<boolean>(false)
const nightModel = ref<boolean>(false)
const charShow = ref<boolean>(false)
const manHua = ref<any>()
const index = ref<number>(0)

const urlString = ref<any>([])
// const urlStringList = ref<any>([])
const titleString = ref<string>()
const imgString = ref<string>()
const newNum = ref(num)
const itemIndex = ref<number>(0)
const ifFinish = ref<boolean>(false)
const showPopup = ref<boolean>(false)
const isFinish = ref<number>()
const arrList = ref<any>()
// const numIndex = ref<number>(0)
const numIdArr = ref<Array<{ id: number | undefined, chapId: number | undefined }>>([])



onMounted(() => {
    let ifNight: any = localStorage.getItem("detailsNightModel")
    nightModel.value = JSON.parse(ifNight)
    let idVa: any = localStorage.getItem("bookId")
    idVa = JSON.parse(idVa)
    showPopup.value = true

    historyReadRate()
    getManHuaOne(idVa)
    getHistoryRead()

})

const clickOffNo = () => {
    show.value = !show.value
    charShow.value = false
}

const clickNight = () => {
    nightModel.value = !nightModel.value
    localStorage.setItem("detailsNightModel", JSON.stringify(nightModel.value))
}


const clickChap = (id: number, tit: string) => {

    titleString.value = tit
    newNum.value = id
    showPopup.value = true

    getManHuaTwo(id)
    getHistoryRead()
}

//获取历史阅读进度
const historyReadRate = () => {
    let arr: any = localStorage.getItem("historyRead")
    let arrList: Array<{ id: number, chapId: number }> = JSON.parse(arr)
    if (arrList) {
        let isExist = arrList.map<boolean>(item => item.id == id)
        let isTrue = isExist.filter(i => i)


        if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
            var index = arrList.findIndex((v) => {
                return v.id == id
            })
            newNum.value = arrList[index].chapId
            return
        }
    }
}

// 获取漫画章节内容
const getManHuaOne = async (val: any) => {
    let data: any = await Api.getManHuaOne(val)

    manHua.value = data.data.ep_list
    isFinish.value = data.data.is_finish
    arrList.value = data.data.ep_list
    localStorage.setItem("cataList", JSON.stringify(arrList.value))
    if (num != undefined) {
        let numbervalue = num
        getManHuaTwo(numbervalue)
        return
    }
    getManHuaTwo(data.data.ep_list[0].id)
}

const getManHuaTwo = async (id: any) => {
    let { data }: any = await Api.getManHuaTwo(id)


    for (let i = 0; i < data.images.length; i++) {
        getManHuaThree(data.images[i].path)
    }
    var index = manHua.value.findIndex((item: any) => {
        return item.id == newNum.value
    })

    itemIndex.value = index == -1 ? 0 : index


    titleString.value = manHua.value[index]?.title

}
const getManHuaThree = async (url: any) => {
    urlString.value = []
    let { data }: any = await Api.getManHuaThree(url)

    let obj: any = {
        // path: `https://manga.hdslb.com/bfs/manga/00a51ace92423b516f31ed6c697c1cccf423fbf6.jpg?token=00e4123f34d6ef834da28c1e75336393&ts=639a9c06`
        path: `https://manga.hdslb.com${url}?token=${data[0].token}`

    }
    urlString.value?.push(obj)
    imgString.value = manHua.value[itemIndex.value].cover
    console.log(urlString.value);

    showPopup.value = false
    // getNumList()
}

const upOneWord = () => {
    showPopup.value = true
    var index = manHua.value.findIndex((item: any) => {
        return item.id == newNum.value
    })
    if (manHua.value[index - 1] == undefined) {
        showToast("已经到顶了...")
        showPopup.value = false
        return
    }
    urlString.value = []
    getManHuaTwo(manHua.value[index - 1].id)
    titleString.value = manHua.value[index - 1].title
    newNum.value = manHua.value[index - 1].id
    getHistoryRead()
}
const downOneWord = () => {
    showPopup.value = true
    var index = manHua.value.findIndex((item: any) => {
        return item.id == newNum.value
    })

    if (manHua.value[index + 1] == undefined) {
        showToast("已经没有了...")
        showPopup.value = false
        return
    }

    urlString.value = []
    getManHuaTwo(manHua.value[index + 1].id)
    titleString.value = manHua.value[index + 1].title
    newNum.value = manHua.value[index + 1].id
    getHistoryRead()
}

const clickToggleSort = () => {
    ifFinish.value = !ifFinish.value
    if (ifFinish.value == true) {
        arrList.value.sort((a: any, b: any): any => {
            return a.ord - b.ord
        })
        return
    }

    let arr: any = localStorage.getItem("cataList")
    arrList.value = JSON.parse(arr)

}

const getHistoryRead = () => {

    if (id && newNum.value) {
        let objRead: { id: number, chapId: number } = {
            id: id,
            chapId: newNum.value
        }

        let arr: any = localStorage.getItem("historyRead")
        let arrList: Array<{ id: number, chapId: number }> = JSON.parse(arr)
        if (arrList) {
            let isExist = arrList.map<boolean>(item => item.id == id)
            let isTrue = isExist.filter(i => i)


            if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
                var index = arrList.findIndex((v) => {
                    return v.id == id
                })
                arrList[index].chapId = newNum.value
                localStorage.setItem("historyRead", JSON.stringify(arrList))

                return
            }
            arrList.push(objRead)

            localStorage.setItem("historyRead", JSON.stringify(arrList))
            return
        }
        numIdArr.value?.push(objRead)
        localStorage.setItem("historyRead", JSON.stringify(numIdArr.value))
    }
}

// const getScrollBottom = (e: any) => {


//     if (e.target.scrollHeight - e.target.scrollTop < 820) {

//         for (let u = numIndex.value; u < urlString.value.length; u++) {
//             if (u != numIndex.value) {
//                 urlStringList.value.push(urlString.value[u])
//                 console.log(urlStringList.value);
//                 numIndex.value = numIndex.value + 10
//             }
//         }
//     }

// }


const clickReturn = () => {
    emit("clickReturn", false);
}
</script>

<style scoped>
.man-hua {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 12;
    width: 100%;
    height: 100vh;
    background-color: #fff;
    overflow: auto;
}

.header-box {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
}

.header-box-left {
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
}

img {
    width: 100%;
    display: block;
}

.bg {
    width: 100%;
    min-height: 230px;
    background-image: url("@/assets/images/dh.png");
    background-size: cover;
    background-repeat: no-repeat;

}

.bottom-box {
    width: 100%;
    height: 100%;
}

.bottom-box-up {
    border-bottom: 1px solid #ddd;
}

.bottom-box-up {
    height: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 30px;
    box-sizing: border-box;
}

.bottom-box-bot {
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.bottom-box-up-item,
.night-model,
.bottom-box-bot-item {
    padding: 10px 0px;
    color: #fff;
}

.catalogue {
    width: 100%;
}

.catalogue-item {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    color: #fff;
}

.catalogue-item-img {
    width: 120px;
    height: 100px;
    display: block;
    margin-right: 10px;
}

.catalogue-item-content {
    width: calc(100% - 130px);
    padding: 10px 0px;
    border-bottom: 1px solid #fff;

}

.chapters,
.uptime {

    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.introduce {

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 10px 0px 12px;
}

.nightDetails {
    background-color: black !important;
    color: #ddd !important;
}

.active {
    border: 1px solid rgb(17, 251, 5);
    color: rgb(17, 251, 5) !important;
    box-sizing: border-box;
}

.header-cata {
    position: sticky;
    left: 0;
    top: 0;
    display: flex;
    justify-content: space-between;
    padding: 0px 20px;
    color: #fff;
    align-items: center;
    margin: 20px 0px;
    background-color: rgb(31, 31, 31);
}

.header-cata-left {
    padding: 10px 20px;
    border-radius: 999px;
    background-color: rgb(153, 57, 243);
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