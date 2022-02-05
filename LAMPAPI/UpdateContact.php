<?php

        $inData = getRequestInfo();

        $cid = 0;

        $conn = new mysqli("localhost", "YayApi", "ILovePHP", "COP4331");

        if( $conn->connect_error )
        {
                returnWithError( 0, $conn->connect_error );
        }
        else
        {
                // make sure the contact you're trying to edit is there
                $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UID=? AND CID=?");
		$stmt->bind_param('ii', $inData["uid"], $inData["cid"]);
		$stmt->execute();
                
                $result = $stmt->get_result();
                $stmt->close(); 

                // if it exists
                if ($row = $result->fetch_assoc()) {
                
                        // Update the Contact
                        $stmt2 = $conn->prepare("UPDATE Contacts SET FirstName=? AND LastName=? AND Email=? AND Phone=? WHERE UID=? AND CID=?); 
                                                
                        $stmt2->bind_param("ssssii", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"], 
                                        $inData["uid"], $inData["cid"]);
                        $stmt2->execute();
                        $stmt2->close();

                
                        // Check if updated successfully
		        $stmt3 = $conn->prepare("SELECT * FROM `Contacts` WHERE UID=? AND CID=?");
		        $stmt3->bind_param('ii', $inData["uid"], $inData["cid"]);
		        $stmt3->execute();
		
		        $result2 = $stmt3->get_result();
		
                         if ($row2 = $result2->fetch_assoc()) {

                                if (strcmp($row2['FirstName'], $inData["firstName"]) != 0) {
                                        returnWithError("Update was unsuccessful ");  
                                }
                                elseif (strcmp($row2['LastName'], $inData["lastName"]) != 0) {
                                        returnWithError("Update was unsuccessful ");  
                                } 
                                elseif (strcmp($row2['Email'], $inData["email"]) != 0) {
                                        returnWithError("Update was unsuccessful ");  
                                } 
                                elseif (strcmp($row2['Phone'], $inData["phone"]) != 0) {
                                        returnWithError("Update was unsuccessful ");  
                                } 
                                else {
                                        returnWithInfo("Update was successful")
                                }
                        
                         } else {
                                returnWithError("Contact could not be retrieved.");
                         }
                                
                         $stmt3->close();
                            

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

function returnWithInfo($msg)
{
    $retValue = '{"message":"'. $msg .'"}';
    sendResultInfoAsJson($retValue);
}


        
?>