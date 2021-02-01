<?php

namespace App\Http\Controllers;

use App\Middleware\Orcaapi;
use App\Middleware\Orcadb;
use App\Database\Queries\Vital;
use App\Database\Queries\Patientnote;
use App\Database\Queries\Procedure;

class Medicalinfos {

    private $rdata;

    private function orca_update() {

        $raw = $this->rdata->raw;
        
        $patient_orca = (object)[
            'id' => $raw->Patient_ID,  (isset($raw->Patient_ID)) ? $raw->Patient_ID : null,
            'name' => $raw->WholeName,  (isset($raw->WholeName)) ? $raw->WholeName : null,
            'nameKana' => $raw->WholeName_inKana,  (isset($raw->WholeName_inKana)) ? $raw->WholeName_inKana : null,
            'birthDate' => $raw->BirthDate,  (isset($raw->BirthDate)) ? $raw->BirthDate : null,
            'gender' => $raw->Sex,  (isset($raw->Sex)) ? $raw->Sex : null,
            'Relationship' => $raw->Relationship,  (isset($raw->Relationship)) ? $raw->Relationship : null,
            'householderName' => $raw->HouseHolder_WholeName,  (isset($raw->HouseHolder_WholeName)) ? $raw->HouseHolder_WholeName : null,
            'occupationName' => $raw->Occupation,  (isset($raw->Occupation)) ? $raw->Occupation : null,
            'phone' => $raw->CellularNumber,  (isset($raw->CellularNumber)) ? $raw->CellularNumber : null,
            'mail' => $raw->EmailAddress,  (isset($raw->EmailAddress)) ? $raw->EmailAddress : null,
            'Allergy1' => (isset($raw->Allergy1)) ? $raw->Allergy1 : null,
            'Infection1' => (isset($raw->Infection1)) ? $raw->Infection1 : null,
            'Comment1' => (isset($raw->Comment1)) ? $raw->Comment1 : null,
            'address_zip' => $raw->Home_Address_Information->Address_ZipCode,  (isset($raw->Home_Address_Information->Address_ZipCode)) ? $raw->Home_Address_Information->Address_ZipCode : null,
            'address_addr1' => $raw->Home_Address_Information->WholeAddress1,  (isset($raw->Home_Address_Information->WholeAddress1)) ? $raw->Home_Address_Information->WholeAddress1 : null,
            'address_addr2' => $raw->Home_Address_Information->WholeAddress2,  (isset($raw->Home_Address_Information->WholeAddress2)) ? $raw->Home_Address_Information->WholeAddress2 : null,
            'comp_name' => $raw->WorkPlace_Information->WholeName,  (isset($raw->WorkPlace_Information->WholeName)) ? $raw->WorkPlace_Information->WholeName : null,
            'comp_zip' => $raw->WorkPlace_Information->Address_ZipCode,  (isset($raw->WorkPlace_Information->Address_ZipCode)) ? $raw->WorkPlace_Information->Address_ZipCode : null,
            'comp_addr1' => $raw->WorkPlace_Information->WholeAddress1,  (isset($raw->WorkPlace_Information->WholeAddress1)) ? $raw->WorkPlace_Information->WholeAddress1 : null,
            'comp_addr2' => $raw->WorkPlace_Information->WholeAddress2,  (isset($raw->WorkPlace_Information->WholeAddress2)) ? $raw->WorkPlace_Information->WholeAddress2 : null,
            'comp_tel' => $raw->WorkPlace_Information->PhoneNumber,  (isset($raw->WorkPlace_Information->PhoneNumber)) ? $raw->WorkPlace_Information->PhoneNumber : null,
            'pregnantFlag' => (isset($raw->PregnantFlag)) ? $raw->PregnantFlag : null,
        ];

        $orca_data = [
            'insurances' => null,
            'patient' => $patient_orca,
            'kouhi' => null,
            'hasKouhi' => false,
            'hasIns' => false,
            'editGB' => false
        ];
        
        $orca = new Orcaapi();
        $orca_query = $orca->patient_edit($orca_data);

        if(!$orca_query->ok) {
            $res->message = $orca_query->msg;
            return;
        }
        
    }

    public function update($req, $res) {

        $this->rdata = $req->update[0];

        if ($this->rdata->mode === 'basicEdit') {

            if ($this->rdata->patientData->pregnantFlag !== $this->rdata->insertData->pregnantFlag) {
                if ($this->rdata->insertData->pregnantFlag) {
                  $this->rdata->raw->PregnantFlag = "True";
                } else {
                  $raw['PregnantFlag'] = "False";
                }
                $this->orca_update();
            }
            
            $vital_data = [];
            if ($this->rdata->insertData->tab !== $this->rdata->patientData->tab) {
                array_push($vital_data, ['id' => 1, 'value' => $this->rdata->insertData->tab]);
            }
            if ($this->rdata->insertData->alc !== $this->rdata->patientData->alc) {
                array_push($vital_data, ['id' => 2, 'value' => $this->rdata->insertData->alc]);
            }
            if ($this->rdata->insertData->blood !== $this->rdata->patientData->blood) {
                array_push($vital_data, ['id' => 104, 'value' => $this->rdata->insertData->blood]);
            }
            if ($this->rdata->insertData->expectedDate !== $this->rdata->patientData->expectedDate) {
                array_push($vital_data, ['id' => 100, 'value' => $this->rdata->insertData->expectedDate]);
            }
            
            $db = new Vital();

            foreach($vital_data as $key => $value) {

                $value['patient_id'] = $this->rdata->patientData->patientID;
                $query = $db->post($value);
    
                if(!$query->ok) {
                    $res->message = $query->msg;
                    return;
                }

            }
        }

        if ($this->rdata->mode === 'allprinfEdit') {

            $this->rdata->raw->PregnantFlag = 
                $this->rdata->raw->Personally_Information->Pregnant_Class;

            $insertString = "";
            foreach($this->rdata->insertData->value as $key => $value) {
                $insertString = $insertString . $value->name . ";;";
            }
            $insertString = substr($insertString, 0, -2);
            $insertString = mb_convert_kana($insertString, "A");

            $vital_code = $this->rdata->insertData->target;
            $this->rdata->raw->{$vital_code} = $insertString;

            if (isset($this->rdata->insertData->addValue)) {
              $mod_value = 'ADD_' . $this->rdata->insertData->addValue;
            } else if (isset($this->rdata->insertData->removeValue)) {
              $mod_value = 'DEL_' . $this->rdata->insertData->removeValue;
            }
          
            $db = new Vital();

            $query_data = [
                'id' => null,
                'patient_id' => $this->rdata->patientData->patientID,
                'value' => $mod_value,
                'vital_code' => $vital_code

            ];

            $query = $db->post($query_data);

            if(!$query->ok) {
                $res->message = $query->msg;
                return;
            }

            $this->orca_update();
        }





        $res->success = true;

    }

    public function get($req, $res) {

        // Define Variables
        $patient_id = $req->itemId;
        $return_data = [
            'basic' => [],
            'vitals' => [],
            'Allergy1' => [],
            'Comment1' => [],
            'Infection1' => [],
            'byoumei' => [],
            'byoumei_history' => [],
            'notes' => [],
            'koui' => [],
            'karte' => [],
            'raw' => null
        ];
        $expectedDate = null;
        $alc = '不明';
        $tab = '不明';
        $blood = '不明';
        $pregnantFlag = false;

        // Get Orca data
        $orca = new Orcaapi();
        $orca_query = $orca->get_patient_info($patient_id);

        if(!$orca_query->ok) {
            $res->message = $orca_query->msg;
            return;
        }

        $return_data['raw'] = $orca_query->result;
        $orca_data = $orca_query->result;

        // Get Vitals
        $db = new Vital();
        $query = $db->get($patient_id);
        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $vitals = $query->data;
        $return_data['vitals'] = $vitals;

        foreach($vitals as $key => $value) {

            if ($value['vital_id'] === 1 && $tab === '不明') {
                $tab = $value['value'];
            }
            if ($value['vital_id'] === 2 && $alc === '不明') {
                $alc = $value['value'];
            }
            if ($value['vital_id'] === 104 && $blood === '不明') {
                $blood = $value['value'];
            }
            if ($value['vital_id'] === 100 && $expectedDate) {
                $expectedDate = $value['value'];
            }
        }

        // Pregnant Flag
        if (isset($orca_data->Personally_Information->Pregnant_Class)) {
            $pregnantFlag = true;
        }
        
        // Allergy
        if (isset($orca_data->Allergy1)) {
            $orca_data->Allergy1 = mb_convert_kana($orca_data->Allergy1, "a");
            $return_data['Allergy1'] = explode(";;", $orca_data->Allergy1);
        }

        // Problems
        if (isset($orca_data->Comment1)) {
            $orca_data->Comment1 = mb_convert_kana($orca_data->Comment1, "a");
            $return_data['Comment1'] = explode(";;", $orca_data->Comment1);
        }

        // Infection
        if (isset($orca_data->Infection1)) {
            $orca_data->Infection1 = mb_convert_kana($orca_data->Infection1, "a");
            $return_data['Infection1'] = explode(";;", $orca_data->Infection1);
        }

        $orca_data = json_encode($orca_data);
        $orca_data = json_decode($orca_data, true);        

        $return_data['basic'] = [
            'patientName' => $orca_data['WholeName'],
            'patientNameKana' => $orca_data['WholeName_inKana'],
            'patientID' => $patient_id,
            'birthDate' => $orca_data['BirthDate'],
            'pregnantFlag' => $pregnantFlag,
            'expectedDate' => $expectedDate,
            'gender' => $orca_data['Sex'],
            'blood' => $blood,
            'alc' => $alc,
            'tab' => $tab,
        ];

        // Get Orca Data for Byoumei
        $diseases = $orca->patient_disease_get($patient_id);

        if(!$orca_query->ok) {
            $res->message = $orca_query->msg;
            return;
        }

        $diseases = $diseases->result->Disease_Information;

        $diseases = json_encode($diseases);
        $diseases = json_decode($diseases, true);
        
        if (isset($diseases['Disease_Information_child'])) {
            if (isset($diseases['Disease_Information_child']['Department_Code'])) {
                $return_data['byoumei'][0] = $diseases['Disease_Information_child'];
            } else {
                $return_data['byoumei'] = $diseases['Disease_Information_child'];
            }
        }

        // Full Disease History

        $disease_history = new Orcadb();
        $disease_history->disease_history($patient_id);

        
        if(!$disease_history->ok) {
            $res->message = $disease_history->msg;
            return;
        }
        
        $disease_history = $disease_history->data;
        foreach ($disease_history as $key => $value) {
            $disease_history[$key]['byomei'] = mb_convert_encoding($value['byomei'], "UTF-8", "EUC-JP");
            $disease_history[$key]['hosoku_comment'] = mb_convert_encoding($value['hosoku_comment'], "UTF-8", "EUC-JP");
        }

        $return_data['byoumei_history'] = $disease_history;
        
        //Notes

        $db = new Patientnote();
        $patient_notes = $db->get($patient_id);

        if(!$patient_notes->ok) {
            $res->message = $patient_notes->msg;
            return;
        }

        $patient_notes = $patient_notes->data;

        foreach($patient_notes as $key => $value) {
            $date = date_create($value['insert_date']);
            $date = date_format($date, 'Y年n月j日');

            $patient_notes[$key]['insertDate'] = $date;
            $patient_notes[$key]['dummy'] = $value['note'];
            $patient_notes[$key]['edit'] = false;    
        }

        $return_data['notes'] = $patient_notes;

        // Procedures
        
        $db = new Procedure();
        $procedures = $db->get($patient_id);

        if(!$procedures->ok) {
            $res->message = $procedures->msg;
            return;
        }

        $procedures = $procedures->data;

        foreach($procedures as $key => $value) {
            
            $date = $value['date'];
            $encounterID = $value['id'];
    
            array_push($return_data['karte'], $value);

            if ($value['content_koui'] != null) {
                $value = json_decode($value['content_koui']);
                foreach ($value as $skey => $svalue) {
                    $svalue->date = $date;
                    $svalue->encounterID = $encounterID;
                    array_push($return_data['koui'], $svalue);
                }
            }
    
        }

        $res->data = $return_data;
        $res->success = true;
        
    }

}