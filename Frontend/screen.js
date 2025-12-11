function saveScreenTime() {
    const todayMin = Number(document.getElementById("screenMinutes").value);

    // STORE TODAY
    const today = new Date().toISOString().slice(0, 10);
    const data = { date: today, minutes: todayMin };

    localStorage.setItem("screenToday", JSON.stringify(data));

    // COPY TODAY → YESTERDAY (tomorrow)
    let prev = JSON.parse(localStorage.getItem("screenPrevDay"));
    let storedToday = JSON.parse(localStorage.getItem("screenToday"));

    if (!prev || prev.date !== today) {
        localStorage.setItem("screenPrevDay", JSON.stringify(storedToday));
    }

    alert("Screen time saved!");
}