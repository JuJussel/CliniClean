<?php

namespace App\Middleware;

use App\Middleware\Httprequest;
use App\Middleware\Encountercost;
use stdClass;

class Orcaapi {

    private $orca_headers;
    private $orca_options;


    public function __construct() {
        $this->ok = false;
        $this->headers = array(
            'Content-Type: application/xml'
        );
        $this->options = array(
            'user' => $GLOBALS['config']['orcaapi']['user'],
            'pass' => $GLOBALS['config']['orcaapi']['pass']
        );
        $this->department_code = '01';
        $this->url = $GLOBALS['config']['orcaapi']['url'];

    }

    private function validate($expected, $target) {
        if ($this->response_status !== 200) {
            $this->msg = 
                "!!!エラー　ITまで連絡してください。
                \n Http request to Oraca failed! 
                \n Error code: " . $this->response_status
            ;
            return false;
        }
        $this->response = simplexml_load_string($this->response);
        if(!$this->response) {
            $this->msg = '';
            foreach (libxml_get_errors() as $orca_error) {
                $this->msg = $this->msg . $orca_error->message . "<br>";
            }
            return false;
        }
        $orca_api_result = strval($this->response->{$target}->Api_Result);
        if(!in_array($orca_api_result, $expected)) {
            $this->msg = strval($this->response->{$target}->Api_Result_Message);
            return false;
        }
        return true;
    }
    // Build Response
    private function response() {
        $return_data = new stdClass();
        $return_data->ok = $this->ok;
        $return_data->result = $this->response;
        if (isset($this->msg)) {
            $return_data->msg = $this->msg;
        }
        return $return_data;
    }
    
    // Execute get request
    private function get($route) {
        $request = new Httprequest($this->url . $route);
        $request->setBasicAuthCredentials(
            $this->options['user'],
            $this->options['pass']
        );
        $request->setHeaders($this->headers);
        $request->execute();
        $this->response = $request->getResponse();
        $this->response_status = $request->getHttpCode();
    }

    // Execute post request
    private function post($route, $query_string) {
        $request = new Httprequest($this->url . $route);
        $request->setRequestType('POST');
        $request->setPostFields($query_string);
        $request->setBasicAuthCredentials(
            $this->options['user'],
            $this->options['pass']
        );
        $request->setHeaders($this->headers);
        $request->execute();
        $this->response = $request->getResponse();
        $this->response_status = $request->getHttpCode();
    }

    // ToDo: Need to standardize function names...
    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Get Patient Info //////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function get_patient_info($query) {
        $route = '/api01rv2/patientgetv2?id=' . $query;
        $this->get($route);
        if ($this->validate(['00'], 'patientinfores')) {
            $this->ok = true;
            $this->response = $this->response->patientinfores->Patient_Information;
        }
        return $this->response();
    }
    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Get Patient Full Insucance Info ///////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function get_patient_insurances($orca_data) {
        $route = '/api01rv2/patientlst2v2?class=01';
        $request_string = 
        '   
            <data>
                <patientlst2req type="record">
                    <Patient_ID_Information type="array">
                            <Patient_ID_Information_child type="record">
                                    <Patient_ID type="string">' . $orca_data . '</Patient_ID>
                            </Patient_ID_Information_child>
                    </Patient_ID_Information>
                </patientlst2req>
            </data>
        ';
        $this->post($route, $request_string);
        if ($this->validate(['00'], 'patientlst2res')) {
            $this->ok = true;
            $this->response = $this->response->patientlst2res;
        }
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Update Patient Basic //////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function patient_edit($orca_data) {

        $orca_data_pat = $orca_data['patient'];
        $orca_birthdate = str_replace("/", "-", $orca_data_pat->birthDate);

        $mod = '1';
        if ($orca_data['editGB'] === 'true') {
            $mod = '2';
        }
        $orca_data_pat->name = mb_convert_kana($orca_data_pat->name, "A");

        $householder_rel = '２';
        $householder_name = mb_convert_kana($orca_data_pat->householderName, "A");
        if ($orca_data_pat->householderName == '本人') {
            $householder_rel = '１';
            $householder_name = $orca_data_pat->name;
        }
        if (isset($orca_data_pat->Relationship)) {
            $householder_rel = $orca_data_pat->Relationship;
            $householder_name = $orca_data_pat->householderName;
        }

        $route = '/orca12/patientmodv2?class=02';
        $request_string = 
        '
            <data>
                <patientmodreq type="record">
                    <Mod_Key type="string">' . $mod . '</Mod_Key>
                    <Patient_ID type="string">' . $orca_data_pat->id . '</Patient_ID>
                    <WholeName type="string">' . $orca_data_pat->name . '</WholeName>
                    <WholeName_inKana type="string">' . $orca_data_pat->nameKana . '</WholeName_inKana>
                    <BirthDate type="string">' . $orca_birthdate . '</BirthDate>
                    <Sex type="string">' . $orca_data_pat->gender . '</Sex>
                    <HouseHolder_WholeName type="string">' . $householder_name . '</HouseHolder_WholeName>
                    <Relationship type="string">' . $householder_rel . '</Relationship>
                    <Occupation type="string">' . $orca_data_pat->occupationName . '</Occupation>
                    <CellularNumber type="string">' . $orca_data_pat->phone . '</CellularNumber>
                    <EmailAddress type="string">' . $orca_data_pat->mail . '</EmailAddress>
                    <Allergy1 type="string">' . $orca_data_pat->Allergy1 . '</Allergy1>
                    <Infection1 type="string">' . $orca_data_pat->Infection1 . '</Infection1>
                    <Comment1 type="string">' . $orca_data_pat->Comment1 . '</Comment1>
                    <Home_Address_Information type="record">
                            <Address_ZipCode type="string">' . $orca_data_pat->address_zip . '</Address_ZipCode>
                            <WholeAddress1 type="string">' . $orca_data_pat->address_addr1 . '</WholeAddress1>
                            <WholeAddress2 type="string">' . $orca_data_pat->address_addr2 . '</WholeAddress2>
                            <PhoneNumber1 type="string"></PhoneNumber1>
                    </Home_Address_Information>
                    <WorkPlace_Information type="record">
                            <WholeName type="string">' . $orca_data_pat->comp_name . '</WholeName>
                            <Address_ZipCode type="string">' . $orca_data_pat->comp_zip . '</Address_ZipCode>
                            <WholeAddress1 type="string">' . $orca_data_pat->comp_addr1 . '</WholeAddress1>
                            <WholeAddress2 type="string">' . $orca_data_pat->comp_addr2 . '</WholeAddress2>
                            <PhoneNumber type="string">' . $orca_data_pat->comp_tel . '</PhoneNumber>
                    </WorkPlace_Information>
                    <Personally_Information type="record">
                            <Pregnant_Class type="string">' . $orca_data_pat->pregnantFlag . '</Pregnant_Class>
                    </Personally_Information>
                </patientmodreq>
            </data>
        ';
        $this->post($route, $request_string);
        if (!$this->validate(['00'], 'patientmodres')) {
            return;
        }

        // Add Insurance
        if ($orca_data['hasIns']) {

            foreach ($orca_data['insurances'] as $insurance_key => $insurance_value) {
            
                $insurance_relation = '2';
                if ($insurance_value->hihokensha->relation === '本人') {
                    $insurance_relation = '1';
                }
                $insurance_value->name = mb_convert_kana($insurance_value->name, 'RNSK');

                $route = '/orca12/patientmodv2?class=04';
                $request_string = 
                '
                    <data>
                        <patientmodreq type="record">
                                <Mod_Key type="string">2</Mod_Key>
                                <Patient_ID type="string">' . $orca_data_pat->id . '</Patient_ID>
                                <WholeName type="string">' . $orca_data_pat->name . '</WholeName>
                                <WholeName_inKana type="string">' . $orca_data_pat->nameKana . '</WholeName_inKana>
                                <BirthDate type="string">' . $orca_birthdate . '</BirthDate>
                                <Sex type="string">' . $orca_data_pat->gender . '</Sex>
                                <HealthInsurance_Information type="record">
                                        <InsuranceProvider_Class type="string"></InsuranceProvider_Class>
                                        <InsuranceProvider_Number type="string">' . $insurance_value->hokenshaNumber . '</InsuranceProvider_Number>
                                        <InsuranceProvider_WholeName type="string"></InsuranceProvider_WholeName>
                                        <HealthInsuredPerson_Symbol type="string">' . $insurance_value->kigou . '</HealthInsuredPerson_Symbol>
                                        <HealthInsuredPerson_Number type="string">' . $insurance_value->bangou . '</HealthInsuredPerson_Number>
                                        <RelationToInsuredPerson type="string">' . $insurance_relation . '</RelationToInsuredPerson>
                                        <HealthInsuredPerson_WholeName type="string">' . $insurance_value->name . '</HealthInsuredPerson_WholeName>
                                        <Certificate_StartDate type="string">' . $insurance_value->validDate[0] . '</Certificate_StartDate>
                                        <Certificate_ExpiredDate type="string">' . $insurance_value->validDate[1] . '</Certificate_ExpiredDate>
                                        <Certificate_GetDate type="string">' . $insurance_value->getDate . '</Certificate_GetDate>
                                        <PublicInsurance_Information type="array"></PublicInsurance_Information>
                                </HealthInsurance_Information>
                        </patientmodreq>
                    </data>
                ';
                $this->post($route, $request_string);
                if (!$this->validate(['00'], 'patientmodres')) {
                    return;
                }
            }
        }

        if ($orca_data['hasKouhi']) {

            $orca_publicInsurance = '';
            foreach ($orca_data['kouhi'] as $insurance_key => $kouhi_value) {
                $orca_temp =
                    '
                        <PublicInsurance_Information_child type="record">
                            <PublicInsurance_Class type="string"></PublicInsurance_Class>
                            <PublicInsurer_Number type="string">' . $kouhi_value->khFuSha . '</PublicInsurer_Number>
                            <PublicInsuredPerson_Number type="string">' . $kouhi_value->khRecp . '</PublicInsuredPerson_Number>
                            <Certificate_IssuedDate type="string">' . $kouhi_value->valid[0] . '</Certificate_IssuedDate>
                            <Certificate_ExpiredDate type="string">' . $kouhi_value->valid[1] . '</Certificate_ExpiredDate>
                        </PublicInsurance_Information_child>
                    ';
                $orca_publicInsurance = $orca_publicInsurance . $orca_temp;
            }

            $route = '/orca12/patientmodv2?class=04';
            $request_string = 
            '
                <data>
                    <patientmodreq type="record">
                        <Mod_Key type="string">2</Mod_Key>
                        <Patient_ID type="string">' . $orca_data_pat->id . '</Patient_ID>
                        <WholeName type="string">' . $orca_data_pat->name . '</WholeName>
                        <WholeName_inKana type="string">' . $orca_data_pat->nameKana . '</WholeName_inKana>
                        <BirthDate type="string">' . $orca_birthdate . '</BirthDate>
                        <Sex type="string">' . $orca_data_pat->gender . '</Sex>
                        <HealthInsurance_Information type="record">
                            <PublicInsurance_Information type="array">' . $orca_publicInsurance . '</PublicInsurance_Information>
                        </HealthInsurance_Information>
                    </patientmodreq>
                </data>
            ';

            $this->post($route, $request_string);
            if (!$this->validate(['00'], 'patientmodres')) {
                return;
            }
        }
        $this->ok = true;
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Create New Patient ////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function patient_create($orca_data) {

        $orca_data_pat = $orca_data['patient'];
        $orca_birthdate = str_replace("/", "-", $orca_data_pat->birthDate);
        $orca_data_pat->name = mb_convert_kana($orca_data_pat->name, "A");

        $householder_rel = '２';
        $householder_name = mb_convert_kana($orca_data_pat->householderName, "A");
        if ($orca_data_pat->householderName == '本人') {
            $householder_rel = '１';
            $householder_name = $orca_data_pat->name;
        }

        $route = '/orca12/patientmodv2?class=01';
        $insString =
        '
            <HealthInsurance_Information type="record">
                    <InsuranceProvider_Class type="string">980</InsuranceProvider_Class>
            </HealthInsurance_Information>
        ';
        $request_string = 
        '
            <data>
                <patientmodreq type="record">
                    <Mod_Key type="string">2</Mod_Key>
                    <Patient_ID type="string">*</Patient_ID>
                    <WholeName type="string">' . $orca_data_pat->name . '</WholeName>
                    <WholeName_inKana type="string">' . $orca_data_pat->nameKana . '</WholeName_inKana>
                    <BirthDate type="string">' . $orca_birthdate . '</BirthDate>
                    <Sex type="string">' . $orca_data_pat->gender . '</Sex>
                    <HouseHolder_WholeName type="string">' . $householder_name . '</HouseHolder_WholeName>
                    <Relationship type="string">' . $householder_rel . '</Relationship>
                    <Occupation type="string">' . $orca_data_pat->occupationName . '</Occupation>
                    <CellularNumber type="string">' . $orca_data_pat->phone . '</CellularNumber>
                    <EmailAddress type="string">' . $orca_data_pat->mail . '</EmailAddress>
                    <Home_Address_Information type="record">
                            <Address_ZipCode type="string">' . $orca_data_pat->address_zip . '</Address_ZipCode>
                            <WholeAddress1 type="string">' . $orca_data_pat->address_addr1 . '</WholeAddress1>
                            <WholeAddress2 type="string">' . $orca_data_pat->address_addr2 . '</WholeAddress2>
                            <PhoneNumber1 type="string"></PhoneNumber1>
                    </Home_Address_Information>
                    <WorkPlace_Information type="record">
                            <WholeName type="string">' . $orca_data_pat->comp_name . '</WholeName>
                            <Address_ZipCode type="string">' . $orca_data_pat->comp_zip . '</Address_ZipCode>
                            <WholeAddress1 type="string">' . $orca_data_pat->comp_addr1 . '</WholeAddress1>
                            <WholeAddress2 type="string">' . $orca_data_pat->comp_addr2 . '</WholeAddress2>
                            <PhoneNumber type="string">' . $orca_data_pat->comp_tel . '</PhoneNumber>
                    </WorkPlace_Information>
                    ' . $insString . '
                </patientmodreq>
            </data>
        ';
        $this->post($route, $request_string);
        if (!$this->validate(['00','K1','K2','K3','K4','K5'], 'patientmodres')) {
            return;
        }
        $pat_id = $this->response->patientmodres->Patient_Information->Patient_ID;

        // Add Insurance
        if ($orca_data['hasIns']) {

            foreach ($orca_data['insurances'] as $insurance_key => $insurance_value) {
            
                $insurance_relation = '2';
                if ($insurance_value->hihokensha->relation === '本人') {
                    $insurance_relation = '1';
                }
                $insurance_value->name = mb_convert_kana($insurance_value->name, 'RNSK');
                $insurance_value->hihokensha->name = mb_convert_kana($insurance_value->hihokensha->name, 'A');
                
                $route = '/orca12/patientmodv2?class=04';
                $request_string = 
                '
                    <data>
                        <patientmodreq type="record">
                                <Mod_Key type="string">2</Mod_Key>
                                <Patient_ID type="string">' . $pat_id . '</Patient_ID>
                                <WholeName type="string">' . $orca_data_pat->name . '</WholeName>
                                <WholeName_inKana type="string">' . $orca_data_pat->nameKana . '</WholeName_inKana>
                                <BirthDate type="string">' . $orca_birthdate . '</BirthDate>
                                <Sex type="string">' . $orca_data_pat->gender . '</Sex>
                                <HealthInsurance_Information type="record">
                                        <InsuranceProvider_Class type="string"></InsuranceProvider_Class>
                                        <InsuranceProvider_Number type="string">' . $insurance_value->hokenshaNumber . '</InsuranceProvider_Number>
                                        <InsuranceProvider_WholeName type="string"></InsuranceProvider_WholeName>
                                        <HealthInsuredPerson_Symbol type="string">' . $insurance_value->kigou . '</HealthInsuredPerson_Symbol>
                                        <HealthInsuredPerson_Number type="string">' . $insurance_value->bangou . '</HealthInsuredPerson_Number>
                                        <RelationToInsuredPerson type="string">' . $insurance_relation . '</RelationToInsuredPerson>
                                        <HealthInsuredPerson_WholeName type="string">' . $insurance_value->name . '</HealthInsuredPerson_WholeName>
                                        <Certificate_StartDate type="string">' . $insurance_value->validDate[0] . '</Certificate_StartDate>
                                        <Certificate_ExpiredDate type="string">' . $insurance_value->validDate[1] . '</Certificate_ExpiredDate>
                                        <Certificate_GetDate type="string">' . $insurance_value->getDate . '</Certificate_GetDate>
                                        <PublicInsurance_Information type="array"></PublicInsurance_Information>
                                </HealthInsurance_Information>
                        </patientmodreq>
                    </data>
                ';
                $this->post($route, $request_string);
                if (!$this->validate(['00'], 'patientmodres')) {
                    return;
                }
            }
        }

        if ($orca_data['hasKouhi']) {

            $orca_publicInsurance = '';
            foreach ($orca_data['kouhi'] as $insurance_key => $kouhi_value) {
                $orca_temp =
                    '
                        <PublicInsurance_Information_child type="record">
                            <PublicInsurance_Class type="string"></PublicInsurance_Class>
                            <PublicInsurer_Number type="string">' . $kouhi_value->khFuSha . '</PublicInsurer_Number>
                            <PublicInsuredPerson_Number type="string">' . $kouhi_value->khRecp . '</PublicInsuredPerson_Number>
                            <Certificate_IssuedDate type="string">' . $kouhi_value->valid[0] . '</Certificate_IssuedDate>
                            <Certificate_ExpiredDate type="string">' . $kouhi_value->valid[1] . '</Certificate_ExpiredDate>
                        </PublicInsurance_Information_child>
                    ';
                $orca_publicInsurance = $orca_publicInsurance . $orca_temp;
            }

            $route = '/orca12/patientmodv2?class=04';
            $request_string = 
            '
                <data>
                    <patientmodreq type="record">
                        <Mod_Key type="string">2</Mod_Key>
                        <Patient_ID type="string">' . $pat_id . '</Patient_ID>
                        <WholeName type="string">' . $orca_data_pat->name . '</WholeName>
                        <WholeName_inKana type="string">' . $orca_data_pat->nameKana . '</WholeName_inKana>
                        <BirthDate type="string">' . $orca_birthdate . '</BirthDate>
                        <Sex type="string">' . $orca_data_pat->gender . '</Sex>
                        <HealthInsurance_Information type="record">
                            <PublicInsurance_Information type="array">' . $orca_publicInsurance . '</PublicInsurance_Information>
                        </HealthInsurance_Information>
                    </patientmodreq>
                </data>
            ';

            $this->post($route, $request_string);
            if (!$this->validate(['00'], 'patientmodres')) {
                return;
            }
        }
        $this->ok = true;
        $this->response = $pat_id;
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Create New Patient Reception //////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function reception_create($orca_data) {

        $route = '/orca11/acceptmodv2';
        $request_string =
        '
            <data>
                <acceptreq type="record">
                        <Request_Number type="string">01</Request_Number>
                        <Patient_ID type="string">' . $orca_data->patientID . '</Patient_ID>
                        <Acceptance_Date type="string">' . $orca_data->date . '</Acceptance_Date>
                        <Acceptance_Time type="string">' . $orca_data->time . '</Acceptance_Time>
                        <Department_Code type="string">' . $orca_data->dep . '</Department_Code>
                        <Physician_Code type="string">1' . $orca_data->doctor . '</Physician_Code>
                        <Medical_Information type="string">' . $orca_data->type . '</Medical_Information>
                        <HealthInsurance_Information type="record">
                        <Insurance_Combination_Number type="string">' . $orca_data->insSet . '</Insurance_Combination_Number>
                        </HealthInsurance_Information>
                </acceptreq>
            </data>
        ';
        $this->post($route, $request_string);
        if ($this->validate(['00','K1','K2','K3'], 'acceptres')) {
            $this->ok = true;
            $this->response = $this->response->acceptres;
        }
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Get Patient Byoumei ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function patient_disease_get($orca_data) {

        $route = '/orca101/diseasegetv2?class=01';
        $request_string =
        '
            <data> 
                <disease_inforeq type="record"> 
                    <Patient_ID type="string">' . $orca_data . '</Patient_ID>                            
                    <Base_Date type="string"></Base_Date>
                </disease_inforeq> 
            </data> 
        ';
        $this->post($route, $request_string);
        if ($this->validate(['00', '21'], 'disease_infores')) {
            $this->ok = true;
            $this->response = $this->response->disease_infores;
        }
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Register Koui//////////////////////////////////////
    //////////////// Includes Shohou, Kensa, Shot, Koui ////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function register_koui($orca_data) {

        // Additional koui not yet implemented. Need to rework bin/koui_calc_shinRyou.php
        $additional_koui = new Encountercost($orca_data);
        
        $additional_koui_children = '';
        foreach ($additional_koui->response->koui as $SR_key => $SR_value) {
            $tmp_str = 
            '
                <Medication_info_child type="record">
                        <Medication_Code type="string">' . $SR_value['code'] . '</Medication_Code>
                        <Medication_Name type="string"></Medication_Name>
                        <Medication_Number type="string">1</Medication_Number>
                </Medication_info_child>
            ';
            $additional_koui_children = $additional_koui_children . $tmp_str;
        }
        $additional_koui_string =
        '
            <Medical_Information_child type="record">
                    <Medical_Class type="string">' . $additional_koui->response->type . '</Medical_Class>
                    <Medical_Class_Number type="string">1</Medical_Class_Number>
                    <Medication_info type="array">
                    ' . $additional_koui_children . '
                    </Medication_info>
            </Medical_Information_child>
        ';

        // Koui ryou
        $kouiRyou_arr = [];
        $tempKouiIns_arr = [];
        $kouiRyou_str = "";
        foreach ($orca_data->koui as $k_keyP => $k_valueP) {
            // convert types
            $k_valueP->count = 1;
            if ($k_valueP->ins === "0001") {
                $k_valueP->kouiType = "960";
            } else {
                switch ($k_valueP->type) {
                    case '60':
                        $k_valueP->kouiType = "600";
                        break;
                    case '40':
                        $k_valueP->kouiType = "400";
                        break;
                    case '50':
                        $k_valueP->kouiType = "500";
                        break;
                    case '70':
                        $k_valueP->kouiType = "700";
                        break;
                    case '25':
                        $k_valueP->kouiType = "210";
                        break;
                    case '30':
                        if ($k_valueP->var->location === "静脈") {
                            $k_valueP->kouiType = "320";
                        } else {
                            $k_valueP->kouiType = "310";
                        }
                        break;
                }
            }
            //If Jihi
            if ($k_valueP->ins === "0001") {
                if (isset($tempKouiIns_arr['jihi'])) {
                    foreach ($tempKouiIns_arr['jihi'] as $key => $value) {
                        if ($value['kouiCode'] === $k_valueP->kouiCode) {
                            $tempKouiIns_arr['jihi'][$key]['count']++;
                        } else {
                            array_push($tempKouiIns_arr['jihi'], $k_valueP);
                        }
                    }
                } else {
                    $tempKouiIns_arr['jihi'] = [$k_valueP];
                }
            } else {
                //Sort by Insurance
                if (isset($tempKouiIns_arr[$k_valueP->ins])) {
                    array_push($tempKouiIns_arr[$k_valueP->ins], $k_valueP);
                } else {
                    $tempKouiIns_arr[$k_valueP->ins] = [$k_valueP];
                }
            }
        }

        foreach ($tempKouiIns_arr as $ti_key => $ti_value) {
            $temp_child_str = "";
            foreach ($ti_value as $kk_key => $kk_value) {
                $temp_child = 
                '
                    <Medical_Information_child type="record">
                            <Medical_Class type="string">' . $kk_value->kouiType . '</Medical_Class>
                            <Medical_Class_Number type="string">' . $kk_value->count . '</Medical_Class_Number>
                            <Medication_info type="array">
                                <Medication_info_child type="record">
                                        <Medication_Code type="string">' . $kk_value->kouiCode . '</Medication_Code>
                                        <Medication_Name type="string"></Medication_Name>
                                </Medication_info_child>
                            </Medication_info>
                    </Medical_Information_child>
                ';
                if ($kk_value->kouiType === "310" || $kk_value->kouiType === "320") {
                    $temp_child = 
                    '
                        <Medical_Information_child type="record">
                                <Medical_Class type="string">' . $kk_value->kouiType . '</Medical_Class>
                                <Medical_Class_Number type="string">' . $kk_value->count . '</Medical_Class_Number>
                                <Medication_info type="array">
                                    <Medication_info_child type="record">
                                            <Medication_Code type="string">' . $kk_value->kouiCode . '</Medication_Code>
                                            <Medication_Name type="string"></Medication_Name>
                                    </Medication_info_child>
                                    <Medication_info_child type="record">
                                            <Medication_Code type="string">' . $kk_value->var->medID . '</Medication_Code>
                                            <Medication_Name type="string"></Medication_Name>
                                            <Medication_Number type="string">' . $kk_value->var->amount . '</Medication_Number>
                                    </Medication_info_child>
                                </Medication_info>
                        </Medical_Information_child>
                    ';
                }
                if ($kk_value->kouiType === "210") {
                    switch ($kk_value->var->type) {
                        case '1':
                            $temp_shohou_type = '212';
                            break;
                        case '3':
                            $temp_shohou_type = '222';
                            break;
                        case '5':
                            $temp_shohou_type = '232';
                            break;
                    }
    
                    $temp_child = 
                    '
                        <Medical_Information_child type="record">
                                <Medical_Class type="string">' . $temp_shohou_type . '</Medical_Class>
                                <Medical_Class_Number type="string">' . $kk_value->var->times . '</Medical_Class_Number>
                                <Medication_info type="array">
                                        <Medication_info_child type="record">
                                                <Medication_Code type="string">' . $kk_value->kouiCode . '</Medication_Code>
                                                <Medication_Number type="string">' . $kk_value->var->amount . '</Medication_Number>
                                        </Medication_info_child>
                                </Medication_info>
                        </Medical_Information_child>
                    ';
                }
                $temp_child_str = $temp_child_str . $temp_child;
            }
            $tempKouiIns_arr[$ti_key]['orca_string'] = $temp_child_str;
        }
        foreach ($tempKouiIns_arr as $key => $value) {
            if ($key === "jihi") {
                $insCombFinal = "0001";
            } else {
                $insCombFinal = $key;
            }
            $request_string = 
            '
                <data>
                        <medicalreq type="record">
                                <InOut type="string"></InOut>
                                <Patient_ID type="string">' . $orca_data->patient_id . '</Patient_ID>
                                <Medical_Uid type="string"></Medical_Uid>
                                <Diagnosis_Information type="record">
                                        <Department_Code type="string">' . $this->department_code . '</Department_Code>
                                        <Physician_Code type="string">1' . $orca_data->doctor . '</Physician_Code>
                                        <HealthInsurance_Information type="record">
                                                <Insurance_Combination_Number type="string">' . $insCombFinal . '</Insurance_Combination_Number>
                                        </HealthInsurance_Information>
                                        <Medical_Information type="array">
                                                ' . $additional_koui_string . '
                                                ' . $value['orca_string'] . '
                                        </Medical_Information>
                                </Diagnosis_Information>
                        </medicalreq>
                </data>
            ';

            $route = '/api21/medicalmodv2?class=01';

            $this->post($route, $request_string);
            if ($this->validate(['00','K1','K2','K3'], 'medicalres')) {
                $this->ok = true;
                $this->response = $this->response->acceptres;
            }
            return $this->response();
        }

    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Register/Edit Byoumei//////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function update_disease($orca_data) {

        $orca_data->Disease_AcuteFlag = "";
        if ($orca_data->Disease_SuspectedFlag === "SA") {
            $orca_data->Disease_AcuteFlag = "A";
            $orca_data->Disease_SuspectedFlag = "S";
        } else if ($orca_data->Disease_SuspectedFlag === "A") {
            $orca_data->Disease_AcuteFlag = "A";
            $orca_data->Disease_SuspectedFlag = "";
        }

        $request_string = 
        '
            <data>
                <diseasereq type="record">
                    <Patient_ID type="string">' . $orca_data->patient_ID . '</Patient_ID>
                    <Perform_Date type="string"></Perform_Date>
                    <Perform_Time type="string"></Perform_Time>
                    <Diagnosis_Information type="record">
                        <Department_Code type="string">01</Department_Code>
                    </Diagnosis_Information>
                    <Disease_Information type="array">
                        <Disease_Information_child type="record">
                            <Disease_Code type="string">' . $orca_data->Disease_Single  . '</Disease_Code>
                            <Disease_Supplement_Name type= "string">' . $orca_data->Disease_Supplement_Name . '</Disease_Supplement_Name>
                            <Disease_Category type="string">' . $orca_data->Disease_Category . '</Disease_Category>
                            <Disease_SuspectedFlag type="string">' . $orca_data->Disease_SuspectedFlag . '</Disease_SuspectedFlag>
                            <Disease_AcuteFlag type="string">' . $orca_data->Disease_AcuteFlag . '</Disease_AcuteFlag>
                            <Disease_Receipt_Print type="string">' . $orca_data->Disease_Receipt_Print . '</Disease_Receipt_Print>
                            <Disease_StartDate type="string">' . $orca_data->Disease_StartDate . '</Disease_StartDate>
                            <Disease_EndDate type="string">' . $orca_data->Disease_EndDate . '</Disease_EndDate>
                            <Disease_OutCome type="string">' . $orca_data->Disease_OutCome . '</Disease_OutCome>
                            <Disease_Class type="string">AUTO</Disease_Class>
                            <Insurance_Combination_Number type="string">' . $orca_data->Insurance_ID . '</Insurance_Combination_Number>
                        </Disease_Information_child>
                    </Disease_Information>
                </diseasereq>
            </data>
        ';

        $route = '/orca22/diseasev3';

        $this->post($route, $request_string);
        if ($this->validate(['00','W01','W02','W03','W04','W05','W06','W07','W08',], 'diseaseres')) {
            $this->ok = true;
            $this->response = $this->response->diseaseres;
        }
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Get Patient Byoumei ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function get_procedure_status($orca_data) {

        $route = '/api01rv2/tmedicalgetv2';
        $request_string =
        '
            <data> 
                <tmedicalgetreq type="record">
                    <InOut type="string">2</InOut>
                    <Department_Code type="string">01</Department_Code>
                    <Patient_ID type="string">' . $orca_data. '</Patient_ID>
                </tmedicalgetreq>
            </data> 
        ';
        $this->post($route, $request_string);
        if ($this->validate(['15', 'K1'], 'tmedicalgetres')) {
            $this->ok = true;   
            $this->response = (string) $this->response->tmedicalgetres->Api_Result;
        }
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Get Patient Byoumei ///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function get_patient_income_info($orca_data) {

        $route = '/api01rv2/incomeinfv2';
        $request_string =
        '
            <data> 
                <private_objects type="record">
                    <Patient_ID type="string">' . $orca_data . '</Patient_ID>
                </private_objects>
            </data> 
        ';
        $this->post($route, $request_string);
        if ($this->validate(['0000'], 'private_objects')) {
            $this->ok = true;   
            $this->response = $this->response->private_objects->Income_Information;
        }
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Create User ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function create_user($orca_data) {

        $route = '/orca101/manageusersv2';
        $request_string =
        '
            <data>
                <manageusersreq type ="record">
                    <Request_Number type ="string">02</Request_Number>
                    <User_Information type ="record">
                        <User_Id type ="string">' . $orca_data->user_name . '</User_Id>
                        <User_Password type ="string">' . $orca_data->password . '</User_Password>
                        <Group_Number type ="string">3</Group_Number>
                        <Full_Name type ="string">' . mb_convert_kana($orca_data->name_last . $orca_data->name_first, 'RNK') . '</Full_Name>
                    </User_Information>
                </manageusersreq>
            </data>
        ';
        $this->post($route, $request_string);
        if ($this->validate(['0000'], 'manageusersres')) {
            $this->ok = true;   
            $this->response = $this->response->private_objects->Income_Information;
        }
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Edit User ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function edit_user($orca_data) {

        $route = '/orca101/manageusersv2';
        $request_string =
        '
            <data>
                <manageusersreq type ="record">
                    <Request_Number type ="string">03</Request_Number>
                    <User_Information type ="record">
                        <User_Id type ="string">' . $orca_data->old_user_name . '</User_Id>
        ';
        if ($orca_data->user_name !== $orca_data->old_user_name) {
            $request_string = $request_string . '<New_User_Id type ="string">' . $orca_data->user_name . '</New_User_Id>';
        }

        $request_string = $request_string . '<New_Full_Name type ="string">' . mb_convert_kana($orca_data->name_last . $orca_data->name_first, 'RNK') . '</New_Full_Name>
                    </User_Information>
                </manageusersreq>
            </data>
        ';
        $this->post($route, $request_string);
        if ($this->validate(['0000'], 'manageusersres')) {
            $this->ok = true;   
            $this->response = $this->response->private_objects->Income_Information;
        }
        return $this->response();
    }

    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Edit User Password ////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function edit_user_password($orca_data) {

        $route = '/orca101/manageusersv2';
        $request_string =
        '
            <data>
                <manageusersreq type ="record">
                    <Request_Number type ="string">03</Request_Number>
                    <User_Information type ="record">
                        <User_Id type ="string">' . $orca_data->user_name . '</User_Id>
                        <New_User_Password type ="string">' . $orca_data->password . '</New_User_Password>
                    </User_Information>
                </manageusersreq>
            </data>
        ';
        $this->post($route, $request_string);
        if ($this->validate(['0000'], 'manageusersres')) {
            $this->ok = true;   
            $this->response = $this->response->private_objects->Income_Information;
        }
        return $this->response();
    }


    ////////////////////////////////////////////////////////////////////////////
    //////////////////////// Delete User ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    public function delete_user($orca_data) {

        $route = '/orca101/manageusersv2';
        $request_string =
        '
            <data>
                <manageusersreq type ="record">
                    <Request_Number type ="string">04</Request_Number>
                    <User_Information type ="record">
                        <User_Id type ="string">' . $orca_data->user_name . '</User_Id>
                    </User_Information>
                </manageusersreq>
            </data>
        ';
        $this->post($route, $request_string);
        if ($this->validate(['0000'], 'manageusersres')) {
            $this->ok = true;   
            $this->response = $this->response->private_objects->Income_Information;
        }
        return $this->response();
    }




}


