const apiKey = '00ff90d1d6009aca348e568fc5085e2c';
const weatherBox = document.querySelector('.weather-box');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeather(city);
    }
});
const locationButton = document.getElementById('location-button');

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        
        if (data.cod === '404') {
            alert('City not found');
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data');
    }
}

async function getWeatherByLocation(position) {
    const { latitude, longitude } = position.coords;
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data');
    }
}

function displayWeather(data) {
    const {
        name,
        main: { temp, humidity },
        weather: [{ description }],
        wind: { speed }
    } = data;

    document.querySelector('.city').textContent = name;
    document.querySelector('.temperature').textContent = `${Math.round(temp)}°C`;
    document.querySelector('.description').textContent = description;
    document.querySelector('.humidity span').textContent = `${humidity}%`;
    document.querySelector('.wind span').textContent = `${speed} km/h`;
    
    weatherBox.classList.remove('hide');
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByLocation, (error) => {
            console.error('Error getting location:', error);
            alert('Unable to get your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});