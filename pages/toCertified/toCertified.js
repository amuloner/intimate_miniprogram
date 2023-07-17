// pages/toCertified/toCertified.js
import { request, uploadFile } from "../../utils/request";
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    userInfo: {},
    step: 1, //步骤
    form: {},
    tempFile: {}
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
      userInfo
    })
  },

  //文件选择
  chooseFile(){
    let that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['docx','doc','pdf'],
      success (res) {
        const tempFile = res.tempFiles[0];
        that.setData({
          tempFile
        })
      }
    })
  },

  //信息表单验证处理
  formSubmit(e){
    console.log(e.detail.value);
    let {value} = e.detail;
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    //简单验证
    if(!this.data.tempFile.name){
      wx.showToast({
        title: '请添加认证材料',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return;
    }
    for (const key in value) {
      if (Object.hasOwnProperty.call(value, key)) {
        const element = value[key];
        if(!element.trim()){
          wx.showToast({
            title: `${key}不能为空！`,
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          return;
        }
        if(key == "idCard" && reg.test(element) === false){
          wx.showToast({
            title: `身份证不正确！`,
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          return;
        }
        if(key == "gender" && (element != "男" && element != "女")){
          wx.showToast({
            title: `请正确输入性别！`,
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          return;
        }
      }
    }

    //上传图片 请求认证
    uploadFile({
      url: '/sys/filesUpload',
      filePath: this.data.tempFile.path,
      name: "file",
      method: "POST",
      formData:{}
    }).then(res => {
      //请求认证
      console.log(res);
      request({
        url:"/con/addCon",
        data:{
          id: this.data.userInfo.id,
          certifiedUrl: JSON.parse(res.data).data,
          ...value
        },
        method: "POST"
      }).then(res => {
        if(res.data.code == 200){
          console.log(res);
          wx.showToast({
            title: '提交成功！',
            icon: 'seccess',
            duration: 1500,
            mask: false,
            success: (result)=>{
              wx.navigateBack({
                delta: 1
              });
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        }
      })
    });

  },

  //进入步骤二
  toStep2(){
    this.setData({
      step: 2
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