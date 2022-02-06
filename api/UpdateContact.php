<?php header('Access-Control-Allow-Origin: *');?>

<?php

$inData = getRequestInfo();

$cid = 0;

$conn = new mysqli("localhost", "YayApi", "ILovePHP", "COP4331");

if ($conn->connect_error) {
    returnWithError(0, $conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UID=? AND CID=?");
    $stmt->bind_param('ii', $inData["uid"], $inData["cid"]);
    $stmt->execute();

    $result = $stmt->get_result();
    $stmt->close();

    // if the contact you're trying to edit exists
    if ($result && $result->num_rows > 0) {

        //Update the Contact
        $stmt2 = $conn->prepare("UPDATE Contacts SET FirstName=?,LastName=?,Email=?,Phone=? WHERE UID=? AND CID=?");
        $stmt2->bind_param('ssssii', $inData["firstName"], $inData["lastName"], $inData["email"],
            $inData["phone"], $inData["uid"], $inData["cid"]);
        $stmt2->execute();
        $stmt2->close();

        $stmt3 = $conn->prepare("SELECT * FROM Contacts WHERE UID=? AND CID=?");
        $stmt3->bind_param('ii', $inData["uid"], $inData["cid"]);
        $stmt3->execute();

        $result2 = $stmt3->get_result();

        if ($row = $result2->fetch_assoc()) {
            if (strcmp($row['FirstName'], $inData["firstName"]) != 0) {
                returnWithError("Update was unsuccessful");
            } elseif (strcmp($row['LastName'], $inData["lastName"]) != 0) {
                returnWithError("Update was unsuccessful");
            } elseif (strcmp($row['Email'], $inData["email"]) != 0) {
                returnWithError("Update was unsuccessful");
            } elseif (strcmp($row['Phone'], $inData["phone"]) != 0) {
                returnWithError("Update was unsuccessful");
            } else {
                returnWithInfo("Update was successful");
            }

        } else {
            returnWithError("Contact could not be updated.");
        }

        $stmt3->close();

    } else {
        returnWithError("Contact doesn't exist");
    }

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

function returnWithInfo($msg)
{
    $retValue = '{"message":"' . $msg . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
