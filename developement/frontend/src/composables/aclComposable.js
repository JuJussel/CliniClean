
/*
@requiredLevel: Minimum Level needed. 0: open, 1: read, 2:edit

*/

const aclLogic = function (requiredLevel, view) {
    const userStore = useUserStore()
    const uiStore = useUiStore()
    const settingStore = useSettingStore()

    if (!view) {
        view = uiStore.activeTab
    }
    const permissions = settingStore.settingData.permissions[view] || null;
    const userGroup = userStore.userData?.userGroup || null;
    const availableLevel = permissions?.[userGroup - 1] || null;

    if (userGroup == 99) return true;
    if (!permissions) return false;
    if (!userGroup) return false;
    if (!availableLevel) return false;

    if (availableLevel >= requiredLevel) return true;
    return false;

}

export default aclLogic

