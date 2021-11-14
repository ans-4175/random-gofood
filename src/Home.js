import React, { useState, useRef } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import { fetchRandom, fetchDetail } from './api/merchants';
// import { useParams } from 'react-router-dom';
import { sendEvent } from './libs/ga-analytics';
import { useCurrentPosition } from 'react-use-geolocation';

// error on esm import
// import { WiredButton } from 'wired-elements-react';

const { pickNRandom } = require('./libs/helpers');

function Home() {
  const [fetched, setFetched] = useState(false);
  const [pickedMerchant, setPickedMerchant] = useState({});
  const [pickedMenus, setPickedMenus] = useState([]);
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
    sendEvent({
      category: 'interaction',
      action: `button`,
      label: 'hit'
    });

    const randomMerchants = pickNRandom(merchants, 1);
    const pickedMerchant = randomMerchants[0];
    const detailMerchant = await fetchDetail(pickedMerchant.id);
    const randomMenu = pickNRandom(detailMerchant.menu, 3);
    
    setFetched(true);
    setPickedMerchant(detailMerchant);
    setPickedMenus(randomMenu);
  };

  return (
    <div className="container">
      <h3>Random GoFood Picker</h3>
      <h5>Near You</h5>
      {isLoading || (!posData && !posError) ? (
        <p>Loading...</p>
      ) : isError || posError ? (
        <p>Error: {isError ? error.message : posError.message}</p>
      ) : (
        <>
          {/* <WiredCard elevation={3} ref={boxCard}> */}
            <section>
              <button onClick={() => onButton()}>
                Show Me Food
              </button>
              { (fetched) && (
                <>
                  <p>{`"${pickedMerchant.name}"`}</p>
                  <p><a href={`https://maps.google.com/?q=${pickedMerchant.address}`} target="_blank">{`${pickedMerchant.address}`}</a></p>
                  <p><a href={pickedMerchant.link} target="_blank">Open in GoFood</a></p>
                  <span>--MENU--</span>
                  {pickedMenus.map((menu, key) =>
                    <div key={key}>
                      <p>{menu.name}</p>
                      <p>{menu.price}</p>
                    </div>
                  )}
                </>
              )}
            </section>
          {/* </WiredCard> */}
        </>
      )}
    </div>
  );
}

export default Home;
