<?php header('Access-Control-Allow-Origin: *');?>

<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "YayApi", "ILovePHP", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $query = '%' . $inData["query"] . '%';
    $stmt = $conn->prepare("SELECT *
                            FROM `Contacts`
							WHERE (`FirstName` LIKE ? OR `LastName` LIKE ?) AND UID=?");
    $stmt->bind_param("ssi", $query, $query, $inData["uid"]);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"firstName": "' . $row["FirstName"] . '"' . ', "lastName": "' . $row["LastName"] . '", "cid": ' . $row["CID"] . '}';
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
