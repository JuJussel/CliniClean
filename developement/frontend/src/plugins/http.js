import Globals from '@/config/global';

var baseURL = Globals.apiURL;

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
}

export default {
    get: function(route, data, abortSignal) {
      return request(route, data, "GET", abortSignal);
    },
    post: function(route, data, abortSignal) {
      return request(route, data, "POST", abortSignal);
    },
    put: function(route, data, abortSignal) {
      return request(route, data, "PUT", abortSignal);
    },
    delete: function(route, data, abortSignal) {
      return request(route, data, "DELETE", abortSignal);
    }
}
