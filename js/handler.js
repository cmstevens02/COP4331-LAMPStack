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
            if (resp.error.length > 0) throw Error(resp.error);
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
            console.log(resp);
            if (resp.error) throw Error(resp.error);
            setCookie(resp.id);
            window.location.href = "contacts.html";
        })
        .catch((err) => {
            document.querySelector("#register-result").innerHTML =
                "Error: " + err;
        });
}

// Adds a contact, then prepares it for editing
function handleCreateContact() {
    // Open contact tab
    document.getElementById("info").classList.add("info-selected");
    const cid = createContact(getID, "", "", "", "");

    let uid = getID();
    let firstName = document.querySelector("#editContactFirstName").value;
    let lastName = document.querySelector("#editContactLastName").value;
    let email = document.querySelector("#editContactEmail").value;
    let phone = document.querySelector("#editContactPhone").value;

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

    const params = {
        uid: uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
    };

    fetch(url + "CreateContact" + ext, {
        method: "POST",
        body: json.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            if (resp.error) throw Error(resp.error);
            document.querySelector("#create-result").innerHTML =
                "Contact created";
        })
        .catch((err) => {
            console.log(err);
        });
}

// Deletes a user
function deleteUser() {
    let uid = getID();
    let currentUser = getUser(uid);

    const params = {
        password: currentUser.password,
        uid: uid,
    };

    fetch(urlBase + "DeleteUser" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            if (resp.error) throw Error(resp.error);
            window.location.href = "index.html";
            document.querySelector("#login-result").innerHTML = "User Deleted";
        })
        .catch((err) => {
            console.log(err);
        });
}

function searchContacts() {
    let uid = getID();
    let query = document.querySelector("#searchContact").value;

    if (query.length == 0) {
        document.querySelector("#searchContact").placeholder =
            "Please enter a valid string";
        return;
    }

    const params = {
        uid: uid,
        query: query,
    };

    fetch(urlBase + "SearchContacts" + ext, {
        method: "POST",
        body: json.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            let arr = resp.results;
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
