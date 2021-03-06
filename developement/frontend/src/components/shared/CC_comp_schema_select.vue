<template>
  <div>
    <div style="display: flex; flex-wrap: wrap">
      <vs-card
        v-for="(rowImg, rowIndex) in items"
        :key="rowIndex"
        @click.native="selectImg(rowImg.img)"
        style="margin: 5px; width: 112px"
      >
        <template #title> </template>
        <template #img>
          <img
            :src="$globals.assetsUrl + 'schemas/' + rowImg.tump"
            alt="rowImg.name"
            style="object-fit: contain; width: 100px; height: 100px"
          />
        </template>
        <template #text>
          <p>{{ rowImg.name }}</p>
        </template>
      </vs-card>
    </div>
  </div>
</template>

<script>
export default {
  created() {

    this.$get('schemas')
    .then(result => {
      this.items = result.data
    })
    .catch(result => {
      this.$apiError(result)
    })

  },
  data() {
    return {
      items: [],
    };
  },
  methods: {
    selectImg(img) {
      this.$emit("select", img);
    },
  },
};
</script>

<style>
.itemImage {
  height: 100px;
  width: 100px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
