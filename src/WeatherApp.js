import React, {useState, useEffect} from 'react'
import styled from '@emotion/styled'
import WeatherCard from './WeatherCard'
import { ThemeProvider } from "@emotion/react";
import useWeatherApi from "./useWeatherApi";
import WeatherSetting from "./WeatherSetting";
import { findLocation } from "./utils";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc"
  }
};

const Container = styled.div`
  background-color: ${({theme}) => theme.backgroundColor};
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;



const WeatherApp = () => {
  const [fetchData, currentWeather, moment, currentCity, setCurrentCity] = useWeatherApi()
  const findLocationCity = findLocation(currentCity)
  const [currentPage, setCurrentPage] = useState('weatherCard')
  const [nowTheme, setNowTheme] = useState('light')

  useEffect(() => {
    setNowTheme( moment === 'day' ? 'light' : 'dark')
    localStorage.setItem('new',currentCity)
  }, [moment,currentCity])


  return(
    <ThemeProvider theme={theme[nowTheme]}>
      <Container>
        {currentPage === 'weatherCard' && (
          <WeatherCard 
            currentCity={findLocationCity.cityName}
            moment={moment}
            getData={fetchData}
            nowWeather={currentWeather}
            cogTrigger={setCurrentPage}
          />
        )}
        {currentPage === 'weatherSetting' && (
          <WeatherSetting 
            cogTrigger={setCurrentPage}
            currentCity={findLocationCity.cityName}
            setCurrentCity={setCurrentCity}
          />
        )}
        
      </Container>
    </ThemeProvider>
  )
}

export default WeatherApp