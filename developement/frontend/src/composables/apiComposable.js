import { useToast } from "primevue/usetoast"

const request = function (route, data, type, abortSignal) {

    const promise = new Promise(function (resolve, reject) {

        let options = {
            method: type,
            signal: abortSignal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        if (type !== 'GET') {

            if (route === "uploads/single") {
                let fd = new FormData();
                fd.append("data", JSON.stringify(data.meta));
                fd.append("file", data.file);
                options = {
                    method: type,
                    body: fd,
                    signal: abortSignal,
                }
            } else {

                options = {
                    method: type,
                    body: JSON.stringify(data),
                    signal: abortSignal,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }

            }

        }

        fetch('/api/' + route, options)
            .then((res) => {
                if (!res.ok) {
                    const contentType = res.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        res.json().then(result => reject(result.message));
                        return;
                    } else {
                        res.text().then(result => reject(result));
                        return;
                    }
                }
                res.json().then(result => resolve(result));
            })
            .catch((res) => {
                if (res.statusText) {
                    reject(res.statusText)
                }
                reject(res);
            });
    });
    return promise;
}


export default {
    get: async function (route, data = {}, abortSignal = null) {
        const toast = useToast()
        try {
            return await request(route, data, "GET", abortSignal);
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
            return false
        }
    },
    post: async function (route, data = {}, abortSignal = null) {
        const toast = useToast()
        try {
            return await request(route, data, "POST", abortSignal);
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
            return false
        }
    },
    put: async function (route, data = {}, abortSignal = null) {
        const toast = useToast()
        try {
            return await request(route, data, "PUT", abortSignal);
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
            return false
        }
    },
    delete: async function (route, data = {}, abortSignal = null) {
        const toast = useToast()
        try {
            return await request(route, data, "DELETE", abortSignal);
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
            return false
        }
    }
}

