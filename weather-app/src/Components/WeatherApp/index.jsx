import React from 'react'
import './style.css'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faSearch } from '@fortawesome/free-solid-svg-icons';
import search_icon from '../Assets/search.png'
import clear_icon from '../Assets/clear.png'
import cloud_icon from '../Assets/cloud.png'
import drizzle_icon from '../Assets/drizzle.png'
import humidity_icon from '../Assets/humidity.png'
import rain_icon from '../Assets/rain.png'
import snow_icon from '../Assets/snow.png'
import  wind_icon from '../Assets/wind.png'


const index = () => {
    let api_key = "38930843f10c4fa62a388f78da650272"
    const search = async () =>{
        element = document.getElementsByClassName("cityInput")
        if(element[0].value===""){
            return 0
        }
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`
        let response = await fetch(url)
        let data = await response.json()
        let temperature = document.getElementsByClassName("weather-temp")
        let location = document.getElementsByClassName("weather-location")

        temperature[0].innerHTML= Math.round((data.main.temp));
        location[0].innerHTML = data.name;
    }
  return (
    <div className='container'>
      <div className='card'>
        <div className='card-body'>
          <div className='top'>
            <input type="text" className='cityInput' placeholder='Search City' />
            <div className='search-icon'onClick={()=>{search()}}>
                <img src={search_icon} />
            </div>
          </div>
          <div className='middle'>
            <h6 className='weather-temp'>13°C</h6>
            <span className='weather-location'>London</span>
          </div>
          <div className='bottom'>
            <div className='data'>
                    <span id='humidity' className='calc'>40 km/h</span>
                    <span className='calc'>40 km/h</span>
                    <span className='calc'>40 km/h</span>
            </div>
            <div className='weather-image'>
                <img src={cloud_icon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
