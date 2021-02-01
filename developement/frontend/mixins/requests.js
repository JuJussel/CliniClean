import globals from '../globals'

export default {
  methods: {
    doRequest (type, data) {
      let self = this
      var promise = new Promise(function (resolve) {
        const server = globals.apiURL
        var $ = require('jquery')
        let sessionID = null
        if (type !== 'login') {
          sessionID = document.cookie.split('; ').find(row => row.startsWith('PHPSESSID')).split('=')[1];
        }
        var types = {
          login: {
            url: 'session_create',
            method: 'post'
          },
          sessionCheck: {
            url: 'session_get',
            method: 'post'
          },
          logout: {
            url: 'session_delete',
            method: 'post'
          },
          getUserData: {
            url: 'user_get',
            method: 'get'
          },
          getLists: {
            url: 'lists_get',
            method: 'get'
          },
          insuranceSearch: {
            url: 'insurance_get',
            method: 'get'
          },
          hokenshaGet: {
            url: 'hokensha_get',
            method: 'get'
          },
          patientCreate: {
            url: 'patient_create',
            method: 'post'
          },
          patientUpdate: {
            url: 'patient_update',
            method: 'post'
          },
          patientGetQuick: {
            url: 'patient_get_quick',
            method: 'get'
          },
          patient_get_details: {
            url: 'patient_get_details',
            method: 'get'
          },
          getZip: {
            url: 'zip_get',
            method: 'get'
          },
          receptionGet: {
            url: 'reception_get',
            method: 'get'
          },
          receptionCreate: {
            url: 'reception_create',
            method: 'post'
          },
          reservationCreate: {
            url: 'reservation_create',
            method: 'post'
          },
          receptionUpdate: {
            url: 'reception_update',
            method: 'post'
          },
          shinsatuStart: {
            url: 'shinsatu_start',
            method: 'post'
          },
          fileUpload: {
            url: 'file_upload',
            method: 'post'
          },
          kouiCheck: {
            url: 'koui_check',
            method: 'post'
          },
          insuranceGetSets: {
            url: 'insurance_get_sets',
            method: 'get'
          },
          kouiAddHistory: {
            url: 'koui_history_add',
            method: 'post'
          },
          karteSave: {
            url: 'karte_save',
            method: 'post'
          },
          karteClose: {
            url: 'karte_close',
            method: 'post'
          },
          karteGet: {
            url: 'karte_get',
            method: 'get'
          },
          ordersGet: {
            url: 'orders_get',
            method: 'get'
          },
          ordersUpdate: {
            url: 'orders_update',
            method: 'post'
          },
          sessionExtend: {
            url: 'blank',
            method: 'get'
          },
          paymentGet: {
            url: 'payment_get',
            method: 'get'
          },
          paymentCreate: {
            url: 'payment_create',
            method: 'post'
          },
          kenkoushindanSave: {
            url: 'kenkoushindan_save',
            method: 'post'
          },
          kenkoushindanGet: {
            url: 'kenkoushindan_get',
            method: 'get'
          },
          kartePause: {
            url: 'karte_pause',
            method: 'post'
          },
          kensaInputGet: {
            url: 'kensa_input_get',
            method: 'get'
          },
          kensaInputSave: {
            url: 'kensa_input_save',
            method: 'post'
          },
          patientGetMedical: {
            url: 'patient_get_medical',
            method: 'get'
          },
          patientMedicalEdit: {
            url: 'patient_medical_update',
            method: 'post'
          },
          getByoumeiSearch: {
            url: 'byoumei_get_search',
            method: 'get'
          },
          editByoumei: {
            url: 'byoumei_edit',
            method: 'post'
          },
          editNote: {
            url: 'note_edit',
            method: 'post'
          },
          vitalCreate: {
            url: 'vital_create',
            method: 'post'
          },
          karteListGet: {
            url: 'karte_list_get',
            method: 'get'
          },
          setEdit: {
            url: 'set_edit',
            method: 'post'
          },
          fileUpload: {
            url: 'file_upload',
            method: 'post'
          }
        }
        // End types

        // Request function
        if (types[type].method === 'get') { //GET
          let urlData = '?session_id=' + sessionID + '&data=' + data 
          fetch(server + types[type].url + '.php' + urlData)
          .then((response) => response.json())
          .then((response) => {
            if (response.err) {
              if (response.msg === 'si') {
                self.$eventHub.$emit('sessionInvalid')
              } else {
                alert(response.msg)
                self.$eventHub.$emit('loadingDone')
                resolve(response)
              }
            } else {
              resolve(response)
            }
          })
        } else { //POST
          let requestData = { session_id: sessionID, data: data }
          var fd = new FormData()
          fd.append('data', JSON.stringify(data))
          fd.append('session_id', sessionID)
          if (data.hasFiles) {
            data.fileList.forEach(file => {
              fd.append('files[]', file)
            })
          }
          fetch(server + types[type].url + '.php', {
            method: 'POST',
            body: fd,
          })
          .then((result) => result.json())
          .then((result) => {
            if (result.err) {
              if (result.msg === 'si') {
                self.$eventHub.$emit('sessionInvalid')
              } else {
                alert(result.msg)
                self.$eventHub.$emit('loadingDone')
                resolve(result)
              }
            } else {
              resolve(result)
            }
          })
        }
      })
      return promise
    }
  }
}
