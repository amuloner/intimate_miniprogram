// components/mySelect/mySelect.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propArray:{
      type:Array,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectShow:false,//初始option不显示
    nowText:"按时间",//初始内容
    currentIndex:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //option的显示与否
    selectToggle(){
        this.setData({
            selectShow: !this.data.selectShow
        })
    },
    //设置内容
    setText(e){
      var {index} = e.currentTarget.dataset;//当前点击的索引
      var nowText = this.properties.propArray[index].text;//当前点击的内容
      this.setData({
          selectShow: false,
          nowText:nowText,
          currentIndex: index
      })
      //触发父页面的自定义方法
      this.triggerEvent("orderItemChange",this.properties.propArray[index].order)
    }
  },
  options: {
    addGlobalClass: true
  }
})
