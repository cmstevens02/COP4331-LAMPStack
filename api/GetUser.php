<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "YayApi", "ILovePHP", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Selects a user from the database with a matching uid
    $stmt = $conn->prepare("SELECT * FROM `Users` WHERE ID=?");
    $stmt->bind_param('i', $inData["uid"]);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        returnWithInfo($row['Login'], $row['Password'], $row['FirstName'], $row['LastName'], $row['DateCreated'], $row['DateLastLoggedIn']);
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
function returnWithInfo($username, $password, $firstName, $lastName, $dateCreated, $dateLastLoggedIn)
{
    $retValue = '{"username":"' . $username .
        '","password":"' . $password .
        '","firstName":"' . $firstName .
        '","lastName":"' . $lastName .
        '","dateCreated":"' . $dateCreated .
        '","dateLastLoggedIn":"' . $dateLastLoggedIn .
        '","error":""}';
    sendResultInfoAsJson($retValue);
}
