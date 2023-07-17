import { request } from "../../utils/request";

// pages/essay/essay.js
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
        title:"推荐",
        isActive:true
      },
      {
        id:1,
        title:"最新好文",
        isActive:false
      }
    ],
    essayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getEssayList("0");
  },

  //获取文章数据
  getEssayList(flag){
    request({
      url:'/essay/getEssayList',
      data:{
        pageIndex: 1,
        pageSize: 20,
        flag
      },
      method: 'POST',
    })
    .then(res => {
      if(res.data.code === 200){
        let essayList = res.data.data.records;
        this.setData({
          essayList
        })
      }
    })
  },

  //文章详情页
  toEssayDetail(e){
    console.log(e);
    //将被点击的文章数据存入缓存
    wx.setStorageSync("essayItem", this.data.essayList[e.currentTarget.dataset.index]);
    wx.navigateTo({
      url: '/pages/essayDetail/essayDetail',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  // 子组件点击事件,修改导航样式并显示对应内容
  handleItemTap(e){
    // 获取触发的组件索引
    const {index} = e.currentTarget.dataset;
    // 根据索引处理数据
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    });
    this.getEssayList(index);
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
    this.getEssayList("0");
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