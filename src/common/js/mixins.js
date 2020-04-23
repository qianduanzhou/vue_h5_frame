import { requestApi } from "@/request/request";
import getOpenId from "@/utils/getOpenId";

export const CheckLogin = {
  data() {
    return {
      openId: "",
      src_: "",
      key: "",
      gid: ""
    };
  },
  created() {
    console.log("minxi");
    this.gid = this.$route.params.gid;

    if (this.$route.params.key) {
      this.key = this.$route.params.key;
      localStorage.setItem("key", this.key);
    }

    this.openId = localStorage.getItem("newSystemOpenId") || "";
    if (localStorage.getItem("key") && !this.key) {
      this.key = localStorage.getItem("key");
    }
    if (this.$route.params.appid && this.openId) {
      this.src_ = this.$route.params.appid;
    } else {
      this.src_ = window.location.href;
    }
  },
  methods: {
    //  确认登录
    checkLogin() {
      return new Promise(async (resolve, reject) => {
        this.openId = localStorage.getItem("newSystemOpenId") || "";
        if (this.openId == "") {
          this.openId = await getOpenId();
        }
        return resolve(true);
      });
    },
    //  获取登录信息
    getLoginMsg() {
      return new Promise(async (resolve, reject) => {
        requestApi({
          name: "getLoginMsg",
          data: {
            openid: this.openId || (await getOpenId())
          }
        }).then(res => {
          if (res.code == 1) {
            sessionStorage.setItem("subscribe", res.data.subscribe);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    //  数据上报
    pushData(type) {
      let data = {
        openid: this.openId,
        gid: this.gid,
        type: type,
        key: this.key
      };
      console.log("pushData", data.openid);
      requestApi({
        name: "putData",
        data
      }).then(res => {
        console.log(res);
      });
    },
    //  数据上报
    putData(key, optype, src, op_ret, isTest) {
      this.sendkv({
        key: key,
        page_type: 1,
        page_path: window.location.href,
        item_id: this.gid,
        src_: src || this.src_,
        op_type: optype,
        source: this.key,
        op_ret: op_ret || 0,
        is_test: isTest || 0
      });
    }
  }
};
