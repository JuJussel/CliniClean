import { store } from "../store"
import { useUserStore } from '@/stores/user'
/*
@requiredLevel: Minimum Level needed. 0: open, 1: read, 2:edit

*/


export default {

    install: (app, options) => {

        const userStore = useUserStore()

        app.config.globalProperties.$aclService = function (requiredLevel, view = store.getters.activeTab) {
            const permissions = options.permissions[view] || null;
            const userGroup = userStore.userData?.userGroup || null;
            const availableLevel = permissions?.[userGroup - 1] || null;

            if (userGroup == 99) return true;
            if (!permissions) return false;
            if (!userGroup) return false;
            if (!availableLevel) return false;

            if (availableLevel >= requiredLevel) return true;
            return false;

        }
    }

}