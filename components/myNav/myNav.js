const app = getApp();
Component({
  // multipleSlots 为组件开启多插槽模式
  options: {
    multipleSlots: true,
  },
  // externalClasses 为组件指定多个外部样式类
  externalClasses: ['nav-bgc-class', 'nav-title-class', 'ex-back-pre'],
  // properties 组件用来储存外部数据
  properties: {
    navbarData: { //navbarData 
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    },
  },
  // 组件用来储存内部私有数据
  data: {
    // 自定义导航栏的高度
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
  },
  // methods对象 定义组件内的各种方法
  methods: {
    // 返回键，触发自定义事件，将返回的事件交给父级页面来分情况定义
    _navback() {
      // this.triggerEvent('goBack')
      wx.navigateBack();
    }
  }
})
