import Globals from '@/config/global';

var baseURL = Globals.apiURL;

var request = function(route, data, type, abortSignal) {
    
  const promise = new Promise(function(resolve, reject) {

    let options = {
      method: type,
      signal: abortSignal,
      credentials: Globals.httpCredPol,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    if(type !== 'GET') {
      options = {
        method: type,
        body: JSON.stringify(data),
        signal: abortSignal,
        credentials: Globals.httpCredPol,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }

    var url = baseURL
    url = new URL(route, url)

    if(type === 'GET') {
      
      if (data) {
        url.search = new URLSearchParams(data).toString()
      }
    }

    fetch(url.toString(), options)
      .then((res) => {
        if (!res.ok) {
          res.json().then(result => reject(result.message));
          return;
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
    get: function(route, data={}, abortSignal=null) {
      return request(route, data, "GET", abortSignal);
    },
    post: function(route, data={}, abortSignal=null) {
      return request(route, data, "POST", abortSignal);
    },
    put: function(route, data={}, abortSignal=null) {
      return request(route, data, "PUT", abortSignal);
    },
    delete: function(route, data={}, abortSignal=null) {
      return request(route, data, "DELETE", abortSignal);
    }
}
