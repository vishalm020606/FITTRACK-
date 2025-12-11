async function getBMI() {
    const res = await fetch("http://localhost:5000/health/bmi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            weight: 70,
            height: 170
        })
    });

    const data = await res.json();
    console.log(data);
}