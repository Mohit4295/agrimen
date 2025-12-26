document.addEventListener('DOMContentLoaded', function() {
  // Initialize district selector first
  const districtSelector = document.getElementById('district-selector');
  if (districtSelector) {
    districtSelector.value = "28.6692,77.4380"; // Default to Lucknow
    
    fetchUPWeather();
    initializeWeatherData();
    
    districtSelector.addEventListener('change', function() {
      fetchUPWeather();
      initializeWeatherData();
    });
  }
  
  // Initialize all other functions
  initializeMandiPrices();
  initializeSteps();
  initializeStats();
  initializeFeatures();
  initializeRewards();
  initializeTestimonials();
  initializeKnowledge();
  initializeMap();
  initGoogleTranslate();
});

// Google Translate Integration
function initGoogleTranslate() {
  // Make sure translation works with dynamically loaded content
  const observer = new MutationObserver(function(mutations) {
    if (document.querySelector('.goog-te-combo') && !window.translationEventAttached) {
      window.translationEventAttached = true;
      document.querySelector('.goog-te-combo').addEventListener('change', function() {
        // Allow time for translation to apply
        setTimeout(function() {
          // Re-initialize dynamic elements to ensure translations are applied
          if (document.getElementById('mandiPrices')) initializeMandiPrices();
          if (document.getElementById('weatherGrid')) initializeWeatherData();
          if (document.getElementById('stepsGrid')) initializeSteps();
          if (document.getElementById('statsGrid')) initializeStats();
          if (document.getElementById('featuresGrid')) initializeFeatures();
          if (document.getElementById('rewardsGrid')) initializeRewards();
          if (document.getElementById('testimonialsGrid')) initializeTestimonials();
          if (document.getElementById('knowledgeGrid')) initializeKnowledge();
        }, 1000);
      });
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Custom language switcher that uses Google Translate in the background
function changeLanguage(langCode) {
    // Get the hidden Google Translate select element
    var googleCombo = document.querySelector('.goog-te-combo');
    if (googleCombo) {
        // Set its value to our selected language
        googleCombo.value = langCode;
        
        // Trigger the change event
        var event = new Event('change', { bubbles: true });
        googleCombo.dispatchEvent(event);
    } else {
        console.error('Google Translate not initialized yet');
    }
}

// Ensure Google Translate is properly initialized but stays hidden
document.addEventListener('DOMContentLoaded', function() {
    // Create an observer to watch when Google adds its elements
    const observer = new MutationObserver(function(mutations) {
        // Remove any visible Google elements that might appear
        document.querySelectorAll('.goog-te-banner-frame, .skiptranslate:not(#google_translate_element)').forEach(function(el) {
            el.style.display = 'none';
        });
        
        // Set document back to top (Google pushes it down)
        document.body.style.top = '0';
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
});

// ================== ENHANCED WEATHER (UTTAR PRADESH DISTRICTS) ==================
const apiKey = "09d43ea438e62547228202d0b7fa123c";

// Enhanced emoji function with better weather identification
function getWeatherEmoji(condition, temp, wind, humidity) {
  condition = condition.toLowerCase();
  
  // Specific weather conditions
  if (condition.includes("thunderstorm") || condition.includes("thunder")) return "⛈️";
  if (condition.includes("drizzle")) return "🌦️";
  if (condition.includes("rain")) {
    if (condition.includes("heavy")) return "🌧️";
    if (condition.includes("light")) return "🌦️";
    return "🌧️";
  }
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("mist")) return "🌫️";
  if (condition.includes("fog")) return "🌫️";
  if (condition.includes("haze")) return "🌫️";
  if (condition.includes("smoke")) return "💨";
  if (condition.includes("dust") || condition.includes("sand")) return "🌪️";
  if (condition.includes("tornado")) return "🌪️";
  
  // Cloud conditions
  if (condition.includes("overcast")) return "☁️";
  if (condition.includes("clouds")) {
    if (condition.includes("few")) return "🌤️";
    if (condition.includes("scattered")) return "⛅";
    if (condition.includes("broken")) return "☁️";
    return "☁️";
  }
  
  // Clear sky
  if (condition.includes("clear")) {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) return "☀️";
    return "🌙";
  }
  
  // Based on temperature and wind
  if (temp >= 35) return "🔥";
  if (temp <= 15) return "❄️";
  if (wind > 10) return "💨";
  if (humidity > 80) return "💧";
  
  return "🌍";
}

// Get district name from coordinates - Uttar Pradesh Districts (More Precise Coordinates)
function getDistrictName(coords) {
  const districts = {
    "27.1767,78.0081": "Agra",
    "27.8974,78.0880": "Aligarh",
    "26.4481,82.5359": "Ambedkar Nagar",
    "26.1542,81.8145": "Amethi",
    "28.9044,78.4673": "Amroha",
    "26.4655,79.5091": "Auraiya",
    "26.7922,82.1998": "Ayodhya",
    "26.0735,83.1857": "Azamgarh",
    "28.9455,77.2183": "Baghpat",
    "27.5745,81.5959": "Bahraich",
    "25.7619,84.1487": "Ballia",
    "27.4306,82.1803": "Balrampur",
    "25.4765,80.3367": "Banda",
    "26.9259,81.1836": "Barabanki",
    "28.3670,79.4304": "Bareilly",
    "26.8016,82.7460": "Basti",
    "25.3953,82.5698": "Bhadohi",
    "29.3724,78.1350": "Bijnor",
    "28.0370,79.1200": "Budaun",
    "28.4070,77.8498": "Bulandshahr",
    "25.2579,83.2679": "Chandauli",
    "25.2018,80.8997": "Chitrakoot",
    "26.5024,83.7791": "Deoria",
    "27.5582,78.6637": "Etah",
    "26.7856,79.0151": "Etawah",
    "27.3906,79.5806": "Farrukhabad",
    "25.9318,80.8135": "Fatehpur",
    "27.1591,78.3957": "Firozabad",
    "28.5355,77.3910": "Gautam Buddha Nagar",
    "28.6692,77.4380": "Ghaziabad",
    "25.5877,83.5777": "Ghazipur",
    "27.1342,81.9619": "Gonda",
    "26.7606,83.3732": "Gorakhpur",
    "25.9570,80.1415": "Hamirpur",
    "28.7309,77.7787": "Hapur",
    "27.3956,80.1315": "Hardoi",
    "27.5963,78.0519": "Hathras",
    "26.1547,79.3509": "Jalaun",
    "25.7464,82.6836": "Jaunpur",
    "25.4484,78.5685": "Jhansi",
    "27.0531,79.9137": "Kannauj",
    "26.4085,79.9806": "Kanpur Dehat",
    "26.4499,80.3319": "Kanpur Nagar",
    "27.8067,78.6462": "Kasganj",
    "25.5324,81.3814": "Kaushambi",
    "26.7412,83.8876": "Kushinagar",
    "27.9471,80.7819": "Lakhimpur Kheri",
    "24.6876,78.4160": "Lalitpur",
    "26.8467,80.9462": "Lucknow",
    "27.1251,83.5610": "Maharajganj",
    "25.2918,79.8720": "Mahoba",
    "27.2360,79.0243": "Mainpuri",
    "27.4924,77.6737": "Mathura",
    "25.9422,83.5610": "Mau",
    "28.9845,77.7064": "Meerut",
    "25.1462,82.5690": "Mirzapur",
    "28.8386,78.7733": "Moradabad",
    "29.4727,77.7085": "Muzaffarnagar",
    "28.6359,79.8040": "Pilibhit",
    "25.8971,81.9400": "Pratapgarh",
    "25.4358,81.8463": "Prayagraj",
    "26.2345,81.2409": "Raebareli",
    "28.7940,79.0260": "Rampur",
    "29.9680,77.5510": "Saharanpur",
    "28.5903,78.5699": "Sambhal",
    "26.7919,83.0366": "Sant Kabir Nagar",
    "27.8826,79.9110": "Shahjahanpur",
    "29.4513,77.3089": "Shamli",
    "27.5073,81.9969": "Shravasti",
    "27.2647,83.0866": "Siddharthnagar",
    "27.5704,80.6829": "Sitapur",
    "24.6900,83.0600": "Sonbhadra",
    "26.2648,82.0727": "Sultanpur",
    "26.5393,80.4878": "Unnao",
    "25.3176,82.9739": "Varanasi"
  };
  return districts[coords] || "Uttar Pradesh";
}

// Format time for last updated
function formatUpdateTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

// // Fetch current weather for selected district - EXACT TEMPERATURE
// function fetchUPWeather() {
//   const selector = document.getElementById("district-selector");
//   if (!selector) return;
  
//   const coords = selector.value.split(',');
//   const lat = parseFloat(coords[0]);
//   const lon = parseFloat(coords[1]);
//   const districtName = getDistrictName(selector.value);

//   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
//     .then(res => res.json())
//     .then(data => {
//       const div = document.getElementById("current-weather");
//       if (!div) return;

//       const condition = data.weather[0].description;
//       // EXACT TEMPERATURE - No rounding, show 1 decimal place
//       const temp = data.main.temp.toFixed(1);
//       const feelsLike = data.main.feels_like.toFixed(1);
//       const tempMin = data.main.temp_min.toFixed(1);
//       const tempMax = data.main.temp_max.toFixed(1);
//       const wind = data.wind.speed.toFixed(1);
//       const humidity = data.main.humidity;
//       const pressure = data.main.pressure;
//       const visibility = data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A';
//       const emoji = getWeatherEmoji(condition, parseFloat(temp), parseFloat(wind), humidity);
//       const lastUpdated = formatUpdateTime(data.dt);
//       const sunrise = formatUpdateTime(data.sys.sunrise);
//       const sunset = formatUpdateTime(data.sys.sunset);

//       div.innerHTML = `
//         <div class="current-location">
//           <span class="current-location-pin">📍</span>
//           ${districtName}
//           <span class="last-updated">Updated: ${lastUpdated}</span>
//         </div>
//         <div class="weather-display">
//           <div class="weather-emoji-large">${emoji}</div>
//           <div class="weather-info">
//             <div class="current-temp">${temp}°C</div>
//             <div class="temp-range">↓${tempMin}°C / ↑${tempMax}°C</div>
//             <div class="current-condition">${condition}</div>
//           </div>
//         </div>
//         <div class="weather-details">
//           <div class="weather-detail-item">
//             <strong>Feels Like</strong>
//             <span>${feelsLike}°C</span>
//           </div>
//           <div class="weather-detail-item">
//             <strong>Wind</strong>
//             <span>${wind} m/s</span>
//           </div>
//           <div class="weather-detail-item">
//             <strong>Humidity</strong>
//             <span>${humidity}%</span>
//           </div>
//           <div class="weather-detail-item">
//             <strong>Pressure</strong>
//             <span>${pressure} hPa</span>
//           </div>
//           <div class="weather-detail-item">
//             <strong>Visibility</strong>
//             <span>${visibility} km</span>
//           </div>
//           <div class="weather-detail-item">
//             <strong>Sunrise</strong>
//             <span>🌅 ${sunrise}</span>
//           </div>
//           <div class="weather-detail-item">
//             <strong>Sunset</strong>
//             <span>🌇 ${sunset}</span>
//           </div>
//         </div>
//         <div class="weather-source">
//           <small>📡 Data: OpenWeatherMap | Coords: ${lat.toFixed(4)}, ${lon.toFixed(4)}</small>
//         </div>
//       `;
//     })
//     .catch(err => {
//       console.error("Current weather error:", err);
//       document.getElementById("current-weather").innerHTML = 
//         `<div class="weather-loader">❌ Unable to fetch weather data</div>`;
//     });
// }

// Fetch current weather for selected district - EXACT TEMPERATURE
function fetchUPWeather() {
  const selector = document.getElementById("district-selector");
  if (!selector) return;
  
  const coords = selector.value.split(',');
  const lat = parseFloat(coords[0]);
  const lon = parseFloat(coords[1]);
  const districtName = getDistrictName(selector.value);

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("current-weather");
      if (!div) return;

      const condition = data.weather[0].description;
      // EXACT TEMPERATURE - No rounding, show 1 decimal place
      const temp = data.main.temp.toFixed(1);
      const feelsLike = data.main.feels_like.toFixed(1);
      const tempMin = data.main.temp_min.toFixed(1);
      const tempMax = data.main.temp_max.toFixed(1);
      const wind = data.wind.speed.toFixed(1);
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const visibility = data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A';
      const emoji = getWeatherEmoji(condition, parseFloat(temp), parseFloat(wind), humidity);
      const lastUpdated = formatUpdateTime(data.dt);
      const sunrise = formatUpdateTime(data.sys.sunrise);
      const sunset = formatUpdateTime(data.sys.sunset);

      div.innerHTML = `
        <div class="current-location">
          <span class="current-location-pin">📍</span>
          ${districtName}
          <span class="last-updated">🕐 ${lastUpdated}</span>
        </div>
        <div class="weather-display">
          <div class="weather-emoji-large">${emoji}</div>
          <div class="weather-info">
            <div class="current-temp">${temp}°C</div>
            <div class="temp-range">↓${tempMin}° / ↑${tempMax}°</div>
            <div class="current-condition">${condition}</div>
          </div>
        </div>
        <div class="weather-details">
          <div class="weather-detail-item">
            <strong>Feels Like</strong>
            <span>🌡️ ${feelsLike}°</span>
          </div>
          <div class="weather-detail-item">
            <strong>Wind</strong>
            <span>💨 ${wind} m/s</span>
          </div>
          <div class="weather-detail-item">
            <strong>Humidity</strong>
            <span>💧 ${humidity}%</span>
          </div>
          <div class="weather-detail-item">
            <strong>Pressure</strong>
            <span>🔵 ${pressure}</span>
          </div>
          <div class="weather-detail-item">
            <strong>Visibility</strong>
            <span>👁️ ${visibility} km</span>
          </div>
          <div class="weather-detail-item">
            <strong>Sunrise</strong>
            <span>🌅 ${sunrise}</span>
          </div>
          <div class="weather-detail-item">
            <strong>Sunset</strong>
            <span>🌇 ${sunset}</span>
          </div>
        </div>
        <div class="weather-source">
          <small>📡 OpenWeatherMap | ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E</small>
        </div>
      `;
    })
    .catch(err => {
      console.error("Current weather error:", err);
      document.getElementById("current-weather").innerHTML = 
        `<div class="weather-loader">❌ Unable to fetch weather data</div>`;
    });
}

// 5-Day Forecast for selected district - EXACT TEMPERATURE
function initializeWeatherData() {
  const selector = document.getElementById("district-selector");
  if (!selector) return;
  
  const coords = selector.value.split(',');
  const lat = parseFloat(coords[0]);
  const lon = parseFloat(coords[1]);

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("weatherGrid");
      if (!grid) return;

      if (data.cod !== "200") {
        grid.innerHTML = `<div class="weather-loader">❌ ${data.message}</div>`;
        return;
      }

      const daily = {};
      data.list.forEach(entry => {
        const d = new Date(entry.dt * 1000);
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        const dateStr = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });

        if (!daily[dayName]) {
          daily[dayName] = {
            ...entry,
            dateStr: dateStr,
            temps: [entry.main.temp],
            conditions: [entry.weather[0].description]
          };
        } else {
          daily[dayName].temps.push(entry.main.temp);
          daily[dayName].conditions.push(entry.weather[0].description);
        }
      });

      grid.innerHTML = Object.keys(daily).slice(0, 5).map(day => {
        const f = daily[day];
        const temps = f.temps;
        const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
        const minTemp = Math.min(...temps).toFixed(1);
        const maxTemp = Math.max(...temps).toFixed(1);
        const c = f.weather[0].description;
        const w = f.wind.speed.toFixed(1);
        const h = f.main.humidity;
        const e = getWeatherEmoji(c, parseFloat(avgTemp), parseFloat(w), h);

        return `
          <div class="forecast-card">
            <div class="forecast-day">${day}</div>
            <div class="forecast-date">${f.dateStr}</div>
            <div class="forecast-icon">${e}</div>
            <div class="forecast-temp">${avgTemp}°C</div>
            <div class="forecast-temp-range">↓${minTemp}° / ↑${maxTemp}°</div>
            <div class="forecast-condition">${c}</div>
            <div class="forecast-humidity">💧 ${h}%</div>
          </div>
        `;
      }).join("");
    })
    .catch(err => {
      console.error("Forecast error:", err);
      document.getElementById("weatherGrid").innerHTML = 
        `<div class="weather-loader">❌ Unable to fetch forecast</div>`;
    });
}

// Mandi Prices Data
function initializeMandiPrices() {
    const crops = [
        { 
            name: "Wheat", 
            variety: "Dara", 
            minPrice: "₹2,250", 
            maxPrice: "₹2,300", 
            trend: "up",
            icon: "🌾"
        },
        { 
            name: "Sugarcane", 
            variety: "General", 
            minPrice: "₹340", 
            maxPrice: "₹350", 
            trend: "up",
            icon: "🎋"
        },
        { 
            name: "Tomato", 
            variety: "Hybrid", 
            minPrice: "₹1,500", 
            maxPrice: "₹1,600", 
            trend: "up",
            icon: "🍅"
        },
        { 
            name: "Onion", 
            variety: "Nashik Red", 
            minPrice: "₹800", 
            maxPrice: "₹900", 
            trend: "up",
            icon: "🧅"
        },
    ];

    const mandiPrices = document.getElementById('mandiPrices');
    mandiPrices.innerHTML = crops.map(crop => `
        <div class="table-row">
            <div class="crop-info">
                <span class="crop-icon">${crop.icon}</span>
                <span class="crop-name">${crop.name}</span>
            </div>
            <div class="crop-variety">${crop.variety}</div>
            <div class="price">${crop.minPrice}</div>
            <div class="price">${crop.maxPrice}</div>
            <div>
                <span class="trend-icon">↗</span>
            </div>
        </div>
    `).join('');
}

// ==================== FARMER QUIZ GAME ====================

const quizData = [
  { lang: "en", question: "Which method saves the most water in irrigation?", options: ["Flood irrigation", "Drip irrigation", "Sprinkler irrigation", "Canal irrigation"], answer: "Drip irrigation" },
  { lang: "en", question: "Which crop is known as the 'Golden Fibre'?", options: ["Cotton", "Jute", "Wheat", "Sugarcane"], answer: "Jute" },

  { lang: "hi", question: "किस सिंचाई पद्धति से सबसे अधिक पानी बचता है?", options: ["बाढ़ सिंचाई", "ड्रिप सिंचाई", "स्प्रिंकलर सिंचाई", "नहर सिंचाई"], answer: "ड्रिप सिंचाई" },
  { lang: "hi", question: "कौनसी फसल 'सुनहरा रेशा' कहलाती है?", options: ["कपास", "जूट", "गेहूँ", "गन्ना"], answer: "जूट" },

  { lang: "ml", question: "ഏത് ജലസേചന രീതിയിലാണ് കൂടുതൽ വെള്ളം ലാഭിക്കപ്പെടുന്നത്?", options: ["വെള്ളപ്പൊക്ക ജലസേചനം", "ഡ്രിപ്പ് ഇറിഗേഷൻ", "സ്പ്രിങ്ക്ലർ ഇറിഗേഷൻ", "കാലവായ് ഇറിഗേഷൻ"], answer: "ഡ്രിപ്പ് ഇറിഗേഷൻ" },
  { lang: "ml", question: "ഏത് വിളയാണ് 'സ്വർണ്ണ നാരായി' അറിയപ്പെടുന്നത്?", options: ["പരുത്തി", "ജ്യൂട്ട്", "ഗോതമ്പ്", "കരിമ്പ്"], answer: "ജ്യൂട്ട്" }
];

let currentQuestion = {};

function initQuiz() {
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const resultEl  = document.getElementById("quiz-result");
  const nextBtn   = document.getElementById("next-btn");
  const langSelect= document.getElementById("language"); // dropdown, optional

  if (!questionEl || !optionsEl || !nextBtn) {
    console.warn("Quiz elements not found!");
    return;
  }

  function loadQuestion() {
    const selectedLang = langSelect ? langSelect.value : "en";
    const filtered = quizData.filter(q => q.lang === selectedLang);
    currentQuestion = filtered[Math.floor(Math.random() * filtered.length)];

    questionEl.textContent = currentQuestion.question;
    optionsEl.innerHTML = "";
    resultEl.textContent = "";

    currentQuestion.options.forEach(option => {
      const btn = document.createElement("button");
      btn.classList.add("quiz-option");
      btn.textContent = option;
      btn.onclick = () => checkAnswer(option, btn);
      optionsEl.appendChild(btn);
    });
  }

  function checkAnswer(option, btn) {
    [...optionsEl.children].forEach(b => b.disabled = true);
    if (option === currentQuestion.answer) {
      btn.classList.add("correct");
      resultEl.textContent = "✅ Correct!";
      resultEl.style.color = "green";
    } else {
      btn.classList.add("wrong");
      resultEl.textContent = "❌ Wrong! Answer: " + currentQuestion.answer;
      resultEl.style.color = "red";
    }
  }

  // Event bindings
  nextBtn.addEventListener("click", loadQuestion);
  if (langSelect) langSelect.addEventListener("change", loadQuestion);

  // First load
  loadQuestion();
}

// Ensure DOM is ready before accessing elements
document.addEventListener("DOMContentLoaded", initQuiz);

// Steps Data
function initializeSteps() {
    const steps = [
        {
            number: "1",
            title: "Sign Up",
            description: "Join with your mobile number.",
            bgColor: "green-100"
        },
        {
            number: "2", 
            title: "Get Quests",
            description: "Receive tasks for your crop.",
            bgColor: "green-200"
        },
        {
            number: "3",
            title: "Track Progress", 
            description: "See your score and badges grow.",
            bgColor: "green-300"
        },
        {
            number: "4",
            title: "Earn Rewards",
            description: "Get real-world benefits.",
            bgColor: "green-400"
        }
    ];

    const stepsGrid = document.getElementById('stepsGrid');
    stepsGrid.innerHTML = steps.map(step => `
        <div class="step-item">
            <div class="step-number ${step.bgColor}">${step.number}</div>
            <h3 class="step-title">${step.title}</h3>
            <p class="step-description">${step.description}</p>
        </div>
    `).join('');
}

// Stats Data
function initializeStats() {
    const stats = [
        {
            number: "5000+",
            label: "Farmers Joined",
            icon: "💡",
            bgColor: "blue"
        },
        {
            number: "10000+",
            label: "Quests Completed", 
            icon: "🎯",
            bgColor: "purple"
        },
        {
            number: "15%",
            label: "Increase in Water Savings",
            icon: "💧", 
            bgColor: "cyan"
        }
    ];

    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = stats.map((stat, index) => `
        <div class="stat-card">
            <div class="stat-icon ${stat.bgColor}">
                <span>${stat.icon}</span>
            </div>
            <div class="stat-number">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
            ${index === 1 ? '<div class="stat-accent"></div>' : ''}
        </div>
    `).join('');
}

function initializeFeatures() {
  const features = [
    { 
      icon:"🌱", 
      title:"Crop Monitoring",
      description:"Know in real time which crops can be grown in Uttar Pradesh based on weather, soil, season and water availability.",
      link:"crop_monitoring_new.html" 
    },
    { 
      icon:"💧", 
      title:"Water Management", 
      description:"Optimize irrigation schedules and reduce water waste with smart recommendations." 
    },
    { 
      icon:"📊", 
      title:"Yield Prediction", 
      description:"Get accurate harvest forecasts based on weather patterns and crop data.", 
      special:"yield"
    },
    { 
      icon:"🌡️", 
      title:"Weather Alerts", 
      description:"Receive timely weather affecting your crops .", 
      link:"#weather-section" 
    },
    { 
      icon:"📑", 
      title:"Government Tax", 
      description:"Government high taxes on farmers try to overcome." 
    },
    { 
      icon:"🏆", 
      title:"Achievement System", 
      description:"Earn points, badges, and rewards for sustainable farming practices." 
    }
  ];

  const featuresGrid = document.getElementById('featuresGrid');
  if (!featuresGrid) return;
  featuresGrid.innerHTML = "";

  // Loop ONCE ✅
  features.forEach(feature => {
    const card = document.createElement("div");
    card.className = "feature-card";
    card.innerHTML = `
      <div class="feature-card-icon">${feature.icon}</div>
      <h3 class="feature-card-title">${feature.title}</h3>
      <p class="feature-card-description">${feature.description}</p>
    `;

    // ✅ Handle links
    if (feature.link) {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        if (feature.link.startsWith("#")) {
          const target = document.querySelector(feature.link);
          if (target) {
            target.scrollIntoView({ behavior:"smooth", block:"start" });
            target.style.boxShadow = "0 0 12px 3px #3b82f6"; // highlight briefly
            setTimeout(() => target.style.boxShadow="none", 2000);
          }
        } else {
          window.location.href = feature.link;
        }
      });
    }

    // ✅ Handle Yield Prediction Modal
    if (feature.special === "yield") {
      card.style.cursor = "pointer";
      card.addEventListener("click", openYieldModal);
    }

    featuresGrid.appendChild(card);
  });

  // yield modal
  if(!document.getElementById("yieldModal")){
    const modal=document.createElement("div");
    modal.id="yieldModal"; modal.className="yield-modal"; modal.style.display="none";
    modal.innerHTML=`<div class="yield-modal-content">
      <span id="yieldClose" class="yield-close">&times;</span>
      <h2>🌾 Yield Prediction Tool</h2>
      <label>Select Crop:</label>
      <select id="cropType">
        <option value="wheat">Wheat</option>
        <option value="rice">Rice</option>
        <option value="sugarcane">Sugarcane</option>
        <option value="potato">Potato</option>
      </select>
      <label>Area (acres):</label>
      <input type="number" id="area" placeholder="e.g. 2">
      <label>Rainfall (mm):</label>
      <input type="number" id="rainfall" placeholder="e.g. 180">
      <label>Fertilizer:</label>
      <select id="fertilizer">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button id="predictBtn" class="cta-btn">🔮 Predict Yield</button>
      <div id="yieldResult" class="yield-result"></div>
    </div>`;
    document.body.appendChild(modal);
    document.getElementById("yieldClose").addEventListener("click", closeYieldModal);
    document.getElementById("predictBtn").addEventListener("click", predictYield);
  }
}
function openYieldModal(){document.getElementById("yieldModal").style.display="flex";}
function closeYieldModal(){document.getElementById("yieldModal").style.display="none";}
function predictYield(){
  const crop=document.getElementById("cropType").value;
  const area=parseFloat(document.getElementById("area").value);
  const rain=parseFloat(document.getElementById("rainfall").value);
  const fert=document.getElementById("fertilizer").value;
  if(!area||!rain){document.getElementById("yieldResult").innerHTML="⚠️ Enter valid area+rainfall"; return;}
  const base={wheat:3000, rice:2800, sugarcane:70000, potato:25000};
  let y= base[crop]*area;
  if(rain<100) y*=0.8; else if(rain>250) y*=0.9;
  if(fert==="low") y*=0.85; else if(fert==="high") y*=1.15;
  document.getElementById("yieldResult").innerHTML=`🌱 Predicted Yield: <b>${Math.round(y)} kg</b>`;
}

// Rewards Data
function initializeRewards() {
    const rewards = [
        {
            icon: "🌱",
            title: "Seeds & Fertilizer",
            description: "High-quality agricultural supplies",
            points: "500 Points"
        },
        {
            icon: "🚜",
            title: "Equipment Rental",
            description: "Discounted farm equipment access",
            points: "1000 Points"
        },
        {
            icon: "📚",
            title: "Training Programs",
            description: "Free agricultural workshops",
            points: "750 Points"
        },
        {
            icon: "💰",
            title: "Cash Rewards",
            description: "Direct monetary benefits",
            points: "2000 Points"
        }
    ];

    const rewardsGrid = document.getElementById('rewardsGrid');
    rewardsGrid.innerHTML = rewards.map(reward => `
        <div class="reward-card">
            <div class="reward-icon">${reward.icon}</div>
            <h3 class="reward-title">${reward.title}</h3>
            <p class="reward-description">${reward.description}</p>
            <div class="reward-points">${reward.points}</div>
        </div>
    `).join('');
}

// Testimonials Data
function initializeTestimonials() {
    const testimonials = [
        {
            text: "AgriQuest transformed my farming practices! The water management tips alone saved me 20% on irrigation costs.",
            author: "Ramesh Yadav",
            location: "Lucknow, Uttar Pradesh",
            avatar: "🧑‍🌾"
        },
        {
            text: "The gamification aspect makes learning about sustainable farming so engaging. My crop yield increased by 15%!",
            author: "Sunita Devi",
            location: "Varanasi, Uttar Pradesh",
            avatar: "👩‍🌾"
        },
        {
            text: "Real-time weather alerts and mandi prices help me make better decisions. Highly recommend to all farmers!",
            author: "Suresh Kumar",
            location: "Kanpur, Uttar Pradesh",
            avatar: "🧑‍🌾"
        }
    ];

    const testimonialsGrid = document.getElementById('testimonialsGrid');
    testimonialsGrid.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <p class="testimonial-text">"${testimonial.text}"</p>
            <div class="testimonial-author">
                <div class="author-avatar">${testimonial.avatar}</div>
                <div class="author-info">
                    <h4>${testimonial.author}</h4>
                    <p class="author-location">${testimonial.location}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Knowledge Hub Data
function initializeKnowledge() {
    const articles = [
        {
            category: "Soil Health",
            title: "Understanding Soil pH for Better Crops",
            description: "Learn how soil acidity affects crop growth and how to maintain optimal pH levels.",
            readTime: "5 min read",
            icon: "🌱"
        },
        {
            category: "Water Management",
            title: "Drip Irrigation: Complete Guide",
            description: "Master water-efficient irrigation techniques to save water and increase yield.",
            readTime: "8 min read",
            icon: "💧"
        },
        {
            category: "Pest Control",
            title: "Organic Pest Management",
            description: "Natural methods to protect your crops without harmful chemicals.",
            readTime: "6 min read",
            icon: "🐛"
        },
        {
            category: "Crop Rotation",
            title: "Sustainable Farming Practices",
            description: "Implement crop rotation for soil health and increased productivity.",
            readTime: "7 min read",
            icon: "🔄"
        }
    ];

    const knowledgeGrid = document.getElementById('knowledgeGrid');
    knowledgeGrid.innerHTML = articles.map(article => `
        <div class="knowledge-card">
            <div class="knowledge-image">${article.icon}</div>
            <div class="knowledge-content">
                <div class="knowledge-category">${article.category}</div>
                <h3 class="knowledge-title">${article.title}</h3>
                <p class="knowledge-description">${article.description}</p>
                <div class="knowledge-meta">${article.readTime}</div>
            </div>
        </div>
    `).join('');
}

// Initialize Real-time Map with Leaflet - Uttar Pradesh
let map;
let userLocationMarker;
let farmerMarkers = [];

function initializeMap() {
    // Initialize map centered on Uttar Pradesh
    map = L.map('map').setView([26.8467, 80.9462], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Add sample farmer locations across Uttar Pradesh
    const farmerLocations = [
        { lat: 26.8467, lng: 80.9462, name: "Lucknow Farmers Hub", farmers: 450 },
        { lat: 25.3176, lng: 82.9739, name: "Varanasi Farmers", farmers: 380 },
        { lat: 26.4499, lng: 80.3319, name: "Kanpur Community", farmers: 320 },
        { lat: 27.1767, lng: 78.0081, name: "Agra Farmers Group", farmers: 280 },
        { lat: 25.4358, lng: 81.8463, name: "Prayagraj Collective", farmers: 350 },
        { lat: 28.9845, lng: 77.7064, name: "Meerut Farmers", farmers: 290 },
        { lat: 26.7606, lng: 83.3732, name: "Gorakhpur Group", farmers: 260 },
        { lat: 28.6692, lng: 77.4380, name: "Ghaziabad Farmers", farmers: 310 },
        { lat: 28.3670, lng: 79.4304, name: "Bareilly Community", farmers: 240 },
        { lat: 25.7464, lng: 82.6836, name: "Jaunpur Farmers", farmers: 220 }
    ];

    farmerLocations.forEach(location => {
        const marker = L.circleMarker([location.lat, location.lng], {
            radius: Math.sqrt(location.farmers) / 2,
            fillColor: '#22c55e',
            color: '#16a34a',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.6
        }).addTo(map);

        marker.bindPopup(`
            <strong>${location.name}</strong><br>
            <span style="color: #16a34a;">🧑‍🌾 ${location.farmers} farmers</span><br>
            <small>Active AgriQuest users</small>
        `);

        farmerMarkers.push(marker);
    });

    // Locate button functionality
    const locateBtn = document.getElementById('locateBtn');
    const locationStatus = document.getElementById('locationStatus');
    
    locateBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            locationStatus.textContent = 'Finding your location...';
            locateBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    if (userLocationMarker) {
                        map.removeLayer(userLocationMarker);
                    }
                    
                    userLocationMarker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'user-location-marker',
                            html: '📍',
                            iconSize: [25, 25],
                            iconAnchor: [12, 25]
                        })
                    }).addTo(map);
                    
                    userLocationMarker.bindPopup(`
                        <strong>Your Location</strong><br>
                        <small>Lat: ${lat.toFixed(6)}<br>
                        Lng: ${lng.toFixed(6)}</small>
                    `);
                    
                    map.setView([lat, lng], 13);
                    
                    locationStatus.textContent = 'Location found!';
                    locateBtn.disabled = false;
                    
                    let nearestDistance = Infinity;
                    let nearestFarmers = 0;
                    
                    farmerLocations.forEach(location => {
                        const distance = calculateDistance(lat, lng, location.lat, location.lng);
                        if (distance < nearestDistance) {
                            nearestDistance = distance;
                            nearestFarmers = location.farmers;
                        }
                    });
                    
                    setTimeout(() => {
                        locationStatus.textContent = `${nearestFarmers} farmers within ${nearestDistance.toFixed(1)}km`;
                    }, 2000);
                },
                function(error) {
                    let errorMessage = 'Unable to get location. ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Permission denied.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Position unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Request timeout.';
                            break;
                        default:
                            errorMessage += 'Unknown error.';
                            break;
                    }
                    locationStatus.textContent = errorMessage;
                    locateBtn.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            locationStatus.textContent = 'Geolocation is not supported by this browser.';
        }
    });

    // Map legend
    const legend = L.control({position: 'bottomleft'});
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-legend');
        div.style.background = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        div.style.fontSize = '12px';
        div.innerHTML = `
            <strong>AgriQuest UP Community</strong><br>
            <span style="color: #16a34a;">● Farmer Groups</span><br>
            <span>📍 Your Location</span><br>
            <small>Circle size = Number of farmers</small>
        `;
        return div;
    };
    legend.addTo(map);

    // Animate markers
    setTimeout(() => {
        farmerMarkers.forEach((marker, index) => {
            setTimeout(() => {
                marker.openPopup();
                setTimeout(() => marker.closePopup(), 1500);
            }, index * 500);
        });
    }, 1000);
}

// Distance helper
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Smooth scrolling
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Button animation
document.addEventListener('click', function(e) {
    if (e.target.matches('button')) {
        const button = e.target;
        const originalText = button.textContent;
        if (button.classList.contains('join-btn') || 
            button.classList.contains('cta-btn') || 
            button.classList.contains('impact-btn')) {
            
            button.textContent = 'Loading...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        }
    }
});

// Intersection observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll(`
        .forecast-card,
        .feature-card,
        .reward-card,
        .testimonial-card,
        .knowledge-card,
        .stat-card,
        .step-item
    `);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Live indicators
function updateLiveIndicators() {
    const liveDots = document.querySelectorAll('.live-dot');
    liveDots.forEach(dot => {
        dot.style.animation = 'pulse 2s infinite';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateLiveIndicators();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (map && map.closePopup) {
            map.closePopup();
        }
    }
});

// Performance monitor
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    
    const locationStatus = document.getElementById('locationStatus');
    if (locationStatus && e.error.message.includes('geolocation')) {
        locationStatus.textContent = 'Location services unavailable';
    }
});

console.log('AgriQuest application initialized successfully! 🌱');

// More reliable language switching implementation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize a flag to track when Google Translate is ready
    window.googleTranslateReady = false;
    
    // Function to change language - will be called when dropdown changes
    function changeLanguage(langCode) {
        if (!window.googleTranslateReady) {
            console.log('Google Translate not ready yet, trying again in 500ms...');
            setTimeout(function() { changeLanguage(langCode); }, 500);
            return;
        }
        
        // Method 1: Try to use Google's function directly
        try {
            var googleFrame = document.getElementsByClassName('goog-te-menu-frame')[0];
            if (googleFrame) {
                var doc = googleFrame.contentDocument || googleFrame.contentWindow.document;
                var elements = doc.getElementsByClassName('goog-te-menu2-item');
                
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].innerHTML.includes(langCode)) {
                        elements[i].click();
                        return;
                    }
                }
            }
        } catch(e) {
            console.log('Method 1 failed:', e);
        }
        
        // Method 2: Try using the select element
        try {
            var select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = langCode;
                var event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
                return;
            }
        } catch(e) {
            console.log('Method 2 failed:', e);
        }
        
        // Method 3: Last resort, use direct URL manipulation
        try {
            if (langCode === 'en') {
                // For English, reload the page without translation
                var url = window.location.href.split('#');
                window.location.href = url[0] + '#googtrans(en|en)';
                location.reload();
            } else {
                // For other languages
                var url = window.location.href.split('#');
                window.location.href = url[0] + '#googtrans(en|' + langCode + ')';
                location.reload();
            }
        } catch(e) {
            console.log('Method 3 failed:', e);
        }
    }
    
    // Connect our custom dropdown to the language change function
    var languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    // Modified Google Translate initialization function
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi,ml',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
        
        // Mark Google Translate as ready
        window.googleTranslateReady = true;
        console.log('Google Translate initialized successfully');
        
        // Hide Google elements
        var styles = document.createElement('style');
        styles.textContent = `
            .goog-te-banner-frame, 
            .skiptranslate:not(#google_translate_element),
            .goog-te-gadget-icon,
            .goog-te-menu-value span,
            .goog-tooltip,
            .goog-tooltip:hover,
            .goog-text-highlight,
            .goog-te-gadget span {
                display: none !important;
            }
            body {
                top: 0 !important;
            }
        `;
        document.head.appendChild(styles);
        
        // Set the dropdown to match the current page language
        setTimeout(function() {
            try {
                var currentLang = document.documentElement.lang || 'en';
                if (languageSelector && currentLang) {
                    languageSelector.value = currentLang.substring(0, 2);
                }
            } catch(e) {
                console.log('Could not set initial language:', e);
            }
        }, 1000);
    };
    
    // Load Google Translate script
    var googleScript = document.createElement('script');
    googleScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    googleScript.async = true;
    document.head.appendChild(googleScript);
    
    // Set a timeout to check if Google Translate loaded
    setTimeout(function() {
        if (!window.googleTranslateReady) {
            console.log('Google Translate failed to load within timeout');
        }
    }, 5000);
});

// Store selected language in localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Language dropdown event listener
    var languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        // Set initial value from localStorage if exists
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            languageSelector.value = savedLanguage;
            // Apply the saved language
            setTimeout(function() {
                changeLanguage(savedLanguage);
            }, 500);
        }
        
        // When language changes, save to localStorage
        languageSelector.addEventListener('change', function() {
            const selectedLang = this.value;
            localStorage.setItem('selectedLanguage', selectedLang);
            changeLanguage(selectedLang);
        });
    }
    
    // Prevent translation of language dropdowns
    var style = document.createElement('style');
    style.textContent = `
        .notranslate {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
    `;
    document.head.appendChild(style);
});