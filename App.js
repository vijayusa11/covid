import { Avatar, Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import 'leaflet/dist/leaflet.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Login from './Login';
import {useDispatch} from 'react-redux';
import { logout } from './features/userSlice';

function App() {
  const [user, loading] = useAuthState(auth);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("WorldWide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
 
  const dispatch = useDispatch();
  var Spinner = require('react-spinkit');
  const signOut = () => {
    auth.signOut().then(() => {
        dispatch(logout())
    })
  }

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {    
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then(response => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      })
    };
    getCountriesData();
  },[])
  console.log('COUNTRIES-INFO', countries);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log('hey', countryCode);
    setCountry(countryCode);
    // https://disease.sh/v3/covid-19/countries
    // https://disease.sh/v3/covid-19/all
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.lng]);
      setMapZoom(4);
    });
  };
  console.log("INFO", countryInfo);
    
  if (loading) {
    return (
    <AppLoading>
      <AppLoadingContents>
        <img src='https://logos.textgiraffe.com/logos/logo-name/Sarita-designstyle-popstar-m.png' alt='Vijay Choudhary' />
        <Spinner name='ball-spin-fade-loader' color='purple' fadeIn='none' />
      </AppLoadingContents>
    </AppLoading>
  );
}

  return (
        <>
         {!user ? (
        <Login />
      ) :
    (
    <div className="app">
    <div className='app__left'>
    <div className='app__header'>
      <h1>Covid-19 Tracker</h1>
      <FormControl className='app__dropdown'>
        <Select Variant='outlined' value={country} onChange={onCountryChange}>
            <MenuItem value={country}>{country}</MenuItem>
            {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <h5>{user?.displayName}</h5>
      <Avatar className='header__avatar' onClick={signOut} src={user?.photoURL} style={{ cursor: 'pointer' }}/>
    </div>
    <div className='app__stats'>
      <InfoBox isRed active={casesType==='cases'} onClick={(e) => setCasesType('cases')} title='Cases' cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
      <InfoBox active={casesType==='recovered'} onClick={(e) => setCasesType('recovered')} title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
      <InfoBox isRed active={casesType==='deaths'} onClick={(e) => setCasesType('deaths')} title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
    </div>
    <Map 
      casesType = {casesType}
      countries = {mapCountries}
      center = {mapCenter}
      zoom = {mapZoom}
    />
    </div>
  <Card className='app__right'>
    <CardContent>
      <h3>Live Cases by Country</h3>
      <Table countries={tableData}/>
      <h3>Worldwide New {casesType}</h3>
      <LineGraph casesType={casesType}/>
      {/* Graph */}
    </CardContent>
  </Card>
</div>
    )}
</>
  )
}
export default App;

const AppLoading = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100%;
`;

const AppLoadingContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  > img {
    height: 200px;
    padding: 20px;
    object-fit: contain;
  }
`;