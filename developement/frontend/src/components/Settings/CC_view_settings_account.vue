<template>
    <div style="height: 100%">
        Account
    </div>
</template>

<script>

import imageCropp from ''

export default {
    components: {
        imageCropper
    },
    data() {
        return {
        }
    },
    methods: {
        saveAvatar(img) {
            console.log(img);
        }
    },
    
}
</script>
