import React, { useState } from 'react';
// import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import {
  WiredButton,
  WiredCard
} from 'wired-elements-react';
import { Wheel } from 'react-custom-roulette'
// import { sendEvent } from './libs/ga-analytics';
import { useCurrentPosition } from 'react-use-geolocation';

import { fetchRandom, fetchDetail } from './api/merchants';
import './App.css';

import { pickNRandom } from './libs/common';

const data = [
  { option: '0' },
  { option: '1' },
  { option: '2' },
  { option: '3' },
  { option: '4' },
  { option: '5' },
  { option: '6' },
  { option: '7' },
  { option: '8' },
  { option: '9' },
  { option: '10' },
  { option: '11' },
]

function App() {
  const [fetched, setFetched] = useState(false);
  const [pickedMerchant, setPickedMerchant] = useState({});
  const [pickedMenus, setPickedMenus] = useState([]);
  const [posData, posError] = useCurrentPosition();
  // const boxCard = useRef({});

  const {
    data: merchants,
    error,
    isLoading,
    isError,
    // refetch
  } = useQuery(['merchants', 'posData'], () => fetchRandom(posData.coords.latitude, posData.coords.longitude), {
    enabled: !!posData
  });

  const onButton = async () => {
    // sendEvent({
    //   category: 'interaction',
    //   action: `button`,
    //   label: 'hit'
    // });

    const randomMerchants = pickNRandom(merchants, 1);
    const pickedMerchant = randomMerchants[0];
    const detailMerchant = await fetchDetail(pickedMerchant.id);
    const randomMenu = pickNRandom(detailMerchant.menu, 3);

    setFetched(true);
    setPickedMerchant(detailMerchant);
    setPickedMenus(randomMenu);
  };

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
  }

  return (
    <main>
      <WiredCard elevation={3}>
        <h3>Random GoFood Picker</h3>
        <h5>Near You</h5>
        {isLoading || (!posData && !posError) ? (
          <p>Loading...</p>
        ) : isError || posError ? (
          <p>Error: {isError ? error.message : posError.message}</p>
        ) : (
          <section>
            <WiredButton elevation={2} onClick={() => onButton()}>Show Me Food</WiredButton>
            {fetched && (
              <>
                <p>{`"${pickedMerchant.name}"`}</p>
                <p>
                  <a href={`https://maps.google.com/?q=${pickedMerchant.address}`} target="_blank">
                    {`${pickedMerchant.address}`}
                  </a>
                </p>
                <p>
                  <a href={pickedMerchant.link} target="_blank">
                    Open in GoFood
                  </a>
                </p>
                <span>--MENU--</span>
                {pickedMenus.map((menu, key) => (
                  <div key={key}>
                    <p>{menu.name}</p>
                    <img alt={menu.name} src={menu.image} />
                    <p>{menu.price}</p>
                  </div>
                ))}
              </>
            )}
          </section>
        )}
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false)
          }}
        />
        <WiredButton elevation={2} onClick={handleSpinClick}>SPIN</WiredButton>
      </WiredCard>
    </main>
  );
}

export default App;