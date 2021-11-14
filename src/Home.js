import React, { useState, useRef } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import { fetchRandom, fetchDetail } from './api/merchants';
// import { useParams } from 'react-router-dom';
import { sendEvent } from './libs/ga-analytics';
import { useCurrentPosition } from 'react-use-geolocation';

// error on esm import
import { WiredButton, WiredCard } from 'wired-elements-react';
// const { WiredButton, WiredCard } = require('wired-elements-react');

const { pickNRandom } = require('./libs/helpers');

function Home() {
  // const [lastDirection, setLastDirection] = useState('');
  const [posData, posError] = useCurrentPosition();
  const boxCard = useRef({});

  const {
    data: merchants,
    error,
    isLoading,
    isError,
    isFetching,
    refetch
  } = useQuery(['merchants', 'posData'], () => fetchRandom(posData.coords.latitude, posData.coords.longitude), {
    enabled: !!posData
  });

  const onButton = async () => {
    const randomWheel = pickNRandom(merchants, 1);
    const pickedMerchant = randomWheel[0];
    const detailMerchant = await fetchDetail(pickedMerchant.id);
    console.log(detailMerchant);

    sendEvent({
      category: 'interaction',
      action: `button`,
      label: 'hit'
    });
  };

  return (
    <div>
      {isLoading || (!posData && !posError) ? (
        <p>Loading...</p>
      ) : isError || posError ? (
        <p>Error: {isError ? error.message : posError.message}</p>
      ) : (
        <>
          {/* <WiredCard elevation={3} ref={boxCard}> */}
            <section>
              <WiredButton elevation={2} onClick={() => onButton()}>
                Click Me
              </WiredButton>
            </section>
            <div>
              <p>Latitude: {posData.coords.latitude}</p>
              <p>Longitude: {posData.coords.longitude}</p>
            </div>
          {/* </WiredCard> */}
        </>
      )}
    </div>
  );
}

export default Home;
