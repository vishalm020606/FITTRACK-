// ---------- GLOBAL FUNCTIONS ----------
function toMinutes(t) {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

// Default tasks
const tasks = [
    { id: "breakfast", name: "Breakfast", time: "" },
    { id: "work", name: "Work / College", time: "" },
    { id: "gym", name: "Gym", time: "" },
    { id: "dinner", name: "Dinner", time: "" }
];

function renderPreview() {
    const preview = document.getElementById("preview");
    preview.innerHTML = "";

    // Read input values for each task
    tasks.forEach(t => {
        const input = document.getElementById(t.id + "_time");
        if (input) t.time = input.value;
    });

    const sorted = tasks.slice().sort((a, b) => toMinutes(a.time) - toMinutes(b.time));

    sorted.forEach(t => {
        const div = document.createElement("div");
        div.className = "detail-item";
        div.innerHTML = `<strong>${t.name}:</strong> ${t.time || "--:--"}`;
        preview.appendChild(div);
    });
}

// ---------- DOM LOADED ----------
document.addEventListener("DOMContentLoaded", () => {

    // Inputs
    const screenYesterday = document.getElementById("screenYesterday");
    const screenBtn = document.getElementById("screenBtn");
    const screenResponse = document.getElementById("screenResponse");

    const wakeTime = document.getElementById("wakeTime");
    const sleepTime = document.getElementById("sleepTime");
    const calcSleepBtn = document.getElementById("calcSleepBtn");
    const totalSleep = document.getElementById("totalSleep");
    const sleepSuggestion = document.getElementById("sleepSuggestion");
    const sleepSummary = document.getElementById("sleepSummary");

    const addCustomBtn = document.getElementById("addCustomBtn");
    const customName = document.getElementById("customName");
    const customTime = document.getElementById("customTime");

    const saveBtn = document.getElementById("saveBtn");


    // ---------- SCREEN TIME ----------
    screenBtn.onclick = () => {
        const hrs = parseFloat(screenYesterday.value);
        if (isNaN(hrs) || hrs < 0) return alert("Enter valid hours!");

        screenResponse.innerHTML =
            hrs >= 3 ?
            "<span style='color:#ff6b7a'>High screen time.</span>" :
            "<span style='color:#7cff9b'>Healthy screen-time!</span>";
    };


    // ---------- ADD CUSTOM TASK ----------
    addCustomBtn.onclick = () => {
        const name = customName.value.trim();
        const time = customTime.value;

        if (!name) return alert("Enter task name!");

        const id = "task_" + Date.now();
        tasks.push({ id, name, time });

        const previewBox = document.getElementById("preview");

        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <label>${name}</label>
            <input type="time" id="${id}_time" value="${time}" onchange="renderPreview()">
        `;
        previewBox.parentNode.insertBefore(wrapper, previewBox);

        customName.value = "";
        customTime.value = "";
        renderPreview();
    };


    // ---------- SLEEP CALC ----------
    calcSleepBtn.onclick = () => {
        const wake = wakeTime.value;
        const sleep = sleepTime.value;

        if (!wake || !sleep) return alert("Enter both times!");

        let w = toMinutes(wake);
        let s = toMinutes(sleep);

        // cross-midnight
        if (s > w) s -= 24 * 60;

        const hrs = ((w - s) / 60).toFixed(1);
        totalSleep.textContent = hrs;

        sleepSuggestion.textContent =
            hrs >= 7.5 ? "Great sleep!" :
            hrs >= 6 ? "Average — add 1 hour." :
            "Low — you will feel tired.";

        sleepSummary.style.display = "block";
    };


    // ---------- SAVE TO BACKEND ----------
    saveBtn.onclick = async() => {

        // Update preview before saving
        renderPreview();

        // Screen time in minutes
        const screenMinutes = parseFloat(screenYesterday.value || 0) * 60;

        // Routine array (backend expects ARRAY)
        const routinePlan = [
            `Breakfast → ${document.getElementById("breakfast_time").value}`,
            `Work → ${document.getElementById("work_time").value}`,
            `Gym → ${document.getElementById("gym_time").value}`,
            `Dinner → ${document.getElementById("dinner_time").value}`
        ];

        // Final data packet for backend
        const data = {
            sleepHours: parseFloat(totalSleep.textContent) || 0,
            routine: routinePlan,
            sleepMessage: sleepSuggestion.textContent || "",

            // ⭐ Correct names for backend + dashboard
            screenMinutes: screenMinutes,
            screenMessage: screenMinutes >= 180 ? "High screen time" : "Good control"
        };

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/routine/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": token ? String(token) : "" // ⭐ IMPORTANT FIX
            },
            body: JSON.stringify(data)
        });

        const json = await res.json();

        if (json.error) return alert(json.error);

        alert("Routine Saved!");
        window.location.href = "dashboard.html";
    };

});