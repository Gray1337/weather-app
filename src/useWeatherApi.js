import {useState,useEffect, useCallback, useMemo} from 'react'
import sunriseAndSunsetData from './sunrise-sunset.json'
import { findLocation } from "./utils";

const fetchCurrentWeather = (local) =>{
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-015A44DA-F3CC-41AB-AF5C-13D9AECB6EB9&locationName=${local}`)
    .then(response=>response.json())
    .then(data=>{
      console.log('現在天氣',data)
      const locationData = data.records.location[0]
      const weatherElements = locationData.weatherElement.reduce(
        (neededData, item)=>{
          if(['WDSD','TEMP','HUMD'].includes(item.elementName)){
            neededData[item.elementName] = item.elementValue
          }
          return neededData
        },{})
      return{
        observationTime: locationData.time.obsTime,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
        locationName:locationData.locationName,
      }
    })
}
const fetchForcastWeather = (local) =>{
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-015A44DA-F3CC-41AB-AF5C-13D9AECB6EB9&locationName=${local}`)
  .then(res=>res.json())
  .then(data=>{
    console.log('預測天氣',data)
    const locationData = data.records.location[0]
    const weatherElements = locationData.weatherElement.reduce(
      (neededData,item)=>{
        if(['Wx','PoP','CI'].includes(item.elementName)){
          neededData[item.elementName] = item.time[0].parameter
        }
        return neededData
      }
    ,{})
    return{
      description: weatherElements.Wx.parameterName,
      weatherCode:weatherElements.Wx.parameterValue,
      rainPossibility:weatherElements.PoP.parameterName,
      comfortability:weatherElements.CI.parameterName,
    }
  })
}
const getMoment =(locationName)=>{
  const location = sunriseAndSunsetData.find(
    data => data.locationName === locationName)
  if(!location)return null

  const now = new Date()
  const nowDate = Intl.DateTimeFormat('zh-TW',{
    year:'numeric',
    month:'2-digit',
    day:'2-digit'
  }).format(now).replace(/\//g,'-')
  const date = location.time.find( time => time.dataTime === nowDate )

  const sunriseStamp = new Date(`${date.dataTime} ${date.sunrise}`).getTime()
  const sunsetStamp = new Date(`${date.dataTime} ${date.sunset}`).getTime()
  const nowStamp = now.getTime()

  return sunriseStamp <= nowStamp && nowStamp <= sunsetStamp ? 'day' : 'night'
}

const useWeatherApi = () =>{
  // useState
  const [currentWeather, setCurrentWeather] = useState({
    observationTime: new Date(),
    // locationName: '',
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: '',
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
    isLoading:true,
  });
  // useState
  const storageCity = localStorage.getItem('new')
  const [currentCity, setCurrentCity] = useState(storageCity||'臺中市')
  const locationCity = findLocation(currentCity)
  // useCallback 儲存非同步func
  const {cityName, locationName} = locationCity
  const fetchData = useCallback(()=>{
    const memorizedCallback = async() =>{
      const [dataOne,dataTwo] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchForcastWeather(cityName)
      ])
      setCurrentWeather({
        ...dataOne,
        ...dataTwo,
        isLoading:false
      })
    }
    setCurrentWeather(prevState=>({
      ...prevState,
      isLoading:true
    }))
    memorizedCallback()
  },[locationName,cityName])
  // useMemo 儲存計算func
  const moment = useMemo(() => getMoment(locationCity.sunriseCityName), [locationCity.sunriseCityName])
  // useEffect
  useEffect(() => {
    fetchData()
  }, [fetchData])
  


  return [fetchData, currentWeather, moment, currentCity, setCurrentCity]
}

export default useWeatherApi