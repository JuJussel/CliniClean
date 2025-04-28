<template>
    <div>
        <search 
            style="height: 300px" 
            :category="{code: 31}"
            @select="selectPrevVac"
        />
    </div>
</template>

<script>
import search from "../../cc_p_karte/cc_p_procedures_browser/cc_p_procedures_search"

export default {
    components: {
        search
    },
    methods: {
        selectPrevVac(item) {
            
        }
    }
}

</script>