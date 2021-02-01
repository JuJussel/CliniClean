<?php

namespace App\Middleware;

use stdClass;
use PDO;

class Orcadb {

    public function __construct() {
        $this->ok = false;
    }    

    private function db_query($query, $params = NULL) {
        $host = $GLOBALS['db']['orca']['dbhost'];
        $user = $GLOBALS['db']['orca']['dbuser'];
        $pass = $GLOBALS['db']['orca']['dbpass'];

        try {
            $orca_conn = new PDO(
                "pgsql:host=$host;dbname='orca'",
                $user,
                $pass,
            );
        } catch (\PDOException $e) {
            $this->msg =  '
                Connection failed: Cannot connect to Orca Database. <br> 
                オルカのデータベースに接続できませんでした。
            ';
            return;
        }
        
        $stmt = $orca_conn->prepare($query);
        if (!$stmt) {
            $this->msg = $stmt->errorInfo();
        }

        if($params) {
            foreach($params as $key => &$value) {
                $stmt->bindParam($key +1, $value);
            }
        }
        // Execute Statement
        if ($stmt->execute()) {
            $this->ok = true;
            $this->data = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($this->data, $row);
            }
        } else {
            $this->msg = $stmt->errorInfo();
        }

        // Close
        $stmt = null;
    }

    public function shinsatutypes() {
        
        $query = 
        "   SELECT kbncd AS id, kanritbl AS name 
            FROM public.tbl_syskanri
            WHERE kanricd = '1012'
            ORDER BY id
        ";

        return $this->db_query($query);
    }

    public function zips($params) {

        $query = 
        "   SELECT editadrs_name 
            FROM public.tbl_adrs
            WHERE post = :zip
            LIMIT 1
        ";

        $params = [
            $params
        ];

        return $this->db_query($query, $params);

    }

    public function diseases($params) {

        $query = 
        "   SELECT
                byomeicd,
                byomei
            FROM
                master.tbl_byomei
            WHERE
                byomeicd LIKE :code OR
                byomei LIKE :name
            LIMIT 100
        ";

        $search =  mb_convert_kana($params, 'R');
        $name = '%' . mb_convert_encoding($search, "EUC-JP") . '%';
        $code = mb_convert_encoding($search, "EUC-JP") . '%';

        $params = [
            $code,
            $name
        ];

        return $this->db_query($query, $params);

    }

    public function insurances($params) {

        $kigo = mb_convert_encoding(mb_convert_kana($params['kigou'], 'N'), "EUC-JP");;
        $num =  mb_convert_encoding(mb_convert_kana($params['bangou'], 'N'), "EUC-JP");
        $hknjanum = $params['hokensha'];
        
        $query = 
        "   SELECT
                ptid,
                hihknjaname
            FROM
                public.tbl_pthkninf
            WHERE
                kigo = ? AND
                num = ? AND
                hknjanum = ?
        ";


        $params = [
            $kigo,
            $num,
            $hknjanum
        ];
        return $this->db_query($query, $params);

    }

    public function insurance_providers($params) {

        $query = 
        "   SELECT seidoname
            FROM public.tbl_hknnum
            WHERE hbtnum = :hokensha_number
            LIMIT 1
        ";

        $params = [
            substr($params, 1, 2)
        ];
        return $this->db_query($query, $params);

    }

    public function procedures($params) {

        $kouiCat = $params->cat;
        $code = mb_convert_encoding($params->name, 'EUC-JP') ;
        $kouiName = mb_convert_kana($params->name, "KVCRN");
        $kouiName = '%' . mb_convert_encoding($kouiName, 'EUC-JP') . '%';

        // Default
        $where = 
        "   WHERE
                srykbn IN (:kouiCat) 
                AND (name LIKE :kouiName OR srycd IN ('$code'))
                AND yukoedymd = '99999999'
        ";
        // Meds
        if ($kouiCat === '25') {
            $where = 
            "   WHERE
                    srykbn = :kouiCat
                    AND (ykzkbn = '1' OR ykzkbn = '6')
                    AND (name LIKE :kouiName or srycd IN ('$code'))
                    AND yukoedymd = '99999999'
            ";
            $kouiCat = '';
        }
        // Shot
        if ($kouiCat === '30') {
            $where = 
            "   WHERE 
                    srykbn = :kouiCat
                    AND ykzkbn = '4'
                    AND (name LIKE :kouiName OR srycd IN ('$code'))
                    AND yukoedymd = '99999999'
            ";
            $kouiCat = '';
        }

        $query = 
        "   SELECT
                srycd AS kouiID,
                name,
                taniname,
                ten AS cost
            FROM public.tbl_tensu 
        " 
            . $where . 
        "
            LIMIT 200
        ";

        $params = [
            $kouiCat,
            $kouiName
        ];
        return $this->db_query($query, $params);

    }

    public function disease_history($params) {

        $query = 
        "   SELECT 
                bm.khnbyomeicd,
                bm.utagaiflg,
                bm.syubyoflg,
                bm.hkncombi,
                bm.rezeflg,
                bm.tenkikbn,
                bm.tenkiymd,
                bm.byomei,
                bm.creymd,
                bm.upymd,
                bm.hosoku_comment 
            FROM tbl_ptbyomei bm
            WHERE bm.ptid = :patientID 
                AND NOT dltflg = '1'
            ORDER BY bm.creymd DESC
        ";

        $params = [
            $params
        ];

        return $this->db_query($query, $params);

    }

    public function etensu($params) {
        
        $query = 
        "   SELECT
                tt.nyugaitekkbn as inonly,
                tt.routekkbn as oldonly,
                tt.hospsrykbn as hosponly,
                tt.kgnage as minage,
                tt.jgnage as maxage,
                t.r_day as viod,
                t.r_month as viom,
                t.r_same as vios,
                t.r_week as viow,
                t.c_kaisu as maxcount
            FROM tbl_tensu tt
            LEFT JOIN tbl_etensu_1 t ON t.srycd = tt.srycd
            WHERE tt.srycd = :newKouiCode AND tt.yukoedymd = '99999999'
            LIMIT 1
        ";

        $params = [
            $params
        ];

        return $this->db_query($query, $params);
   
    }

    public function etensu_timing($params) {
        $query = 
        "   SELECT 
                te.srycd1 AS koui_code_1,
                te.srycd2  AS koui_code_2,
                te.haihan AS contra_type,
                (SELECT tt.name
                    FROM tbl_tensu tt
                    WHERE tt.srycd = te.srycd1
                    AND tt.yukoedymd = '99999999')
                    AS name_kanji_1,
                (SELECT tt.name
                    FROM tbl_tensu tt
                    WHERE tt.srycd = te.srycd2
                    AND tt.yukoedymd = '99999999')
                    AS name_kanji_2,
                sr.creymd AS insert_date
            FROM tbl_etensu_" . $params['tbl'] . " te 
            INNER JOIN tbl_sryact sr
                ON sr.srycd1 = te.srycd2
                AND (not sr.srykbn = '96' AND sr.ptid = :patientID AND sr.creymd >= :dateLim)
            WHERE te.srycd1 = :newKouiCode
                AND te.yukoedymd = '99999999'
            LIMIT 1
        ";

        $params = [
            $params['patientID'],
            $params['dateLim'],
            $params['newKouiCode']
        ];

        return $this->db_query($query, $params);

    }

    public function etensu_same($params) {
        
        $query = 
        "   SELECT 
                te.srycd1 as koui_code_1,
                te.srycd2 as koui_code_2,
                te.haihan as contra_type,
                (SELECT tt.name FROM tbl_tensu tt WHERE tt.srycd = te.srycd1 AND tt.yukoedymd = '99999999') as name_kanji_1,
                (SELECT tt.name FROM tbl_tensu tt WHERE tt.srycd = te.srycd2 AND tt.yukoedymd = '99999999') as name_kanji_2
            FROM tbl_etensu_3_3 te 
            WHERE 
                te.srycd1 = :newKouiCode
                AND te.yukoedymd = '99999999'
        ";

        $params = [
            $params
        ];

        return $this->db_query($query, $params);
   
    }

    public function etensu_count($params) {
        
        $query = 
        "   SELECT
                te.tanicd as unit_code,
                te.taniname as unit_name,
                te.kaisu as amount,
                ts.name as name_kanji
            FROM tbl_etensu_5 te
            LEFT JOIN tbl_tensu ts ON ts.srycd = te.srycd
            WHERE te.srycd = :newKouiCode AND te.yukoedymd = '99999999' AND ts.yukoedymd = '99999999'
        ";

        $params = [
            $params
        ];

        return $this->db_query($query, $params);
   
    }

    public function etensu_act($params) {
        
        $query = 
        "   SELECT 
                ts.ptid 
            FROM tbl_sryact ts
            WHERE 
                ts.srycd1 = :newKouiCode 
                AND ts.ptid = :patientID 
                AND ts.creymd >= :dateLim
        ";

        return $this->db_query($query, $params);
   
    }



    
}