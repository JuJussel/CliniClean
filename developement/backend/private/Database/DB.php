<?php
namespace App\Database;

use stdClass;

/**
 * Bring your own DB
 */
class DB
{

    public function sanitize_xss($value) {
        return htmlspecialchars(strip_tags($value));
    }

    public function query($params)
    {

        $query = $params['query'];

        $result = new StdClass();
        $result->ok = false;

        // Connect to DB
        $conn = mysqli_connect(
            $GLOBALS['db']['cliniclean']['dbhost'],
            $GLOBALS['db']['cliniclean']['dbuser'],
            $GLOBALS['db']['cliniclean']['dbpass'],
            $GLOBALS['db']['cliniclean']['dbname'],
        );
        if (!$conn) {
            $result->msg = $conn->error;
            return $result;
        }

        // Prepare Statement
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            $result->msg = $conn->error;
            return $result;
        }

        //Bind Paramerters if present
        if (isset($params['bind_params'])) {
            $parameters = [''];
            foreach($params['bind_params'] as $value) {
                $parameters[0] .= $value[0];
                $parameters[] .= "{$value[1]}";
            }
            $stmt->bind_param(...$parameters);
        }

        // Execute Statement
        if ($stmt->execute()) {
            $result->insert_id = $stmt->insert_id;
            $get_result = $stmt->get_result();
            $result->ok = true;
            if ($get_result) {
                $result->data = [];
                while ($row = mysqli_fetch_assoc($get_result)) {
                    array_push($result->data, $row);
                }
            }
        } else {
            $result->msg = $conn->error;
        }

        // Close and return
        $stmt->close();
        return $result;
    }
}
