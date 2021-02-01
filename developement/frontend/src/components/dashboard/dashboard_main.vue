<template>
  <div style="height: 100%">
    <vs-row style="height: 100%">
        <vs-col w="3" style="height: 100%">
            <div class="content-card">
                <div class="cc-card-header" style="height: 30px">
                    <h2>ニュースmedley</h2>
                </div>
                <timeline id="medley_life" sourceType="profile" :options="{ tweetLimit: '10' }" style="height:calc(100% - 70px); overflow: auto"/>
            </div>
        </vs-col>
        <vs-col w="3" style="height: 100%">
            <div class="content-card">
                <div class="cc-card-header" style="height: 30px">
                    <h2>ニュースm3.com</h2>
                </div>
                <timeline id="m3com_editors" sourceType="profile" :options="{ tweetLimit: '10' }" style="height:calc(100% - 70px); overflow: auto"/>
            </div>
        </vs-col>
        <vs-col w="3" style="height: 100%">
            <div class="content-card">
                <div class="cc-card-header" style="height: 30px">
                    <h2>ニュース医療速報</h2>
                </div>
                <timeline id="Medical_News_J" sourceType="profile" :options="{ tweetLimit: '10' }" style="height:calc(100% - 70px); overflow: auto"/>
            </div>
        </vs-col>
    </vs-row>
  </div>
</template>

<script>

import timeline from 'vue-tweet-embed/src/timeline'

export default {
    components: {
        'timeline': timeline
    }
}
</script>
