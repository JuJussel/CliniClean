import config from "../config/global";
import {store} from "../store"

/*
@requiredLevel: Minimum Level needed. 0: open, 1: read, 2:edit

*/

const aclCheck = function (requiredLevel, view = store.getters.activeView) {
    
    const permissions = config.permissions[view] || null;
    const userGroup = store.getters.user.userGroup || null;
    const availableLevel = permissions[userGroup - 1] || null;

    if (userGroup == 99) return true;
    if (!permissions) return false;
    if (!userGroup) return false;
    if (!availableLevel) return false;

    if(availableLevel >= requiredLevel) return true;

    return false;
 
}

export default {
    install: (app) => {
        app.config.globalProperties.$aclService = aclCheck
    }
  
  }