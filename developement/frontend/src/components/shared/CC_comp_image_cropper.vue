<template>
    <div>
        <vs-row style="margin: 20px 0">
            <vs-button dark @click="$refs.input.click()">画像選択</vs-button>
        </vs-row>
        <vs-row v-if="imgSrc" style="margin: 0 10px">
            <vs-col w="8">
            <vueCropper
                ref="cropper"
                :aspect-ratio="1"
                :src="imgSrc"
                preview="#preview"
            />
            </vs-col>
            <vs-col w="4" style="padding-left: 40px">
                <h3 style="margin-top: 0">プレビュー</h3>
                <div 
                    id="preview" 
                    style="height: 150px; width: 150px; overflow: hidden"
                    v-bind:style="{'border-radius': previewRadius}"></div>
            </vs-col>
        </vs-row>
        <input
            ref="input"
            type="file"
            name="image"
            accept="image/*"
            style="display: none"
            @change="setImage"
        />
    </div>
</template>

<script>

import vueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
    props: {
        previewRadius: {default:'0px'},
        height: {type: Number, default: 1000},
        width: {type: Number, default: 1000}
    },
    components: {
        vueCropper
    },
    data() {
        return {
            imgSrc: null
        }
    },
    methods: {
        getImage() {
            return this.$refs.cropper.getCroppedCanvas({height: this.height, width: this.width})
        },
        setImage(e) {
            const file = e.target.files[0];
            if (file.type.indexOf('image/') === -1) {
                alert('Please select an image file')
                return
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader()
                reader.onload = (event) => {
                    this.imgSrc = event.target.result
                    // rebuild cropperjs with the updated source
                    setTimeout(function() {
                        this.$refs.cropper.replace(event.target.result)
                        this.$emit('selected')
                    }.bind(this), 200)
                }
                reader.readAsDataURL(file)
            } else {
                alert('Sorry, FileReader API not supported')
            }
        },

    }

}
</script>
