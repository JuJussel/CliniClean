<?php

namespace App\Middleware;

use App\Database\Queries\Setting;
use App\Database\Queries\Patient;
use App\Middleware\Orcaapi;
use stdClass;
use DateTime;

class Encountercost {

    public function __construct($data) {

        $this -> calculate($data);

    }

    private function calculate($data) {

        $SC = $data;
        $SC->day = strtolower(date('D'));
        $SC->time = new DateTime('now');
        $SC->date = date("Y-m-d");
        $SC->time_str = date("H:i");
        $SC->date_year = date("Y");
        $SC->date_month = date("m");
        $SC->shin_add_items = [
            [//Shin
              'n' => [
                'n' => '111000770',
                's' => '111012170'
              ],
              'k' => [
                'n' => '111000670',
                's' => '111012070'
              ],
              'g' => [
                'n' => '111000570',
                's' => '111011970'
              ],
              'ml' => [
                'n' => '111012470',
                's' => '111012470'
              ],
              'z' => [
                's' => '111000370'
              ],
            ],
            [//Sai
              'n' => [
                'n' => '112001310',
                's' => '112014970'
              ],
              'k' => [
                'n' => '112001210',
                's' => '112014870'
              ],
              'g' => [
                'n' => '112001110',
                's' => '112014770'
              ],
              'ml' => [
                'n' => '112015570',
                's' => '112015570'
              ],
              'z' => [
                's' => '112007410'
              ],
            ]
        ];
        $oh = new Setting();
        $oh = $oh->get('clinic_opening_hours');
        $oh = json_decode($oh->data[0]['config_value'], TRUE);
        $SC->opening_hours = $oh;
        $SC->opening_hours_today = $SC->opening_hours[$SC->day];
        $SC->start1 = new DateTime($SC->opening_hours_today[0]);
        $SC->start2 = new DateTime($SC->opening_hours_today[2]);
        $SC->end1 = new DateTime($SC->opening_hours_today[1]);
        $SC->end2 = new DateTime($SC->opening_hours_today[3]);
        $SC->kensa_same_day_addition_counter = 0;
    
        $response = (object) [
            'ok' => false,
            'type' => '110',
            'koui' => []
        ];

        //Patient Age
        $patient_age = new Patient();
        $patient_age = $patient_age->get($SC->patient_id)->data[0];
        $patient_age_birthdate = date_create($patient_age['birthdate']);
        $patient_age_now = date_create($SC->date);
        $SC->age = date_diff($patient_age_birthdate,$patient_age_now) -> format("%y");
  
        //// Shoshin or Saishin ////////////////////////////////////////////////////////
        $SC->type_tag = 0; //tag for shin type
        $SC->koui_base = "111000110"; //shoshin

        $orca = new Orcaapi();
        $orca_result = $orca->patient_disease_get($SC->patient_id);
        if(!$orca_result->ok) {
            $response->message = $orca_result->msg;
            return;    
        }
        $diseases = 
            $orca_result->result->Disease_Information->Disease_Information_child;

        if($diseases) {
            foreach($diseases as $key => $value) {
                if (!isset($value->Disease_EndDate)) {
                  $SC->type_tag = 1; //tag for shin type
                  $SC->koui_base = "112007410"; //saishin
                  $response->type = "120"; //saishin
                }
            }
        }

        array_push($response->koui, ['code'=>$SC->koui_base,'times'=>1]);

        //// Additional item ///////////////////////////////////////////////////////////
        $add_item = 'none';
        //Check if late Night/////////////////////////////////////////////////////
        if (
            $SC->time >= new DateTime('22:00') && $SC->time <= new DateTime('24:00')
            ||
            $SC->time >= new DateTime('00:00') && $SC->time <= new DateTime('06:00')
        )
        {
            $add_item = 'n';
        }
    //Check if holiday///////////////////////////////////////////////////////
        else if ($SC->day === 'sun') {
            $add_item = 'k';
        }
        else if ($SC->is_holiday) {
            $add_item = 'k';
        }

    //Check if outside hours///////////////////////////////////////////////
        else if (
            !($SC->time >= $SC->start1 && $SC->time <= $SC->end1) 
            &&
            !($SC->time >= $SC->start2 && $SC->time <= $SC->end2)
        )
        {
            $add_item = 'g';
        }

    // Check if early or late hours/////////////////////////////////////////////
        else if ($SC->day === 'sat') {
            if (
                $SC->time >= new DateTime('06:00') && $SC->time <= new DateTime('08:00')
                ||
                $SC->time >= new DateTime('12:00') && $SC->time <= new DateTime('22:00')
            )
            {
                $add_item = 'ml';
            }
        } else if (
            $SC->time >= new DateTime('06:00') && $SC->time <= new DateTime('08:00')
            ||
            $SC->time >= new DateTime('18:00') && $SC->time <= new DateTime('22:00')
        )
        {
            $add_item = 'ml';
        }

    // Check if under 6 years /////////////////////////////////////////////
        if ($SC->age < 6) {
            $SC->age_type = "s";
        } else {
            $SC->age_type = "n";
        }
        if ($add_item ==="none" && $SC->age < 5) {
            $add_item = "z";
        }

        // Select additional item //////////////////////////////////////////////
        if ($add_item !=="none") {
            $koui_add = $SC->shin_add_items[$SC->type_tag][$add_item][$SC->age_type];
            array_push($response->koui, ['code'=>$koui_add, 'times'=>1]);
        }
        $response->ok = true;
        $this->response = $response;
    } 
}