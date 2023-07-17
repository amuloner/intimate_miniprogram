// components/myHearder/myHearder.js
let app =  getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    log_img: app.globalData.url+'/images/log.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toSearch(){
      wx.navigateTo({
        url: '/pages/searchPage/searchPage',
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
  options: {
    addGlobalClass: true
  }
})
