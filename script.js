// Getting elements into this js file
const curTime = document.getElementById('time');
const curDate = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const searchBtn = document.getElementById('btn')
const cityRef = document.getElementById('getcity')

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const today = time.getDay();
    const hour = time.getHours();
    const hr12frmt = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    curTime.innerHTML = (hr12frmt < 10 ? '0' + hr12frmt : hr12frmt) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    curDate.innerHTML = days[today] + ', ' + date + ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData() {

    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=19d602645a60bfd89517ff52a0c33bb1`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })

        fetch(`http://api.weatherapi.com/v1/forecast.json?key=d82c0a8a3e9b4e6fbd1203535221410&q=${latitude},${longitude}&days=6&aqi=no&alerts=no`).then(res => res.json()).then(data1 => {
            console.log(data1)
            showWeatherData2(data1);
        })
    })

    window.addEventListener("load", getWeatherData2())

}

function getWeatherData2(){
    let cityvalue = cityRef.value ;
    console.log(cityvalue)

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityvalue}&exclude=hourly,minutely&units=metric&appid=19d602645a60bfd89517ff52a0c33bb1`).then(res => res.json()).then(data2 => {
            console.log(data2.main, wind, sys)
            showWeatherData(data2);
        })
        .catch((data2) => {
            let name = data2.name;

            timezone.innerHTML = "Place not found!"
            countryEl.innerHTML = ""
            currentWeatherItemsEl.innerHTML = ""
            currentTempEl.innerHTML = `
                    <div class="other">
                        <div>${name}</div>
                        <div class="day">Today</div>
                        
                    </div>
            `
        })
    
}

function showWeatherData(data) {
    let { humidity, pressure, temp_max, temp_min, temp } = data.main;
    let { sunrise, sunset } = data.sys;
    let { speed } = data.wind;

    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${speed}</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>    
    `;

    currentTempEl.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">Today</div>
                <div class="temp">Temperature&nbsp;&nbsp;&nbsp;${temp}</div>
                <div class="temp">Max/Min&nbsp;&nbsp;&nbsp;${temp_max}/${temp_min}</div>
            </div>
        `

}

function showWeatherData2(data1) {

    let { lat, lon } = data1.location;

    timezone.innerHTML = data1.location.tz_id;
    countryEl.innerHTML = lat + 'N ' + lon + 'E'
    

    let otherDayForcast = ''

    var dt = new Date();
    var dt1 = dt.getDay();

    data1.forecast.forecastday.forEach((d = 0, idx = 0) => {

        dayOfWeek = days[dt1]

        if (idx + 1 == 1) {
            weatherForecastEl.innerHTML = `
            <div class="weather-forecast-item">
                <img src=${d.day.condition.icon} alt="weather icon" class="w-icon">
                <div class="day">Tomorrow</div>                
                <div class="temp">Feels Like</div>
                <div class="temp">${d.day.avgtemp_c}°C</div>
            </div>
            `
            dt1 += 1;

        } 
        else if(dt1 == 6){
            dt1 = 0;
            dayOfWeek = days[dt1]
            otherDayForcast += `
            <div class="weather-forecast-item">
                <img src=${d.day.condition.icon} alt="weather icon" class="w-icon">
                <div class="day">${dayOfWeek}</div>                
                <div class="temp">Feels Like</div>
                <div class="temp">${d.day.avgtemp_c}°C</div>
            </div>
            
            `
        }
        else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <img src=${d.day.condition.icon} alt="weather icon" class="w-icon">
                <div class="day">${dayOfWeek}</div>                
                <div class="temp">Feels Like</div>
                <div class="temp">${d.day.avgtemp_c}°C</div>
            </div>
            
            `
            dt1 += 1;
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;

}
