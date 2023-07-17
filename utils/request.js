// es6的promise技术
// 用来发送请求的js扩展
//封装一个发请求加载中效果

// 同时发送异步请求的次数
let ajaxTimes = 0;
let isOutTime = true;
var appInst =  getApp();


export const request=(params)=>{
    ajaxTimes ++;

    // 显示加载中
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    params.url = appInst.globalData.url + "/im"+ params.url;

    return new Promise((resovle,reject)=>{
        wx.request({
            ...params,
            success:(result)=>{
                isOutTime = false;
                resovle(result);
            }
            ,fail:(err)=>{
                reject(err);
            }
            ,complete:()=>{
                if(isOutTime){
                    wx.showToast({
                        title: '数据较多，正在后台为您加载！请稍后查看！',
                        icon: 'none',
                        image: '',
                        duration: 1000,
                        mask: true,
                    });
                }
                isOutTime = true;
                ajaxTimes --;
                // 请求完成 关闭加载中
                if (ajaxTimes===0) {
                    wx.hideLoading();
                }
            }
        })
    })
}
export const requestNoLoading=(params)=>{
    params.url = appInst.globalData.url + "/im"+ params.url;

    return new Promise((resovle,reject)=>{
        wx.request({
            ...params,
            success:(result)=>{
                isOutTime = false;
                resovle(result);
            }
            ,fail:(err)=>{
                reject(err);
            }
            ,complete:()=>{
                if(isOutTime){
                    wx.showToast({
                        title: '数据较多，正在后台为您加载！请稍后查看！',
                        icon: 'none',
                        image: '',
                        duration: 1000,
                        mask: true,
                    });
                }
                isOutTime = true;
            }
        })
    })
}

export const uploadFile=(params)=>{
    ajaxTimes ++;

    // 显示加载中
    wx.showLoading({
        title: "上传中",
        mask: true
    });
    params.url = appInst.globalData.url + "/im"+ params.url;

    return new Promise((resovle,reject)=>{
        wx.uploadFile({
            ...params,
            success:(result)=>{
                isOutTime = false;
                resovle(result);
            }
            ,fail:(err)=>{
                reject(err);
            }
            ,complete:()=>{
                if(isOutTime){
                    wx.showToast({
                        title: '数据较多，正在后台为您加载！请稍后查看！',
                        icon: 'none',
                        image: '',
                        duration: 1000,
                        mask: true,
                    });
                }
                isOutTime = true;
                ajaxTimes --;
                // 请求完成 关闭加载中
                if (ajaxTimes===0) {
                    wx.hideLoading();
                }
            }
        })
    })
}