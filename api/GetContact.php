<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "YayApi", "ILovePHP", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Selects a contact from the database with a matching uid and cid
    $stmt = $conn->prepare("SELECT * FROM `Contacts` WHERE UID=? AND CID=?");
    $stmt->bind_param('ii', $inData["uid"], $inData["cid"]);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        returnWithInfo($row['FirstName'], $row['LastName'], $row['Email'], $row['Phone'], $row['DateCreated']);
    } else {
        returnWithError("No Records Found");
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
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

// Constructs a json with the given information
function returnWithInfo($firstName, $lastName, $email, $phone, $dateCreated)
{
    $retValue = '{"firstName":"' . $firstName .
        '","lastName":"' . $lastName .
        '","email":"' . $email .
        '","phone":"' . $phone .
        '","dateCreated":"' . $dateCreated .
        '","error":""}';
    sendResultInfoAsJson($retValue);
}
