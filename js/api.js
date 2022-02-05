const baseURL = "http://friendidex.xyz/api/";
const ext = ".php";

class User {
    constructor(
        uid,
        firstName,
        lastName,
        password,
        dateCreated,
        dateLastUpdated
    ) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.dateCreated = dateCreated;
        this.dateLastUpdated = dateLastUpdated;
    }
}

// id: number
function setCookie(id) {
    const mins = 20;
    const date = new Date(Date.now() + mins * 60 * 1000);
    let cm = getCookieMap();
    cm.set("id", id);
    cm.set("expires", date.toUTCString());
    document.cookie = serializeCookieMap(cm);
}

function getCookieMap() {
    if (document.cookie.length == 0) {
        return new Error("getID error: cookie doesn't exist");
    }

    const m = new Map();
    document.cookie.split(";").forEach((val) => {
        spl = val.split("=");
        m.set(spl[0], spl[1]);
    });

    return m;
}

function serializeCookieMap(cm) {
    let parsed = "";

    cm.forEach((v, k, m) => {
        parsed += `${k}=${v};`;
    });

    return parsed;
}

function getID() {
    cm = getCookieMap();
    return cm.get("id");
}

function logout() {
    document.cookie = `id=0;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    window.location.href = "index.html";
}

//! --------------------- API ENDPOINTS ---------------------

// returns: error
function handleDeleteUser(uid, password) {
    const params = {
        password: password,
        uid: uid,
    };

    const resp = doRequest("DeleteUser", params);
    if (!resp) {
        return new Error(resp);
    }

    setCookie(0);
    return null;
}

// returns: User Object
function getUser(uid) {
    let user;
    const params = {
        uid: uid,
    };
    fetch(urlBase + "GetUser" + ext, {
        method: "POST",
        body: params,
    })
        .then((resp) => resp.json())
        .then((resp) => {
            user = new User(
                uid,
                resp.firstName,
                resp.lastName,
                resp.password,
                resp.dateCreated,
                resp.dateLastUpdated
            );
        })
        .catch((err) => console.log(err));

    return user;
}

// Returns: error
function deleteContact(uid, cid) {
    const params = {
        uid: uid,
        cid: cid,
    };

    const resp = doRequest("DeleteContact", params);
    if (!resp) {
        return new Error(resp);
    }

    return null;
}

// Returns: ContactStub[]
function searchContacts(uid, query) {
    const params = {
        uid: uid,
        query: query,
    };

    const resp = doRequest("UpdateContact", params);
    if (!resp) {
        return new Error(resp);
    }

    return null;
}

// Returns: Contact
function getContact(uid, cid) {
    const params = {
        uid: uid,
        cid: cid,
    };

    const resp = doRequest("GetContact", params);
    if (!resp) {
        return new Error(resp);
    }

    return null;
}
