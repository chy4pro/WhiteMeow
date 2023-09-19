import { useIndexStore } from "@/store/index";

const clearStorage = () => {
    // router.push({
    //   path: '/login'
    // })
}

const globalBaseUrlHandle = () => {
    // 测试环境
    if (window.location.hostname.indexOf("miao.pansi") > -1) {
        return 'https://miaoapi.pansi.com'
    }

    // release环境
    if (window.location.hostname.indexOf("webrelease.ashgso") > -1) {
        return 'https://release.ashgso.com/ashleydiscount'
    }

    // 生产环境
    if (window.location.hostname.indexOf("web.ashgso") > -1) {
        return 'https://checklist.ashgso.com/ashleydiscount'
    }

    // 本地环境
    if (window.location.hostname.indexOf("localhost") > -1) {
        return '//localhost:8081/api'
    }
};

/**
 * @基于promise
 * @入参
 * {
 *
 * resType: xml / blob / img / 默认json
 *
 * type: get / post(默认post)
 *
 * data: 数据 {key: value}(必传), 如果想中断请求，传入abort: (xhr) => {xhr.abort()}即可
 *
 * url: 接口地址(必传)
 *
 * jsonType: 入参的类型 考虑到有些数据需要转成字符串对象接受（默认true）
 *
 * formData: 文件上传bool, 默认为false
 *
 * }
 */

export function usePromise(obj) {
    const apiUrl = globalBaseUrlHandle()

    const xhr = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new window.ActiveXObject('Microsoft.XMLHTTP')

    const promise = new Promise((resolve, reject) => {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // 当类型是XML
                if (obj.resType === 'xml') {
                    return xhr.status === 200 ?
                        resolve(xhr.responseXML) :
                        reject(xhr.responseXML)
                }

                // 当类型是img
                if (obj.resType === 'img') {
                    return xhr.status === 200 ?
                        resolve(xhr) :
                        reject(xhr)
                }

                // blob类型
                if (obj.resType === 'blob') {
                    if (xhr.status === 200) {
                        const str = xhr.getResponseHeader('content-disposition')
                        const fileName = str.substring(
                            str.indexOf("=") + 2,
                            str.length - 1
                        )
                        resolve({
                            blob: xhr.response,
                            fileName
                        })
                    } else {
                        reject(xhr.response)
                    }
                    return
                }

                // 当类型是字符串对象
                if (
                    typeof (xhr.response) === 'string' &&
                    xhr.response.constructor === String
                ) {
                    if (xhr.status === 200) {
                        // 用户没权限，token过期。清除挂载全局的变量，释放内存
                        if (JSON.parse(xhr.response).code === 401) {
                            clearStorage()
                            return
                        }
                        return resolve(JSON.parse(xhr.response))
                    }
                    return reject(JSON.parse(xhr.response))
                }

                // 当类型是json格式
                if (xhr.status === 200) {
                    // 用户没权限，token过期。清除挂载全局的变量，释放内存
                    if (xhr.response.code === 401) {
                        clearStorage()
                        return
                    }
                    resolve(xhr.response)
                }
                return reject(xhr.response)
            }
        }

        xhr.responseType = obj.resType ? obj.resType : 'json'
        obj.type = obj.type ? obj.type : 'post'

        xhr.withCredentials = true

        if (obj.type.toLowerCase() === 'get') {
            let param = ''
            if (obj.data) {
                for (const i in obj.data) {
                    param += `${i}=${encodeURIComponent(obj.data[i])}&`
                }
            }
            xhr.open(
                'get',
                apiUrl + (obj.data ?
                    `${obj.url}?${param.substring(0, param.length - 1)}` :
                    obj.url),
                true
            )

            if (useIndexStore().state.token) {
                xhr.setRequestHeader('Authorization', useIndexStore().state.token)
            }

            xhr.send(null)
        }

        if (obj.type.toLowerCase() === 'post') {
            obj.jsonType = obj.jsonType ? obj.jsonType : true

            let formData = null
            let param = ''

            if (obj.formData) {
                formData = new window.FormData()

                for (const key in obj.data) {
                    if (typeof obj.data[key] === 'object') {
                        if (obj.data[key].length > 1) {
                            for (const item of obj.data[key]) {
                                formData.append(key, item)
                            }
                        } else {
                            formData.append(key, obj.data[key][0])
                        }
                    }

                    if (typeof obj.data[key] === 'string') {
                        formData.append(key, obj.data[key])
                    }
                }
            } else if (obj.jsonType) {
                param = JSON.stringify(obj.data)
            } else {
                for (const i in obj.data) {
                    param += `${i}=${encodeURIComponent(obj.data[i])}&`
                }
            }

            xhr.open('post', apiUrl + obj.url, true)

            if (useIndexStore().state.token) {
                xhr.setRequestHeader('Authorization', useIndexStore().state.token)
            }

            if (obj.jsonType) {
                xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
            } else if (obj.formData) {
                // 如果是文件上传，这里不需要指定content-type,浏览器会自动生成
            } else {
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            }

            // 文件上传
            if (obj.formData) {
                xhr.send(formData)
            } else if (obj.jsonType) {
                // json格式
                xhr.send(param)
            } else {
                xhr.send(param.substring(0, param.length - 1))
            }
        }

        obj.data.abort && obj.data.abort(xhr)
    })
    return promise
}