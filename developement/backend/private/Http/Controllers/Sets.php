<?php
namespace App\Http\Controllers;

use App\Database\Queries\Set;

class Sets {

    private function populate_branch($node, $nodes_by_parent) {

        $children = $nodes_by_parent[$node['id']] ?? [];

        foreach ($children as &$child){
            $child = $this->populate_branch($child, $nodes_by_parent);
        }
    
        $node['children'] = $children;
    
        return $node;    

    }

    public function get($req, $res) {

        $query_data = $req->itemId;

        $db = new Set();
        $query = $db->get($query_data);

        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $flat_list = $query->data;
        $patient_nodes = [
            'text' => 'この患者のみ',
            'children' => []
        ];
        $tree = array();
        $parent_nodes = array();
        $nodes_by_parent = array();

        if(is_null($flat_list) || count($flat_list) <= 0){
            $res->data = [];
            $res->success = true;    
            return;
        }

        foreach ($flat_list as $node) {

            $node['content'] = json_decode($node['content'], true);            
            $patient = $node['patient'];
            $node = [
                'parent' => $node['parent'],
                'id' => $node['id'],
                'data' => [
                    'id' => $node['id'],
                    'isFolder' => $node['folder'] == 1 ? true : false,
                    'content' => $node['content']
                ],
                'text' => $node['text'] = $node['content']['name']
            ];

            if ($node['parent'] != null && !$patient) {
                $nodes_by_parent[$node['parent']][] = $node;
            } 
            else if ($patient) {
                $patient_nodes['children'][] = $node;
                $patient_nodes['id'] =  $node['id'];
                $patient_nodes['data']['patient'] = $patient;
                $patient_nodes['data']['isFolder'] = true;
            }
            else {
                $parent_nodes[] = $node;
            }

        }

        foreach ($parent_nodes as $node) {
            $t = $this -> populate_branch($node, $nodes_by_parent);
            $tree[] = $t;
        }

        array_unshift($tree, $patient_nodes);

        $res->data = $tree;
        $res->success = true;

    }

    public function post($req, $res) {

        $req_data = $req->post->data;
        $req_data->user = $_SESSION['user'];
        $req_data->is_folder = 0;
        $req_data->content = [
            'name' => $req_data->text,
            'items' => $req_data->content
        ];
        $req_data->content = json_encode($req_data->content);


        $db = new Set();
        $query = $db->post($req_data);
        if (!$query->ok) {
            $res->message = $query->msg;
            return;
        }

        $res->success = true;
    }


}