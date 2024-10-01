
const blobToDataURL = async (files, meta = "") => {
    return Promise.all(
        files.map((file) => {
            return readAsDataURL(file);
        })
    );
    function readAsDataURL(file) {
        return new Promise((resolve) => {

            let fileReader = new FileReader();
            fileReader.onload = function () {
                return resolve({
                    data: fileReader.result,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    meta: meta,
                });
            };
            fileReader.readAsDataURL(file);
        });
    }
}

const objectURLtoBlob = async (files) => {
    return Promise.all(
        files.map(async (file) => {
            return await fetch(file[0].objectURL)
                .then(r => r.blob())
                .then(blobFile => new File(
                    [blobFile],
                    file[0].name,
                    { type: file[0].type }))

        }))
}

export default { blobToDataURL, objectURLtoBlob }
