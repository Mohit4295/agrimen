document.addEventListener('DOMContentLoaded', function() {
  fetchKeralaWeather();        // show current live Kerala weather
  initializeWeatherData();     // show 5-day forecast
  initializeMandiPrices();
  initializeSteps();
  initializeStats();
  initializeFeatures();
  initializeRewards();
  initializeTestimonials();
  initializeKnowledge();
  initializeMap();
  initGoogleTranslate();      // initialize Google Translate
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
// ================== WEATHER (KERALA, Free API) ==================
const apiKey = "09d43ea438e62547228202d0b7fa123c";   // 🔑 Put your OpenWeather key here
const lat = 9.9312, lon = 76.2673; // Kochi, Kerala

// Emoji helper
function getWeatherEmoji(condition, temp, wind) {
  condition = condition.toLowerCase();
  if (condition.includes("clear")) return "☀️";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("thunder")) return "⛈️";
  if (condition.includes("drizzle")) return "🌦️";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) return "🌫️";
  if (wind > 8) return "💨";
  if (temp >= 32) return "🔥";
  if (temp <= 15) return "❄️";
  return "🌍";
}

// Current Kerala Weather (today)
function fetchKeralaWeather() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("current-weather");
      if (!div) return;

      const condition = data.weather[0].description;
      const temp = Math.round(data.main.temp);
      const wind = data.wind.speed;
      const emoji = getWeatherEmoji(condition, temp, wind);

      div.innerHTML = `
        <h3>🌴 Kerala Live Weather (${data.name})</h3>
        <p>${emoji} ${temp}°C<br>${condition}, 💨 ${wind} m/s</p>
      `;
    })
    .catch(err => {
      console.error("Current weather error:", err);
      document.getElementById("current-weather").innerHTML = `<p>Unable to fetch Kerala live weather ☁️</p>`;
    });
}
// 5-Day Kerala Forecast (Free OpenWeather API)
function initializeWeatherData() {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("weatherGrid");
      if (!grid) return;

      if (data.cod !== "200") {
        grid.innerHTML = `<p>Error: ${data.message}</p>`;
        return;
      }

      const daily = {};
      data.list.forEach(entry => {
        const d = new Date(entry.dt * 1000);
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

        // if we do NOT yet have a forecast saved for this day, save this entry
        if (!daily[dayName]) {
          daily[dayName] = entry;
        }
      });

      // Build forecast cards (first forecast per day → ensures 5 days)
      grid.innerHTML = Object.keys(daily).slice(0, 5).map(day => {
        const f = daily[day];
        const t = Math.round(f.main.temp);
        const c = f.weather[0].description;
        const w = f.wind.speed;
        const e = getWeatherEmoji(c, t, w);

        return `
          <div class="weather-card">
            <div class="weather-day">${day}</div>
            <div class="weather-icon">${e}</div>
            <div class="weather-temp">${t}°C</div>
            <div class="weather-condition">${c}</div>
          </div>
        `;
      }).join("");
    })
    .catch(err => {
      console.error("Forecast error:", err);
      document.getElementById("weatherGrid").innerHTML = `<p>Unable to fetch 5-day forecast ☁️</p>`;
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
      description:"Know in real time which crops can be grown in Kerala based on weather, soil, season and water availability.",
      link:"crop_monitoring_new.html" 
    //   link:"cropmonitoring.html" 

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
            target.style.boxShadow = "0 0 12px 3px #22c55e"; // highlight briefly
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
        <option value="paddy">Paddy (Rice)</option>
        <option value="banana">Banana</option>
        <option value="coconut">Coconut</option>
        <option value="pepper">Black Pepper</option>
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
  const base={paddy:2500, banana:8000,coconut:7000,pepper:500};
  let y= base[crop]*area;
  if(rain<100) y*=0.8; else if(rain>250) y*=0.9;
  if(fert==="low") y*=0.85; else if(fert==="high") y*=1.15;
  document.getElementById("yieldResult").innerHTML=`🌱 Predicted Yield: <b>${Math.round(y)} kg</b>`;
}

// ============ CROP MONITORING HELP ============
// function showCropSuggestions(){
//   fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
//    .then(r=>r.json())
//    .then(d=>{
//      const temp=d.main.temp;
//      const humidity=d.main.humidity;
//      const rain=d.rain ? (d.rain["1h"]||d.rain["3h"]||0) : 0;
//      const month=new Date().getMonth()+1;
//      let crops=[];
//      if([6,7,8,9].includes(month)||rain>100){crops.push("Paddy","Banana","Turmeric","Ginger","Tapioca");}
//      if([10,11,12,1,2].includes(month)||(temp>=18&&temp<=28)){crops.push("Black Pepper","Cardamom","Onion","Vegetables");}
//      if([3,4,5].includes(month)||temp>30){crops.push("Watermelon","Cucumber","Okra","Maize");}
//      crops.push("Coconut","Banana (all-year)","Tea","Coffee","Rubber");
//      if(humidity<40)crops.push("Millets","Pulses");
//      if(rain>200)crops.push("Taro","Yam");
//      document.getElementById("todayCrops").innerHTML=
//       "<ul class='crops-list'>"+crops.map(c=>`<li>✅ ${c}</li>`).join("")+"</ul>";
//    })
//    .catch(e=>{
//      console.error(e);
//      document.getElementById("todayCrops").innerHTML="⚠️ Unable to fetch crops.";
//    });
// }
// --- Weather + Crop Suggestion (Kerala) ---
function fetchCropMonitoringWeather() {
  const apiKey = "09d43ea438e62547228202d0b7fa123c"; // ✅ your key
  const lat = 9.9312, lon = 76.2673;

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      const temp = Math.round(data.main.temp);
      const weather = data.weather[0].description;
      const rain = data.rain ? (data.rain["1h"] || data.rain["3h"] || 0) : 0;
      const month = new Date().getMonth() + 1;

      // Update live weather card
      document.getElementById("current-weather").innerHTML = `
        <h3>${data.name}: ${weather.toUpperCase()}</h3>
        <p>🌡️ Temp: ${temp}°C <br> 🌧️ Rainfall: ${rain} mm (last hr)</p>
      `;

      // 🌾 Suggest crops based on rules
      let crops = [];
      if ([6,7,8,9].includes(month) || rain > 120) {
        crops = ["Paddy (Rice)", "Banana", "Tapioca", "Turmeric", "Ginger"];
      } else if ([10,11,12,1,2].includes(month) || temp < 28) {
        crops = ["Black Pepper", "Cardamom", "Vegetables", "Banana"];
      } else {
        crops = ["Watermelon", "Muskmelon", "Cucumber", "Short-duration Maize"];
      }

      // Always recommend perennials
      crops.push("Coconut","Rubber","Tea","Coffee");

      // Update crop list
      document.getElementById("todayCrops").innerHTML = 
        "<ul class='crops-list'>" + crops.map(c => `<li>✅ ${c}</li>`).join("") + "</ul>";
    })
    .catch(err => {
      console.error("Crop monitoring error:", err);
      document.getElementById("todayCrops").textContent = "⚠️ Unable to fetch crops today.";
    });
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
            author: "Rajesh Kumar",
            location: "Kochi, Kerala",
            avatar: "🧑‍🌾"
        },
        {
            text: "The gamification aspect makes learning about sustainable farming so engaging. My crop yield increased by 15%!",
            author: "Priya Nair",
            location: "Thrissur, Kerala",
            avatar: "👩‍🌾"
        },
        {
            text: "Real-time weather alerts and mandi prices help me make better decisions. Highly recommend to all farmers!",
            author: "Arun Menon",
            location: "Palakkad, Kerala",
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

// Initialize Real-time Map with Leaflet
let map;
let userLocationMarker;
let farmerMarkers = [];

function initializeMap() {
    // Initialize map centered on Kerala
    map = L.map('map').setView([10.8505, 76.2711], 7);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Add sample farmer locations across Kerala
    const farmerLocations = [
        { lat: 9.9312, lng: 76.2673, name: "Kochi Farmers Hub", farmers: 310 },
        { lat: 8.5241, lng: 76.9366, name: "Thiruvananthapuram Farmers", farmers: 250 },
        { lat: 11.2588, lng: 75.7804, name: "Kozhikode Community", farmers: 180 },
        { lat: 9.2981, lng: 76.3320, name: "Alappuzha Rice Farmers", farmers: 220 },
        { lat: 10.0889, lng: 76.3881, name: "Thrissur Collective", farmers: 260 },
        { lat: 10.5276, lng: 76.2144, name: "Palakkad Farmers", farmers: 300 },
        { lat: 11.8745, lng: 75.3704, name: "Kannur Group", farmers: 200 }
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
            <strong>AgriQuest Kerala Community</strong><br>
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
        .weather-card,
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

// Simulated updates
function simulateDataUpdates() {
    setInterval(() => {
        const weatherCards = document.querySelectorAll('.weather-temp');
        weatherCards.forEach(card => {
            const currentTemp = parseInt(card.textContent);
            const variation = Math.random() > 0.5 ? 1 : -1;
            card.textContent = `${currentTemp + variation}°C`;
        });
        
        console.log('Data updated at:', new Date().toLocaleTimeString());
    }, 30000);
}

document.addEventListener('DOMContentLoaded', function() {
    updateLiveIndicators();
    simulateDataUpdates();
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
// Add this to your script.js file:

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