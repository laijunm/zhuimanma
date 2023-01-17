<template>
  <div class="register-page">
    <div class="head-nav">
      <div class="return" @click="onClickLeft"><van-icon name="arrow-left" /></div>
      <div class="title">手机注册</div>
    </div>
    <div class="phone-and-verification">
      <div class="phone-type">
        <div class="type-number">+86</div>
        <input class="phone-input" type="number" oninput="if(value.length>11)value=value.slice(0,11)"
          placeholder="输入手机号码" v-model="phoneNum">
      </div>
      <div class="verification">
        <input class="verification-input" type="text" placeholder="输入验证码" v-model="replaceNumVer">
        <div class="get-verification" :class="{ ver: replaceTotalTime >= 10 }" @click="getReplaceVerification">{{
            replaceContent
        }}</div>
      </div>
    </div>
    <div class="verification-mobile" @click="clickBtn">验证手机</div>
    <div class="read-agree">
      <span class="read-agree-check" v-show="(isCheck == false)" @click="(isCheck = !isCheck)"><i class="fa fa-square-o"
          aria-hidden="true"></i></span>
      <span class="read-agree-check" style="color:red" v-show="(isCheck == true)" @click="(isCheck = !isCheck)"><i
          class="fa fa-check-square" aria-hidden="true"></i></span>
      <span class="read-agree-content">我已阅读并同意<span>《追漫吗用户协议》</span><span>《隐私协议》</span></span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { showToast, showDialog, showLoadingToast, showSuccessToast } from 'vant';
import type { userDataType } from "../../typings"


const emit = defineEmits(["clickReturn"]);
const isCheck = ref<boolean>(false)
const phoneNum = ref<string>()
const replaceTotalTime = ref<number>(10)
const verNum = ref<string>()
const replaceNumVer = ref<string>()
const replaceContent = ref<string>('获取验证码')
const accountArr = ref<Array<userDataType>>()

const router = useRouter()



onMounted(() => {



})


function clickBtn() {

  accountArr.value = []

  if (isCheck.value != true) {
    showToast('请阅读并勾选用户协议和隐私政策');
    return
  }
  if (phoneNum.value == null) {
    showToast('请输入手机号码');
    return
  }

  if (replaceNumVer.value == undefined || replaceNumVer.value != verNum.value) {
    showToast('验证码错误');
    return
  }

  let regMobile = /^1[3|4|5|7|8][0-9]{9}$/;
  if (regMobile.test(phoneNum.value) !== true) {
    showToast('手机号格式错误');
    return;
  }

  let account: userDataType = {
    mobileNum: phoneNum.value,
    pass: 123456
  }

  let data: any = localStorage.getItem("userAccount")
  let userAccountList: Array<userDataType> = JSON.parse(data)

  if (userAccountList) {
    let isExist = userAccountList.map<boolean>(item => item.mobileNum == account.mobileNum)
    let isTrue = isExist.filter(i => i)
    if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
      showToast({
        message: '账号已存在',
        wordBreak: 'break-word',
      });
      return
    }

    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      onClose: (() => {
        userAccountList.push(account)
        localStorage.setItem("ifLogin", JSON.stringify(true))
        localStorage.setItem("userAccount", JSON.stringify(userAccountList))
        localStorage.setItem("currentAccount",JSON.stringify(phoneNum.value))
        showSuccessToast({
          message: '注册成功',
          forbidClick: true,
          onClose: (() => {
            router.push("/")
          })
        });
      })
    });
    return
  }
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    onClose: (() => {
      accountArr.value?.push(account)
      localStorage.setItem("ifLogin", JSON.stringify(true))
      localStorage.setItem("userAccount", JSON.stringify(accountArr.value))
      localStorage.setItem("currentAccount",JSON.stringify(phoneNum.value))
      showSuccessToast({
        message: '注册成功',
        forbidClick: true,
        onClose: (() => {
          router.push("/")
        })
      });
    })
  });

}

// 验证码
function getReplaceVerification() {
  if (replaceTotalTime.value < 10) {
    return;
  }
  showToast({
    message: '验证码已发送',
    wordBreak: 'break-word',
    duration: 800
  });
  let num = "";
  for (let i = 0; i < 6; i++) {
    let numVerifi = Math.floor(Math.random() * 10);
    num += numVerifi;
  }
  verNum.value = num
  getReplaceVerificationTime();

  setTimeout(() => {
    showDialog({
      message: `您本次的验证码为${num}`,
    }).then(() => {
      replaceNumVer.value = num;
    });
  }, 1000)





}
// 获取验证码倒计时
function getReplaceVerificationTime() {
  let getTime = window.setInterval(() => {
    replaceContent.value = replaceTotalTime.value + "s后再次发送";
    replaceTotalTime.value--;
    if (replaceTotalTime.value == 0) {
      replaceTotalTime.value = 10;
      replaceContent.value = "获取验证码";
      window.clearInterval(getTime);
    }
  }, 1000);
}

function onClickLeft() {
  emit("clickReturn", false);
}
</script>

<style scoped>
.register-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgb(255, 254, 250);
  z-index: 11;
}

.head-nav {
  width: 100vw;
  height: 45px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: purple;
  color: #fff;
  font-size: 18px;
}

.return {
  position: absolute;
  left: 10px;
}

.phone-and-verification {
  padding: 10px;
  box-sizing: border-box;
}

.phone-type,
.verification {
  display: flex;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 1px 2px 6px #ddd;
  padding: 10px;
  margin: 10px 0px;
}

input {
  outline-style: none;
  border: none;
  background-color: transparent;
}

.type-number {
  margin-right: 20px;
  margin-left: 10px;
}

.phone-input {
  border-left: 1px solid #ddd;
  width: calc(100% - 28px);
  padding-left: 10px;
}

.verification-input {
  padding-left: 10px;
  border-right: 1px solid #ddd;
}

.get-verification {
  margin-left: 20px;
  text-align: center;
  color: #999;
}

.ver {
  color: red;
}

.verification-mobile {
  text-align: center;
  width: 95%;
  padding: 10px 0px;
  background-color: #bbb;
  color: #fff;
  border-radius: 6px;
  margin: 0 auto 15px;
  box-shadow: 1px 2px 6px #ddd;
}

.read-agree-content {
  margin-left: 6px;
  color: #999;
  font-size: 14px;
}

.read-agree {
  line-height: 19px;
  padding: 0px 10px;
}

.read-agree-content>span {
  color: rgba(0, 187, 255, 0.866);
}

.read-agree-check {
  width: 16px;
  font-size: 18px;
  transform: translateY(2px);
  display: inline-block;
}
</style>