<template>
  <div>
    <vs-input ref="fileInput" @input="addFile()" label="資格取得" type="file" style="display: none"/>
		<vs-table style="height: 160px">
			<template #notFound>
				<div>
					<b style="color: gray">ファイナルを選択してください</b>
				</div>
			</template>
			<template #header>
				<div class="cc-table-header-content">
					<h2>
						<span style="margin-left: 10px"> {{ title }} </span>
					</h2>
					<vs-button dark @click="chooseFile">ファイル選択</vs-button>
				</div>
			</template>

			<template #thead>
				<vs-tr>
					<vs-th>ファイル名</vs-th>
					<vs-th></vs-th>
				</vs-tr>
			</template>
			<template #tbody>
				<vs-tr v-for="(tr,index) in files" :key="index" style="align-items: center">
					<vs-td> {{ tr.name }} </vs-td>
					<vs-td>
						<vs-button size="small" dark border style="margin: 0" @click="removeFile(index)">
							<i class="fas fa-trash-alt"></i>
						</vs-button>
					</vs-td>
				</vs-tr>
			</template>
		</vs-table>
  </div>
</template>

<script>
export default {
	props: {
		title: {
			default: 'ファイル選択'
		}
	},
  data() {
    return {
      files: [],
    };
	},
	watch: {
		files() {
			this.$emit('change', this.files)
		}
	},
  methods: {
		chooseFile() {
			this.$refs.fileInput.$el.children[0].children[0].click()
		},
		removeFile(index) {
			this.files.splice(index, 1)
		},
    addFile() {
			let file = this.$refs.fileInput.$el.children[0].children[0].files[0]
			file = {name: file.name, type: file.type, data: file}
			this.files.push(file)
			this.$refs.fileInput.$el.children[0].children[0].value=''
    },
  },
};
</script>

