import {store} from '../store'
import Api from './api.service'

const isAuthenticated = new Promise(function(resolve, reject) {
    const user = store.getters.user
    const token = window.localStorage.getItem('accessToken')
    if(user && token) {
        console.log('checking...');
        Api.api.auth.get({token: token, userId: user.id})
        .then(() => {
            console.log('ISOK');
            resolve()
        })
        .catch(() => {
            console.log('NOTGOOD');
            reject()
        })
    } else {
        console.log(('NOPE'));
        reject()
    }
  })

  export default {
    isAuthenticated
  }