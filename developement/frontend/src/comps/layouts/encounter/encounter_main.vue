<template>
    <div class="grid gap-2 grid-cols-9">
        <Card :pt="{ body: { class: 'h-full' }, content: { class: 'h-full' } }" class="col-span-3">
            <template #content>
            </template>
        </Card>
        <Card :pt="{ body: { class: 'h-full' }, content: { class: 'h-full' } }" class="col-span-4">
            <template #content>
                <Karte />
            </template>
        </Card>
        <Card class="col-span-2">
            <template #title>Simple Card</template>
            <template #content>
                <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                    repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione
                    quam perferendis esse, cupiditate neque
                    quas!
                </p>
            </template>
        </Card>

    </div>
</template>

<script setup>

import Karte from './karte'

</script>