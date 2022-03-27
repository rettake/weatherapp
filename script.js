/* variables of DOM */

const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

/* Arrays of days and months */

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesdey', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* API WEATHER */

const API_KEY = '9d6a8ef7481a427b768e38a742180721';

/* Live Date */

setInterval(() => {
   const time = new Date();
   const month = time.getMonth();
   const date = time.getDate();
   const day = time.getDay();
   const hour = time.getHours();
   const hourIn12HrFormat = hour >= 13 ? hour % 12: hour 
   const minutes = time.getMinutes();
   const ampm = hour > 11 ? "PM" : "AM";

   timeEl.innerHTML = (hourIn12HrFormat < 10 ? "0"+hourIn12HrFormat: hourIn12HrFormat) + ":" + (minutes < 10 ? "0"+minutes: minutes) + " " + `<span id="am-pm">${ampm}</span>`;

   dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

/* Weather upload */

function getWeatherData() {
   navigator.geolocation.getCurrentPosition((success) => {
      let { latitude, longitude } = success.coords;

      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
         .then(res => res.json())
         .then(data => {
            console.log(data)
            showWeatherData(data);
         })
   })
}

function showWeatherData(data) {
   let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

   timezone.innerHTML = data.timezone;
   countryEl.innerHTML = data.lat + 'N ' + data.lon+"E";

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
      <div>Wind</div>
      <div>${wind_speed}</div>
   </div>
   <div class="weather-item">
      <div>Sunrise</div>
      <div>${window.moment(sunrise * 1000).format("HH:MM a")}</div>
   </div>
   <div class="weather-item">
      <div>Sunset</div>
      <div>${window.moment(sunset * 1000).format("HH:MM a")}</div>
   </div>
   
   `;

   let otherDayForecast = ``
   data.daily.forEach((day, idx) => {
      if (idx == 0) {
         currentTempEl.innerHTML = `
         <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
         <div class="other">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <div class="temp">Night :  ${day.temp.night}&#176; C</div>
            <div class="temp">Day :  ${day.temp.day}&#176; C</div>
         </div>
         `
      } else {
         otherDayForecast += `
         <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">               
            <div class="temp">Night :  ${day.temp.night}&#176; C</div>
            <div class="temp">Day :  ${day.temp.day}&#176; C</div>
         </div>
         `
      }
   })

   weatherForecastEl.innerHTML = otherDayForecast;
}


getWeatherData();