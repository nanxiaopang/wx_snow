export const request = (params) => {
    const baseUrl = 'http://tywx.weatheryun.com/'
    return new Promise((resolve,reject) => {
        wx.request({
            header: {
                // Referer: 'http://10.48.21.119:8856/',
                // token: '0b0f2740-cc81-4c58-b2df-a1431903fb97-iscsso.he.sgcc.com.cn'
            },
            url: baseUrl + params.url,
            method: params.method || 'get',
            data: params.data || {},
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            }
        })
    })
}