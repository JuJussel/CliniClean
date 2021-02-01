<?php
namespace App\Http\Controllers;

// ToDo
// Lot of legacy code in here
// Needs to be re-done ata some point

use \DateTime;
use \DateInterval;
use App\Middleware\Orcadb;

class Procedurechecks {

    private function build_response($res, $type, $comm = '') {

        $result['checkOK'] = false;

        switch ($type) {
            case 1:
                // hospitalization only
                $result['message'] = "入院レセプトに限り記録可能な診療行為です。";
                break;
            case 2:
                // old age only
                $result['message'] = "後期高齢者医療に限り適用される診療行為です。";
                break;
            case 22:
                // not old age only
                $result['message'] = "<b>医療保険に限り適用される診療行為です。</b></br>後期高齢者医療保険使用中です";
                break;
    
            case 3:
                // hospital only
                $result['message'] = "病院に限り適用される診療行為です。";
                break;
    
            case 4:
                // minimum age
                $result['message'] = $comm;
                break;
    
            case 5:
                // maximum age
                $result['message'] = $comm;
                break;
    
            case 6:
                // violation, day, week, month
                if ($comm['vioType'] === "3_1") {
                    $returnDateFor = new DateTime($comm['lastUse']);
                    $result['message'] = "<b>" .
                    $comm['vioName1'] . "</b>は同一日に<b>" . $comm['vioName2'] .
                    "</b>との併算定が出来ません。</br>" .
                    $comm['vioName2'] . "の算定日付：" . date_format($returnDateFor, "Y年m月d日");
                } else if ($comm['vioType'] === "3_4") {
                    $returnDateFor = new DateTime($comm['lastUse']);
                    $result['message'] = "<b>" .
                    $comm['vioName1'] . "</b>は一週間に<b>" . $comm['vioName2'] .
                    "</b>との併算定が出来ません。</br>" .
                    $comm['vioName2'] . "の算定日付：" . date_format($returnDateFor, "Y年m月d日");
                } else if ($comm['vioType'] === "3_2") {
                    $returnDateFor = new DateTime($comm['lastUse']);
                    $result['message'] = "<b>" .
                    $comm['vioName1'] . "</b>は同一月に<b>" . $comm['vioName2'] .
                    "</b>との併算定が出来ません。</br><b>" .
                    $comm['vioName2'] . "の算定日付：" . date_format($returnDateFor, "Y年m月d日</b>");
                }
                break;
    
            case 7:
                // same time violation
                $result['message'] = "<b>" .
                    $comm['vioName1'] . "</b>と<b>" . $comm['vioName2'] .
                    "</b>は同時に算定出来ません。</br>どちらかが算定しないか自費に設定してください。";
                $result['item1'] = $comm['vioName1'];
                $result['vioCode'] = $comm['vioCode2'];
                $result['special'] = true;
                break;
    
            case 8:
                // count limit
                $result['message'] = $comm['kouiName'] .
                    "の算定回数制限は" . $comm['unit'] . "つき" . $comm['limit'] . "回です。";
                break;
    
            case 20:
                // Has Operation and Shot
                $result['message'] = "手術が算定されています。注射料は算定できません。";
                break;
    
            case 99:
                // Check OK
                $result['checkOK'] = true;
                break;
        }
        $res->data = $result;
        $res->success = true;

    }

    private function first_day_of($period, $new_date) {

        $period = strtolower($period);
        switch ($period) {
            case 'month':
                $new_date->modify('first day of this month');
                break;
            case 'week':
                $new_date->modify(($new_date->format('w') === '0') ? 'now' : 'sunday last week');
                break;
        }
        return $new_date;
    
    }

    private function vio_check($vioType, $date_limit) {

        $date_limit = $date_limit->format('Ymd');
        $query_params = [
            'tbl' => $vioType,
            'newKouiCode' => $this->request_data->newKoui,
            'dateLim' => $date_limit,
            'patientID' => $this->request_data->patientID,
        ];

        $vio_query = new Orcadb();
        $vio_query->etensu_timing($query_params);

        if (!$vio_query->ok) {
            $res->message = $vio_query->msg;
            return;
        }

        $vio_query = $vio_query->data;
        foreach($vio_query as $key => $value) {
            $vio_query[$key]['name_kanji_1'] = mb_convert_encoding($value['name_kanji_1'], "UTF-8", "EUC-JP");
            $vio_query[$key]['name_kanji_2'] = mb_convert_encoding($value['name_kanji_2'], "UTF-8", "EUC-JP");

        }

        if (count($vio_query) > 0) {
            $returnArray = [
                'vioName1' => $vio_query[0]['name_kanji_1'],
                'vioName2' => $vio_query[0]['name_kanji_2'],
                'contIdent' => $vio_query[0]['contra_type'],
                'lastUse' => $vio_query[0]['insert_date'],
                'vioType' => $vioType,
            ];
            $this->build_response($res, 6, $returnArray);
            return;
        }

    }

    private function calc_age($calc_type) {

        if ($calc_type === "AA") {
            $cdate = new DateTime($this->request_data->patientBirthDate);
            $cdate->add(new DateInterval('P28D'));
        }
        if ($calc_type === "AE") {
            $cdate = new DateTime($this->request_data->patientBirthDate);
            $cdate->add(new DateInterval('P90D'));
        } else if ($calc_type === "B3") {
            $modDate = date("Y-m-d", strtotime('+3 years', $this->request_data->patientBirthDate));
            $cdate = new DateTime($$modDate);
            $cdate->modify('first day of next month');
        } else if ($calc_type === "BF") {
            $modDate = date("Y-m-d", strtotime('+15 years', $this->request_data->patientBirthDate));
            $cdate = new DateTime($modDate);
            $cdate->modify('first day of next month');
        } else if ($calc_type === "BK") {
            $modDate = date("Y-m-d", strtotime('+20 years', $this->request_data->patientBirthDate));
            $cdate = new DateTime($modDate);
            $cdate = new DateTime($cbirthdate);
            $cdate->modify('first day of next month');
        }
        return $cdate;
    
    }



    public function post($req, $res) {
        
        $date = new DateTime();

        $this->request_data = $req->post->data;

        if ($this->request_data->newItemIgnore) {
            $this->$this->build_response($res, 99);
            return;
        }
        
        $this->request_data->current_koui = [];
        foreach($this->request_data->koui as $key => $value) {

            array_push($this->request_data->current_koui, $value->kouiCode);

            if ($value->type === "50" && $this->request_data->newType === "30") {
                $this->build_response($res, 20);
                return;
            }
            if ($value->type === "30" && $this->request_data->newType === "50") {
                $this->build_response($res, 20);
                return;
            }

        }

        $orca_koui_data = new Orcadb();
        $orca_koui_data->etensu($this->request_data->newKoui);

        if (!$orca_koui_data->ok) {
            $res->message = $orca_koui_data->msg;
            return;
        }

        $orca_koui_data = $orca_koui_data->data[0];

        // Only hospitalization?
        if ($orca_koui_data['inonly'] === '1') {
            $this->build_response($res, 1, "");
            return;
        }

        // Only old insurance?
        if ($orca_koui_data['oldonly'] !== '0') {
            if ($this->request_data->insPovNr !== '039') {
                if ($orca_koui_data['oldonly'] === '2') {
                    $this->build_response($res, 2, "");
                    return;
                }
            } else if ($this->request_data->insPovNr === '039') {
                if ($orca_koui_data['oldonly'] === '1') {
                    $this->build_response($res, 22, "");
                    return;
                }
            }
        }

        // Only for Hospitals?
        if ($orca_koui_data['hosponly'] === '1') {
            $this->build_response($res, 3, "");
            return;
        }

        // Minimum Age?
        if ($orca_koui_data['minage'] !== '0') {
            if ($orca_koui_data['minage'] === "AA") {
                $basedate = ageCalc($orca_koui_data['minage']);
                if ($date < $basedate) {
                    $this->build_response($res, 4, "下限年齢は生後２８日です。");
                    return;
                }
            } else if ($orca_koui_data['minage'] === "B3") {
                $basedate = ageCalc($orca_koui_data['minage']);
                if ($date < $basedate) {
                    $this->build_response($res, 4, "下限年齢は３歳に達した日の翌月の１日です。");
                    return;
                }
            } else if ($orca_koui_data['minage'] === "BF") {
                $basedate = ageCalc($orca_koui_data['minage']);
                if ($date < $basedate) {
                    $this->build_response($res, 4, "下限年齢は１５歳に達した日の翌月の１日です。");
                    return;
                }
            } else if ($orca_koui_data['minage'] === "BK") {
                $basedate = ageCalc($orca_koui_data['minage']);
                if ($date < $basedate) {
                    $this->build_response($res, 4, "下限年齢は２０歳に達した日の翌月の１日です。");
                    return;
                }
            } else if ($orca_koui_data['minage'] !== '  ' && $this->request_data->patientAge < $orca_koui_data['minage']) {
                $this->build_response($res, 4, "下限年齢は" . $orca_koui_data['minage'] . "年です。");
                return;
            }
        }

        // Maximum Age?
        if ($orca_koui_data['maxage'] !== '00') {
            if ($orca_koui_data['maxage'] === "AA") {
                $basedate = ageCalc($orca_koui_data['maxage']);
                if ($date >= $basedate) {
                    $this->build_response($res, 4, "上限年齢は生後２８日です。");
                    return;
                }
            } else if ($orca_koui_data['maxage'] === "AE") {
                $basedate = ageCalc($orca_koui_data['maxage']);
                if ($date >= $basedate) {
                    $this->build_response($res, 4, "上限年齢は生後９０日です。");
                    return;
                }
            } else if ($orca_koui_data['maxage'] === "B3") {
                $basedate = ageCalc($orca_koui_data['maxage']);
                if ($date >= $basedate) {
                    $this->build_response($res, 4, "上限年齢は３歳に達した日の翌月の１日です。");
                    return;
                }
            } else if ($orca_koui_data['maxage'] === "BF") {
                $basedate = ageCalc($orca_koui_data['maxage']);
                if ($date >= $basedate) {
                    $this->build_response($res, 4, "上限年齢は１５歳に達した日の翌月の１日です。");
                    return;
                }
            } else if ($orca_koui_data['maxage'] === "BK") {
                $basedate = ageCalc($orca_koui_data['maxage']);
                if ($date >= $basedate) {
                    $this->build_response($res, 4, "上限年齢は２０歳に達した日の翌月の１日です。");
                    return;
                }
            } else if ($orca_koui_data['maxage'] !== '  ' && $this->request_data->patientAge >= $orca_koui_data['maxage']) {
                $this->build_response($res, 5, "上限年齢は" . $orca_koui_data['maxage'] . "年です。");
                return;
            }
        }

        // Clinic Licenses??

        // Any Contradictions
        //Daily
        if ($orca_koui_data['viod'] !== '0') {
            $limitDate = $date;
            $this->vio_check("3_1", $limitDate);
        }
        //Monthly
        if ($orca_koui_data['viom'] !== '0') {
            $limitDate = $this->first_day_of('month', $date);
            $this->vio_check("3_2", $limitDate);
        }
        //Weekly
        if ($orca_koui_data['viow'] !== '0') {
            $limitDate = $this->first_day_of('week', $date);
            $this->vio_check("3_4", $limitDate);
        }

        //Same Time
        if ($orca_koui_data['vios'] !== '0') {

            $vio_query_same = new Orcadb();
            $vio_query_same->etensu_same($this->request_data->newKoui);

            if (!$vio_query_same->ok) {
                $res->message = $vio_query_same->msg;
                return;
            }

            $vio_query_same = $vio_query_same->data;
    
            
            foreach($this->request_data->koui as $key => $value) {

                $s = array_search($value->kouiCode, array_column($vio_query_same, 'koui_code_2'));
                if ($s > -1) {

                    $returnArray = [
                        'vioName1' => mb_convert_encoding($vio_query_same[$s]['name_kanji_1'], "UTF-8", "EUC-JP"),
                        'vioName2' => mb_convert_encoding($vio_query_same[$s]['name_kanji_2'], "UTF-8", "EUC-JP"),
                        'vioCode2' => mb_convert_encoding($vio_query_same[$s]['koui_code_2'], "UTF-8", "EUC-JP"),
                        'contIdent' => mb_convert_encoding($vio_query_same[$s]['contra_type'], "UTF-8", "EUC-JP"),
                    ];
                    $this->build_response($res, 7, $returnArray);
                    return;

                }

            }

        }

        // Count Limit ?
        if ($orca_koui_data['maxcount'] !== '0') {
            
            $contTypeArrayTime = [53, 121, 131, 138, 142, 143, 144, 145, 146, 147, 148];
            $contTypeArrayPreg = [149];

            $vio_query_count = new Orcadb();
            $vio_query_count->etensu_count($this->request_data->newKoui);


            $vio_query_count = $vio_query_count->data;

            foreach ($vio_query_count as $key => $row) {
                if (in_array($row['unit_code'], $contTypeArrayTime)) {
                    switch ($row['unit_code']) {
                        // same patient
                        case '53':
                            $startDate = "1900-1-1";
                            break;
                        // same day
                        case '121':
                            $startDate = date("Y-m-d");
                            break;
                        // same month
                        case '131':
                            $startDate = $this->first_day_of('month', $date);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                        // same week
                        case '138':
                            $startDate = $this->first_day_of('week', $date);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                        // same 2 weeks
                        case '142':
                            $date->sub(new DateInterval('P7D'));
                            $startDate = $this->first_day_of('week', $date);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                        // last 2 months
                        case '143':
                            $dateDum = date('Y-m-d', strtotime('-1 month'));
                            $dateDum = new DateTime($dateDum);
                            $startDate = $this->first_day_of('month', $dateDum);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                        // last 3 months
                        case '144':
                            $dateDum = date('Y-m-d', strtotime('-2 months'));
                            $dateDum = new DateTime($dateDum);
                            $startDate = $this->first_day_of('month', $dateDum);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                        // last 4 months
                        case '145':
                            $dateDum = date('Y-m-d', strtotime('-3 months'));
                            $dateDum = new DateTime($dateDum);
                            $startDate = $this->first_day_of('month', $dateDum);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                        // last 6 months
                        case '146':
                            $dateDum = date('Y-m-d', strtotime('-5 months'));
                            $dateDum = new DateTime($dateDum);
                            $startDate = $this->first_day_of('month', $dateDum);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                        // last 12 months
                        case '147':
                            $dateDum = date('Y-m-d', strtotime('-11 months'));
                            $dateDum = new DateTime($dateDum);
                            $startDate = $this->first_day_of('month', $dateDum);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                        // last 5 years ???
                        case '148':
                            $dateDum = date('Y-m-d', strtotime('-59 months'));
                            $dateDum = new DateTime($dateDum);
                            $startDate = $this->first_day_of('month', $dateDum);
                            $startDate = $startDate->format("Y-m-d");
                            break;
                    }

                    $vio_query_act = new Orcadb();
                    $vio_query_act->etensu_act(
                        [
                            $this->request_data->newKoui,
                            $this->request_data->patientID,
                            $startDate
                        ]
                    );

                    $vio_query_act = $vio_query_act->data;  

            
                    if (count($vio_query_act) >= $row['amount']) {
                        $returnArray = [
                            $row['name_kanji'],
                            $row['unit_name'],
                            $row['amount'],
                        ];
                        $this->build_response($res, 8, $returnArray);
                        return;
                    }

                } else if (in_array($row['unit_code'], $contTypeArrayPreg)) {

                }
            }
        }

        // No items
        $this->build_response($res, 99, '');
        return;

    }

}