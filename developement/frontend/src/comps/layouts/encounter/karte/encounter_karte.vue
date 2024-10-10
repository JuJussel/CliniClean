<template>
    <div class="h-full grid grid-cols-2 grid-rows-3 gap-2">
        <div class="row-span-2">
            <Soap />
        </div>
        <div class="row-span-3">
            <Procedures />
        </div>
        <div>Files</div>
    </div>
</template>

<script setup>

import Soap from './soap'
import Procedures from './procedures'

</script>