document.addEventListener('DOMContentLoaded', () => {
    const currentLocationBtn = document.getElementById('current-location-btn');
    const locationSearchInput = document.getElementById('location-search-input');
    const searchBtn = document.getElementById('location-search-btn');
    const dashboard = document.getElementById('dashboard');

    currentLocationBtn.addEventListener('click', getCurrentLocation);
    searchBtn.addEventListener('click', searchLocation);

    function getCurrentLocation() {
        if (navigator.geolocation) {
            
            navigator.geolocation.getCurrentPosition(
                
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log(position);
                    getSunriseSunsetData(latitude, longitude);
                },
                
                (error) => {
                    alert("Error getting current location.");
                }
            );
            
        } else {
            showError("Geolocation is not supported by your browser.");
        }
    }

    function searchLocation() {
        const location = locationSearchInput.value;
        if (location.trim() !== '') {
            // Use Geocode API to get latitude and longitude for the searched location
            const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;
            fetch(geocodeApiUrl).then(response => response.json())
                .then(data => {
                    if (!data.length) return alert('No coordinates found for ${location}');
                    const { lat, lon} = data[0]; 
                    getSunriseSunsetData(lat, lon);
                    
                }).catch(() => {
                    alert("An error occurred while fetching the coordinates!");
                });
        } else {
            alert("Please enter a location.");
        }
    }
    
    searchBtn.addEventListener('click', searchLocation);

    function getSunriseSunsetData(latitude, longitude) {
        // Use Sunrise Sunset API to get sunrise and sunset data
        const todayDate = new Date();
        const todayApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${todayDate.toISOString().split('T')[0]}&formatted=0`;
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        
        const tomorrowApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${tomorrowDate.toISOString().split('T')[0]}&formatted=0`;
        Promise.all([
            fetch(todayApiUrl).then(response => response.json()),
            fetch(tomorrowApiUrl).then(response => response.json())
        ])
        .then(([todayData, tomorrowData]) => {
            updateDashboard(todayData.results, tomorrowData.results);
            console.log(todayData);
        console.log(tomorrowData);
        })
        
        .catch((error) => {
            alert("Error getting sunrise and sunset data.");
        });
    }

    function updateDashboard(todayData, tomorrowData) {
        // Update the dashboard with sunrise and sunset data
        // Implement code to display data in the dashboard
        const todayContainer = document.getElementById('today-container');
        const tomorrowContainer = document.getElementById('tomorrow-container');

        const todayDate = new Date();
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        if (todayData && tomorrowData) {
        todayContainer.innerHTML = `<div class="container-header">Today <br>
        ${formatDate(todayDate)}
        </div>
        <img src="sunrise.svg" alt="Sunrise Today">
        <p>Sunrise : ${todayData.sunrise}</p>
        <p>Dawn: ${todayData.dawn}</p>
        <p>Day Length: ${todayData.day_length}</p>
        <p>Solar Noon: ${todayData.solar_noon}</p>
        <p>TimeZone of ${locationSearchInput.value}: ${todayData.timezone}</p>
        <img src="sunrise.svg" alt="Sunset Today" width="50%">
                               <p>Sunset : ${todayData.sunset}</p>
                               <p>Dusk: ${todayData.dusk}</p>
                               <p>TimeZone of ${locationSearchInput.value}: ${todayData.timezone}</p>`;
        tomorrowContainer.innerHTML = `<div class="container-header">Tomorrow 
        <br>
        ${formatDate(tomorrowDate)}</div>
        <img src="sunrise.svg" alt="Sunrise Tomorrow">
                               <p>Sunrise : ${tomorrowData.sunrise}</p>
                               <p>Dawn: ${tomorrowData.dawn}</p>
                               <p>Day Length: ${tomorrowData.day_length}</p>
                               <p>Solar Noon: ${tomorrowData.solar_noon}</p>
                               <p>TimeZone of ${locationSearchInput.value}: ${tomorrowData.timezone}</p>
                               <img src="sunrise.svg" alt="Sunset Tomorrow">
                               <p>Sunset : ${tomorrowData.sunset}</p>
                               <p>Dusk: ${tomorrowData.dusk}</p>
                               <p>TimeZone of ${locationSearchInput.value}: ${tomorrowData.timezone}</p>`;
        locationSearchInput.value = '';
        todayContainer.classList.remove('hidden');
            tomorrowContainer.classList.remove('hidden');
        } else {
            todayContainer.classList.add('hidden');
            tomorrowContainer.classList.add('hidden');
        }                 
        dashboard.classList.remove('hidden');
    }

    function formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function showError(message) {
        // Show error message to the user
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.textContent = message;
        dashboard.innerHTML = '';
        dashboard.appendChild(errorDiv);
        dashboard.classList.remove('hidden');
    }
    
    
});
window.addEventListener("scroll", function() {
    var footer = document.getElementById("footer");
    var position = footer.getBoundingClientRect();
    // Display footer when it reaches the bottom of the page
    if (position.top <= window.innerHeight) {
        footer.style.display = "block";
    }
});
