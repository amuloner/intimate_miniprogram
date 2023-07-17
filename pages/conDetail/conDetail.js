import { formatDate } from "../../utils/myFun";
import { request } from "../../utils/request";

// pages/conDetail/conDetail.js
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    conItem: [],
    weekIndex: -1,//当前点击的日期行
    dateIndex: -1,//当前选定的时间
    loginTime:"",
    isShow: false,

    workTime: [
      {start: "9:00",end: "9:50"},
      {start: "10:00",end: "10:50"},
      {start: "11:00",end: "11:50"},
      {start: "13:30",end: "14:20"},
      {start: "14:30",end: "15:20"}
    ],
    dateList: [],
    dateNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //取出咨询师id，查询相关信息
    let conItemId = wx.getStorageSync("conItemId");
    this.getCon(conItemId);
  },

  //获取咨询师信息
  getCon(id){
    request({
      url: `/con/getConById/${id}`,
      method: "GET"
    })
    .then(res => {
      if(res.data.code == 200){
        let conItem = res.data.data;
        let date = new Date(conItem.atcationDate);
        this.setData({
          conItem,
          loginTime: date.getFullYear() + '年' + date.getMonth() + '月'
        })
      }
    })
  },

  //选择咨询时间，如何确定？获取定义数组的index和i，
  //对字符串来说当前选择为字符串下标index *5 + i
  //0 1 =>1  1 2 => 7  3 3 => 18
  selectDate(e){
    let {index, itemindex} = e.currentTarget.dataset;
    this.setData({
      weekIndex: index,
      dateIndex: itemindex
    })
  },

  //发起预约 将用户id、nickname、time、orderIndex、conId发到后端
  //预约完成需要更改其可约时间
  toOrder(){
    let userInfo = wx.getStorageSync("userInfo");
    if(userInfo.authority == 1){
      wx.showToast({
        title: '咨询师不支持预约！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
      return;
    }
    let orderIndex = this.data.weekIndex * 5 + this.data.dateIndex
    request({
      url: "/con/orderCon",
      data: {
        userId: userInfo.id,
        username: userInfo.nickname,
        time: new Date().getFullYear() + '-' + this.data.dateList[this.data.weekIndex].date + " " + this.data.workTime[this.data.dateIndex].start,
        orderIndex,
        conId: this.data.conItem.id
      },
      method: "POST"
    }).then(res => {
      if(res.data.code == 200){
        wx.showToast({
          title: '预约成功',
          icon: 'none',
          image: '',
          duration: 2000,
          mask: true,
          fail: ()=>{},
          complete: ()=>{
            //更改可约时间，将时间字符切割成数组替换指定位置再合并
            let dateStr = this.data.conItem.conDate;
            const newDateStr = (str, index) => {
              const strAry = str.split('');
              strAry[index] = '1';
              return strAry.join('');
            };
            this.setData({
              isShow: false,
              weekIndex: -1,
              dateIndex: -1,
              "conItem.conDate": newDateStr(dateStr, orderIndex)
            })
          }
        });
      }else{
        wx.showToast({
          title: '当前时间已满！',
          icon: 'error',
          image: '',
          duration: 3000,
          mask: true,
          fail: ()=>{},
          complete: ()=>{
            this.setData({
              isShow: false,
              weekIndex: -1,
              dateIndex: -1
            })
          }
        });
      }
    })
  },

  //跳转聊天界面
  toMsgDetail(){
    //需要登录，监测是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.setStorageSync("navUrl", {"type": "page", "url": "/pages/conDetail/conDetail"});
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    };
    //携带对象用户id跳转
    wx.navigateTo({
      url: `/pages/msgPage/msgPage?page=con&userId=${userInfo.id}`,
      success: (result)=>{},
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  //显示选择卡片
  showCard(){
    //需要登录，监测是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.setStorageSync("navUrl", {"type": "page", "url": "/pages/conDetail/conDetail"});
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    };

    let dateStr = this.data.conItem.conDate;
    console.log(dateStr.split('0').length - 1);
    //00000 000000 00000 00000怎么变成时间
    //将字符串截取成数组
    let result = [];
    let tmp = [];
    for(let i = 0 ;i < dateStr.length; i++){
      tmp.push(dateStr.slice(i,i+1));
      if(i > 0 && (i + 1) % 5 == 0){//每五个取出一次
        let index = i / 5;
        var date1 = new Date();//获取当前时间
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+index);//当前时间+n天
        let title = formatDate(date2, "周W");
        let date = formatDate(date2, "MM-DD");

        result.push({tmp, title, date});
        tmp = [];
      }
    }
    this.setData({
      isShow: true,
      dateList: result,
      dateNum: dateStr.split('0').length - 1
    })
  },

  //关闭卡片
  changeShow(){
    this.setData({
      isShow: false
    })
  },

  reTap(){},
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