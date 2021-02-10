<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
  :root {
    --vs-shadow-opacity: .15!important;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
  body {
    margin: 0;
    font-size: 14px
  }
  .juzoom-enter-active {
    transition: all .3s
  }
  .juzoom-enter, .juzoom-leave-to {
    opacity: 0;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  .vs-input {
        width: 100%!important;
  }
  .vs-input:not(textarea) {
    height: 33px
  }
  .content-card {
    border-radius: 20px;
    background-color: white;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.3);
    margin: 10px;
    height: calc(100% - 20px);
  }
  .content-card-header {
    display: flex;
    align-items: center

  }
  .dialog-title {
    margin: 0
  }
  th {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  .hidden-tab {
    position: fixed;
    left: -10000px
  }
  .active-tab {
    position: relative;
    left: 0
  }
  button:disabled {
    cursor: not-allowed;
  }
  .cc-table-filter-button {
    pointer-events: all;
    margin: 0 5px!important;
  }
    .cc-table-filter-button i{
    font-size: 12px!important
  }
  .cc-tag {
    margin-left: 20px;
    background-color: rgba(var(--vs-gray-2),1);
    padding: 10px;
    border-radius: 10px;
  }
  .cc-radio-input {
    margin-left: 22px;
    display: flex;
    height: 53px;
  }
  .cc-input-label {
    position: absolute;
    margin-top: -5px;
    margin-left: 10px;
    font-size: 12px
  }
  .cc-card-has-header {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .cc-card-has-header .cc-card-content {
    flex-grow: 1 ;
    overflow: auto;
  }
  .cc-card-header {
    background-color: rgba(var(--vs-gray-2), 1);
    border-radius: 14px 14px 0 0;
    padding: 10px;
    display: flex;
    align-items: center
  }
  .cc-card-header h2 {
    margin: 0
  }
  .cc-card-header button {
    height: 34px
  }
  .cc-hover-icon {
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 10px
  }
  .cc-hover-icon:hover {
    background-color: rgba(var(--vs-gray-2), 1);
    color: rgba(var(--vs-color), 1);
  }
  .cc-click-row:hover td {
    cursor: pointer;
    background-color: rgba(var(--vs-primary), 0.2)!important
  }
  .fc-left {
    margin-left: 10px;
    margin-top: -35px;
  }
  .cc-danger-input {
    background: rgba(var(--vs-danger), 0.1) !important;
    color: rgba(var(--vs-danger), 1)!important;
  }
  .cc-badge-text {
    width: auto!important
  }
  .cc-badge-text > .vs-avatar {
    justify-content: flex-start;
    height: 30px;
    background: none!important;
    box-shadow: none!important
  }
  .cc-badge {
    background-color: rgba(var(--vs-primary), 1)!important
  }
  .cc-table-header-content {
    display: flex;
    align-items: center;
    margin-bottom: -15px
  }
  .cc-table-header-content h2 {
    margin: 0!important
  }
  .cc-dialog-footer {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end
  }
  .cc-info-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  .cc-info-row-label {
    margin-right: 20px;
    text-align: right
  }
  .cc-vs-table-condensed td{
    padding: 5px;
    height: 30px;
    line-height: 15px;
  }
  .cc-max-width-td {
    display: inline-block;
    overflow: hidden;
    position: static;
  }
  .cc-hover-button {
    opacity: 0;
  }
  .cc-tree-button {
     opacity: 0;
  }
  .tree-anchor:hover  .cc-tree-button {
    opacity: 1
  }
  .cc-date-picker {
    border-radius: 12px;
  }
  .cc-mx-input {
    border-radius: 12px!important
  }
  .hover-override {
    background: white!important
  }
  .hover-fix:hover td {
    background: rgba(var(--vs-gray-2), 1)!important
  }
  .mx-table-date .today {
    color: rgba(var(--vs-primary), 1)!important
  }
  .mx-calendar-content .cell:hover  {
    background-color: rgba(var(--vs-primary), .2)!important;
    color: rgba(var(--vs-primary), 1)!important;
    border-radius: 14px
  }
  .mx-calendar-content .cell.active {
    background-color: rgba(var(--vs-primary), .2)!important;
    color: rgba(var(--vs-primary), 1)!important;
  }
  .cell.in-range ~ .cell.active {
    border-radius: 0 12px 12px 0
  }
  .cell ~ .cell.active {
    border-radius: 12px 0 0 12px
  }
  .mx-calendar-content .cell.in-range {
    background-color: rgba(var(--vs-primary), .1)!important;

  }
  tr:hover > td .cc-hover-button, .vs-card:hover  .cc-hover-button{
    opacity: 1;
  }
  .mx-datepicker-range {
    width: 100%!important
  }
  .vs-input__label--label {
    font-size: 0.9rem!important
  }
  .vs-select__option {
    max-height: inherit!important
  }
  .vs-card {
    max-width: none!important;
  }
  .vs-dialog-content.blur {
    backdrop-filter: none!important;
    /* backdrop-filter: blur(5px)!important; */
  }
  .vs-table__tr.expand td{
    background: rgba(var(--vs-gray-2),1);
  }
  .vs-dialog {
    max-width: none!important;
  }
  .vs-sidebar__item.active {
    color: rgba(var(--vs-text), 1)!important
  }
  .vs-button-group .vs-button:last-child {
    margin-left: -2px
  }
  .vs-button-group .vs-button:only-child {
    border-radius: 12px!important
  }
  .vs-select__label--label {
    margin-left: 6px
  }
  .vs-table__thead th {
    width: auto!important
  }
  .vs-table-content {
    position: relative;
    height: 100%;
  }
  .vs-table {
    max-height: calc(100% - 50px);
    position: absolute
  }
  .vs-input-content--has-label {
    margin: 10px
  }
  .vs-select-content {
    margin: 20px;
  }
  .vs-select__input {
    min-height: 34px!important
  }
  .vs-select__options {
    margin-top: -4px
  }
  .vs-input__loading::after {
    border: 2px solid rgba(var(--vs-dark), 1)!important;
    border-radius: inherit!important;
    border-top: 2px solid transparent!important;
    border-left: 2px solid transparent!important;
    border-right: 2px solid transparent!important;
  }
  .vs-input__loading::before {
    border: 2px dashed rgba(var(--vs-dark), 1)!important;
    border-radius: inherit!important;
    border-top: 2px solid transparent!important;
    border-left: 2px solid transparent!important;
    border-right: 2px solid transparent!important;
  }
  .vs-select__options:after {
    box-shadow: none!important
  }
  .vs-select-content {
    width: calc(100% - 40px)!important;
    max-width: none!important
  }
  .vs-dialog__footer {
    display: flex;
    justify-content: flex-end;
  }
  .vs-table table {
    min-width: 0!important
  }
  .vs-button--shadow {
    background-color: rgba(var(--vs-gray-2), 1)!important
  }
  .ql-toolbar.ql-snow {
    border: none!important
  }
  .ql-container.ql-snow {
    border-radius: 12px;
    border: none!important;
    background-color: rgba(var(--vs-dark), 0.1)
  }
  .ql-active > * > *, 
  .ql-toolbar.ql-snow > *:hover > * > *, 
  .ql-toolbar.ql-snow > *:hover > span > * > * {
    color: rgba(var(--vs-primary), 1)!important;
    stroke: rgba(var(--vs-primary), 1)!important;
  }
  .ql-customBtn:hover {
    color: rgba(var(--vs-primary), 1)!important;
    stroke: rgba(var(--vs-primary), 1)!important;
  }
  .tree-node:not(.selected) {
    border-radius: 15px
  }
  .tree-node>.tree-content {
    transition: all 0.3s ease;
    border-radius: 15px
  }
  .tree-node:not(.selected)>.tree-content:hover {
    background: #ccf4f0!important;
    border-radius: 15px
  }
  .tree-node.selected>.tree-content {
    background: rgba(var(--vs-gray-2), 1)!important
  }
  .fc-scrollgrid > thead .fc-scroller {
    overflow: hidden!important
  }
  .avatar-cropper-footer {
    display: none!important;
  }

  .cropper-view-box,
  .cropper-face {
    border-radius: 50%;
  }

</style>

<style media="screen">
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #E4E7ED;
    border-radius: 4px
}
::-webkit-scrollbar-button {
      background-color: #606266;
      width: 8px;
      height: 8px;
      border-radius: 4px
}
/* Handle */
::-webkit-scrollbar-thumb {
    background: #606266;
    border-radius: 4px;
}

::selection {
  background: #00c7b2;
  color: white
}
</style>