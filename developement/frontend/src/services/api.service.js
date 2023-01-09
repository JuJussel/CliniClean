
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


    if (type === 'GET') {

      if (data) {
        route = route + '?' + new URLSearchParams(data).toString()
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
