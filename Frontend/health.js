async function calculateHealth() {

    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    if (!height || !weight || height <= 0 || weight <= 0) {
        alert("Enter valid height and weight!");
        return;
    }

    // STEP 1: GET BMI + DIET + WORKOUT
    const bmiRes = await fetch("http://localhost:3000/health/bmi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ height, weight })
    });

    const data = await bmiRes.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    // STEP 2: UPDATE UI
    document.getElementById("bmi-value").innerText = data.bmi;
    document.getElementById("cal-value").innerText = data.calories;
    document.getElementById("protein-value").innerText = data.protein;
    document.getElementById("diet-value").innerText = data.diet;
    document.getElementById("workout-value").innerText = data.workout;

    document.getElementById("healthSummary").style.display = "block";

    // STEP 3: SAVE ALL DATA INTO DB
    const saveRes = await fetch("http://localhost:3000/health/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({
            height,
            weight,
            bmi: data.bmi,
            calories: data.calories,
            protein: data.protein,
            diet: data.diet, // ★ ADDED
            workout: data.workout // ★ ADDED
        })
    });

    const saveData = await saveRes.json();

    if (saveData.error) {
        alert(saveData.error);
        return;
    }

    alert("Successfully Saved📈!");
}

function saveHealth() {
    alert("Health is auto-saved after BMI calculation.");
}