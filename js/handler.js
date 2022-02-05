const urlBase = "http://friendidex.xyz/api/";

// Logs a user into the database, redirects to contacts page
function handleLogin() {
    const username = document.querySelector("#login-name").value;
    const password = document.querySelector("#login-password").value;

    const params = {
        login: username,
        password: md5(password),
    };

    fetch(urlBase + "Login" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.error) throw Error(resp.error);
            console.log(resp);
            setCookie(resp.id);
            window.location.href = "contacts.html";
        })
        .catch((err) => {
            document.querySelector("#login-result").innerHTML =
                "Invalid username or password";
            console.log(err);
        });
}

// Registers a user into the database, then logs them in
function handleRegister() {
    const firstName = document.querySelector("#register-first-name").value;
    const lastName = document.querySelector("#register-last-name").value;
    const username = document.querySelector("#register-username").value;
    const password = document.querySelector("#register-password").value;
    const confirmPassword = document.querySelector(
        "#register-confirm-password"
    ).value;

    // Check all data is filled
    if (firstName.length == 0 || lastName.length == 0 || username.length == 0) {
        document.querySelector("#register-result").innerHTML =
            "Please enter all information.";
        return;
    }
    // Check matching password
    if (password != confirmPassword) {
        document.querySelector("#register-result").innerHTML =
            "Mismatched password";
        return;
    }
    // Check min pass length
    if (password.length < 8) {
        document.querySelector("#register-result").innerHTML =
            "Invalid password. Password must be at least 8 characters long.";
        return;
    }

    document.querySelector("#register-result").innerHTML = "";

    // Register user
    const params = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: md5(password),
    };

    fetch(urlBase + "SignUp" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.error.length > 0) throw Error(resp.error);

            setCookie(resp.id);
            window.location.href = "contacts.html";
        })
        .catch((err) => {
            document.querySelector("#register-result").innerHTML =
                "Error: " + err;
        });
}

// Adds a contact
function handleCreateContact() {
    // Open contact tab
    document.getElementById("info").classList.add("info-selected");

    const params = {
        uid: getID(),
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    };

    fetch(urlBase + "CreateContact" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.error > 0) throw Error(resp.error);
            document.querySelector("#create-result").innerHTML =
                "Contact created";

            cm = getCookieMap();
            cm.set("cid", resp.cid);
            serializeCookieMap(cm);
        })
        .catch((err) => {
            console.log(err);
        });
}

// Saves a contact after editing
function handleSaveContact() {
    let uid = getID();
    let firstName = document.querySelector("#editContactFirstName").value;
    let lastName = document.querySelector("#editContactLastName").value;
    let phone = document.querySelector("#editContactPhoneNumber").value;
    let email = document.querySelector("#editContactEmail").value;

    if (
        firstName.length == 0 ||
        lastName.length == 0 ||
        email.length == 0 ||
        phone.length == 0
    ) {
        document.querySelector("#create-result").innerHTML =
            "Please enter all information.";
        return;
    }

    const cm = getCookieMap();
    console.log(cm);
    const cid = cm.get("cid");
    console.log(cid);

    const params = {
        uid: uid,
        cid: cid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
    };
    console.log(params);
    fetch(urlBase + "UpdateContact" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.error) throw Error(resp.error);

            document.querySelector("#create-result").innerHTML =
                "Contact saved :)";
        })
        .catch((err) => {
            console.log(err);
        });

    // Close contact tab
    document.getElementById("info").classList.remove("info-selected");

    document.querySelector("#editContactFirstName").value = "";
    document.querySelector("#editContactLastName").value = "";
    document.querySelector("#editContactPhoneNumber").value = "";
    document.querySelector("#editContactEmail").value = "";

    // Remove cid from cookie
    cm.delete("cid");
    serializeCookieMap(cm);
}

// Returns: error
function handleDeleteContact(uid, cid) {
    const params = {
        uid: uid,
        cid: cid,
    };

    fetch(urlBase + "DeleteContact" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.error > 0) throw Error(resp.error);
            document.querySelector("#create-result").innerHTML =
                "Contact created";

            cm = getCookieMap();
            cm.set("cid", resp.cid);
            serializeCookieMap(cm);
        })
        .catch((err) => {
            console.log(err);
        });

    return null;
}
// Deletes a user
function handleDeleteUser() {
    let cm = getCookieMap;
    const uid = cm.get("id");
    const cid = cm.get("cid");

    const params = {
        cid: cid,
        uid: uid,
    };

    fetch(urlBase + "DeleteUser" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.error) throw Error(resp.error);
        })
        .catch((err) => {
            console.log(err);
        });
}

function handleSearchContact() {
    let uid = getID();
    let query = document.querySelector("#search-contact").value;

    if (query.length == 0) {
        return;
    }
    console.log(query);

    const params = {
        uid: uid,
        query: query,
    };
    console.log(params);
    let arr = [];
    fetch(urlBase + "SearchContacts" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            res = document.querySelector("#search-results");
            res.value = resp;
            arr = resp.results;
        })
        .catch((err) => {
            console.log(err);
        });

    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i].cid);
        console.log(arr[i].firstName);
        console.log(arr[i].lastName);
    }
}

function logOut() {
    logout();
}
