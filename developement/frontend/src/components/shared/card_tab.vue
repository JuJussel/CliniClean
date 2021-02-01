<template>
  <div class="el-card" :class="shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow'">
    <div v-if="location === 'left'" style="display: flex; height: 100%">
      <div class="tabs-pane">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(index)"
          class="tab-pane-item"
          v-bind:class="[{'tab-pane-item-active': index === activeTab}]"
        > 
          {{ tab[0] }} 
        </div>
      </div>
      <div class="el-card__body tab-card-main" :style="bodyStyle">
        <slot name="header" v-if="$slots.header"></slot>
        <div class="var-cont" :id="_uid">
          <slot></slot>
        </div>
      </div>
    </div>
    <div v-if="location === 'right'" style="display: flex; height: 100%; flex-direction: row-reverse;">
      <div class="tabs-pane-right">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(index)"
          class="tab-pane-item"
          v-bind:class="[{'tab-pane-item-right-active': index === activeTab}]"
        > 
          {{ tab[0] }} 
        </div>
      </div>
      <div class="el-card__body tab-card-main" :style="bodyStyle">
        <slot name="header" v-if="$slots.header"></slot>
        <div class="var-cont" :id="_uid">
          <slot></slot>
        </div>
      </div>
    </div>
    <div v-if="location === 'top'" style="height: 100%">
      <div class="tabs-pane-top">
        <div style="display: flex">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            @click="changeTab(index)"
            class="tab-pane-item-top"
            v-bind:style="{'padding': '0 ' + padding + 'px' }"
            v-bind:class="[{'tab-pane-item-top-active': index === activeTab}]"
          > 
            {{ tab[0] }} 
          </div>
        </div>
        <slot name="buttons" v-if="$slots.buttons"></slot>
      </div>

      <div class="el-card__body tab-card-main" :style="bodyStyle">
        <slot name="header" v-if="$slots.header"></slot>
        <div class="var-cont" :id="_uid">
          <slot></slot>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'ElCardTab',
    props: {
      location: {type: String, default: 'left'},
      header: {},
      bodyStyle: {},
      shadow: {
        type: String
      },
      padding: {
        type: Number,
        default: 20
      }
    },
    data() {
      return {
        activeTab: 0,
        tabs: []
      }
    },
    mounted() {
      let tabs = []
      let cont = document.getElementById(this._uid)
      const children = cont.querySelectorAll(":scope > div" )        
      children.forEach(i => {
        if (i.attributes.name) {
          let label = null
          if (i.attributes.label) {
            label = i.attributes.label.value
          }
          tabs.push([i.attributes.name.value, label])
        }
      })        
      this.tabs = tabs
      let that = this
        this.$slots.default.forEach(function(slot, index) {
          if (index === that.activeTab) {
            slot.elm.className = "tab-content-visible"            
          } else {
            slot.elm.className = "tab-content-hidden"
          }
        })
    },
    watch: {
      activeTab() {
        let that = this
        this.$slots.default.forEach(function(slot, index) {
          that.$nextTick(() => {
            if (index === that.activeTab) {
              slot.elm.className = "tab-content-visible"            
            } else {
              slot.elm.className = "tab-content-hidden"
            }
          });
          
        })
      }
    },
    methods: {
      changeTab(index) {
        this.activeTab = index
        let tab = this.tabs[index]
        this.$emit('changeTab', tab)
      }
    }
  }
</script>

<style scoped>
.tabs-pane {
  min-width: 75px;
  background-color: #f5f7fa;
  border-right: solid 1px #E4E7ED;
  flex-shrink: 0
}
.tabs-pane-right {
  min-width: 75px;
  background-color: #f5f7fa;
  border-left: solid 1px #E4E7ED;
  flex-shrink: 0
}

.tab-pane-item {
  line-height: 39px;
  color: #909399;
  text-align: right;
  padding-right: 15px;
  padding-left: 15px;
  cursor: pointer;
  transition: color .3s cubic-bezier(.645,.045,.355,1);
  transition: background .3s cubic-bezier(.645,.045,.355,1);
  border-top: solid 1px #f5f7fa;
  border-bottom: solid 1px #f5f7fa;
}
.tab-pane-item:first-child {
  margin-top: -1px
}
.tab-pane-item:hover {
  color: #00C7B2;
}
.tab-pane-item-active {
  border-right: solid 1px white;
  margin-right: -1px;
  color: #00C7B2;
  background-color: white;
  border-top: solid 1px #E4E7ED;
  border-bottom: solid 1px #E4E7ED;
}
.tab-pane-item-right-active {
  border-left: solid 1px white;
  margin-left: -1px;
  color: #00C7B2;
  background-color: white;
  border-top: solid 1px #E4E7ED;
  border-bottom: solid 1px #E4E7ED;
}
.tabs-pane-top {
  background-color: #f5f7fa;
  border-bottom: solid 1px #E4E7ED;
  display: flex;
  justify-content: space-between
}
.tab-pane-item-top {
  line-height: 39px;
  color: #909399;
  text-align: center;
  cursor: pointer;
  padding: 0 20px;
  transition: color .3s cubic-bezier(.645,.045,.355,1);
  transition: background .3s cubic-bezier(.645,.045,.355,1);
  border-left: solid 1px #f5f7fa;
  border-right: solid 1px #f5f7fa;
}
.tab-pane-item-top:first-child {
  border-left: none
}
.tab-pane-item-top:hover {
  color: #00C7B2;
}
.tab-pane-item-top-active {
  border-bottom: solid 1px white;
  margin-bottom: -1px;
  color: #00C7B2;
  background-color: white;
  border-left: solid 1px #E4E7ED;
  border-right: solid 1px #E4E7ED;
}

.tab-card-main {
  height: calc(100% - 40px);
}
.var-cont {
  height: calc(100% - 30px);
  overflow: auto;
}
.tab-content-hidden {
  display: none
}
</style>