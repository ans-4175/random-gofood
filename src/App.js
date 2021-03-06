import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  WiredButton,
  WiredCard,
  WiredLink,
  WiredDialog,
  WiredRadioGroup,
  WiredRadio
} from 'wired-elements-react';
import { useCurrentPosition } from 'react-use-geolocation';
import useGoogleAnalytics from './libs/use-analytics';
import { sendEvent } from './libs/ga-analytics';

import { Wheel } from 'react-custom-roulette';

import { fetchRandom, fetchDetail } from './api/merchants';
import { pickNRandom } from './libs/common';

import './App.css';
import DetailMerchant from './components/DetailMerchant';

/**
 * TODO(imballinst): probably it'll be better if we can provide a typing that works
 * across the `random-gofood` and `random-gofood-api`. This typing is intended so that
 * devs don't have to "guess" the object data structure without looking another source.
 * @typedef {Object} Merchant
 * @property {string} id example: "2874043e-7595-40e3-af90-90c3012783a3".
 * @property {boolean} active example: true.
 * @property {string} is_open example: "OPEN".
 * @property {string} address example: "Jl. Amil No. 16, Pasar Minggu, Jakarta".
 * @property {string} phone_number example: "".
 * @property {number} price_level example: 2.
 * @property {string} name example: "SOTO AYAM NASI RAMES 84 AY, AHMAD HERMANTO".
 * @property {string} tag example: "SOTO_BAKSO_SOP,ANEKA_AYAM_BEBEK".
 * @property {number} distance_km example: 0.
 * @property {string} location example: "-6.2729465,106.8380703".
 * @property {number} eta_delivery_minutes example: 17.
 * @property {number} eta_cooking_minutes example: 8.
 */

function App() {
  useGoogleAnalytics();

  const [typeSelect, setTypeSelect] = useState('ALL');
  const [fetched, setFetched] = useState(false);
  /** @type [Merchant, Function] */
  const [pickedMerchant, setPickedMerchant] = useState({});
  const [detailMerchant, setDetailMerchant] = useState({});
  // eslint-disable-next-line
  const [pickedMenus, setPickedMenus] = useState([]);
  const [wheelData, setWheelData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [posData, posError] = useCurrentPosition();
  // const boxCard = useRef({});
  // This state is used in tandem with `pickedMerchant`.
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const {
    data: merchants,
    error,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery(
    ['merchants', 'posData'],
    () =>
      fetchRandom(
        posData.coords.latitude,
        posData.coords.longitude,
        typeSelect
      ),
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

  const handleCheckbox = (selected) => {
    sendEvent({
      category: 'interaction',
      action: `checkbox`,
      label: selected
    });
    setTypeSelect(selected);
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

    setPickedMerchant(pickedMerchant);
    setDetailMerchant(detailMerchant);
    setMustSpin(false);
    setFetched(true);
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
        <h1 className="app-title">Random GoFood Picker</h1>
        <h2 className="txt-notes">Near You (beta)</h2>
        <WiredRadioGroup
          selected={typeSelect}
          onselected={(e) => handleCheckbox(e.detail.selected)}
        >
          <WiredRadio className="txt-radio" name="ALL">
            Semua
          </WiredRadio>
          <WiredRadio className="txt-radio" name="FOOD">
            Makanan Berat
          </WiredRadio>
          <WiredRadio className="txt-radio" name="DRINK">
            Minuman
          </WiredRadio>
          <WiredRadio className="txt-radio" name="SNACK">
            Cemilan
          </WiredRadio>
          <WiredRadio className="txt-radio" name="COFFEE">
            Aneka Kopi
          </WiredRadio>
        </WiredRadioGroup>
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
                  <p className="txt-resto text-center">{pickedMerchant.name}</p>

                  <div className="text-center spacing-x-8">
                    <WiredLink
                      href={`https://www.google.com/maps/search/?api=1&query=${pickedMerchant.location}`}
                      target="_blank"
                      rel="noopener"
                      className="txt-cta"
                    >
                      Open in Map
                    </WiredLink>

                    <span>&bull;</span>

                    <WiredLink
                      href={detailMerchant.link}
                      target="_blank"
                      rel="noopener"
                      className="txt-cta"
                    >
                      Open in GoFood
                    </WiredLink>
                  </div>

                  <WiredButton
                    elevation={2}
                    onClick={() => setIsResultModalOpen(true)}
                  >
                    See restaurant detail
                  </WiredButton>
                </>
              )}

              <p className="foot-notes">&copy; @ans4175, @ajiballinst</p>
            </section>

            <WiredDialog open={isResultModalOpen}>
              {fetched && (
                <DetailMerchant
                  detailMerchant={detailMerchant}
                  pickedMerchant={pickedMerchant}
                  setIsResultModalOpen={setIsResultModalOpen}
                  isResultModalOpen={isResultModalOpen}
                  pickedMenus={pickedMenus}
                />
              )}
            </WiredDialog>
          </>
        )}
      </WiredCard>
    </main>
  );
}

export default App;
