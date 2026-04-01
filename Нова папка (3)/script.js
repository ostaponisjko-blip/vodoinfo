let data = JSON.parse(localStorage.getItem("utilityData")) || [];

let waterChart, gasChart, electricityChart;

// 📅 Автоматично ставимо сьогоднішню дату
function setTodayDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = today;
}

// ➕ Додавання запису
function addRecord() {
    const dateInput = document.getElementById("date");
    const waterInput = document.getElementById("water");
    const gasInput = document.getElementById("gas");
    const electricityInput = document.getElementById("electricity");

    const date = dateInput.value;
    const water = parseFloat(waterInput.value);
    const gas = parseFloat(gasInput.value);
    const electricity = parseFloat(electricityInput.value);

    if (!date || isNaN(water) || isNaN(gas) || isNaN(electricity)) {
        alert("Заповни всі поля!");
        return;
    }

    data.push({ date, water, gas, electricity });
    data.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem("utilityData", JSON.stringify(data));

    // 🧹 Очищення полів
    dateInput.value = "";
    waterInput.value = "";
    gasInput.value = "";
    electricityInput.value = "";

    // 📅 знову ставимо сьогодні
    setTodayDate();

    render();
}

// 📊 Розрахунок витрат
function calculateUsage(index, key) {
    if (index === 0) return 0;
    return data[index][key] - data[index - 1][key];
}

// 🔄 Рендер таблиці + графіків
function render() {
    const table = document.getElementById("tableBody");
    table.innerHTML = "";

    let dates = [];
    let waterUsage = [];
    let gasUsage = [];
    let electricityUsage = [];

    data.forEach((item, i) => {
        const tr = document.createElement("tr");

        const wUse = calculateUsage(i, "water");
        const gUse = calculateUsage(i, "gas");
        const eUse = calculateUsage(i, "electricity");

        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.water}</td>
            <td>${item.gas}</td>
            <td>${item.electricity}</td>
            <td>${wUse}</td>
            <td>${gUse}</td>
            <td>${eUse}</td>
        `;

        table.appendChild(tr);

        dates.push(item.date);
        waterUsage.push(wUse);
        gasUsage.push(gUse);
        electricityUsage.push(eUse);
    });

    updateCharts(dates, waterUsage, gasUsage, electricityUsage);
}

// 📈 Оновлення графіків
function updateCharts(dates, water, gas, electricity) {
    if (waterChart) waterChart.destroy();
    if (gasChart) gasChart.destroy();
    if (electricityChart) electricityChart.destroy();

    waterChart = new Chart(document.getElementById("waterChart"), {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "Вода",
                data: water
            }]
        }
    });

    gasChart = new Chart(document.getElementById("gasChart"), {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "Газ",
                data: gas
            }]
        }
    });

    electricityChart = new Chart(document.getElementById("electricityChart"), {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "Світло",
                data: electricity
            }]
        }
    });
}

// 🗑 Очистити все
function clearAll() {
    if (confirm("Точно очистити всі дані?")) {
        data = [];
        localStorage.removeItem("utilityData");
        render();
    }
}

// ⌨️ Enter = додати запис
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addRecord();
    }
});

// 🚀 Запуск
setTodayDate();
render();