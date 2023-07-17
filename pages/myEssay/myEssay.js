import { request,uploadFile } from "../../utils/request";
import { formatDate } from "../../utils/myFun";
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
        title:"我的文章",
        isActive:true
      },
      {
        id:1,
        title:"审核中",
        isActive:false
      },
      {
        id:2,
        title:"发布新文",
        isActive:false
      }
    ],
    essayList:[],
    userInfo:{},
    essayImgUrl: "",

    status: 0//文章审核状态0-->审核中  1-->发布
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
    this.getEssayListById("0");
  },

  //选择文章封面
  chooseEssayImg(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (res)=>{
        const tempFilePaths = res.tempFilePaths[0];
        this.setData({
          essayImgUrl: tempFilePaths
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  //请求发布文章，提交审核
  formSubmit(e){
    let {title, content} = e.detail.value;
    if(!content.trim()){
      this.setData({
        content: ""
      });
      wx.showToast({
        title: '内容不可为空！',
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
        title: '标题不可为空！',
        duration: 1500,
        icon:"error",
        mask: false
      });
      return;
    };
    if(!this.data.essayImgUrl.trim()){
      this.setData({
        essayImgUrl: ""
      });
      wx.showToast({
        title: '请选择封面！',
        duration: 1500,
        icon:"error",
        mask: false
      });
      return;
    };
    //上传头像到服务器中保存
    uploadFile({
      url: '/sys/fileUpload',
      filePath: this.data.essayImgUrl,
      name: "file",
      method: "POST",
      formData:{
        "type": "essay"
      }
    }).then(res => {
      console.log(res);
      request({
        url: "/essay/addEssay",
        data: {
          author: this.data.userInfo.nickname,
          authorId: this.data.userInfo.id,
          title,
          content,
          uploadTime: formatDate(new Date(new Date().getTime()), "YYYY-MM-DD"),
          smallImg: JSON.parse(res.data).data
        },
        method: "POST"
      }).then(res => {
        if(res.data.code == 200){
          wx.showToast({
            title: '发布成功！',
            icon: 'success',
            duration: 1500,
            mask: true,
            success: (result)=>{
              this.setData({
                title: "",
                content: "",
                essayImgUrl: ""
              });
            },
            complete: ()=>{}
          });
        }
      })
    });

  },

  //根据id获取文章数据
  getEssayListById(flag){
    if(this.data.status > 1) return;
    request({
      url:'/essay/getEssayList',
      data:{
        pageIndex: 1,
        pageSize: 20,
        flag,
        id: this.data.userInfo.id,
        status: this.data.status
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
      url: `/pages/essayDetail/essayDetail?status=${this.data.status}`,
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
      tabs,
      status: index
    });
    this.getEssayListById(index);
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