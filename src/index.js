import './style.css';

const searchInput = document.getElementById("location-input");
const locationForm = document.getElementById("location-form");
const weatherResultContainer = document.getElementById("weather-result")
const forecastGrid = document.querySelector(".forecast-grid");
const weatherInfoGrid = document.querySelector(".weather-info-grid");
const address = document.getElementById("address")
const temp = document.getElementById("temp");
const description = document.getElementById("desc")
const mainIcon = document.getElementById("main-icon");


locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    displayData();
})

const bubbles = []
for (let i = 1; i <= 6; i++) {
    bubbles.push(document.querySelector(`#fcd-${i}`));
}

const icons = []
for (let i = 1; i <= 6; i++) {
    icons.push(document.querySelector(`.icon-${i}`));
}

async function fetchData() {
    const loc = (searchInput.value == "") ? "New York" : searchInput.value;
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?key=HXCK23HA9K84HTTS6A6VL8CTN`);
        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.log("Error fetching data", error)
    }
}

async function processData() {
    try {
        return await fetchData();
    } catch (error) {
        console.log("Error in process data", error)
    }
    
}

async function displayData() {
    try {
        const processedData = await processData();
        console.log(processedData)
        // Capitalize first letter
    
        address.textContent = processedData.resolvedAddress.charAt(0).toUpperCase() + processedData.resolvedAddress.slice(1);
        description.textContent = processedData.currentConditions.conditions;
        temp.textContent = processedData.currentConditions.temp + "F";
        
        displayIcon(mainIcon, processedData.currentConditions.icon);
        
        weatherInfoGrid.appendChild(address);
        weatherInfoGrid.appendChild(temp);
        weatherInfoGrid.appendChild(description);

        // Future forecasts
        const futureForecasts = processedData.days.slice(1, 7);
        futureForecasts.forEach((day, index) => {
            const bubble = bubbles[index];
            bubble.querySelector(`.icon-${index + 1}`).hasChildNodes[0] && bubble.querySelector(`.icon-${index + 1}`).removeChild(bubble.querySelector(`.icon-${index + 1}`).firstChild);
            displayIcon(bubble.querySelector(`.icon-${index + 1}`), day.icon);
            bubble.querySelector(`.day-${index + 1}`).textContent = day.datetime;
            bubble.querySelector(`.temp-${index + 1}`).textContent = day.temp + "F";
            // bubble.style.display = "block"; // Show the bubble
            forecastGrid.appendChild(bubble);
        });
        weatherResultContainer.appendChild(forecastGrid)
    } catch (error) {
        console.log("Error in displayData", error.message)
        address.textContent = "Nothing found"
        weatherResultContainer.appendChild(address)
    }
}

async function displayIcon(parentContainer, iconCode) {
    try {
        const icon = document.createElement("img")
        import (`./icons/${iconCode}.svg`).then((module) => {
            icon.src = module.default
        })
        parentContainer.appendChild(icon);
    } catch (error) {
        console.log("Error in displayIcon", error)
    }
}

displayData();

// TODO: Make a function to clear pre-existing data 