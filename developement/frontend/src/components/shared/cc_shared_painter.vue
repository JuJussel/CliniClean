<template>
  <div @mouseup="upAddTextFloater">
    <div style="display: flex; border-bottom: solid 1px var(--cui-dark); padding: 5px">
      <button class="menu-item" v-bind:class="{ 'is-active': drawMode === 'pencil' }" @click="drawMode = 'pencil'">
          <i class="fas fa-pencil-alt"></i>
      </button>
      <button class="menu-item" v-bind:class="{ 'is-active': drawMode === 'line' }" @click="drawMode = 'line'">
          <i class="fas fa-minus"></i>
      </button>
      <button class="menu-item" v-bind:class="{ 'is-active': drawMode === 'box' }" @click="drawMode = 'box'">
          <i class="fas fa-square"></i>
      </button>
      <button class="menu-item" v-bind:class="{ 'is-active': drawMode === 'text' }" @click="drawMode = 'text'">
          <i class="fas fa-font"></i>
      </button>
      <button class="menu-item" v-bind:class="{ 'is-active': strokeColor === 'black' }" @click="strokeColor = 'black'">
          <i class="fas fa-square" style="-webkit-text-fill-color: black"></i>
      </button>
      <button class="menu-item" v-bind:class="{ 'is-active': strokeColor === 'red' }" @click="strokeColor = 'red'">
          <i class="fas fa-square" style="-webkit-text-fill-color: red"></i>
      </button>
      <button class="menu-item" v-bind:class="{ 'is-active': strokeColor === 'blue' }" @click="strokeColor = 'blue'">
          <i class="fas fa-square" style="-webkit-text-fill-color: blue"></i>
      </button>
      <button class="menu-item" v-bind:class="{ 'is-active': strokeColor === 'green' }" @click="strokeColor = 'green'">
          <i class="fas fa-square" style="-webkit-text-fill-color: green"></i>
      </button>
    </div>

    <div ref="canvasCont" style="position: relative; height: 100%">
      <canvas class="canvas" :id="'canvasImg' + id" :width="canvasSize.wa" :height="canvasSize.ha"></canvas>
      <canvas class="temp" :id="'canvas' + id" :width="canvasSize.wa" :height="canvasSize.ha"></canvas>
      <canvas
        class="temp"
        :id="'canvasTemp' + id"
        v-on:mousedown="handleMouseDown"
        v-on:mouseup="handleMouseUp"
        v-on:mousemove="handleMouseMove"
        :width="canvasSize.wa"
        :height="canvasSize.ha"
      ></canvas>
      <div
        v-bind:style="{ display: showTextFloater}"
        class="addTextFloater"
        id="addTextFloater"
        @mousemove="moveAddTextFloater"
      >
        <div>
          <textarea
            id="addTextFloaterTextBox"
            v-model="textToAdd"
            v-bind:style="{ color: strokeColor, 'font-size': fontSize + 'px' }"
            class="addTextFloaterInput"
            name="name"
            rows="1"
            cols="10"
            @mousemove="moveAddTextFloater"
          ></textarea>
        </div>
        <div
          style="margin-left: 5px"
          @mousemove="moveAddTextFloater"
        >
          <div style="width: 120px; display: flex; flex-wrap: wrap">
            <cui-button
              icon="fas fa-plus"
              @click="fontSize=fontSize+4"
              @mousemove="moveAddTextFloater"
            />
            <cui-button
              icon="fas fa-arrows-alt"
              @mousedown="downAddTextFloater"
              @mouseup="upAddTextFloater"
              @mousemove="moveAddTextFloater"
            />
            <cui-button
              icon="fas fa-minus"
              @click="fontSize=fontSize-4" 
              @mousemove="moveAddTextFloater"
            />
            <cui-button
              icon="fas fa-check"
              @click="drawText"
              @mousemove="moveAddTextFloater"
            />
          </div>
        </div>
        <!-- <resize-observer style="display: none" @notify="onResize"/> -->
      </div>
    </div>
  </div>
</template>

<script>
// import { ResizeObserver } from "vue-resize";
export default {
//   components: {
//     "resize-observer": ResizeObserver
//   },
  props: {
    width: {
      type: Number,
      default: 600
    }, 
    height: {
      type: Number,
      default: 500
    }, 
    xRay: {
      type: Boolean,
      default: false
    },
    schema: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: '123'
    }
  },
  data() {
    return {
      mounted: false,
      textToAdd: "",
      addTextFloater: {
        mouseDown: false,
        moveStart: {}
      },
      imageCanvas: {
        ctx: ""
      },
      mainCanvas: {
        c: "",
        ctx: "",
        w: "",
        h: ""
      },
      outputCanvas: {
        c: "",
        ctx: ""
      },
      mouse: {
        current: {
          x: 0,
          y: 0
        },
        previous: {
          x: 0,
          y: 0
        },
        down: false
      },
      drawMode: "pencil",
      strokeColor: "black",
      fontSize: 12
    };
  },
  computed: {
    random() {
      return new Date().getTime();
    },
    canvasSize() {
      var h = this.height;
      var w = this.width;
      return {
        w: w + "px",
        h: h + "px",
        wa: w,
        ha: h
      };
    },
    showTextFloater: function() {
      if (this.drawMode === "text") {
        return "flex";
      } else {
        return "none";
      }
    },
    currentMouse: function() {
      return {
        x: this.mouse.current.x,
        y: this.mouse.current.y
      };
    }
  },
  mounted: function() {
    this.mainCanvas.c = document.getElementById("canvasTemp" + this.id);
    this.mainCanvas.ctx = this.mainCanvas.c.getContext("2d");
    this.imageCanvas.c = document.getElementById("canvasImg" + this.id);
    this.imageCanvas.ctx = this.imageCanvas.c.getContext("2d");
    this.outputCanvas.c = document.getElementById("canvas" + this.id);
    this.outputCanvas.ctx = this.outputCanvas.c.getContext("2d");
    this.mainCanvas.w = this.outputCanvas.c.style.width;
    this.mainCanvas.h = this.outputCanvas.c.style.height;
    if (this.xRay) {
      this.setFullCanvas(this.schema)
    }
    this.mounted = true;
  },
  methods: {
    onResize() {
      var div = document.getElementById("addTextFloater");
      this.addTextFloater.w = div.offsetWidth;
      this.addTextFloater.h = div.offsetHeight;
    },
    draw() {
      if (this.mouse.down) {
        this.mainCanvas.ctx.clearRect(
          0,
          0,
          this.canvasSize.wa,
          this.canvasSize.ha
        );
        this.mainCanvas.ctx.lineTo(this.currentMouse.x, this.currentMouse.y);
        this.mainCanvas.ctx.strokeStyle = this.strokeColor;
        this.mainCanvas.ctx.lineWidth = 2;
        this.mainCanvas.ctx.stroke();
      }
    },
    drawLine() {
      if (this.mouse.down) {
        this.mainCanvas.ctx.clearRect(
          0,
          0,
          this.canvasSize.wa,
          this.canvasSize.ha
        );
        this.mainCanvas.ctx.beginPath();
        this.mainCanvas.ctx.moveTo(
          this.mouse.previous.x,
          this.mouse.previous.y
        );
        this.mainCanvas.ctx.lineTo(this.currentMouse.x, this.currentMouse.y);
        this.mainCanvas.ctx.strokeStyle = this.strokeColor;
        this.mainCanvas.ctx.lineWidth = 2;
        this.mainCanvas.ctx.stroke();
      }
    },
    drawBox() {
      if (this.mouse.down) {
        this.mainCanvas.ctx.clearRect(
          0,
          0,
          this.canvasSize.wa,
          this.canvasSize.ha
        );
        this.mainCanvas.ctx.beginPath();
        this.mainCanvas.ctx.strokeStyle = this.strokeColor;
        this.mainCanvas.ctx.lineWidth = 2;
        this.mainCanvas.ctx.strokeRect(
          this.mouse.previous.x,
          this.mouse.previous.y,
          this.currentMouse.x - this.mouse.previous.x,
          this.currentMouse.y - this.mouse.previous.y
        );
      }
    },
    handleMouseDown(event) {
      this.mouse.down = true;
      this.mouse.current = {
        x: event.offsetX,
        y: event.offsetY
      };
      this.mainCanvas.ctx.beginPath();
      this.mouse.previous.x = this.mouse.current.x;
      this.mouse.previous.y = this.mouse.current.y;
      this.mainCanvas.ctx.moveTo(this.currentMouse.x, this.currentMouse.y);
    },
    handleMouseUp() {
      this.mouse.down = false;
      this.imgUpdate();
      this.addTextFloater.mouseDown = false;
    },
    handleMouseMove(event) {
      this.moveAddTextFloater();
      this.mouse.current = {
        x: event.offsetX,
        y: event.offsetY
      };
      if (this.drawMode === "pencil") {
        this.draw(event);
      } else if (this.drawMode === "line") {
        this.drawLine(event);
      } else if (this.drawMode === "box") {
        this.drawBox(event);
      }
    },
    imgUpdate() {
      this.outputCanvas.ctx.drawImage(this.mainCanvas.c, 0, 0);
      this.mainCanvas.ctx.clearRect(
        0,
        0,
        this.canvasSize.wa,
        this.canvasSize.ha
      );
    },
    downAddTextFloater(event) {
      this.addTextFloater.mouseDown = true;
      this.addTextFloater.moveStart.x = event.pageX;
      this.addTextFloater.moveStart.y = event.pageY;
    },
    upAddTextFloater() {
      this.addTextFloater.mouseDown = false;
    },
    moveAddTextFloater(event) {
      if (this.addTextFloater.mouseDown) {
        event = event || window.event;
        var div = document.getElementById("addTextFloater")
        var textBox = document.getElementById("addTextFloaterTextBox")
        var y = event.pageY - this.addTextFloater.moveStart.y
        var x = event.pageX - this.addTextFloater.moveStart.x
        
        if (div.offsetLeft < 1) {
          div.style.left = "1px";
          //this.upAddTextFloater();
          return;
        } else if (div.offsetTop < 1) {
          div.style.top = "1px";
          //this.upAddTextFloater();
          return;
        } else if (div.offsetLeft + textBox.clientWidth > this.canvasSize.wa) {
          div.style.left =
            this.canvasSize.wa - textBox.clientWidth - 1 + "px";
          //this.upAddTextFloater();
          return;
        } else if (div.offsetTop + textBox.clientHeight > this.canvasSize.ha) {
          div.style.top = this.canvasSize.ha - textBox.clientHeight - 1 + "px";
          //this.upAddTextFloater();
          return;
        }
        

        div.style.top = div.offsetTop + y + "px";
        div.style.left = div.offsetLeft + x + "px";
        this.addTextFloater.moveStart.y = event.pageY;
        this.addTextFloater.moveStart.x = event.pageX;
      }
    },

    drawText() {
      var div = document.getElementById("addTextFloater");
      var x = div.offsetLeft;
      var y = div.offsetTop;
      var style = this.fontSize + "px monospace";
      this.outputCanvas.ctx.font = style;
      this.outputCanvas.ctx.fillStyle = this.strokeColor;
      this.outputCanvas.ctx.textBaseline = "hanging";
      this.outputCanvas.ctx.fillText(this.textToAdd, x + 2, y + 4);
      this.drawMode = "pencil";
    },
    addImage(url) {
      var img = document.createElement("img");
      // img.setAttribute("crossOrigin", "anonymous");
      img.src = url;
      img.onload = function() {
        var ratio = this.canvasSize.ha / 1400;
        var w = img.width * ratio;
        var h = this.canvasSize.ha;
        var posX = this.canvasSize.wa / 2 - w / 2;
        this.imageCanvas.ctx.clearRect(
          0,
          0,
          this.canvasSize.wa,
          this.canvasSize.ha
        );
        this.imageCanvas.ctx.drawImage(img, posX, 0, w, h);
      }.bind(this);
    },
    setFullCanvas(data) {
      let that = this;
      var img = new Image();
      img.setAttribute("crossOrigin", "use-credentials");
      img.onload = function() {
        that.imageCanvas.ctx.drawImage(img, 0, 0);
      };
      img.src =this.$globals.schemaUrl + data + "?random=" + this.random
      if(this.xRay && this.schema !== 'lung_schema.png') {
        img.src =this.$globals.filesUrl + data + "?random=" + this.random
      }
    },
    getFullCanvas() {
      this.imageCanvas.ctx.drawImage(this.outputCanvas.c, 0, 0);
      return this.imageCanvas.c.toDataURL();
    //   this.imageCanvas.ctx.clearRect(0, 0);
    },
    getPainting() {
      this.imageCanvas.ctx.drawImage(this.outputCanvas.c, 0, 0);
      //following taken from https://stackoverflow.com/questions/11796554/automatically-crop-html5-canvas-to-contents?answertab=votes#tab-top
      var w = this.imageCanvas.c.width,
        h = this.imageCanvas.c.height,
        pix = { x: [], y: [] },
        imageData = this.imageCanvas.ctx.getImageData(
          0,
          0,
          this.imageCanvas.c.width,
          this.imageCanvas.c.height
        ),
        x,
        y,
        index;

      for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
          index = (y * w + x) * 4;
          if (imageData.data[index + 3] > 0) {
            pix.x.push(x);
            pix.y.push(y);
          }
        }
      }
      pix.x.sort(function(a, b) {
        return a - b;
      });
      pix.y.sort(function(a, b) {
        return a - b;
      });
      var n = pix.x.length - 1;

      w = pix.x[n] - pix.x[0];
      h = pix.y[n] - pix.y[0];
      var cut = this.imageCanvas.ctx.getImageData(pix.x[0], pix.y[0], w, h);

      this.imageCanvas.c.width = w + 5;
      this.imageCanvas.c.height = h + 5;
      this.imageCanvas.ctx.putImageData(cut, 0, 0);

      return this.imageCanvas.c


    }
  },
  ready: function() {
    this.mainCanvas.ctx.translate(0.5, 0.5);
    this.mainCanvas.ctx.imageSmoothingEnabled = false;
  }
};
</script>

<style scoped>
.temp {
  position: absolute;
  top: 0;
  left: 0;
}

.addTextFloater {
  position: absolute;
  top: 50px;
  left: 50px;
}

.addTextFloaterInput {
  border: solid 1px black;
  background-color: transparent;
}
.addTextFloaterInput:focus {
  outline: none;
}
.menu-item {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--cui-font-color);
  border: none;
  background-color: transparent;
  border-radius: 0.4rem;
  padding: 0.25rem;
  margin-right: 0.25rem;
  cursor: pointer
}

.menu-item.is-active,
.menu-item:hover {
    color: #FFF;
    background-color: var(--cui-dark);
}
</style>
