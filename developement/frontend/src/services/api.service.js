import { createChainableState } from "@tiptap/vue-3";

var request = function (route, data, type, abortSignal) {

  const promise = new Promise(function (resolve, reject) {

    let options = {
      method: type,
      signal: abortSignal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    if (type !== 'GET') {

      if (route === "uploads/single") {
        let fd = new FormData();
        fd.append("data", JSON.stringify(data.meta));
        fd.append("file", data.file);
        options = {
          method: type,
          body: fd,
          signal: abortSignal,
        }
      } else {

        options = {
          method: type,
          body: JSON.stringify(data),
          signal: abortSignal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }

      }

    }

    fetch('/api/' + route, options)
      .then((res) => {
        if (!res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            res.json().then(result => reject(result.message));
            return;
          } else {
            res.text().then(result => reject(result));
            return;
          }
        }
        res.json().then(result => resolve(result));
      })
      .catch((res) => {
        if (res.statusText) {
          reject(res.statusText)
        }
        reject(res);
      });
  });
  return promise;
}

export default {

  install: (app) => {

    app.config.globalProperties.$api = {
      get: async function (route, data = {}, abortSignal = null) {
        try {
          return await request(route, data, "GET", abortSignal);
        } catch (err) {
          app.config.globalProperties.$apiError(err)
          return false
        }
      },
      post: async function (route, data = {}, abortSignal = null) {
        try {
          return await request(route, data, "POST", abortSignal);
        } catch (err) {
          app.config.globalProperties.$apiError(err)
          return false
        }
      },
      put: async function (route, data = {}, abortSignal = null) {
        try {
          return await request(route, data, "PUT", abortSignal);
        } catch (err) {
          app.config.globalProperties.$apiError(err)
          return false
        }
      },
      delete: async function (route, data = {}, abortSignal = null) {
        try {
          return await request(route, data, "DELETE", abortSignal);
        } catch (err) {
          app.config.globalProperties.$apiError(err)
          return false
        }
      }
    }
  },
  get: function (route, data = {}, abortSignal = null) {
    return request(route, data, "GET", abortSignal);
  },
  post: function (route, data = {}, abortSignal = null) {
    return request(route, data, "POST", abortSignal);
  },
  put: function (route, data = {}, abortSignal = null) {
    return request(route, data, "PUT", abortSignal);
  },
  delete: function (route, data = {}, abortSignal = null) {
    return request(route, data, "DELETE", abortSignal);
  }
}
