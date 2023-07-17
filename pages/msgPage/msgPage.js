import { formatDate } from "../../utils/myFun";
import { requestNoLoading,request } from "../../utils/request";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示离线   1表示显示    0表示不显示
      title: '消息', //导航栏 中间的标题
    },
    height: app.globalData.statusBarHeight + app.globalData.navBarHeight,
    pageHeight:  app.globalData.pageHeight,
    toView: "",//滚动条目标元素
    url: app.globalData.url,

    content:"",//输入内容
    msgList: [],//聊天历史记录

    lastId: 0,//当前最后一条消息的id
    chatId: 0,//当前信息表id,
    pageIndex: 1,
    pageSize: 50,
    toId: 0,//聊天对象id
    fromId: 0,//用户id
    toHeadImg: "",
    fromHeadImg: ""
  },
  timer: 0, //定时器

  onLoad(options) {
    if(options.page){//从咨询师界面跳转来
      let toId = wx.getStorageSync("conItemId");
      //查询是否存在聊天列表
      request({
        url: `/chat/getChatListById?fromId=${options.userId}&toId=${toId}`,
        method: "GET"
      }).then(res => {
        console.log(res);
        if(res.data.code == 200){
          this.setData({
            chatId: res.data.data.id,
            toHeadImg: res.data.data.toHead,
          })
        }
      });
      this.getCon(toId);
      this.setData({
        fromId: options.userId,
        fromHeadImg: wx.getStorageSync("userInfo").headImg
      })
    }else{
      //获取当前信息表
      let chatItem = wx.getStorageSync("chatItem");
      this.setData({
        "nvabarData.title": chatItem.toName,
        chatId: chatItem.id,
        toId: chatItem.toId,
        fromId: chatItem.fromId,
        toHeadImg: chatItem.toHead,
        fromHeadImg: wx.getStorageSync("userInfo").headImg
      })
    }
    //获取聊天记录
    clearInterval(this.timer);
    //初始化聊天数据
    this.queryChatHis();
    //开启一个定时器，不断获取新的聊天数据
    this.timer = setInterval(() => {
      console.log("在用");
      this.queryChatHis();
    }, 5000);
  },

  onHide() {
    clearInterval(this.timer);
  },

  //输入框失去焦点
  changeContent(e){
    const {value} = e.detail;
    if(value == "") return;
    this.setData({
      content: value
    })
  },

  //发送消息
  sendMessage(){
    if(this.data.content == "") return;
    requestNoLoading({
      url: "/chat/sendChat",
      data: {
        fromId: this.data.fromId,
        toId: this.data.toId,
        content: this.data.content,
        lastChat: this.data.lastId,  //当前的最后一条消息的id
        ctime: new Date().getTime()
      },
      method: "POST"
    }).then(res => {
      if(res.data.code == 200){
        if(res.data.data){
          this.setData({
            chatId: res.data.data.id,
            toHeadImg: res.data.data.toHead,
            content: ""
          })
        };
        //先关闭定时器
        clearInterval(this.timer);
        //再次请求聊天记录
        this.queryChatHis();
        //再开启一个定时器，不断获取新的聊天数据
        this.timer = setInterval(() => {
          this.queryChatHis();
        }, 5000);
      }
    })
  },

  //获取聊天记录
  queryChatHis(){
    requestNoLoading({
      url: "/chat/getChat",
      data: {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
        chatId: this.data.chatId,
        lastId: this.data.lastId,
        fromId: this.data.fromId,
        toId: this.data.toId  
      },
      method: "POST"
    }).then(res => {
      if(res.data.code == 200){
        let {records} = res.data.data;
        if(records.length > 0){
          //先计算时间
          let msgList = this.showDate(records);
          //再设置数据
          this.setData({
            msgList,
            lastId: msgList[msgList.length - 1].id,
            toView: `item${msgList.length - 1}`
          })
        }
      }
    })
  },

  //时间计算工具
  showDate(arry){
    //距离上一次消息过去了3分钟，则显示消息时间, 60*3
    //过去了一天则显示日期 60*60*24，过去了一年则显示年月日 60*60*24*365 
    let lastTime = 0;
    arry.forEach((element, index) => {
      if(index == 0){
        lastTime = element.ctime;
      }else{
        if(element.ctime - lastTime > 60*3*1000){
          element.showTime = formatDate(new Date(Number(element.ctime)),"HH:ii")
        }else if(element.ctime - lastTime > 60*60*24*1000){
          element.showTime = formatDate(new Date(Number(element.ctime)),"MM/DD HH:ii")
        }else if(element.ctime - lastTime > 60*60*24*365*1000){
          element.showTime = formatDate(new Date(Number(element.ctime)),"YYYY-MM-DD HH:ii")
        }
        lastTime = element.ctime;
      }
    });
    return arry;
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
        this.setData({
            "nvabarData.title": conItem.name,
            toId: conItem.id,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(this.timer);
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