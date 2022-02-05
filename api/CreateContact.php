
<?php

$inData = getRequestInfo();

$cid = 0;

$conn = new mysqli("localhost", "YayApi", "ILovePHP", "COP4331");

if ($conn->connect_error) {
    returnWithInfo(0, $conn->connect_error);
} else {
    // Used to determine if there is an error with the insertion
    $prev_cid = $conn->insert_id;

    // Actually does the inserting for the contact!
    $stmt = $conn->prepare("INSERT INTO `Contacts` (`UID`, `FirstName`, `LastName`, `Email`, `Phone`) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $inData["uid"], $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"]);
    $stmt->execute();
    $stmt->close();

    // returns the last inserted id
    $cid = $conn->insert_id;
    echo "uid: " . $inData["uid"] . $inData["firstName"] . $inData["lastName"] . $inData["email"] . $inData["phone"];

    echo "prev: " . $prev_cid . "   curr: " . $cid;

    // If we have a different id after inserting, we successfully inserted!
    if ($prev_cid != $cid) {
        returnWithInfo($cid, "Contact added successfully");
    }
    // something weird happened!
    else {
        returnWithError(0, "Error while adding contact");
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

function returnWithInfo($uid, $msg)
{
    $retValue = '{"id":' . $uid . ',"message":"' . $msg . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithError($uid, $err)
{
    $retValue = '{"id":' . $uid . ',"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
