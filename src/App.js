import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { WiredButton, WiredCard, WiredLink } from 'wired-elements-react';
import { useCurrentPosition } from 'react-use-geolocation';
import useGoogleAnalytics from './libs/use-analytics';
import { sendEvent } from './libs/ga-analytics';

import { Wheel } from 'react-custom-roulette';

import { fetchRandom, fetchDetail } from './api/merchants';
import { pickNRandom } from './libs/common';
import './App.css';

function App() {
  useGoogleAnalytics();

  const [fetched, setFetched] = useState(false);
  const [pickedMerchant, setPickedMerchant] = useState({});
  // eslint-disable-next-line
  const [pickedMenus, setPickedMenus] = useState([]);
  const [wheelData, setWheelData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [posData, posError] = useCurrentPosition();
  // const boxCard = useRef({});

  const {
    data: merchants,
    error,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery(
    ['merchants', 'posData'],
    () => fetchRandom(posData.coords.latitude, posData.coords.longitude),
    {
      enabled: !!posData
    }
  );

  const handleSpinClick = () => {
    sendEvent({
      category: 'interaction',
      action: `button`,
      label: 'spin'
    });
    setFetched(false);
    const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const handleResetClick = () => {
    sendEvent({
      category: 'interaction',
      action: `button`,
      label: 'reset'
    });
    setFetched(false);
    setMustSpin(false);
    refetch();
  };

  const onFinishSpin = async () => {
    const includeName = wheelData[prizeNumber]['option'].substring(
      0,
      wheelData[prizeNumber]['option'].length - 3
    );
    const pickedMerchant = merchants.find((merch) =>
      merch.name.includes(includeName)
    );
    const detailMerchant = await fetchDetail(pickedMerchant.id);
    const randomMenu = pickNRandom(detailMerchant.menu, 3);

    setFetched(true);
    setMustSpin(false);
    setPickedMerchant(detailMerchant);
    setPickedMenus(randomMenu);
  };

  useEffect(() => {
    if (merchants) {
      const randomMerchants = pickNRandom(merchants, 10);
      const newWheelData = randomMerchants.map((merch) => {
        return {
          option: `${merch.name.substring(0, 25)}...`
        };
      });
      setWheelData(newWheelData);
    }
  }, [merchants]);

  return (
    <main>
      <WiredCard elevation={3}>
        <h3>Random GoFood Picker</h3>
        <h5 className='txt-notes'>Near You (beta)</h5>
        {!posData && !posError ? (
          <p>Getting browser's location...</p>
        ) : isFetching || isLoading ? (
          <p>Loading merchants data...</p>
        ) : isError || posError ? (
          <p>Error: {isError ? error.message : posError.message}</p>
        ) : (
          <>
            <section>
              {wheelData && (
                <>
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    outerBorderWidth={3}
                    fontSize={10}
                    radiusLineWidth={3}
                    data={wheelData}
                    onStopSpinning={onFinishSpin}
                  />
                  {mustSpin ? (
                    <p>Waiting to spin...</p>
                  ) : (
                    <>
                      <WiredButton elevation={2} onClick={handleSpinClick}>
                        SPIN
                      </WiredButton>
                      <WiredButton
                        className="btn-reset"
                        elevation={2}
                        onClick={handleResetClick}
                      >
                        RE-LOAD
                      </WiredButton>
                    </>
                  )}
                </>
              )}
            </section>
            <section>
              {fetched && (
                <>
                  <p className='txt-resto'>{`"${pickedMerchant.name}"`}</p>
                  <WiredLink
                    href={`https://www.google.com/maps/search/?api=1&query=${pickedMerchant.location}`}
                    target="_blank"
                    rel="noopener"
                    className='txt-cta'
                  >
                    Open in Map
                  </WiredLink>
                  <br />
                  <WiredLink
                    href={pickedMerchant.link}
                    target="_blank"
                    rel="noopener"
                    className='txt-cta'
                  >
                    Open in GoFood
                  </WiredLink>
                  {/* <span>--MENU--</span>
              {pickedMenus.map((menu, key) => (
                <div key={key}>
                  <p>{menu.name}</p>
                  <img alt={menu.name} src={menu.image} />
                  <p>{menu.price}</p>
                </div>
              ))} */}
                </>
              )}
              <p className='foot-notes'>&copy; @ans4175</p>
            </section>
          </>
        )}
      </WiredCard>
    </main>
  );
}

export default App;
