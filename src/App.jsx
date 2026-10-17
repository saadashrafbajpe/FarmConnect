
import { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";

const CROPS = [
  { name: "Arecanut", category: "Plantation", unit: "kg", base: 480, icon: "🌰" },
  { name: "Coconut", category: "Plantation", unit: "piece", base: 24, icon: "🥥" },
  { name: "Rice", category: "Cereal", unit: "kg", base: 38, icon: "🌾" },
  { name: "Paddy", category: "Cereal", unit: "kg", base: 28, icon: "🌾" },
  { name: "Cashew", category: "Plantation", unit: "kg", base: 150, icon: "🥜" },
  { name: "Black Pepper", category: "Spice", unit: "kg", base: 650, icon: "🌶️" },
  { name: "Cardamom", category: "Spice", unit: "kg", base: 1800, icon: "🌿" },
  { name: "Banana", category: "Fruit", unit: "kg", base: 35, icon: "🍌" },
  { name: "Mango", category: "Fruit", unit: "kg", base: 55, icon: "🥭" },
  { name: "Jackfruit", category: "Fruit", unit: "kg", base: 25, icon: "🍈" },
  { name: "Pineapple", category: "Fruit", unit: "piece", base: 45, icon: "🍍" },
  { name: "Papaya", category: "Fruit", unit: "kg", base: 30, icon: "🍈" },
  { name: "Ginger", category: "Vegetable", unit: "kg", base: 70, icon: "🫚" },
  { name: "Turmeric", category: "Spice", unit: "kg", base: 100, icon: "🌿" },
  { name: "Tomato", category: "Vegetable", unit: "kg", base: 30, icon: "🍅" },
  { name: "Onion", category: "Vegetable", unit: "kg", base: 32, icon: "🧅" },
  { name: "Potato", category: "Vegetable", unit: "kg", base: 28, icon: "🥔" },
  { name: "Chilli", category: "Spice", unit: "kg", base: 90, icon: "🌶️" },
  { name: "Ragi", category: "Cereal", unit: "kg", base: 42, icon: "🌾" },
  { name: "Maize", category: "Cereal", unit: "kg", base: 26, icon: "🌽" },
  { name: "Groundnut", category: "Oilseed", unit: "kg", base: 65, icon: "🥜" },
  { name: "Sugarcane", category: "Commercial", unit: "kg", base: 4, icon: "🎋" },
  { name: "Coffee", category: "Plantation", unit: "kg", base: 260, icon: "☕" },
  { name: "Tea", category: "Plantation", unit: "kg", base: 180, icon: "🍃" },
  { name: "Lemon", category: "Fruit", unit: "kg", base: 60, icon: "🍋" },
  { name: "Orange", category: "Fruit", unit: "kg", base: 55, icon: "🍊" },
  { name: "Green Gram", category: "Pulse", unit: "kg", base: 100, icon: "🌱" },
  { name: "Black Gram", category: "Pulse", unit: "kg", base: 95, icon: "🌱" },
  { name: "Pulses", category: "Pulse", unit: "kg", base: 90, icon: "🫘" },
  { name: "Other", category: "Other", unit: "kg", base: 30, icon: "🌱" },
];

const INITIAL_LISTINGS = [
  {
    id: "demo-1",
    crop: "Coconut",
    quantity: 500,
    unit: "piece",
    price: 24,
    location: "Thirthahalli, Shivamogga",
    quality: "Good",
    seller: "Demo Farmer",
    description: "Fresh coconuts harvested from a local farm.",
    delivery: "Pickup or delivery",
    image: "",
    demo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    crop: "Arecanut",
    quantity: 200,
    unit: "kg",
    price: 480,
    location: "Sagar, Shivamogga",
    quality: "Premium",
    seller: "Demo Plantation",
    description: "Carefully sorted arecanut.",
    delivery: "Pickup",
    image: "",
    demo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    crop: "Rice",
    quantity: 1000,
    unit: "kg",
    price: 38,
    location: "Kundapura, Udupi",
    quality: "Good",
    seller: "Demo Farm",
    description: "Locally grown rice available in bulk.",
    delivery: "Pickup or delivery",
    image: "",
    demo: true,
    createdAt: new Date().toISOString(),
  },
];

const NAVIGATION = [
  { label: "Home", icon: "⌂" },
  { label: "Market", icon: "▦" },
  { label: "Add Crop", icon: "+" },
  { label: "Smart Fair Price", icon: "◈" },
  { label: "My Listings", icon: "▤" },
  { label: "Orders", icon: "🛒" },
  { label: "Weather", icon: "☀" },
  { label: "Market Insights", icon: "↗" },
  { label: "Profile", icon: "♙" },
  { label: "Settings", icon: "⚙" },
];

const STORAGE_KEY = "farmconnect-listings-v1";
const ORDER_KEY = "farmconnect-orders-v1";
const PROFILE_KEY = "farmconnect-profile-v1";

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function cropInfo(name) {
  return CROPS.find((crop) => crop.name === name) || CROPS[CROPS.length - 1];
}

function initialProfile() {
  return readStorage(PROFILE_KEY, {
    name: "FarmConnect User",
    role: "",
    location: "Shivamogga, Karnataka",
  });
}

function App() {
  const [profile, setProfile] = useState(initialProfile);
  const [role, setRole] = useState(() => initialProfile().role || "");
  const [page, setPage] = useState("Home");

  const [listings, setListings] = useState(() =>
    readStorage(STORAGE_KEY, INITIAL_LISTINGS)
  );

  const [orders, setOrders] = useState(() =>
    readStorage(ORDER_KEY, [])
  );

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(
    () => initialProfile().location || "Shivamogga, Karnataka"
  );
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [notice, setNotice] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherKey, setWeatherKey] = useState("");
  const [buyerQuantity, setBuyerQuantity] = useState({});
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState("pickup");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [form, setForm] = useState({
    crop: "Coconut",
    quantity: "100",
    location: "",
    quality: "Good",
    moisture: "Normal",
    harvestDate: "",
    description: "",
    askingPrice: "",
    delivery: "Both",
    photo: "",
    photoName: "",
  });

  const fileInput = useRef(null);
  const noticeTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    } catch {
      setNotice("Storage is full. Try using a smaller crop photo.");
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
    } catch {
      // Orders remain available in this session.
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Profile changes remain available in this session.
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  function notify(message) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 4000);
  }

  function navigate(destination) {
    setPage(destination);
    setMobileNavOpen(false);
    setSelectedListing(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeRole(nextRole) {
    setRole(nextRole);
    setProfile((current) => ({ ...current, role: nextRole }));
    setPage("Home");
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateProfile(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    if (name === "location") setLocation(value);
  }

  const visibleListings = useMemo(() => {
    let result = listings.filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.crop.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.seller.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        cropInfo(item.crop).category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return result;
  }, [listings, search, categoryFilter, sortBy]);

  const ownListings = listings.filter(
    (item) => !item.demo && item.seller === profile.name
  );

  const currentCrop = cropInfo(form.crop);

  /*
   * DEMONSTRATION PRICE MODEL
   * These are indicative calculations, not verified market quotations.
   * Replace the baseline with historical mandi data and documented
   * crop-specific weights before using it for real trading decisions.
   */
  const priceEstimate = useMemo(() => {
    const crop = cropInfo(form.crop);
    const base = crop.base;

    const qualityFactors = {
      Premium: 1.12,
      Good: 1,
      Average: 0.88,
      Low: 0.72,
    };

    const moistureFactors = {
      Normal: 1,
      Dry: 1.02,
      High: 0.86,
    };

    const quantity = Math.max(0, Number(form.quantity) || 0);
    const qualityFactor = qualityFactors[form.quality] || 1;
    const moistureFactor = moistureFactors[form.moisture] || 1;
    const low = base * qualityFactor * moistureFactor * 0.9;
    const high = base * qualityFactor * moistureFactor * 1.1;
    const middle = (low + high) / 2;

    const bulkDiscount = quantity >= 1000 ? 0.08 : quantity >= 500 ? 0.05 : quantity >= 100 ? 0.02 : 0;

    return {
      low: Math.round(low * 100) / 100,
      high: Math.round(high * 100) / 100,
      middle: Math.round(middle * 100) / 100,
      totalLow: Math.round(low * quantity),
      totalHigh: Math.round(high * quantity),
      bulkDiscount,
      base,
      quantity,
    };
  }, [form.crop, form.quantity, form.quality, form.moisture]);

  async function loadWeather() {
    setWeatherLoading(true);
    setWeatherError("");
    setWeather(null);

    try {
      const query = location.trim();
      if (!query) throw new Error("Enter a location first.");

      // Open-Meteo geocoding is free to test and needs no API key.
      const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
      geoUrl.searchParams.set("name", query);
      geoUrl.searchParams.set("count", "1");
      geoUrl.searchParams.set("language", "en");
      geoUrl.searchParams.set("format", "json");

      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) throw new Error("Location lookup failed.");

      const geoData = await geoResponse.json();
      const place = geoData.results?.[0];
      if (!place) throw new Error("Location not found. Try a nearby town name.");

      const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
      forecastUrl.searchParams.set("latitude", place.latitude);
      forecastUrl.searchParams.set("longitude", place.longitude);
      forecastUrl.searchParams.set(
        "current",
        "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m"
      );
      forecastUrl.searchParams.set(
        "daily",
        "temperature_2m_max,temperature_2m_min,precipitation_probability_max"
      );
      forecastUrl.searchParams.set("forecast_days", "5");
      forecastUrl.searchParams.set("timezone", "auto");

      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) throw new Error("Weather service unavailable.");

      const data = await forecastResponse.json();
      setWeather({ ...data, place });
      setWeatherKey(place.name);
    } catch (error) {
      setWeatherError(error.message || "Unable to retrieve weather.");
    } finally {
      setWeatherLoading(false);
    }
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select an image file.");
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      notify("Please use an image smaller than 1.5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        photo: String(reader.result || ""),
        photoName: file.name,
      }));
    };

    reader.onerror = () => notify("Could not read the selected image.");
    reader.readAsDataURL(file);
  }

  function publishCrop(event) {
    event.preventDefault();

    const quantity = Number(form.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      notify("Enter a valid crop quantity greater than zero.");
      return;
    }

    const itemLocation = (form.location || location).trim();
    if (!itemLocation) {
      notify("Enter the farm or pickup location.");
      return;
    }

    const askingPrice = form.askingPrice.trim()
      ? Number(form.askingPrice)
      : priceEstimate.middle;

    if (!Number.isFinite(askingPrice) || askingPrice <= 0) {
      notify("Enter a valid asking price.");
      return;
    }

    const item = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      crop: form.crop,
      quantity,
      unit: currentCrop.unit,
      price: askingPrice,
      location: itemLocation,
      quality: form.quality,
      moisture: form.moisture,
      seller: profile.name.trim() || "FarmConnect Farmer",
      description: form.description.trim(),
      delivery: form.delivery,
      image: form.photo,
      demo: false,
      createdAt: new Date().toISOString(),
    };

    setListings((current) => [item, ...current]);

    setForm((current) => ({
      ...current,
      quantity: "100",
      location: "",
      description: "",
      askingPrice: "",
      photo: "",
      photoName: "",
    }));

    if (fileInput.current) fileInput.current.value = "";

    notify("Crop listing published on this device.");
    navigate("My Listings");
  }

  function placeOrder(item) {
    const quantity = Number(buyerQuantity[item.id] || 1);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      notify("Enter a valid order quantity.");
      return;
    }

    if (quantity > item.quantity) {
      notify(`Only ${item.quantity} ${item.unit} are available.`);
      return;
    }

    const discount = quantity >= 1000 ? 0.08 : quantity >= 500 ? 0.05 : quantity >= 100 ? 0.02 : 0;
    const subtotal = quantity * item.price;
    const deliveryFee = selectedDelivery === "delivery" ? 150 : 0;

    const order = {
      id: `FC-${Date.now().toString().slice(-8)}`,
      listingId: item.id,
      crop: item.crop,
      quantity,
      unit: item.unit,
      seller: item.seller,
      buyer: profile.name,
      location: item.location,
      delivery: selectedDelivery,
      subtotal: Math.round(subtotal * (1 - discount) * 100) / 100,
      deliveryFee,
      total: Math.round((subtotal * (1 - discount) + deliveryFee) * 100) / 100,
      status: "Demo order",
      createdAt: new Date().toISOString(),
    };

    setOrders((current) => [order, ...current]);
    setSelectedListing(null);
    notify("Demo order created. No payment or real booking was made.");
    navigate("Orders");
  }

  function deleteListing(item) {
    if (item.demo) {
      notify("Demo listings cannot be deleted.");
      return;
    }

    if (item.seller !== profile.name) {
      notify("You can only remove your own listings.");
      return;
    }

    setListings((current) => current.filter((row) => row.id !== item.id));
    notify("Your listing was removed.");
  }

  const isSeller = role === "seller";
  const isBuyer = role === "buyer";

  if (!role) {
    return (
      <div className="role-screen">
        <div className="role-container">
          <div className="sidebar-brand" style={{ justifyContent: "center", border: 0 }}>
            <div className="brand-logo">🌿</div>
            <div>
              <h1 className="brand-name" style={{ fontSize: 25 }}>FarmConnect</h1>
              <p className="brand-caption">SMART FARM-TO-BUYER MARKETPLACE</p>
            </div>
          </div>

          <h2 className="role-heading">Growing together. Trading fairly.</h2>
          <p className="role-description">
            Connect directly with farmers and buyers, discover local produce,
            compare indicative prices, and reduce unnecessary middlemen.
          </p>

          <div className="role-grid">
            <button className="role-card" onClick={() => changeRole("seller")}>
              <span className="role-card-icon">🌱</span>
              <span className="role-card-title">I'm a Farmer / Seller</span>
              <span className="role-card-description">
                Publish your crops, check indicative price ranges, add harvest
                details, and connect with potential buyers.
              </span>
              <span className="role-card-action">Enter as seller →</span>
            </button>

            <button className="role-card" onClick={() => changeRole("buyer")}>
              <span className="role-card-icon">🧺</span>
              <span className="role-card-title">I'm a Buyer</span>
              <span className="role-card-description">
                Explore available produce, compare sellers, request bulk
                quantities, and choose pickup or delivery.
              </span>
              <span className="role-card-action">Enter as buyer →</span>
            </button>
          </div>

          <p className="text-muted text-center text-small" style={{ marginTop: 23, marginBottom: 0 }}>
            Demo version · Indicative prices · No real payments
          </p>
        </div>
      </div>
    );
  }

  function renderWeatherCard() {
    if (!weather) {
      return (
        <div className="glass-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Local weather</h3>
              <p className="card-description">
                Get current weather and a five-day forecast for your area.
              </p>
            </div>
            <span className="weather-icon">☀️</span>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="weather-location">
              Town or city
            </label>
            <input
              id="weather-location"
              className="form-control"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. Shivamogga, Karnataka"
            />
          </div>

          <button
            className="btn btn-primary mt-2"
            onClick={loadWeather}
            disabled={weatherLoading}
          >
            {weatherLoading ? "Fetching weather…" : "Fetch local weather"}
          </button>

          {weatherError && (
            <div className="alert alert-warning mt-2">{weatherError}</div>
          )}

          <p className="form-help mt-2">
            Weather is retrieved from Open-Meteo. Weather conditions alone
            cannot establish a crop's market price.
          </p>
        </div>
      );
    }

    const current = weather.current || {};
    const daily = weather.daily || {};
    const weatherLabels = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Drizzle",
      55: "Heavy drizzle",
      61: "Light rain",
      63: "Rain",
      65: "Heavy rain",
      71: "Light snow",
      80: "Rain showers",
      81: "Rain showers",
      82: "Heavy rain showers",
      95: "Thunderstorm",
    };

    return (
      <div className="weather-card">
        <div className="row-between">
          <div>
            <p className="weather-location">Current conditions</p>
            <h3 className="card-title">{weather.place.name}</h3>
            <p className="weather-description">
              {weatherLabels[current.weather_code] || "Local weather"}
            </p>
          </div>
          <span className="weather-icon">🌦️</span>
        </div>

        <div className="weather-temperature">
          {Math.round(current.temperature_2m ?? 0)}°C
        </div>

        <div className="weather-stats">
          <div className="weather-stat">
            <div className="weather-stat-label">Humidity</div>
            <div className="weather-stat-value">
              {current.relative_humidity_2m ?? "—"}%
            </div>
          </div>
          <div className="weather-stat">
            <div className="weather-stat-label">Rain now</div>
            <div className="weather-stat-value">
              {current.precipitation ?? "—"} mm
            </div>
          </div>
          <div className="weather-stat">
            <div className="weather-stat-label">Wind</div>
            <div className="weather-stat-value">
              {current.wind_speed_10m ?? "—"} km/h
            </div>
          </div>
        </div>

        <h4 className="card-title mt-3">5-day forecast</h4>
        <div className="forecast-grid">
          {(daily.time || []).map((day, index) => (
            <div className="forecast-item" key={day}>
              <div className="forecast-day">
                {new Date(`${day}T12:00:00`).toLocaleDateString("en-IN", {
                  weekday: "short",
                })}
              </div>
              <div className="forecast-icon">🌤️</div>
              <div className="forecast-temperature">
                {Math.round(daily.temperature_2m_max?.[index] ?? 0)}°
              </div>
              <div className="forecast-day">
                {Math.round(daily.temperature_2m_min?.[index] ?? 0)}°
              </div>
              <div className="forecast-day mt-1">
                Rain {daily.precipitation_probability_max?.[index] ?? "—"}%
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-secondary mt-3"
          onClick={loadWeather}
          disabled={weatherLoading}
        >
          Refresh weather
        </button>
        {weatherError && <p className="form-help mt-2">{weatherError}</p>}
      </div>
    );
  }

  function renderPricePanel() {
    const crop = cropInfo(form.crop);

    return (
      <div className="price-panel">
        <div className="price-panel-header">
          <div>
            <h3 className="price-panel-title">Smart Fair Price System</h3>
            <p className="price-panel-subtitle">
              Indicative price estimate for {crop.name}
            </p>
          </div>
          <span className="badge badge-warning">Demo model</span>
        </div>

        <div className="form-grid mb-2">
          <div className="form-field">
            <label className="form-label" htmlFor="estimate-crop">
              Crop
            </label>
            <select
              id="estimate-crop"
              name="crop"
              className="form-control"
              value={form.crop}
              onChange={updateForm}
            >
              {CROPS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="estimate-quantity">
              Quantity ({crop.unit})
            </label>
            <input
              id="estimate-quantity"
              name="quantity"
              type="number"
              min="1"
              className="form-control"
              value={form.quantity}
              onChange={updateForm}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="estimate-quality">
              Visible quality
            </label>
            <select
              id="estimate-quality"
              name="quality"
              className="form-control"
              value={form.quality}
              onChange={updateForm}
            >
              {["Premium", "Good", "Average", "Low"].map((quality) => (
                <option key={quality}>{quality}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="estimate-moisture">
              Moisture condition
            </label>
            <select
              id="estimate-moisture"
              name="moisture"
              className="form-control"
              value={form.moisture}
              onChange={updateForm}
            >
              {["Normal", "Dry", "High"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="price-range-grid">
          <div className="price-range-card">
            <p className="price-range-label">Indicative minimum</p>
            <div className="price-range-value minimum">
              {money(priceEstimate.low)}
            </div>
            <p className="price-range-unit">per {crop.unit}</p>
          </div>

          <div className="price-range-card">
            <p className="price-range-label">Indicative maximum</p>
            <div className="price-range-value maximum">
              {money(priceEstimate.high)}
            </div>
            <p className="price-range-unit">per {crop.unit}</p>
          </div>
        </div>

        <div className="price-breakdown">
          <div className="price-breakdown-row">
            <span>Estimated crop value — low</span>
            <strong>{money(priceEstimate.totalLow)}</strong>
          </div>
          <div className="price-breakdown-row">
            <span>Estimated crop value — high</span>
            <strong>{money(priceEstimate.totalHigh)}</strong>
          </div>
          <div className="price-breakdown-row">
            <span>Bulk quantity indicator</span>
            <strong>
              {Math.round(priceEstimate.bulkDiscount * 100)}% potential discount
            </strong>
          </div>
        </div>

        <div className="price-disclaimer">
          <strong>Important:</strong> These numbers use illustrative baseline
          prices coded into this demo, not verified live market quotations.
          The displayed range is not a guaranteed minimum or maximum selling
          price. Actual estimates need historical mandi prices, local market
          data, seasonality, crop variety, grade, moisture, transport, demand,
          supply, weather and verified cost information. A buyer and seller
          should agree on the final price.
        </div>
      </div>
    );
  }

  function renderCropCard(item, own = false) {
    const crop = cropInfo(item.crop);

    return (
      <article className="crop-card" key={item.id}>
        <div className="crop-image">
          {item.image ? (
            <img src={item.image} alt={item.crop} />
          ) : (
            <div className="crop-image-placeholder">{crop.icon}</div>
          )}
          <span className="crop-image-badge badge badge-success">
            {item.quality || "Listed"}
          </span>
        </div>

        <div className="crop-card-body">
          <div className="row-between">
            <h3 className="crop-card-title">{item.crop}</h3>
            <span className="badge badge-neutral">{crop.category}</span>
          </div>

          <p className="crop-card-location">⌖ {item.location}</p>

          <div className="crop-price">
            {money(item.price)}
            <small> / {item.unit}</small>
          </div>

          <p className="text-muted text-small">
            Available: {item.quantity.toLocaleString("en-IN")} {item.unit}
          </p>

          <p className="text-secondary text-small">
            Seller: {item.seller}
          </p>

          {item.description && (
            <p className="text-secondary text-small">{item.description}</p>
          )}

          <p className="form-help">
            {item.delivery || "Pickup"} · Listed{" "}
            {new Date(item.createdAt).toLocaleDateString("en-IN")}
          </p>

          <div className="crop-card-footer">
            {own ? (
              <>
                <span className="badge badge-info">
                  {item.demo ? "Sample listing" : "Your listing"}
                </span>
                {!item.demo && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteListing(item)}
                  >
                    Remove
                  </button>
                )}
              </>
            ) : (
              <>
                <div style={{ minWidth: 0 }}>
                  <label className="form-help" htmlFor={`quantity-${item.id}`}>
                    Quantity
                  </label>
                  <input
                    id={`quantity-${item.id}`}
                    className="form-control"
                    style={{ minHeight: 31, padding: "5px 8px", width: 95 }}
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={buyerQuantity[item.id] ?? 1}
                    onChange={(event) =>
                      setBuyerQuantity((current) => ({
                        ...current,
                        [item.id]: event.target.value,
                      }))
                    }
                  />
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSelectedListing(item);
                    setSelectedDelivery("pickup");
                  }}
                >
                  Buy / Request
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  function renderHome() {
    const myOrders = orders.filter((order) =>
      isBuyer ? order.buyer === profile.name : order.seller === profile.name
    );

    return (
      <>
        <section className="welcome-banner">
          <div className="welcome-content">
            <p className="welcome-greeting">
              {isSeller ? "YOUR FARM, YOUR MARKET 🌱" : "WELCOME TO YOUR MARKET 🧺"}
            </p>
            <h1 className="welcome-title">
              {isSeller
                ? "Good morning, Farmer!"
                : "Fresh produce, closer to you."}
            </h1>
            <p className="welcome-description">
              {isSeller
                ? "List your harvest, explore indicative fair prices, and connect directly with potential buyers."
                : "Discover local crops, compare prices, and connect directly with farmers around your area."}
            </p>
            <div className="welcome-actions">
              {isSeller && (
                <button className="btn btn-primary" onClick={() => navigate("Add Crop")}>
                  + Add a crop
                </button>
              )}
              <button
                className="btn btn-secondary"
                onClick={() => navigate("Market")}
              >
                Explore marketplace →
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("Smart Fair Price")}
              >
                ◈ Check fair price
              </button>
            </div>
          </div>
        </section>

        <section className="metric-grid">
          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Available listings</span>
              <span className="metric-icon">🌾</span>
            </div>
            <div className="metric-value">{listings.length}</div>
            <div className="metric-footer">Crops listed in this demo</div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Your listings</span>
              <span className="metric-icon">🌱</span>
            </div>
            <div className="metric-value">{ownListings.length}</div>
            <div className="metric-footer">Published on this device</div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Your demo orders</span>
              <span className="metric-icon">🧺</span>
            </div>
            <div className="metric-value">{myOrders.length}</div>
            <div className="metric-footer">No payments processed</div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Your location</span>
              <span className="metric-icon">⌖</span>
            </div>
            <div className="metric-value" style={{ fontSize: 17 }}>
              {location.split(",")[0] || "Not set"}
            </div>
            <div className="metric-footer">Edit your location below</div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="glass-card span-2">
            <div className="card-header">
              <div>
                <h2 className="card-title">
                  {isSeller ? "Publish your harvest" : "Find your next harvest"}
                </h2>
                <p className="card-description">
                  {isSeller
                    ? "Add crop details and reach nearby buyers."
                    : "Browse produce listed by local farmers."}
                </p>
              </div>
              <button className="card-action" onClick={() => navigate("Market")}>
                View market →
              </button>
            </div>

            {isSeller ? (
              <div className="stack">
                <p className="text-secondary">
                  A listing can include the crop name, quantity, location,
                  quality, harvest information, photo and your asking price.
                </p>
                <button
                  className="btn btn-primary"
                  style={{ alignSelf: "flex-start" }}
                  onClick={() => navigate("Add Crop")}
                >
                  + Create listing
                </button>
              </div>
            ) : (
              <div className="stack">
                <input
                  className="form-control"
                  placeholder="Search crops or locations…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button
                  className="btn btn-primary"
                  style={{ alignSelf: "flex-start" }}
                  onClick={() => navigate("Market")}
                >
                  Browse available crops
                </button>
              </div>
            )}
          </section>

          <section className="glass-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Smart Fair Price</h2>
                <p className="card-description">Explore an indicative crop price range.</p>
              </div>
              <span className="metric-icon">◈</span>
            </div>
            <div className="price-range-value maximum">
              {money(priceEstimate.low)} – {money(priceEstimate.high)}
            </div>
            <p className="text-muted text-small">
              Per {currentCrop.unit} of {form.crop}
            </p>
            <button
              className="btn btn-secondary btn-block"
              onClick={() => navigate("Smart Fair Price")}
            >
              Calculate price
            </button>
          </section>

          <section className="glass-card span-2">
            <div className="card-header">
              <div>
                <h2 className="card-title">Recently listed crops</h2>
                <p className="card-description">
                  Preview available marketplace produce.
                </p>
              </div>
              <button className="card-action" onClick={() => navigate("Market")}>
                View all →
              </button>
            </div>
            <div className="crop-grid">
              {visibleListings.slice(0, 3).map((item) => renderCropCard(item))}
            </div>
          </section>

          <section className="glass-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Weather & harvest</h2>
                <p className="card-description">Check conditions in your area.</p>
              </div>
            </div>
            {weather ? (
              <>
                <div className="weather-temperature">
                  {Math.round(weather.current?.temperature_2m ?? 0)}°C
                </div>
                <p className="weather-location">
                  {weather.place.name} · {weatherKey}
                </p>
                <p className="text-secondary text-small">
                  Rain now: {weather.current?.precipitation ?? "—"} mm
                </p>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => navigate("Weather")}
                >
                  View forecast
                </button>
              </>
            ) : (
              <>
                <p className="text-secondary text-small">
                  Fetch current conditions and a five-day forecast using the
                  free Open-Meteo weather service.
                </p>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => navigate("Weather")}
                >
                  Get local weather
                </button>
              </>
            )}
          </section>
        </div>

        <section className="glass-card mt-3">
          <div className="card-header">
            <div>
              <h2 className="card-title">Set your location</h2>
              <p className="card-description">
                Use your town or village for local weather and marketplace searches.
              </p>
            </div>
          </div>
          <div className="row flex-wrap">
            <input
              className="form-control"
              style={{ flex: "1 1 250px" }}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Town, district, state"
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                setProfile((current) => ({ ...current, location }));
                notify("Location saved on this device.");
              }}
            >
              Save location
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("Weather")}>
              Fetch weather
            </button>
          </div>
        </section>
      </>
    );
  }

  function renderMarket() {
    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Farm Marketplace</h1>
            <p className="page-subtitle">
              Browse crops, compare seller offers and request bulk quantities.
            </p>
          </div>
          {isSeller && (
            <button className="btn btn-primary" onClick={() => navigate("Add Crop")}>
              + Add crop
            </button>
          )}
        </div>

        <div className="filter-bar">
          <input
            className="filter-control"
            style={{ flex: "1 1 210px" }}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search crop, seller or location…"
          />

          <select
            className="filter-control"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {["All", ...new Set(CROPS.map((crop) => crop.category))].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <select
            className="filter-control"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="recent">Recently listed</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>

          <span className="filter-results">
            {visibleListings.length} listings
          </span>
        </div>

        <div className="alert alert-warning mb-2">
          <span>ℹ️</span>
          <span>
            Listings shown here are stored in this browser. The sample listings
            are demonstration data, not verified offers from actual farmers.
            Live multi-user listings require a shared backend database.
          </span>
        </div>

        {visibleListings.length ? (
          <div className="crop-grid">
            {visibleListings.map((item) => renderCropCard(item))}
          </div>
        ) : (
          <div className="glass-card empty-state">
            <div className="empty-state-icon">🌾</div>
            <h3 className="empty-state-title">No matching crops</h3>
            <p className="empty-state-description">
              Try another search or category, or publish a new crop listing.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("Add Crop")}
            >
              Add crop
            </button>
          </div>
        )}
      </>
    );
  }

  function renderAddCrop() {
    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Add a crop listing</h1>
            <p className="page-subtitle">
              Describe your harvest and publish an offer for potential buyers.
            </p>
          </div>
        </div>

        <form className="form-container" onSubmit={publishCrop}>
          <section className="form-section">
            <h2 className="form-section-title">Crop details</h2>
            <p className="form-section-description">
              Provide the crop, quantity and basic quality information.
            </p>

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" htmlFor="crop-name">Crop name *</label>
                <select
                  id="crop-name"
                  name="crop"
                  className="form-control"
                  value={form.crop}
                  onChange={updateForm}
                  required
                >
                  {CROPS.map((crop) => (
                    <option key={crop.name} value={crop.name}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="crop-quantity">
                  Quantity ({currentCrop.unit}) *
                </label>
                <input
                  id="crop-quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  step="any"
                  className="form-control"
                  value={form.quantity}
                  onChange={updateForm}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="crop-quality">
                  Quality grade *
                </label>
                <select
                  id="crop-quality"
                  name="quality"
                  className="form-control"
                  value={form.quality}
                  onChange={updateForm}
                >
                  {["Premium", "Good", "Average", "Low"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="crop-moisture">
                  Moisture condition
                </label>
                <select
                  id="crop-moisture"
                  name="moisture"
                  className="form-control"
                  value={form.moisture}
                  onChange={updateForm}
                >
                  {["Normal", "Dry", "High"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="crop-harvest-date">
                  Harvest date
                </label>
                <input
                  id="crop-harvest-date"
                  name="harvestDate"
                  type="date"
                  className="form-control"
                  value={form.harvestDate}
                  onChange={updateForm}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="crop-asking-price">
                  Asking price (₹ per {currentCrop.unit})
                </label>
                <input
                  id="crop-asking-price"
                  name="askingPrice"
                  type="number"
                  min="0.01"
                  step="any"
                  className="form-control"
                  value={form.askingPrice}
                  onChange={updateForm}
                  placeholder={`Suggested demo estimate: ${priceEstimate.middle}`}
                />
                <p className="form-help">
                  Leave blank to use the indicative demo estimate.
                </p>
              </div>

              <div className="form-field full-width">
                <label className="form-label" htmlFor="crop-location">
                  Farm / pickup location *
                </label>
                <input
                  id="crop-location"
                  name="location"
                  className="form-control"
                  value={form.location}
                  onChange={updateForm}
                  placeholder="Village, town, district, state"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label" htmlFor="crop-description">
                  Description
                </label>
                <textarea
                  id="crop-description"
                  name="description"
                  className="form-control"
                  value={form.description}
                  onChange={updateForm}
                  placeholder="Crop variety, harvest date, grading, packaging, etc."
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="form-section-title">Crop photo</h2>
            <p className="form-section-description">
              A clear photo helps buyers inspect the listing. Automatic
              image-based quality grading is not enabled in this demo.
            </p>

            <button
              type="button"
              className="upload-zone w-full"
              onClick={() => fileInput.current?.click()}
            >
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Crop preview"
                  style={{
                    maxWidth: "100%",
                    width: 180,
                    maxHeight: 180,
                    objectFit: "contain",
                    borderRadius: 10,
                  }}
                />
              ) : (
                <>
                  <span className="upload-icon">📷</span>
                  <span className="upload-title">Upload a crop photo</span>
                  <span className="upload-description">
                    Optional · Image files · Maximum 1.5 MB
                  </span>
                </>
              )}
              {form.photoName && (
                <span className="form-help">{form.photoName}</span>
              )}
            </button>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhoto}
            />

            {form.photo && (
              <button
                type="button"
                className="btn btn-danger btn-sm mt-2"
                onClick={() => {
                  setForm((current) => ({
                    ...current,
                    photo: "",
                    photoName: "",
                  }));
                  if (fileInput.current) fileInput.current.value = "";
                }}
              >
                Remove photo
              </button>
            )}
          </section>

          <section className="form-section">
            <h2 className="form-section-title">Pickup and delivery</h2>
            <p className="form-section-description">
              Choose the fulfilment options you can offer.
            </p>

            <div className="stack-sm">
              {[
                ["Pickup", "Buyers collect the crop from your farm."],
                ["Delivery", "You arrange delivery; agree on the fee with the buyer."],
                ["Both", "Allow buyers to request either option."],
              ].map(([value, description]) => (
                <label className="delivery-option" key={value}>
                  <input
                    type="radio"
                    name="delivery"
                    value={value}
                    checked={form.delivery === value}
                    onChange={updateForm}
                  />
                  <div>
                    <div className="delivery-option-title">{value}</div>
                    <p className="delivery-option-description">{description}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="form-section">
            <h2 className="form-section-title">Indicative price preview</h2>
            <p className="form-section-description">
              Change crop, quantity and grade to update the illustrative range.
            </p>
            <div className="price-range-grid">
              <div className="price-range-card">
                <p className="price-range-label">Minimum estimate</p>
                <div className="price-range-value minimum">
                  {money(priceEstimate.low)}
                </div>
                <p className="price-range-unit">per {currentCrop.unit}</p>
              </div>
              <div className="price-range-card">
                <p className="price-range-label">Maximum estimate</p>
                <div className="price-range-value maximum">
                  {money(priceEstimate.high)}
                </div>
                <p className="price-range-unit">per {currentCrop.unit}</p>
              </div>
            </div>
            <p className="form-help mt-2">
              These figures are hard-coded demo baselines, not live market
              recommendations. Confirm the actual price before trading.
            </p>
          </section>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("Home")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg">
              Publish crop listing
            </button>
          </div>
        </form>
      </>
    );
  }

  function renderOrders() {
    const relevantOrders = orders.filter((order) =>
      isBuyer ? order.buyer === profile.name : order.seller === profile.name
    );

    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Orders</h1>
            <p className="page-subtitle">
              Review the demo orders created from marketplace listings.
            </p>
          </div>
        </div>

        <div className="alert alert-warning mb-2">
          This is a local prototype. Orders are not sent to real farmers, and
          payments, messaging, transport booking and order confirmation are not
          connected to a backend.
        </div>

        <section className="glass-card">
          {relevantOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🧺</div>
              <h2 className="empty-state-title">No orders yet</h2>
              <p className="empty-state-description">
                {isBuyer
                  ? "Visit the marketplace and create a demo order."
                  : "When buyers create demo orders for your listings, they will appear here."}
              </p>
              <button className="btn btn-primary" onClick={() => navigate("Market")}>
                Open marketplace
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Crop</th>
                    <th>Quantity</th>
                    <th>Fulfilment</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.crop}</td>
                      <td>{order.quantity} {order.unit}</td>
                      <td>{order.delivery}</td>
                      <td>{money(order.total)}</td>
                      <td><span className="badge badge-warning">{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    );
  }

  function renderInsights() {
    const counts = listings.reduce((result, item) => {
      result[item.crop] = (result[item.crop] || 0) + 1;
      return result;
    }, {});

    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Market Insights</h1>
            <p className="page-subtitle">
              Explore listing activity and indicative prices in the prototype.
            </p>
          </div>
        </div>

        <div className="alert alert-warning mb-2">
          These statistics describe the listings in this browser only. They
          are not a substitute for verified historical mandi prices, local
          supply, demand, or official agricultural statistics.
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Number of listings</div>
            <div className="metric-value">{listings.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Different crops listed</div>
            <div className="metric-value">{Object.keys(counts).length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Demo orders</div>
            <div className="metric-value">{orders.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Market location</div>
            <div className="metric-value" style={{ fontSize: 17 }}>
              {location.split(",")[0]}
            </div>
          </div>
        </div>

        <section className="glass-card mt-3">
          <div className="card-header">
            <div>
              <h2 className="card-title">Listed crops</h2>
              <p className="card-description">
                Listing counts and asking prices from the local demo dataset.
              </p>
            </div>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Listings</th>
                  <th>Lowest asking price</th>
                  <th>Highest asking price</th>
                </tr>
              </thead>
              <tbody>
                {[...new Set(listings.map((item) => item.crop))].map((cropName) => {
                  const items = listings.filter((item) => item.crop === cropName);
                  const crop = cropInfo(cropName);
                  const prices = items.map((item) => item.price);

                  return (
                    <tr key={cropName}>
                      <td><strong>{cropName}</strong></td>
                      <td>{items.length}</td>
                      <td>{money(Math.min(...prices))} / {crop.unit}</td>
                      <td>{money(Math.max(...prices))} / {crop.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card mt-3">
          <h2 className="card-title">Factors the production version should consider</h2>
          <div className="stack-sm mt-2">
            {[
              "Historical prices by crop, variety, grade, date and local market.",
              "Recent mandi arrivals, supply, demand and seasonality.",
              "Rainfall, temperature, humidity, forecasts and harvest conditions.",
              "Crop maturity, visual defects, size, colour, moisture and storage quality.",
              "Farm location, distance, transport, loading, packaging and handling costs.",
              "Order quantity, buyer demand, bulk negotiation and delivery preferences.",
            ].map((item) => (
              <div className="alert" key={item}>
                <span className="text-green">✓</span><span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">Edit your display name, role and location.</p>
          </div>
        </div>

        <section className="form-section">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {(profile.name || "F").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="card-title">{profile.name}</h2>
              <p className="text-muted text-small">
                {isSeller ? "Farmer / Seller" : "Buyer"}
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label" htmlFor="profile-name">Display name</label>
              <input
                id="profile-name"
                className="form-control"
                name="name"
                value={profile.name}
                onChange={updateProfile}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="profile-location">Location</label>
              <input
                id="profile-location"
                className="form-control"
                name="location"
                value={profile.location}
                onChange={updateProfile}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setLocation(profile.location);
                notify("Profile saved on this device.");
              }}
            >
              Save profile
            </button>
          </div>
        </section>
      </>
    );
  }

  function renderSettings() {
    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Manage your demo data and application role.</p>
          </div>
        </div>

        <section className="glass-card">
          <h2 className="card-title">Switch your role</h2>
          <p className="card-description">
            Switch between buyer and seller interfaces. This prototype does
            not have separate authenticated accounts.
          </p>
          <div className="row flex-wrap mt-2">
            <button className="btn btn-secondary" onClick={() => changeRole("buyer")}>
              Use as buyer
            </button>
            <button className="btn btn-secondary" onClick={() => changeRole("seller")}>
              Use as seller
            </button>
          </div>
          <hr className="divider" />
          <h2 className="card-title">Demo data</h2>
          <p className="card-description">
            Reset local listings, orders and profile to the starting demo state.
            This action cannot be undone.
          </p>
          <button
            className="btn btn-danger mt-2"
            onClick={() => {
              if (!window.confirm("Reset all FarmConnect demo data on this browser?")) return;

              setListings(INITIAL_LISTINGS);
              setOrders([]);
              setProfile({
                name: "FarmConnect User",
                role,
                location: "Shivamogga, Karnataka",
              });
              setLocation("Shivamogga, Karnataka");
              setSearch("");
              setCategoryFilter("All");
              setWeather(null);

              try {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(ORDER_KEY);
                localStorage.removeItem(PROFILE_KEY);
              } catch {
                // React state is still reset.
              }

              notify("Demo data reset.");
              navigate("Home");
            }}
          >
            Reset demo data
          </button>
        </section>
      </>
    );
  }

  function renderPage() {
    if (selectedListing) {
      const item = selectedListing;
      const quantity = Number(buyerQuantity[item.id] || 1);
      const validQuantity = quantity > 0 && quantity <= item.quantity;
      const bulkDiscount = quantity >= 1000 ? 0.08 : quantity >= 500 ? 0.05 : quantity >= 100 ? 0.02 : 0;
      const subtotal = validQuantity ? quantity * item.price * (1 - bulkDiscount) : 0;
      const deliveryFee = selectedDelivery === "delivery" ? 150 : 0;

      return (
        <section className="form-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Request this crop</h1>
              <p className="page-subtitle">
                Review the indicative order total before creating a demo order.
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedListing(null)}
            >
              ← Back
            </button>
          </div>

          <div className="glass-card">
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div className="crop-image-placeholder" style={{ width: 85, height: 85, borderRadius: 12 }}>
                {cropInfo(item.crop).icon}
              </div>
              <div className="flex-1">
                <h2 className="card-title">{item.crop}</h2>
                <p className="card-description">{item.location}</p>
                <p className="crop-price">
                  {money(item.price)} <small>/ {item.unit}</small>
                </p>
                <p className="text-muted text-small">
                  Seller: {item.seller} · Available: {item.quantity} {item.unit}
                </p>
              </div>
            </div>

            <hr className="divider" />

            <div className="form-field">
              <label className="form-label" htmlFor="order-quantity">
                Order quantity ({item.unit})
              </label>
              <input
                id="order-quantity"
                className="form-control"
                type="number"
                min="1"
                max={item.quantity}
                value={buyerQuantity[item.id] ?? 1}
                onChange={(event) =>
                  setBuyerQuantity((current) => ({
                    ...current,
                    [item.id]: event.target.value,
                  }))
                }
              />
              {!validQuantity && (
                <p className="form-error">Enter a quantity within the available stock.</p>
              )}
            </div>

            <div className="form-field mt-3">
              <label className="form-label">Fulfilment option</label>
              <div className="stack-sm">
                <label className={`delivery-option ${selectedDelivery === "pickup" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="order-delivery"
                    checked={selectedDelivery === "pickup"}
                    onChange={() => setSelectedDelivery("pickup")}
                  />
                  <div>
                    <div className="delivery-option-title">Farm pickup</div>
                    <p className="delivery-option-description">
                      Collect from the listed farm location. No delivery charge added.
                    </p>
                  </div>
                </label>

                <label className={`delivery-option ${selectedDelivery === "delivery" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="order-delivery"
                    checked={selectedDelivery === "delivery"}
                    onChange={() => setSelectedDelivery("delivery")}
                  />
                  <div>
                    <div className="delivery-option-title">Farmer delivery</div>
                    <p className="delivery-option-description">
                      Demo delivery fee of ₹150. Real transport costs must be agreed.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="price-breakdown mt-3">
              <div className="price-breakdown-row">
                <span>Crop subtotal</span>
                <strong>{money(validQuantity ? quantity * item.price : 0)}</strong>
              </div>
              <div className="price-breakdown-row">
                <span>Illustrative bulk discount</span>
                <strong>{Math.round(bulkDiscount * 100)}%</strong>
              </div>
              <div className="price-breakdown-row">
                <span>Delivery fee</span>
                <strong>{money(deliveryFee)}</strong>
              </div>
              <div className="price-breakdown-row price-breakdown-total">
                <span>Indicative total</span>
                <strong>{money(subtotal + deliveryFee)}</strong>
              </div>
            </div>

            <div className="alert alert-warning mt-3">
              This creates a local demo order only. It does not contact the seller,
              reserve inventory, book a vehicle or process payment.
            </div>

            <button
              className="btn btn-primary btn-lg btn-block mt-3"
              disabled={!validQuantity}
              onClick={() => placeOrder(item)}
            >
              Create demo order
            </button>
          </div>
        </section>
      );
    }

    switch (page) {
      case "Home":
        return renderHome();

      case "Market":
        return renderMarket();

      case "Add Crop":
        return renderAddCrop();

      case "Smart Fair Price":
        return (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Smart Fair Price System</h1>
                <p className="page-subtitle">
                  Estimate a price range and understand what a production pricing engine needs.
                </p>
              </div>
            </div>
            {renderPricePanel()}
            <section className="glass-card mt-3">
              <h2 className="card-title">Pricing factors for the production version</h2>
              <p className="card-description">
                These factors should be collected, validated and weighted according
                to the specific crop, grade, location and market.
              </p>
              <div className="stack-sm mt-2">
                {[
                  ["Market price history", "Daily and weekly prices for the crop at nearby regulated markets."],
                  ["Season and supply", "Harvest cycles, arrivals, local production and competing supply."],
                  ["Weather", "Rainfall, temperature, humidity and forecast data from a weather API."],
                  ["Crop quality", "Variety, maturity, defects, size, colour, moisture and storage conditions."],
                  ["Quantity and demand", "Available stock, order volume, buyer interest and bulk negotiation."],
                  ["Farm-to-buyer costs", "Harvesting, grading, packing, loading, distance, transport and handling."],
                  ["Market location", "Local market, district, access to buyers and verified nearby prices."],
                ].map(([title, description]) => (
                  <div className="alert" key={title}>
                    <span className="text-green">◈</span>
                    <div>
                      <strong className="text-primary">{title}</strong>
                      <div className="text-secondary">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        );

      case "My Listings":
        return (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">My Listings</h1>
                <p className="page-subtitle">
                  Manage the crop listings published under your current display name.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate("Add Crop")}>
                + Add crop
              </button>
            </div>
            {ownListings.length ? (
              <div className="crop-grid">
                {ownListings.map((item) => renderCropCard(item, true))}
              </div>
            ) : (
              <div className="glass-card empty-state">
                <div className="empty-state-icon">🌱</div>
                <h2 className="empty-state-title">You have no listings yet</h2>
                <p className="empty-state-description">
                  Create a listing to display your produce in this browser's marketplace.
                </p>
                <button className="btn btn-primary" onClick={() => navigate("Add Crop")}>
                  Add your first crop
                </button>
              </div>
            )}
          </>
        );

      case "Orders":
        return renderOrders();

      case "Weather":
        return (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Weather & Conditions</h1>
                <p className="page-subtitle">
                  Fetch current weather and a five-day forecast for a named location.
                </p>
              </div>
            </div>
            {renderWeatherCard()}
          </>
        );

      case "Market Insights":
        return renderInsights();

      case "Profile":
        return renderProfile();

      case "Settings":
        return renderSettings();

      default:
        return renderHome();
    }
  }

  return (
    <div className="app-shell">
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-logo">🌿</div>
            <div>
              <h1 className="brand-name">FarmConnect</h1>
              <p className="brand-caption">SMART AGRICULTURE</p>
            </div>
          </div>

          <div className="sidebar-section-label">Workspace</div>

          <nav className="sidebar-nav" aria-label="Main navigation">
            {NAVIGATION.filter((item) => {
              if (item.label === "Add Crop" && !isSeller) return false;
              if (item.label === "My Listings" && !isSeller) return false;
              return true;
            }).map((item) => (
              <button
                key={item.label}
                className={`nav-item ${page === item.label ? "active" : ""}`}
                onClick={() => navigate(item.label)}
                aria-current={page === item.label ? "page" : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-assistant">
              <div className="assistant-title">🌿 FarmConnect Guide</div>
              <p className="assistant-description">
                Need a hand? Check crop prices, local weather and marketplace listings.
              </p>
              <button
                className="btn btn-primary btn-sm btn-block"
                onClick={() => navigate("Smart Fair Price")}
              >
                Check fair price →
              </button>
            </div>
            <button
              className="btn btn-secondary btn-sm btn-block mt-2"
              onClick={() => setRole("")}
            >
              Switch buyer / seller
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div className="topbar-left">
              <div className="topbar-search">
                <span className="search-icon">⌕</span>
                <input
                  aria-label="Search marketplace"
                  placeholder="Search crops, locations…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") navigate("Market");
                  }}
                />
              </div>
            </div>

            <div className="topbar-right">
              <button
                className="icon-button"
                title="Open weather"
                aria-label="Open weather"
                onClick={() => navigate("Weather")}
              >
                ☀
              </button>
              <button
                className="icon-button"
                title="Add crop"
                aria-label="Add crop"
                onClick={() => navigate(isSeller ? "Add Crop" : "Market")}
              >
                +
              </button>
              <button
                className="profile-button"
                onClick={() => navigate("Profile")}
              >
                <span className="profile-avatar">
                  {(profile.name || "F").charAt(0).toUpperCase()}
                </span>
                <span>
                  <span className="profile-name">{profile.name}</span>
                  <span className="profile-role">
                    {isSeller ? "Farmer / Seller" : "Buyer"}
                  </span>
                </span>
              </button>
            </div>
          </header>

          {notice && (
            <div className="alert alert-success mb-2" role="status">
              <span>✓</span>
              <span>{notice}</span>
            </div>
          )}

          <div className="page-content">{renderPage()}</div>

          <footer
            className="text-muted text-small text-center"
            style={{ padding: "28px 0 8px" }}
          >
            FarmConnect · Smart Farm-to-Buyer Marketplace · Prototype
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
