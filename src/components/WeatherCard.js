import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import {ReactComponent as cogIcon} from './images/cog.svg'
import { ReactComponent as Loading } from "./images/loading.svg";
import WeatherIcon from './WeatherIcon'

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation:rotate linear 1.5s infinite;
    animation-duration:${({loading}) => loading === true ? '1.5s' : '0s'};
  }
  @keyframes rotate{
    from{
      transform:rotate(0deg);
    }
    to{
      transform:rotate(360deg);
    }
  }
`;
const Cog = styled(cogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;


const WeatherCard = ({moment, getData, nowWeather, cogTrigger, currentCity}) =>{

  const {
    observationTime,
    // locationName,
    description,
    weatherCode,
    temperature,
    windSpeed,
    comfortability,
    rainPossibility,
    isLoading
  } = nowWeather

  return(
    <WeatherCardWrapper>
      <Cog onClick={()=>{cogTrigger('weatherSetting')}}/>
      <Location>{currentCity}</Location>
      <Description>{description}{' - '}{comfortability}</Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)}<Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon 
          moment={moment||'day'}
          currentWeatherCode={weatherCode}
        />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed} m/h
      </AirFlow>
      <Rain>
        <RainIcon />
        {rainPossibility}%
      </Rain>
      <Refresh onClick={getData} loading={isLoading}>
        最後觀測時間:{Intl.DateTimeFormat('zh-TW',{hour:'numeric',minute:'numeric'}).format(new Date(observationTime))}
        { isLoading === true ? <Loading /> : <RefreshIcon /> }
      </Refresh>
    </WeatherCardWrapper>
  )
}

export default WeatherCard