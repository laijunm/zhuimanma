<template>
    <div class="edit-page" :class="{ night: ifNightSwitch == true }">
        <div class="login-head-nav">
            <div class="login-return" @click="onClickLeft"><van-icon name="arrow-left" /></div>
            <div class="login-title">个人资料</div>
            <div class="submit" @click="clickSubmit">保存</div>
        </div>
        <div class="user-data" :class="{ nightItem: ifNightSwitch == true }">
            <div class="user-data-item">
                <div class="user-data-item-img"
                    :style="{ backgroundImage: `url(${userObj?.img != undefined ? userObj?.img : '../src/assets/images/Lp.png'})` }">
                    <img v-show="(img != undefined)" :src="img" alt="">
                </div>
                <div class="user-data-item-right item-teshu">
                    <div class="van-up"><van-uploader :after-read="afterRead" preview-size="40px" /></div>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="user-data-item">
                <div class="user-data-item-text">昵称</div>
                <div class="user-data-item-right">
                    <input type="text" v-model="nameValue" :placeholder="userObj?.name || account">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="user-data-item">
                <div class="user-data-item-text">个性签名</div>
                <div class="user-data-item-right">
                    <input type="text" v-model="introduceValue" :placeholder="userObj?.introduce || ''">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="user-data-item">
                <div class="user-data-item-text">性别</div>
                <div class="user-data-item-right" @click="sexShow = !sexShow">
                    {{ (sexSelext == false ? '男' : '女') }}


                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="user-data-item">
                <div class="user-data-item-text">生日</div>
                <div class="user-data-item-right" @click="(show = !show)">
                    {{ dateData == '' ? userObj?.birthday : dateData }}

                    <van-icon name="arrow" />
                </div>
            </div>

        </div>
        <van-popup v-model:show="show" position="bottom" :style="{ height: '30%' }">
            <van-date-picker v-model="currentDate" title="选择日期" :min-date="minDate" :max-date="maxDate"
                @confirm="dateChange" @cancel="(show = false)" />
        </van-popup>
        <van-popup v-model:show="sexShow" position="bottom" :style="{ height: '10.7%' }">
            <div class="select-sex">
                <div class="sex nan" :class="{ sexselect: sexSelext == false }" @click="clickSexToggle">男</div>
                <div class="sex" :class="{ sexselect: sexSelext == true }" @click="clickSexToggle">女</div>
            </div>
        </van-popup>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { showToast, showLoadingToast, showSuccessToast } from 'vant';
import type { userDataNews, userDataType } from "../../typings"

const emit = defineEmits(["clickEditReturn"]);
const router = useRouter()

const img = ref()
const nameValue = ref<string>()
const introduceValue = ref<string>()
const account = ref<string>()
const currentDate = ref(['2021', '01', '01']);
const minDate = ref<any>(new Date(1970, 1, 1))
const maxDate = ref<any>(new Date())
const userObj = ref<userDataNews>()
const ifNightSwitch = ref<boolean>(false)

// 日期选择
const show = ref<boolean>(false)
const dateData = ref<any>()
//性别选择
const sexShow = ref<boolean>(false)
const sexSelext = ref<boolean>(false)

onMounted(() => {
    let userData: any = localStorage.getItem("currentAccount")
    account.value = JSON.parse(userData)

    let data: any = localStorage.getItem("userData")
    data = JSON.parse(data)
    let phone: any = localStorage.getItem("currentAccount")
    phone = JSON.parse(phone)
    if (data) {

        if (data.phoneNum == phone) {
            userObj.value = data
            return
        }

        return
    }

    let isNight: any = localStorage.getItem("nightModel")
    ifNightSwitch.value = JSON.parse(isNight)

    sexSelext.value = userObj.value?.gender as boolean
    dateData.value = userObj.value?.birthday
})


function dateChange(e: any) {
    dateData.value = `${e.selectedOptions[0].value}-${e.selectedOptions[1].value}-${e.selectedOptions[2].value}`
    show.value = false
}

function clickSexToggle() {
    sexSelext.value = !sexSelext.value
    sexShow.value = !sexShow.value
}


// 提交修改后的资料

function clickSubmit() {

    let userXinxi: any = localStorage.getItem("userData")
    userXinxi = JSON.parse(userXinxi)
    let phone: any = localStorage.getItem("currentAccount")
    phone = JSON.parse(phone)

    if (userXinxi) {


        let userObj = {
            img: img.value == undefined ? userXinxi.img : img.value,
            name: nameValue.value == undefined ? userXinxi.name : nameValue.value,
            introduce: introduceValue.value == undefined ? userXinxi.introduce : introduceValue.value,
            birthday: dateData.value == undefined ? userXinxi.birthday : dateData.value,
            gender: sexSelext.value,
            phoneNum: phone
        }



        showLoadingToast({
            message: '加载中...',
            forbidClick: true,
            duration: 1000,
            onClose: (() => {
                localStorage.setItem("userData", JSON.stringify(userObj))
                showSuccessToast({
                    message: '保存成功',
                    duration: 1000,
                    forbidClick: true,
                    onClose: (() => {
                        onClickLeft()
                        location.reload()
                    })
                });
            })
        });

    }






}

const afterRead = (file: any) => {
    // 此时可以自行将文件上传至服务器
    img.value = file.content
}

function onClickLeft() {
    emit("clickEditReturn", false);
}
</script>

<style scoped>
.edit-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgb(235, 235, 233);
    z-index: 12;
}

input {
    width: 150px;
    outline-style: none;
    background-color: transparent;
    border: none;
    text-align: right;
}

.login-head-nav {
    width: 100vw;
    height: 45px;
    padding: 0px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: purple;
    color: #fff;
    font-size: 18px;
    box-sizing: border-box;
}

/* .login-return {
    position: absolute;
    left: 10px;
} */

.submit {
    font-size: 14px;
}

.user-data {
    width: 100%;
    background-color: #fff;
    padding-left: 10px;
    margin-top: 10px;
    box-sizing: border-box;
}

.user-data-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;

}

.item-teshu {
    display: flex;
    align-items: center;

}

.van-up {
    transform: translateY(4px);
}

.user-data-item-img {
    width: 40px;
    height: 40px;
    box-shadow: 1px 2px 6px #eee;
    border-radius: 999px;
    background-size: cover;
    background-repeat: no-repeat;
}

.user-data-item-img>img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 999px;
}

.user-data-item-right {
    font-size: 14px;
    color: #999;
}

.sheng-ri {
    display: flex;

}

.select-sex {
    width: 100%;
    height: 100%;
}

.sex {
    width: 100%;
    padding: 10px 0px;
    text-align: center;

}

.nan {
    border-bottom: 1px solid #eee;
}

.sexselect {
    background-color: aqua;
    color: #eee;
    font-size: 18px;
    font-weight: bold;
}
</style>