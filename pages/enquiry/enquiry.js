import { request } from "../../utils/request"

// pages/enquiry/enquiry.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    //咨询师数据
    conList:[],
    nowData:"2",
    timetable:["9:00","10:00","11:00","13:30","14:30"],

    // 导航菜单
    dropDownMenuTitle:['城市','时间','排序','筛选'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getConList({});
  },

  /**
   * 获取咨询师列表
   * 条件：
   *  城市：address
   *  时间：data
   *  排序: sort
   *  性别：gender
   *  领域：realm
   */
  getConList(e){
    console.log(e);
    request({
      url:'/con/getAllCons',
      data: e.detail || {},
      method: 'POST',
    })
    .then(res => {
      // console.log((res.data.data[0].conDate.indexOf("0")+1)%5);
      if(res.data.code === 200){
        let conList = res.data.data.records;
        //计算最快可约时间，加到数组中
        conList.forEach(item => {
          item.recentTime = this.getRecentTime(item.conDate)
        });
        this.setData({
          conList
        })
      }
    })
  },

  //咨询详情页
  toConDetail(e){
    //将被点击的咨询师id存入缓存
    wx.setStorageSync("conItemId", this.data.conList[e.currentTarget.dataset.index].id);
    wx.navigateTo({
      url: '/pages/conDetail/conDetail',
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  //计算最快可约时间
  getRecentTime(dateStr){
    //找到第一个0的位置，即最近的可约时间
    let recentIndex = dateStr.indexOf("0");
    let str = recentIndex / 5;
    switch (str) {
      case 0:
        str="明天";
        break;
      case 1:
        str="后天";
        break;
      default:
        var date1 = new Date();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+str);
        str = date2.toLocaleDateString();
        break;
    }
    return str + ' ' + this.data.timetable[recentIndex%5];
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