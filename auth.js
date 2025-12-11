function checkLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
async function signup() {
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!fullname || !email || !username || !password) {
        alert("Please fill all details!");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullname, email, username, password })
        });
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        alert(data.message || "Account created! Please login.");
        window.location.href = "login.html";
    } catch (err) {
        console.error(err);
        alert("Signup failed — check backend console.");
    }
}

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Enter username and password");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Login failed — no token received");
        }
    } catch (err) {
        console.error(err);
        alert("Login failed — check backend console.");
    }
}

function checkLogin() {
    const token = localStorage.getItem("token");

    if (!token || token === "") {
        window.location.href = "login.html";
    }
}


function logout() {
    localStorage.removeItem("token");
    alert("Logged out!");
    window.location.href = "login.html";
}
