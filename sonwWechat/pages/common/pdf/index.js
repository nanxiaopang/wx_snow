
Component({
  /**
   * 使用全局样式属性
   */
  options: {
    // addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
  },
  /**
   * miniprogram-computed提供计算属性
   */
  computed: {
  },
  /**
   * 自带的监听器
   */
  observers: {
  },
  /**
   * miniprogram-computed提供监听器
   */
  watch: {
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  /*组件生命周期*/
  lifetimes: {
    created: function () {
      console.log("在组件实例刚刚被创建时执行")
    },
    attached: function () {
      console.log("在组件实例进入页面节点树时执行")
    },
    ready: function () {
      console.log("在组件在视图层布局完成后执行")
      this.showPdf()
    },
    moved: function () {
      console.log("在组件实例被移动到节点树另一个位置时执行")
    },
    detached: function () {
      console.log("在组件实例被从页面节点树移除时执行")
    },
    error: function () {
      console.log("每当组件方法抛出错误时执行")
    }
  },
  /*组件所在页面的生命周期 */
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log("页面被展示")
    },
    hide: function () {
      // 页面被隐藏
      console.log("页面被隐藏")
    },
    resize: function (size) {
      // 页面尺寸变化
      console.log("页面尺寸变化")
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getFn(){
      return new Promise(function(resolve){
        wx.request({
          url: 'http://10.48.21.116:8080/api/make/basicData/getPdf.action?productId=1000&token=d25784f8-4557-4b1c-8980-da585de6bcd2',
          method: 'GET',
          timeout: 30000,
          header: {
              'content-type': 'application/x-www-form-urlencoded', // 默认值
          },
          responseType: 'arraybuffer',
          success: function (res) {
            console.log(res)
              if (res.statusCode == 200) {
                  resolve(res.data);
              } else {
                console.log(res)
                  // isShowError ? util.showError("系统繁忙，请稍后在试(" + res.statusCode + ")") : "";
              }
          },

          fail: function (res) {
              console.log(res)
              console.log("请求失败，请稍后再试")
          },

          complete: function (res) {
              wx.hideLoading();
          }
        })
      })
    },
    pdfDetail(){
      const _this = this
      return new Promise(function(resolve){
        // resolve(_this.getFn('接口.json',data))
        resolve(_this.getFn())
      })
    },
    showPdf(){
      
      this.pdfDetail().then(function (res) {
        console.log(res)
        const FileSystemManager = wx.getFileSystemManager();//获取全局唯一的文件管理器
        //writeFile支持处理二进制文件流 不必转base64
        FileSystemManager.writeFile({
          filePath: wx.env.USER_DATA_PATH + "/文档.pdf",
          data:res,
          encoding:"binary",//必填
          success (res){
            wx.openDocument({ // 打开文档
              filePath: wx.env.USER_DATA_PATH + "/文档.pdf",  //拿上面存入的文件路径
              showMenu: true, // 显示右上角菜单
              success: function (res) {
                console.log(res)
              }
            })
          }
        })
      })
    },
  }
})
