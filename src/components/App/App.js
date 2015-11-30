/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import styles from './App.scss';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';
import {GoogleMap, Polyline} from 'react-google-maps';
import masonryComponent from 'react-masonry-component';

const Masonry = masonryComponent(React);

import nmea from 'nmea-0183';

import feathers from 'feathers-client';


const app = feathers().configure(feathers.primus({
  transformer: 'sockjs',
  pathname: '/primus',
}));

const locationService = app.service('location');

import AUX from './AUX';
nmea.addParser(new AUX.Decoder('CPAUX'));

import HDT from './HDT';
nmea.addParser(new HDT.Decoder('CPHDT'));

import ROT from './ROT';
nmea.addParser(new ROT.Decoder('CPROT'));

const values = [
  '$GPGGA,022432.00,3645.02246,S,17441.90339,E,1,07,1.43,14.6,M,28.4,M,,*79',
  '$CPHDT,270.0,T*34',
  '$CPROT,-0.4,A*1C',
  '$GPVTG,,T,,M,0.205,N,0.380,K,A*2F',
  '$GPGGA,022433.00,3645.02225,S,17441.90360,E,1,07,1.43,15.1,M,28.4,M,,*77',
  '$CPHDT,270.0,T*34',
  '$CPROT,0.3,A*36',
  '$GPVTG,,T,,M,0.223,N,0.413,K,A*26',
  '$GPGGA,022434.00,3645.02204,S,17441.90370,E,1,05,1.75,15.2,M,28.4,M,,*76',
  '$CPHDT,270.0,T*34',
  '$CPROT,0.5,A*30',
  '$GPVTG,,T,,M,0.166,N,0.308,K,A*29',
  '$GPGGA,022435.00,3645.02200,S,17441.90381,E,1,06,1.43,15.6,M,28.4,M,,*7F',
  '$CPHDT,270.0,T*34',
  '$CPROT,0.6,A*33',
  '$GPVTG,,T,,M,0.204,N,0.379,K,A*28',
  '$GPGGA,022436.00,3645.02199,S,17441.90393,E,1,06,1.43,15.9,M,28.4,M,,*73',
  '$CPHDT,270.0,T*34',
  '$CPROT,0.5,A*30',
  '$GPVTG,,T,,M,0.474,N,0.878,K,A*23',
  '$GPGGA,022437.00,3645.02224,S,17441.90403,E,1,06,1.43,16.3,M,28.4,M,,*70',
  '$CPAUX,BAT,89,8.1975*39',
  '$CPHDT,270.0,T*34',
  '$CPROT,0.5,A*30',
  '$GPVTG,,T,,M,0.643,N,1.192,K,A*29',
  '$GPGGA,022438.00,3645.02245,S,17441.90414,E,1,06,1.43,16.7,M,28.4,M,,*7A',
  '$CPHDT,270.0,T*34',
  '$CPROT,0.3,A*36',
  '$GPVTG,,T,,M,0.359,N,0.665,K,A*29',
  '$GPGGA,022439.00,3645.02226,S,17441.90425,E,1,06,1.43,17.2,M,28.4,M,,*78',
];

const parsed = {};

values.forEach(value => {
  const parsedVal = nmea.parse(value);
  if (!parsed[parsedVal.id]) {
    parsed[parsedVal.id] = [];
  }
  parsed[parsedVal.id].push(parsedVal);
});


@withContext
@withStyles(styles)
class App extends Component {

  componentWillMount() {
    locationService.find({}).then(function(value) {
      console.log(value);
    }).catch(function(err) {
      debugger;
    });
  }


  render() {
    const defaultPos = {
      lat: parseFloat(parsed.GPGGA[0].latitude, 10),
      lng: parseFloat(parsed.GPGGA[0].longitude, 10),
    };
    const path = parsed.GPGGA.map(gga => {
      return {
        lat: parseFloat(gga.latitude, 10),
        lng: parseFloat(gga.longitude, 10),
      };
    });
    const cardCss = 'card';
    return (<Masonry className="container">
      <div className="card-wrapper" ><div className="log card">
        <ul>{(values.map(message => {
          return <li>{message}</li>;
        }))}</ul>
    </div></div>
      <div className="card-wrapper" ><div className={'mapwrapper ' + cardCss }>
      <GoogleMap
        containerProps={{
          style: {
            height: '100%',
          },
        }}
        defaultZoom={19}
        defaultCenter={defaultPos}>
        <Polyline
          path={path}
          geodesic
          strokeColor={'#FF0000'}
          strokeOpacity={1.0}
          strokeWeight={2}
        />
      </GoogleMap>
    </div></div>
    <div className="card-wrapper" >
      <div className={cardCss}>
        <ul>
          <li>Battery: {parsed.CPAUX[0].battery}%</li>
          <li>ROT: {parsed.CPROT[0].rot}</li>
          <li>Heading: {parsed.CPROT[0].heading}</li>
          <li>course: {parsed.GPVTG[0].course}</li>
          <li>knots: {parsed.GPVTG[0].knots}</li>
          <li>kph: {parsed.GPVTG[0].kph}</li>
        </ul>
      </div>
    </div>
  </Masonry>);
  }

}

export default App;
