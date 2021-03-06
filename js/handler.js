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
            if (!resp) throw Error(resp);
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
            if (resp.error) throw Error(resp.error);

            setCookie(resp.id);
            window.location.href = "contacts.html";
        })
        .catch((err) => {
            document.querySelector("#register-result").innerHTML =
                "Error: " + err;
        });
}

function openCreateContact() {
    // Open contact tab
    document.getElementById("info").classList.add("info-selected");
    let cm = getCookieMap();
    cm.set("cid", 0);
    serializeCookieMap(cm);
    document.querySelector("#create-result").innerHTML = "";
}

// Adds a contact
function handleCreateContact() {
    const params = {
        uid: getID(),
        firstName: document.querySelector("#editContactFirstName").value,
        lastName: document.querySelector("#editContactLastName").value,
        email: document.querySelector("#editContactPhoneNumber").value,
        phone: document.querySelector("#editContactEmail").value,
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

            let cm = getCookieMap();
            cm.set("cid", resp.cid);
            serializeCookieMap(cm);
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

    handleSearchContact();
    document.getElementById("info").classList.remove("info-selected");
}

// Saves a contact after editing
function handleSaveContact() {
    const cm = getCookieMap();
    const cid = cm.get("cid");

    if (!cid || cid == 0) {
        handleCreateContact();
        return;
    }

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

    let e = document.querySelector(`#card-${cid}`);
    if (e) e.remove();

    handleSearchContact();
    // Remove cid from cookie
    cm.delete("cid");
    serializeCookieMap(cm);
}

function editContact(cid) {
    let firstNameElement = document.querySelector("#editContactFirstName");
    let lastNameElement = document.querySelector("#editContactLastName");
    let phoneElement = document.querySelector("#editContactPhoneNumber");
    let emailElement = document.querySelector("#editContactEmail");

    const uid = getID();
    let cm = getCookieMap();
    cm.set("cid", cid);
    serializeCookieMap(cm);

    const params = {
        uid: uid,
        cid: cid,
    };
    fetch(urlBase + "GetContact" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            if (resp.error) throw Error(resp.error);

            firstNameElement.value = resp.firstName;
            lastNameElement.value = resp.lastName;
            phoneElement.value = resp.phone;
            emailElement.value = resp.email;
        })
        .catch((err) => {
            console.log(err);
        });

    document.querySelector("#create-result").innerHTML = "";
    document.getElementById("info").classList.add("info-selected");
}

// Returns: error
function handleDeleteContact() {
    let cm = getCookieMap();
    const cid = cm.get("cid");
    const uid = getID();
    serializeCookieMap(cm);

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
                "Contact Deleted :)";

            let cm = getCookieMap();
            cm.set("cid", 0);
            serializeCookieMap(cm);
        })
        .catch((err) => {
            console.log(err);
        });

    document.getElementById("info").classList.remove("info-selected");

    document.querySelector("#editContactFirstName").value = "";
    document.querySelector("#editContactLastName").value = "";

    document.querySelector("#editContactPhoneNumber").value = "";
    document.querySelector("#editContactEmail").value = "";

    document.querySelector("#create-result").innerHTML = "Contact Deleted :)";
    document.querySelector(`#card-${cid}`).remove();
    return null;
}
// Deletes a user
function handleDeleteUser() {
    let cm = getCookieMap();
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
    let searchResults = document.querySelector("#search-results");

    if (query.length == 0) {
        searchResults.innerHTML = "";
        return;
    }

    const params = {
        uid: uid,
        query: query,
    };
    fetch(urlBase + "SearchContacts" + ext, {
        method: "POST",
        body: JSON.stringify(params),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            searchResults.innerHTML = "";
            resp.results.forEach((val, i, arr) => {
                searchResults.innerHTML +=
                    `<div id="card-${val.cid}" class="card">` +
                    `<div class="search-content">` +
                    `<div class="card-header">` +
                    `<span>${val.firstName} ${val.lastName}</span>` +
                    `<button class="search-edit button" onclick="editContact(${val.cid})">` +
                    `<i class="icon fas fa-xs fa-edit"> </i>` +
                    `</button>` +
                    `</div>` +
                    `<div class="card-image">` +
                    `<div class="icon-${(val.cid % 5) + 1}"></div>` +
                    `</div>` +
                    `<div class="card-body">` +
                    (val.phone
                        ? `<span class="search-phone">Phone: ${val.phone}</span>`
                        : "") +
                    (val.email
                        ? `<span class="search-email">Email: ${val.email}</span>`
                        : "") +
                    `</div>` +
                    `</div>` +
                    `</div>`;
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

function logOut() {
    logout();
}
