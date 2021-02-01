<?php
namespace App\Http\Controllers;

use App\Database\Queries\Patient;
use App\Database\Queries\File;
use App\Middleware\Orcaapi;
use stdClass;

class Patients {

    public function all($req, $res) {

        $query_data = $req->params;

        $db_data = new Patient();
        $query = $db_data->all($query_data);
        if ($query->ok) {
            $res->success = true;
            $res->data = $query->data;
        } else {
            $res->message = $query->msg;
        }
    }

    public function get($req, $res) {

        $patient_id = $req->itemId;

        $orca_data = new Orcaapi();
        $query = $orca_data->get_patient_info($patient_id);
        if ($query->ok) {
            $setData = array();
            $orca_result = $query->result;
            $insurances = $orca_result->HealthInsurance_Information->HealthInsurance_Information_child;
            foreach($insurances as $value) {
                $tempArray = [
                    'ID' => (string) $value->Insurance_Combination_Number,
                    'insuranceClass' => (string) $value->InsuranceProvider_Class,
                    'wholeName' => (string) $value->InsuranceProvider_WholeName,
                    'pub1' => "",
                    'pub2' => "",
                    'pub3' => "",
                    'pub4' => "",
                    'selected' => false,
                ];
                $i = 1;
                foreach ($value->PublicInsurance_Information as $valuePublic) {
                    $tempArray['pub' . $i] = (string) $valuePublic->PublicInsurance_Information_child->PublicInsurance_Name;
                    $i++;
                }
                array_push($setData, $tempArray);
            }
            $orca_result = json_decode(json_encode($orca_result), true);
            if (isset($orca_result['Relationship']) && $orca_result['Relationship'] === '１') {
                $orcaRelation = $orca_result['Relationship'];
                $householder = $orca_result['WholeName'];
            } else {
                $orcaRelation = null;
                $householder = $orca_result['HouseHolder_WholeName'];
            }
            $res->data = [
                'id' => $patient_id,
                'name' => $orca_result['WholeName'],
                'nameKana' => $orca_result['WholeName_inKana'],
                'birthDate' => $orca_result['BirthDate'],
                'gender' => $orca_result['Sex'],
                'householderName' => $householder,
                'relation' => $orcaRelation,
                'occupation' => (isset($orca_result['Occupation'])) ? $orca_result['Occupation'] : null,
                'phone' => (isset($orca_result['CellularNumber'])) ? $orca_result['CellularNumber'] : null,
                'mail' => (isset($orca_result['EmailAddress'])) ? $orca_result['EmailAddress'] : null,
                'address_zip' => (isset($orca_result['Home_Address_Information']['Address_ZipCode'])) ? $orca_result['Home_Address_Information']['Address_ZipCode'] : null,
                'address_addr1' => (isset($orca_result['Home_Address_Information']['WholeAddress1'])) ? $orca_result['Home_Address_Information']['WholeAddress1'] : null,
                'address_addr2' => (isset($orca_result['Home_Address_Information']['WholeAddress2'])) ? $orca_result['Home_Address_Information']['WholeAddress2'] : null,
                'comp_name' => (isset($orca_result['WorkPlace_Information']['WholeName'])) ? $orca_result['WorkPlace_Information']['WholeName'] : null,
                'comp_zip' => (isset($orca_result['WorkPlace_Information']['Address_ZipCode'])) ? $orca_result['WorkPlace_Information']['Address_ZipCode'] : null,
                'comp_addr1' => (isset($orca_result['WorkPlace_Information']['WholeAddress1'])) ? $orca_result['WorkPlace_Information']['WholeAddress1'] : null,
                'comp_addr2' => (isset($orca_result['WorkPlace_Information']['WholeAddress2'])) ? $orca_result['WorkPlace_Information']['WholeAddress2'] : null,
                'comp_tel' => (isset($orca_result['WorkPlace_Information']['PhoneNumber'])) ? $orca_result['WorkPlace_Information']['PhoneNumber'] : null,
                'pregnantFlag' => (isset($orca_result['Personally_Information']['Pregnant_Class'])) ? $orca_result['Personally_Information']['Pregnant_Class'] : null,
                'Allergy1' => (isset($orca_result['Allergy1'])) ? $orca_result['Allergy1'] : null,
                'Comment1' => (isset($orca_result['Comment1'])) ? $orca_result['Comment1'] : null,
                'Infection1' => (isset($orca_result['Infection1'])) ? $orca_result['Infection1'] : null,
                'sets' => $setData
            ];
        } else {
            $res->message = $query->msg;
            return;
        }

        //Get Insurances and Public (above will only provide sets)
        $orca_data = new Orcaapi();
        $insurances_query = $orca_data->get_patient_insurances($patient_id);
        if ($insurances_query->ok) {
            $set_data = $insurances_query->result->Patient_Information->Patient_Information_child;
            $rdata = [
                'insurances' => json_decode(json_encode($set_data->HealthInsurance_Information), true)['HealthInsurance_Information_child'],
                'public' => []
            ];
            if (isset(json_decode(json_encode($set_data->PublicInsurance_Information), true)['PublicInsurance_Information_child'])) {
                $rdata['public'] = json_decode(json_encode($set_data->PublicInsurance_Information), true)['PublicInsurance_Information_child'];
            }
            // If only one entry, it will insert all the data in the root. Need to move the data to [0]
            if (count($rdata['insurances']) >0 && !isset($rdata['insurances'][0])) {
                $rdata['insurances'] = [$rdata['insurances']];
            }
            if (count($rdata['public']) >0 && !isset($rdata['public'][0])) {
                $rdata['public'] = [$rdata['public']];
            }
            $res->data['insurances'] = $rdata;
        } else {
            $res->message = $query->msg;
            return;
        }

        // Get files
        $db_data = new File();
        $query = $db_data->all($patient_id);
        if ($query->ok) {
            $res->success = true;
            $res->data['files'] = [];
            foreach($query->data as $value) {
                if ($value['type'] == 1) {
                    $desc = explode('_', $value['name']);
                    if ($desc[0] === '2') {
                        $descName = '公費・受給者:' . $desc[1] . '　負担者番号:'. $desc[2];
                    } else {
                        $descName = '保険・記号:' . $desc[1] . '　番号:'. $desc[2];
                    }
                    $value['name'] = $descName;
                }
                array_push($res->data['files'], $value);
            }
        } else {
            $res->message = $query->msg;
            return;
        }
        $res->success = true;
    }

    public function update($req, $res) {

        $req_data = $req->update[0];
        $patient = $req_data->patient;
        $editGB = $req_data->editGB;
        
        $insurances = false;
        $kouhi = false;
        $add_insurance = false;
        $add_kouhi = false;

        if (count($req_data->insurances) > 0) {
            $insurances = $req_data->insurances;
            $add_insurance = true;
        }
        if (count($req_data->kouhi) > 0) {
            $kouhi = $req_data->kouhi;
            $add_kouhi = true;
        }
        
        //Insert Orca Data
        $orca_data = [
            'insurances' => $insurances,
            'patient' => $patient,
            'kouhi' => $kouhi,
            'hasKouhi' => $add_kouhi,
            'hasIns' => $add_insurance,
            'editGB' => $editGB
        ];
        
        $orca_result = new Orcaapi;
        $orca_result->patient_edit($orca_data);
        if(!$orca_result->ok) {
            $res->message = $orca_result->msg;
            return;
        }

        $patient->db_id = ltrim($patient->id, '0');

        $db_data = new Patient();
        $query = $db_data->update($patient);
        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        $res->success = true;
    }

    public function post($req, $res) {
        
        $req_data = $req->post->data;
        $insurances = false;
        $kouhi = false;
        $add_insurance = false;
        $add_kouhi = false;
        $patient = $req_data->patient;

        if (count($req_data->insurances) > 0) {
            $insurances = $req_data->insurances;
            $add_insurance = true;
        }
        if (count($req_data->kouhi) > 0) {
            $kouhi = $req_data->kouhi;
            $add_kouhi = true;
        }

        $orca_data = [
            'insurances' => $insurances,
            'patient' => $patient,
            'kouhi' => $kouhi,
            'hasKouhi' => $add_kouhi,
            'hasIns' => $add_insurance,
        ];

        $orca = new Orcaapi;
        $orca_result = $orca->patient_create($orca_data);
        if(!$orca_result->ok) {
            $res->message = $orca_result->msg;
            return;
        }

        $patient->id = ltrim($orca_result->result[0], '0');

        $db_data = new Patient();
        $query = $db_data->post($patient);
        if(!$query->ok) {
            $res->message = $query->msg;
            return;
        }
        $res->data = $patient->id;
        $res->success = true;
    }
}