<?php header('Access-Control-Allow-Origin: *');?>

<?php

$inData = getRequestInfo();

$id = 0;


$conn = new mysqli("localhost", "YayApi", "ILovePHP", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    
    // Make sure the user to delete exists. 
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UID=? AND CID=?");
    $stmt->bind_param("ii", $inData["uid"], $inData["cid"]);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result) {
        if ($result->num_rows > 0) {
            // Delete user
            $stmt2 = $conn->prepare("DELETE FROM Contacts WHERE UID = ? AND CID = ?"); 
            $stmt2->bind_param("ii", $inData["uid"], $inData["cid"]);
            $stmt2->execute();
            $result2 = $stmt2->get_result();
            
            // Make sure user was deleted. 
            $stmt3 = $conn->prepare("SELECT * FROM Contacts WHERE UID=? AND CID=?");
            $stmt3->bind_param("ii", $inData["uid"], $inData["cid"]);
            $stmt3->execute();
            $result3 = $stmt3->get_result();

            if ($result3->num_rows > 0) {
                returnWithError("Contact was not able to be deleted."); 
            }
            else {
                returnWithInfo("Contact deleted successfully"); 
            }


        } 
        else {
            returnWithError("Contact not found"); 
        }
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

function returnWithInfo($msg)
{
    $retValue = '{"message":"'. $msg .'"}';
    sendResultInfoAsJson($retValue);
}

?>
