import globals from '../globals'

var baseURL = globals.apiURL

var request = function(route, data = null, type) {
    var qs = '?route=' + route
    var fd = null
    // Check if Get or Delete
    var getDelete = type === 'GET' || type === 'DELETE';
    if (getDelete) {
        if (data) {
            qs = qs + '&params=' + JSON.stringify(data)
        }
    } else {
        fd = new FormData()
        fd.append('data', JSON.stringify(data))
        if (data && data.hasFiles) {
            data.fileList.forEach(file => {
              fd.append('files[]', file)
            })
        }
    }
    const promise = new Promise(function(resolve, reject) {
        fetch(baseURL + qs, {
            credentials: 'include',
            method: type,
            body: fd,
        })
        .then((res) => res.json())
        .then(res => {
            if(!res.success) {
                reject(res)
            } else {
                resolve(res)
            }
        })
        .catch(res => {
            reject(res)
        })
    })
    return promise
}

export default {
    install(Vue) {
        Vue.prototype.$get = function(route, data) {
            return request(route, data, 'GET')
        },
        Vue.prototype.$post = function(route, data) {
            return request(route, data, 'POST')
        },
        Vue.prototype.$put = function(route, data) {
            return request(route, data, 'PUT')
        },
        Vue.prototype.$delete = function(route, data) {
            return request(route, data, 'DELETE')
        },
        Vue.prototype.$apiError = function(res) {
            Vue.prototype.$eventHub.$emit('apiError', res.message)
        }
    }
}