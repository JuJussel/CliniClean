<template>
    <cui-table :data="procedures" compact>
        <template v-slot:row="row">
            <td>
                <i :class="row.cat.icon"></i>
                {{  row.name }}
            </td>
            
        </template>
        <template v-slot:expand="{ expand }">
            <!--exam -->
            <div v-if="expand.cat.code === 60">
                <div v-for="(item,index) in expand.varData" :key="index">
                    <span
                        v-if="item.result.shared.name === '分析物固有結果コード'"
                    >
                        {{ item.result.single.name }}
                    </span>
                    <span v-else> {{ item.result.shared.name }} </span>
                    <span>:</span>
                    <span> {{ item.value }} </span>
                    <span v-if="item.unit.name !== '＊未設定'">{{ item.unit.name }}</span>

                </div>
            </div>
            <!-- perscription -->
            <div v-if="expand.cat.code === 25">
                {{ expand.varData?.timing.name || "" }}
                {{ expand.varData?.amount || "" }}
                {{ expand.taniname || "" }}
                {{ expand.varData?.duration || ""}}
                {{ expand.varData?.timing.unit || "" }}

            </div>
            <!-- shot -->
            <div v-if="expand.cat.code === 30">
                {{ $lang.shotLocation }}:
                {{ expand.varData?.location || "" }}
                {{ $lang.shotAmount }}:
                {{ expand.varData?.amount || "" }}
                {{ expand.taniname || "" }}
                {{ $lang.shotLot }}:
                {{ expand.varData?.lot || "" }}
            </div>
            <!-- prev vac -->
            <div v-if="expand.cat.code === 31">
                <div>
                    {{ expand.varData?.tradeName?.name }}
                </div>
                {{ $lang.shotLocation }}:
                {{ expand.varData?.location || "" }}
                {{ $lang.shotAmount }}:
                {{ expand.varData?.amount || "" }}
                {{ expand.taniname || "" }}
                {{ $lang.shotLot }}:
                {{ expand.varData?.lot || "" }}
            </div>
            <!-- comment -->
            <div>
                {{ expand.comment }}
            </div>
        </template>
    </cui-table>
</template>

<script>
export default {
    props: {
        procedures: {
            type: Array,
            default: []
        }
    }
}
</script>