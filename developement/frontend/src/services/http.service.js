import Globals from '@/config/global';

var baseURL = Globals.apiURL;

var request = function(route, data = null, type, abortSignal) {
    
  const promise = new Promise(function(resolve, reject) {

    let options = {
      method: type,
      signal: abortSignal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': window.localStorage.getItem('accessToken')
      }
    }

    if(type !== 'GET') {
      options = {
        method: type,
        body: JSON.stringify(data),
        signal: abortSignal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': window.localStorage.getItem('accessToken')
        }
      }
    }

    fetch(baseURL + route, options)
    .then((res) => {

      if (res.status !== 200) {
        reject({status: res.status, statusText: res.statusText})
      }
      res.json().then(data => {
        resolve(data)
      })
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
