document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("User not logged in!");
        return;
    }
    fetch("http://localhost:3000/dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        })
        .then(res => res.json())
        .then(data => {

            console.log("Dashboard Summary:", data);

            if (data.error) {
                document.getElementById("insightsBox").innerText = data.error;
                return;
            }
            document.getElementById("energyPercentUI").innerText = data.energyScore + "%";
            animateEnergyRing(data.energyScore);
            document.getElementById("bmi-value").innerText = data.bmi;
            document.getElementById("cal-value").innerText = data.calories;
            document.getElementById("protein-value").innerText = data.protein;
            document.getElementById("diet-value").innerText = data.diet;
            document.getElementById("workout-value").innerText = data.workout;

            document.getElementById("sleep-value").innerText = data.sleepHours;
            document.getElementById("routine-plan").innerText =
                Array.isArray(data.routinePlan) ?
                data.routinePlan.join("\n") :
                data.routinePlan || "Not added";

            document.getElementById("sleep-msg").innerText = data.sleepMessage;
            document.getElementById("screen-min").innerText = data.screenMinutes;
            document.getElementById("screen-msg").innerText = data.screenMessage;
            document.getElementById("insightsBox").innerHTML =
                data.insights || "📌 No insights available yet.";
            loadGraphs(data);
        })
        .catch(err => console.error("Dashboard Fetch Error:", err));

    function animateEnergyRing(percent) {
        const ring = document.querySelector(".ring-progress");
        const full = 628;
        const offset = full - (full * percent / 100);
        ring.style.strokeDashoffset = offset;
    }

    function loadGraphs(data) {

        const weeklyScreen = data.weeklyScreen || [10, 20, 15, 30, 25, 40, 35];
        const weeklySleep = data.weeklySleep || [6, 7, 5, 8, 7, 6, 7];

        new Chart(document.getElementById("screenChart"), {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Minutes",
                    data: weeklyScreen,
                    borderWidth: 3,
                    borderColor: "#ff2f4f"
                }]
            },
            options: { responsive: true }
        });
        new Chart(document.getElementById("sleepChart"), {
            type: "bar",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Hours",
                    data: weeklySleep,
                    backgroundColor: "#ffcc33",
                    borderWidth: 2
                }]
            },
            options: { responsive: true }
        });
    }

});