// pages/mySetting/mySetting.js
import { request, uploadFile } from "../../utils/request";
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    userInfo: {},
    avatarUrl: "",
    nickName: "",
    userIntro: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断是否有用户数据，没有跳转登录
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.redirectTo({
        url: '/pages/login/login'
      });
    };
    this.setData({
      userInfo,
      avatarUrl: this.data.url + userInfo.headImg,
      nickName: userInfo.nickname,
      userIntro: userInfo.userIntro
    })
  },

  //获取用户头像
  onChooseAvatar(e) {
    console.log(e);
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    });
    this.changeUserImg();

  },

  //获取用户昵称
  checkNickname(e){
    let nickname = e.detail.value;
    if(nickname.trim()){
      this.setData({
        nickName: nickname
      })
    }
  },
  
  //修改用户头像
  changeUserImg(){
    this.changeUser("img");
  },

  //修改用户昵称
  changeNickname(e){
    console.log(e);
    if(e.detail.cursor == 0){
      wx.showToast({
        title: '昵称不能为空！',
        icon: 'none',
        duration: 1500,
        mask: false,
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
      this.setData({
        nickName : this.data.userInfo.nickname
      })
      return;
    };
    this.setData({
      nickName: e.detail.value
    });
    this.changeUser();
  },

  //修改用户个签
  changeUserIntro(e){
    console.log(e);
    if(e.detail.cursor == 0){
      this.setData({
        userIntro : this.data.userInfo.userIntro
      })
      return;
    };
    this.setData({
      userIntro: e.detail.value
    });
    this.changeUser();
  },

  //修改用户信息方法
  changeUser(type = "text"){
    if(type == "img"){
      //上传头像
      uploadFile({
        url: '/sys/fileUpload',
        filePath: this.data.avatarUrl,
        name: "file",
        method: "POST",
        formData:{
          "type": "head_img"
        }
      }).then(res => {
        //请求更新
        console.log(res);
        this.updateUser(JSON.parse(res.data).data);
      });
    }else{
      this.updateUser();
    }
  },

  //更新用户信息请求
  updateUser(newImg = this.data.headImg){
    request({
      url:"/user/editUserById",
      data:{
        headImg: newImg,
        nickname: this.data.nickName,
        userIntro: this.data.userIntro,
        id: this.data.userInfo.id
      },
      method: "POST"
    }).then(res => {
      if(res.data.code == 200){
        //更新用户信息
        console.log(res);
        let userInfo = res.data.data;
        wx.setStorageSync("userInfo", userInfo);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})