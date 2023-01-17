<template>
  <div class="login-page">
    <div class="login-head-nav">
      <div class="login-return" @click="onClickLeft"><van-icon name="arrow-left" /></div>
      <div class="login-title">登录</div>
    </div>
    <div class="login-main">
      <div class="mobile-password">
        <div class="icon"><i class="fa fa-user-o" aria-hidden="true"></i></div>
        <input type="number" placeholder="请输入手机号码" v-model="phoneNum" />
      </div>
      <div class="mobile-password" v-show="(isVerPass == true)">
        <div class="icon">
          <i class="fa fa-unlock-alt" aria-hidden="true"></i>
        </div>
        <input type="password" placeholder="请输入密码" v-model="getVerNum" />
      </div>
      <div class="mobile-password" v-show="(isVerPass == false)">
        <input type="number" placeholder="请输入验证码" v-model="getVerNum" />
        <div class="get-verification" :class="{ ver: replaceTotalTime >= 10 }" @click="getReplaceVerification">{{
            replaceContent
        }}</div>
      </div>

      <div class="login-text" @click="getInputValue">登录</div>
      <div class="forget-register">
        <div class="forget" v-show="(isVerPass == true)" @click="(isVerPass = !isVerPass)">验证码登录</div>
        <div class="forget" v-show="(isVerPass == false)" @click="(isVerPass = !isVerPass)">密码登录</div>
        <div class="register" @click="(isRegfister = true)">注册账号</div>
      </div>

    </div>
    <Transition name="register">
      <RegisterPage v-if="(isRegfister == true)" @clickReturn="clickReturnHandel" />
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import RegisterPage from "./RegisterPage.vue";
import { useRouter } from "vue-router"
import { showToast, showDialog, showLoadingToast, showSuccessToast } from 'vant';
import type { userDataType } from "../../typings"

const emit = defineEmits(["clickReturn"]);
const router = useRouter()
const isRegfister = ref<boolean>(false)
//验证码
const replaceTotalTime = ref<number>(10)
const verNum = ref<string>()
const replaceContent = ref<string>('获取验证码')
//显示隐藏
const isVerPass = ref<boolean>(false)
//输入框取值
const phoneNum = ref<string>()
const getVerNum = ref<number | string>()
//是否登录
const ifLogin = ref<boolean>()


function getInputValue() {
  if (phoneNum.value == null) {
    showToast('请输入手机号码');
    return
  }

  if(isVerPass.value == false) {
   if (getVerNum.value == undefined || getVerNum.value != verNum.value) {
    showToast('验证码错误');
    return
  } 
  }
  

  let regMobile = /^1[3|4|5|7|8][0-9]{9}$/;
  if (regMobile.test(phoneNum.value) !== true) {
    showToast('手机号格式错误');
    return;
  }


  let userData: any = localStorage.getItem("userAccount")
  let userAccountList: Array<userDataType> = JSON.parse(userData)

  if (userAccountList) {

    if (isVerPass.value == false) {
      let isExist = userAccountList.map<boolean>(item => item.mobileNum == phoneNum.value)
      let isTrue = isExist.filter(i => i)
      if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
        showLoadingToast({
          message: '加载中...',
          forbidClick: true,
          onClose: (() => {
            ifLogin.value = true
            localStorage.setItem("ifLogin", JSON.stringify(ifLogin.value))
            localStorage.setItem("currentAccount",JSON.stringify(phoneNum.value))
            phoneNum.value = ''
            getVerNum.value = undefined
            showSuccessToast({
              message: '登录成功',
              forbidClick: true,
              onClose: (() => {
                router.push("/")
              })
            });
          })
        });
        return
      }
      showToast({
        message: '账户不存在',
        wordBreak: 'break-word',

      });
      return
    } else if (isVerPass.value == true) {
      let isExist = userAccountList.map<boolean>(item => item.mobileNum == phoneNum.value && item.pass == getVerNum.value)
      let isTrue = isExist.filter(i => i)
      if (isTrue.length > 0 && isTrue.indexOf(false) == -1) {
        showLoadingToast({
          message: '加载中...',
          forbidClick: true,
          onClose: (() => {
            phoneNum.value = ''
            getVerNum.value = undefined
            ifLogin.value = true
            localStorage.setItem("ifLogin", JSON.stringify(ifLogin.value))
            showSuccessToast({
              message: '登录成功',
              forbidClick: true,
              onClose: (() => {
                router.push("/")
              })
            });
          })
        });
        return
      }
      showToast({
        message: '账户不存在',
        wordBreak: 'break-word',

      });
      return
    }
    return
  }


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
      getVerNum.value = num;
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

//注册页面返回
const clickReturnHandel = (val: boolean) => {
  isRegfister.value = val;
};
</script>

<style scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgb(255, 254, 250);
  z-index: 11;
}

.login-head-nav {
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

.login-return {
  position: absolute;
  left: 10px;
}

.login-main {
  padding: 0px 10px;
  box-sizing: border-box;
}

.mobile-password {
  height: 50px;
  align-items: center;
  padding: 0px 10px;
  border-radius: 8px;
  display: flex;
  border: 1px solid #ddd;
  margin: 10px;
  box-shadow: 1px 2px 6px #eee;
}

.icon {
  width: 20px;
  border-right: 1px solid #ddd;
}

input {
  outline-style: none;
  border: none;
  background-color: transparent;
  padding-left: 10px;
}

.login-text {
  width: 95%;
  padding: 12px 0px;
  background-color: #aaa;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  margin: 20px auto 10px;
}

.forget-register {
  width: 95%;
  font-size: 14px;
  color: #888;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}

.register-enter-from,
.register-leave-to {
  transform: translateX(100%);
}

.register-enter-active,
.register-leave-active {
  transition: all 0.3s ease-out;
}

.register-enter-to,
.register-leave-from {
  transform: translateX(0);
}

.get-verification {
  margin-left: 10px;
  font-size: 14px;
  text-align: center;
  color: #999;
}

.ver {
  color: red;
}
</style>