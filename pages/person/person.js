// pages/person/person.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    userInfo: {},
    avatarUrl: "",
    nickName: ""
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
    })
  },

  //获取用户头像
  onChooseAvatar(e) {
    console.log(e);
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    });
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

  //跳转我的测评界面
  toMyEvaPage(){
    wx.navigateTo({
      url: '/pages/myTest/myTest',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  //跳转我的咨询界面
  toMyEnqPage(){
    wx.navigateTo({
      url: '/pages/myEnquiry/myEnquiry',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  //跳转咨询师认证界面
  toBeConPage(){
    wx.navigateTo({
      url: '/pages/toCertified/toCertified',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  //跳转我的文章界面
  toMyEssay(){
    wx.navigateTo({
      url: '/pages/myEssay/myEssay',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  //跳转个人信息界面
  toMysetPage(){
    wx.navigateTo({
      url: '/pages/mySetting/mySetting',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
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
    })
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