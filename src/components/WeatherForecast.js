const WeatherForecast = (props) => {
    return (
        <span className="weather-info__data">
            {props.yesterdaysDataAvailable && <h4>{props.title}</h4>}
            <ul>
              <li>
                <b>Min. Temp.:</b> {props.weather_api_min_temp} C
              </li>
              <li>
                <b>Max. Temp.:</b> {props.weather_api_max_temp} C
              </li>
              <li>
                <b>Humidity:</b> {props.weather_api_humidity} %
              </li>
              <li>
                <b>Sunrise:</b> {props.weather_api_sunrise}
              </li>
              <li>
                <b>Sunset:</b> {props.weather_api_sunset}
              </li>
              <li>
                <span className="footer-source">Source: Weather API</span>
              </li>
              <li>
                <b>Min. Temp.:</b> {props.api_ninjas_api_min_temp} C
              </li>
              <li>
                <b>Max. Temp.:</b> {props.api_ninjas_api_max_temp} C
              </li>
              <li>
                <b>Humidity:</b> {props.api_ninjas_api_humidity} %
              </li>
              <li>
                <b>Sunrise:</b> {props.api_ninjas_api_sunrise}
              </li>
              <li>
                <b>Sunset:</b> {props.api_ninjas_api_sunset}
              </li>
              <li>
                <span className="footer-source">Source: API Ninjas</span>
              </li>
              <li>
                <b>Min. Temp.:</b> {props.visual_crossing_api_min_temp}{" "}
                C
              </li>
              <li>
                <b>Max. Temp.:</b> {props.visual_crossing_api_max_temp}{" "}
                C
              </li>
              <li>
                <b>Humidity:</b> {props.visual_crossing_api_humidity} %
              </li>
              <li>
                <b>Sunrise:</b> {props.visual_crossing_api_sunrise}
              </li>
              <li>
                <b>Sunset:</b> {props.visual_crossing_api_sunset}
              </li>
              <li>
                <span className="footer-source">Source: Visual Crossing</span>
              </li>
            </ul>
          </span>
    )
};

export default WeatherForecast;