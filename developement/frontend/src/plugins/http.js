import globals from "../globals";

var baseURL = globals.apiURL;

var request = function(route, data = null, type, abortSignal) {
  var qs = "?route=" + route;
  var fd = null;
  // Check if Get or Delete
  var getDelete = type === "GET" || type === "DELETE";
  if (getDelete) {
    if (data) {
      qs = qs + "&params=" + JSON.stringify(data);
    }
  } else {
    fd = new FormData();
    fd.append("data", JSON.stringify(data));
    if (data && data.hasFiles) {
      data.fileList.forEach((file) => {
        fd.append("files[]", file);
      });
    }
  }
  const promise = new Promise(function(resolve, reject) {
    fetch(baseURL + qs, {
      credentials: "include",
      method: type,
      body: fd,
      signal: abortSignal,
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          reject(res);
        } else {
          resolve(res);
        }
      })
      .catch((res) => {
        reject(res);
      });
  });
  return promise;
};

export default {
  install(Vue) {
    (Vue.prototype.$get = function(route, data, abortSignal = null) {
      return request(route, data, "GET", abortSignal);
    }),
    (Vue.prototype.$post = function(route, data, abortSignal = null) {
      return request(route, data, "POST", abortSignal);
    }),
    (Vue.prototype.$put = function(route, data, abortSignal = null) {
      return request(route, data, "PUT", abortSignal);
    }),
    (Vue.prototype.$delete = function(route, data, abortSignal = null) {
      return request(route, data, "DELETE", abortSignal);
    }),
    (Vue.prototype.$apiError = function(res) {
      if(res.name !== 'AbortError') {
        Vue.prototype.$eventHub.$emit("apiError", res.message);
      }
    });
  }
};
