import { formatDate } from "../../utils/myFun";
import { request } from "../../utils/request";

// pages/cvsation/cvsation.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    tabs:[
      {
        id:0,
        name:"广场",
        isActive:true
      },
      {
        id:1,
        name:"提问",
        isActive:false
      }
    ],
    showPage: 0,
    questionList: [],
    content: "",
    title: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getQuestionList();
  },

  //提问
  /**
   * userId 用户id
   * title 标题
   * content 内容
   * date 时间
   */
  formSubmit(e){
    let {title, content} = e.detail.value;
    if(!content.trim()){
      this.setData({
        content: ""
      });
      wx.showToast({
        title: '请先输入描述！',
        duration: 1500,
        mask: false,
        icon: "error"
      });
      return;
    };
    if(!title.trim()){
      this.setData({
        title: ""
      });
      wx.showToast({
        title: '请先输入标题！',
        duration: 1500,
        icon:"error",
        mask: false
      });
      return;
    };
    request({
      url: "/question/saveQuestion",
      data: {
        userId: wx.getStorageSync("userInfo").id,
        title,
        content,
        date: formatDate(new Date(new Date().getTime()), "YYYY-MM-DD")
      },
      method: "POST"
    }).then(res => {
      if(res.data.code == 200){
        wx.showToast({
          title: '提问成功！',
          icon: 'success',
          duration: 1500,
          mask: true,
          success: (result)=>{
            this.setData({
              title: "",
              content: ""
            });
          },
          complete: ()=>{
            setTimeout(()=>{
              this.getQuestionList();
            },1000)
          }
        });
      }
    })

  },

  //获取问题数据
  getQuestionList(){
    request({
      url:'/question/getQuestionList',
      data:{
        pageIndex: 1,
        pageSize: 20,
      },
      method: 'POST',
    })
    .then(res => {
      if(res.data.code === 200){
        let questionList = res.data.data.records;
        this.setData({
          questionList
        })
      }
    })
  },

  //跳转详情页
  toQuestionDetail(e){
    //将被点击的咨询师数据存入缓存
    wx.setStorageSync("questionItem", this.data.questionList[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: `/pages/cvsDetail/cvsDetail?index=${e.currentTarget.dataset.index}`,
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  // 处理导航点击事件
  handleItemChange(e){
    // 接收子组件传递过来的索引
    const {index} = e.currentTarget.dataset;
    if(index == 1){//发表问题需要登录
      //需要登录，监测是否登录
      let userInfo = wx.getStorageSync("userInfo");
      if(!userInfo){
        wx.showModal({
          title: '提示',
          content: '您还未登录，是否登录？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              wx.setStorageSync("navUrl", {"type": "page", "url": "/pages/cvsation/cvsation"});
              wx.redirectTo({
                url: '/pages/login/login'
              });
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        return;
      };
    }
    // 根据索引处理数据
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs,
      showPage: index
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