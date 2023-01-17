<template>
  <div class="user-page" :class="{ night: ifNightSwitch == true }">
    <div class="user-bg">
      <div class="userc-content">
        <div class="user-head-img">
          <img v-show="userXinXi?.img != ''" :src="ifLoginTrue == true ? userXinXi?.img : ''" alt="">
        </div>
        <div class="user-head-name">{{ ifLoginTrue == true && userXinXi ? userXinXi?.name : "路人甲" }}</div>
        <div class="user-head-introduce" v-show="(ifLoginTrue == false)" @click="(ifLogin = true)">点击此处登录/注册</div>
      </div>
      <div class="edit-icon" v-show="(ifLoginTrue == true)" @click="(routerEdit = true)"><van-icon name="edit"
          size="30px" color="#fff" /></div>
    </div>
    <div class="user-it" :class="{ night: ifNightSwitch == true }">
      <div class="user-it-item" @click="(routerRead = true)" :class="{ nightItem: ifNightSwitch == true }">
        <div class="item-left">阅读历史</div>
        <div class="item-right"><van-icon name="arrow" /></div>
      </div>
      <div class="user-it-item" :class="{ nightItem: ifNightSwitch == true }">
        <div class="item-left">夜间模式</div>
        <div class="item-right" @click="nightModel">
          <div class="switch-off" v-show="(ifNightSwitch == false)">
            <i class="fa fa-toggle-off" aria-hidden="true"></i>
          </div>
          <div class="switch-on" v-show="(ifNightSwitch == true)">
            <i class="fa fa-toggle-on" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <div class="user-it-item" :class="{ nightItem: ifNightSwitch == true }">
        <div class="item-left">仅在Wifi环境下下载</div>
        <div class="item-right" @click="(ifWifiSwitch = !ifWifiSwitch)">
          <div class="switch-off" v-show="(ifWifiSwitch == false)">
            <i class="fa fa-toggle-off" aria-hidden="true"></i>
          </div>
          <div class="switch-on" v-show="(ifWifiSwitch == true)">
            <i class="fa fa-toggle-on" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <div class="user-it-item" :class="{ nightItem: ifNightSwitch == true }">
        <div class="item-left">收藏更新</div>
        <div class="item-right" @click="(ifCollectSwitch = !ifCollectSwitch)">
          <div class="switch-off" v-show="(ifCollectSwitch == false)">
            <i class="fa fa-toggle-off" aria-hidden="true"></i>
          </div>
          <div class="switch-on" v-show="(ifCollectSwitch == true)">
            <i class="fa fa-toggle-on" aria-hidden="true"></i>
          </div>
        </div>
      </div>


      <div class="user-it-item" @click="clickUpdate" :class="{ nightItem: ifNightSwitch == true }">
        <div class="item-left">检查更新</div>
        <div class="item-right"><van-icon name="arrow" /></div>
      </div>
      <div class="user-it-item" @click="clickCancel" :class="{ nightItem: ifNightSwitch == true }">
        <div class="item-left">注销账号</div>
        <div class="item-right"><van-icon name="arrow" /></div>
      </div>
      <div class="login" v-show="(ifLoginTrue == false)" @click="clickRouterLogin"
        :class="{ nightItem: ifNightSwitch == true }">登录</div>
      <div class="login" v-show="(ifLoginTrue == true)" @click="loginOut" :class="{ nightItem: ifNightSwitch == true }">
        退出登录</div>
    </div>
    <Transition name="login">
      <LoginPageVue v-if="(ifLogin == true)" @clickReturn="clickReturnHandel" />
    </Transition>
    <Transition name="login">
      <EditUserData v-if="(routerEdit == true)" @clickEditReturn="clickEditReturn" />
    </Transition>
    <Transition name="login">
      <ReadHistory v-if="(routerRead == true)" @clickReturnRead="clickReturnRead" />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { showLoadingToast, showSuccessToast, showToast } from 'vant';
import LoginPageVue from "./LoginPage.vue";
import EditUserData from "./EditUserData.vue"
import ReadHistory from "../MyUser/ReadHistory.vue"


const router = useRouter()

// 判断
const ifWifiSwitch = ref<boolean>(false)
const ifCollectSwitch = ref<boolean>(false)
const ifNightSwitch = ref<boolean>(false)
const ifLogin = ref<boolean>(false)
const routerEdit = ref<boolean>(false)
const routerRead = ref<boolean>(false)
const ifLoginTrue = ref<boolean>(false)
const userXinXi = ref<any>()

onMounted(() => {
  let isData: any = localStorage.getItem("ifLogin")
  ifLoginTrue.value = JSON.parse(isData)

  let userData: any = localStorage.getItem("userData")
  userData = JSON.parse(userData)
  let nightModel: any = localStorage.getItem("nightModel")
  ifNightSwitch.value = JSON.parse(nightModel)

  let phone: any = localStorage.getItem("currentAccount")
  phone = JSON.parse(phone)
  if (userData) {

    if (userData.phoneNum == phone) {
      userXinXi.value = userData
      return
    }
 
    return
  }

  let isNight: any = localStorage.getItem("nightModel")
  ifNightSwitch.value = JSON.parse(isNight)
})

// 夜间模式
function nightModel() {
  ifNightSwitch.value = !ifNightSwitch.value
  localStorage.setItem("nightModel", JSON.stringify(ifNightSwitch.value))
}
// 检查更新
function clickUpdate() {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 1000,
    onClose: (() => {
      showToast('已是最新版本');
    })
  });

}
// 点击注销
const clickCancel = () => {
  if (ifLoginTrue.value != true) {
    console.log("未登录");
    return
  }
  let current: any = localStorage.getItem("currentAccount")
  current = JSON.parse(current)
  let userAccount: any = localStorage.getItem("userAccount")
  userAccount = JSON.parse(userAccount)
  var index = userAccount.findIndex((v: any) => {
    return v.mobileNum == current
  })
  console.log(index);
  userAccount.splice(index, 1)
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    onClose: (() => {
      ifLoginTrue.value = false
      localStorage.setItem("userAccount", JSON.stringify(userAccount))
      localStorage.setItem("currentAccount", JSON.stringify(''))
      showSuccessToast({
        message: '已注销当前账号',
        forbidClick: true,
        onClose: (() => {
        })
      });
    })
  });


}

// 跳转
function clickRouterLogin() {
  ifLogin.value = true
}


// 退出登录
function loginOut() {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    onClose: (() => {
      ifLoginTrue.value = false
      localStorage.setItem("ifLogin", JSON.stringify(ifLoginTrue.value))
      showSuccessToast({
        message: '已退出登录',
        forbidClick: true,
        onClose: (() => {
        })
      });
    })
  });

}

//返回
const clickReturnHandel = (val: boolean) => {
  ifLogin.value = val;
};

const clickEditReturn = (val: boolean) => {
  routerEdit.value = val;
};
const clickReturnRead = (val: boolean) => {
  routerRead.value = val;
};



components: {
  LoginPageVue
  EditUserData
  ReadHistory
}
</script>

<style scoped>
.user-page {
  width: 100%;
  height: 100vh;
  padding-bottom: 50px;
  box-sizing: border-box;
  overflow: hidden;
}

.user-bg {
  width: 100%;
  height: 300px;
  position: relative;
  background-image: url("../../assets/images/q1.png");
  background-size: cover;
  background-repeat: no-repeat;
}

.edit-icon {
  position: absolute;
  top: 20px;
  right: 20px;
}

.userc-content {
  width: 120px;
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
}

.user-head-img {
  margin: 0 auto;
  width: 80px;
  height: 80px;
  border-radius: 999px;
  border: 1px solid #fff;
  background-image: url("../../assets/images/Lp.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #fff;
  overflow: hidden;
}

.user-head-img>img {
  width: 100%;
  height: 100%;
  display: block;

}

.user-head-name {
  margin: 15px 0px 8px;
  font-size: 18px;
  color: #fff;
}

.user-head-introduce {
  font-size: 14px;
  color: #ddd;
}

.user-it {
  width: 100%;
  height: calc(100vh - 300px);
  background-color: rgb(247, 243, 243);
  padding: 10px;
  padding-bottom: 50px;
  box-sizing: border-box;
  overflow: auto;
}

.user-it-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  border-bottom: 1px solid #ddd;
  box-shadow: 1px 2px 6px #eee;
  margin-top: 10px;
}

.switch-off {
  font-size: 24px;
}

.switch-on {
  font-size: 24px;
  color: purple;
}

.login {
  width: 95%;
  padding: 10px 0px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 1px 2px 6px #eee;
  border-radius: 999px;
  background-color: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
}

.login:hover {
  background-color: greenyellow;
  color: #fff;
}

.login-enter-from,
.login-leave-to {
  transform: translateX(100%);
}

.login-enter-active,
.login-leave-active {
  transition: all 0.3s ease-out;
}

.login-enter-to,
.login-leave-from {
  transform: translateX(0);
}
</style>