<?php header('Access-Control-Allow-Origin: *');?>

<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "YayApi", "ILovePHP", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $query = trim($inData["query"]);
    $query = explode(" ", $query);
    if (count($query) > 1)
    {
        $firstQuery = '%' . $query[0] . '%'; 
        $secondQuery = '%' . $query[1] . '%';
    }
    else
    {
        $firstQuery = '%' . $query[0] . '%'; 
        $secondQuery = '%' . $query[0] . '%';
    }
    $stmt = $conn->prepare("SELECT *
                            FROM `Contacts`
							WHERE ((`FirstName` LIKE ? OR `LastName` LIKE ?) 
                            OR (`FirstName` LIKE ? OR `LastName` LIKE ?) 
                            OR `Phone` LIKE ? 
                            OR `Email` LIKE ?)
                            AND UID=?
                            LIMIT 50");
    $stmt->bind_param("ssssssi", $firstQuery, $secondQuery, $secondQuery, $firstQuery, $firstQuery, $firstQuery, $inData["uid"]);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"cid":"' . $row['CID'] .
        '","firstName":"' . $row['FirstName'] .
        '","lastName":"' . $row['LastName'] .
        '","email":"' . $row['Email'] .
        '","phone":"' . $row['Phone'] .
        '","dateCreated":"' . $row['DateCreated'] .
        '"}';
    }

    if ($searchCount == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results": [' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}
