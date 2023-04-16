import { useState } from "react";
import moment from "moment";

import { db } from "./utils/firebase";
import { CircularProgress } from "@mui/material";
import {
  ref,
  query,
  push,
  equalTo,
  onValue,
  orderByChild,
} from "firebase/database";

import WeatherForecast from "./components/WeatherForecast";

const App = () => {
  const [city, setCity] = useState("");
  const [cityTouched, setCityTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [todaysWeather, setTodaysWeather] = useState([]);
  const [yesterdaysWeather, setYesterdaysWeather] = useState([]);
  const [yesterdaysDataAvailable, setYesterdaysDataAvailable] = useState(false);
  const [error, setError] = useState("");

  const cityIsValid = city.trim() !== "";

  const todaysDateString = new Date().toLocaleDateString("en-IN");

  const cityOnChangeHandler = (event) => {
    setCity(event.target.value);
  };

  const cityBlurHandler = () => {
    setCityTouched(true);
  };

  const fetchTodaysWeather = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let res = await Promise.all([
        fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=20481b6d927548b8af6144912231104&q=${city}&aqi=no`
        ),
        fetch(`https://api.api-ninjas.com/v1/weather?city=${city}`, {
          // mode: 'no-cors',
          headers: {
            "X-API-Key": "d6RZddtKSSJGZGGX9ber9Q==IyYYd543C4mNkvvw",
          },
        }),
        fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=ZE5GMW6D8GXZ5ARNP7ZN546FU&contentType=json`
        ),
      ]);

      if (!res[0].ok || !res[1].ok || !res[2].ok) {
        throw new Error("Something went wrong!");
      }

      let resJson = await Promise.all(res.map((e) => e.json()));

      setTodaysWeather({
        weather_api_max_temp: resJson[0].forecast.forecastday[0].day.maxtemp_c,
        weather_api_min_temp: resJson[0].forecast.forecastday[0].day.mintemp_c,
        weather_api_humidity:
          resJson[0].forecast.forecastday[0].day.avghumidity,
        weather_api_sunrise: resJson[0].forecast.forecastday[0].astro.sunrise,
        weather_api_sunset: resJson[0].forecast.forecastday[0].astro.sunset,
        api_ninjas_api_max_temp: resJson[1].max_temp,
        api_ninjas_api_min_temp: resJson[1].min_temp,
        api_ninjas_api_humidity: resJson[1].humidity,
        api_ninjas_api_sunrise: moment(
          new Date(resJson[1].sunrise * 1000)
        ).format("LT"),
        api_ninjas_api_sunset: moment(
          new Date(resJson[1].sunset * 1000)
        ).format("LT"),
        visual_crossing_api_max_temp: resJson[2].days[0].tempmax,
        visual_crossing_api_min_temp: resJson[2].days[0].tempmin,
        visual_crossing_api_humidity: resJson[2].days[0].humidity,
        visual_crossing_api_sunrise: moment(
          new Date(resJson[2].days[0].sunriseEpoch * 1000)
        ).format("LT"),
        visual_crossing_api_sunset: moment(
          new Date(resJson[2].days[0].sunsetEpoch * 1000)
        ).format("LT"),
      });

      push(ref(db, "weather/"), {
        added_on_reference: todaysDateString + city.toLocaleLowerCase(),
        city: city,
        weather_api_max_temp: resJson[0].forecast.forecastday[0].day.maxtemp_c,
        weather_api_min_temp: resJson[0].forecast.forecastday[0].day.mintemp_c,
        weather_api_humidity:
          resJson[0].forecast.forecastday[0].day.avghumidity,
        weather_api_sunrise: resJson[0].forecast.forecastday[0].astro.sunrise,
        weather_api_sunset: resJson[0].forecast.forecastday[0].astro.sunset,
        api_ninjas_api_max_temp: resJson[1].max_temp,
        api_ninjas_api_min_temp: resJson[1].min_temp,
        api_ninjas_api_humidity: resJson[1].humidity,
        api_ninjas_api_sunrise: moment(
          new Date(resJson[1].sunrise * 1000)
        ).format("LT"),
        api_ninjas_api_sunset: moment(
          new Date(resJson[1].sunset * 1000)
        ).format("LT"),
        visual_crossing_api_max_temp: resJson[2].days[0].tempmax,
        visual_crossing_api_min_temp: resJson[2].days[0].tempmin,
        visual_crossing_api_humidity: resJson[2].days[0].humidity,
        visual_crossing_api_sunrise: moment(
          new Date(resJson[2].days[0].sunriseEpoch * 1000)
        ).format("LT"),
        visual_crossing_api_sunset: moment(
          new Date(resJson[2].days[0].sunsetEpoch * 1000)
        ).format("LT"),
      }).catch((error) => console.log(error.message));
    } catch (error) {
      setError(error.message);
    }
    setDataFetched(true);
    setIsLoading(false);
  };

  const getYesterdaysWeather = () => {
    setIsLoading(true);
    const splitTodaysDate = todaysDateString.split("/");
    const currentDate = splitTodaysDate[0];
    const currentMonth = splitTodaysDate[1];
    const currentYear = splitTodaysDate[2];

    const yesterdaysDateString = `${
      parseInt(currentDate) - 1
    }/${currentMonth}/${currentYear}`;
    const yesterdaysDateAddOnReference =
      yesterdaysDateString + city.toLocaleLowerCase();

    const yesterdaysWeatherRef = query(
      ref(db, "weather"),
      orderByChild("added_on_reference"),
      equalTo(yesterdaysDateAddOnReference)
    );

    return onValue(yesterdaysWeatherRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        Object.values(data).map((weatherInfo) => {
          setYesterdaysWeather(weatherInfo);
          setYesterdaysDataAvailable(true);
          setDataFetched(true);
        });
      } else {
        setYesterdaysDataAvailable(false);
      }
      setIsLoading(false);
    });
  };

  const getTodaysWeather = () => {
    setIsLoading(true);
    
    const addOnReference = todaysDateString + city.toLocaleLowerCase();
    const weatherRef = query(
      ref(db, "weather"),
      orderByChild("added_on_reference"),
      equalTo(addOnReference)
    );

    return onValue(weatherRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        Object.values(data).map((weatherInfo) => {
          setTodaysWeather(weatherInfo);
          setDataFetched(true);
          getYesterdaysWeather();
        });
      } else {
        fetchTodaysWeather();
      }

      setIsLoading(false);
    });
  };

  const getWeatherHandler = (event) => {
    event.preventDefault();

    if (cityTouched && !cityIsValid) {
      return;
    }
    getTodaysWeather();
  };

  const cityInputClasses = !cityIsValid
    ? "form-control invalid"
    : "form-control";

  return (
    <div className="app">
      <h1>Weather App</h1>
      <section className="form-section">
        <form onSubmit={getWeatherHandler}>
          <div className="control-group">
            <div className={cityInputClasses}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                onChange={cityOnChangeHandler}
                onBlur={cityBlurHandler}
                value={city}
              />
              {!cityIsValid && <p className="error-text">City is required</p>}
              <div className="form-actions">
                <button type="submit" disabled={!cityIsValid}>
                  Get the weather
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
      {isLoading && !error && (
        <section className="loading-icon">
          <CircularProgress />
        </section>
      )}
      {!isLoading && error && <section>{error}</section>}
      {!isLoading && !error && dataFetched && (
        <section className="weather-info">
          <WeatherForecast
            yesterdaysDataAvailable={yesterdaysDataAvailable}
            title="Today"
            weather_api_min_temp={todaysWeather.weather_api_min_temp}
            weather_api_max_temp={todaysWeather.weather_api_max_temp}
            weather_api_humidity={todaysWeather.weather_api_humidity}
            weather_api_sunrise={todaysWeather.weather_api_sunrise}
            weather_api_sunset={todaysWeather.weather_api_sunset}
            api_ninjas_api_min_temp={todaysWeather.api_ninjas_api_min_temp}
            api_ninjas_api_max_temp={todaysWeather.api_ninjas_api_max_temp}
            api_ninjas_api_humidity={todaysWeather.api_ninjas_api_humidity}
            api_ninjas_api_sunrise={todaysWeather.api_ninjas_api_sunrise}
            api_ninjas_api_sunset={todaysWeather.api_ninjas_api_sunset}
            visual_crossing_api_min_temp={
              todaysWeather.visual_crossing_api_min_temp
            }
            visual_crossing_api_max_temp={
              todaysWeather.visual_crossing_api_max_temp
            }
            visual_crossing_api_humidity={
              todaysWeather.visual_crossing_api_humidity
            }
            visual_crossing_api_sunrise={
              todaysWeather.visual_crossing_api_sunrise
            }
            visual_crossing_api_sunset={
              todaysWeather.visual_crossing_api_sunset
            }
          />

          {yesterdaysDataAvailable && (
            <WeatherForecast
              yesterdaysDataAvailable={yesterdaysDataAvailable}
              title="Yesterday"
              weather_api_min_temp={yesterdaysWeather.weather_api_min_temp}
              weather_api_max_temp={yesterdaysWeather.weather_api_max_temp}
              weather_api_humidity={yesterdaysWeather.weather_api_humidity}
              weather_api_sunrise={yesterdaysWeather.weather_api_sunrise}
              weather_api_sunset={yesterdaysWeather.weather_api_sunset}
              api_ninjas_api_min_temp={
                yesterdaysWeather.api_ninjas_api_min_temp
              }
              api_ninjas_api_max_temp={
                yesterdaysWeather.api_ninjas_api_max_temp
              }
              api_ninjas_api_humidity={
                yesterdaysWeather.api_ninjas_api_humidity
              }
              api_ninjas_api_sunrise={yesterdaysWeather.api_ninjas_api_sunrise}
              api_ninjas_api_sunset={yesterdaysWeather.api_ninjas_api_sunset}
              visual_crossing_api_min_temp={
                yesterdaysWeather.visual_crossing_api_min_temp
              }
              visual_crossing_api_max_temp={
                yesterdaysWeather.visual_crossing_api_max_temp
              }
              visual_crossing_api_humidity={
                yesterdaysWeather.visual_crossing_api_humidity
              }
              visual_crossing_api_sunrise={
                yesterdaysWeather.visual_crossing_api_sunrise
              }
              visual_crossing_api_sunset={
                yesterdaysWeather.visual_crossing_api_sunset
              }
            />
          )}
        </section>
      )}
      <section className="footer">
        &#169; 2023 Ameet Swamy. Made with &#x2665; in India.
      </section>
    </div>
  );
};

export default App;
