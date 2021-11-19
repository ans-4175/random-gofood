import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  WiredButton,
  WiredCard,
  WiredLink,
  WiredDialog,
  WiredRadioGroup,
  WiredRadio,
  WiredTabs,
  WiredTab
} from 'wired-elements-react';
import { useCurrentPosition } from 'react-use-geolocation';
import useGoogleAnalytics from './libs/use-analytics';
import { sendEvent } from './libs/ga-analytics';

import { fetchRandom, fetchDetail } from './api/merchants';
import { pickNRandom } from './libs/common';

import { Wheel } from 'react-custom-roulette';

import './App.css';
import DetailMerchant from './components/DetailMerchant';
import TextBlinkRandomizer from './components/TextBlinkRandomizer';

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

  const [posData, posError] = useCurrentPosition();
  const [typeSelect, setTypeSelect] = useState('ALL');
  const [randomizerMode, setRandomizerMode] = useState('wheel');

  // `undefined` states mean not picked yet.
  // When it is defined, then it means these 2 states have been picked/fetched.
  /** @type [Merchant | undefined, Function] */
  const [pickedMerchant, setPickedMerchant] = useState(undefined);
  const [detailMerchant, setDetailMerchant] = useState(undefined);

  // States required for randomizers.
  const [optionsList, setOptionsList] = useState(undefined);
  const [mustStartRandomizing, setMustStartRandomizing] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  // We want to fetch the merchant when we are randomizing.
  // This will ensure that the result appear immediately after the wheel
  // finished spinning or text finished randomizing. After all,
  // we get the "prize number" at the start.
  const [isMerchantDetailShown, setIsMerchantDetailShown] = useState(false);
  const [pickedMenus, setPickedMenus] = useState([]);
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

  const handleSpinClick = async () => {
    sendEvent({
      category: 'interaction',
      action: `button`,
      label: 'spin'
    });

    const newPrizeNumber = Math.floor(Math.random() * optionsList.length);
    const includeName = optionsList[prizeNumber]['option'].substring(
      0,
      optionsList[prizeNumber]['option'].length - 3
    );
    const pickedMerchant = merchants.find((merch) =>
      merch.name.includes(includeName)
    );

    // Set the prize number and picked merchant, then start randomizing.
    setPrizeNumber(newPrizeNumber);
    setPickedMerchant(pickedMerchant);
    setDetailMerchant(undefined);
    setMustStartRandomizing(true);

    // In the meantime, we fetch the picked merchant so that when
    // the randomizer finishes, it can immediately appear.
    const detailMerchant = await fetchDetail(pickedMerchant.id);
    const randomMenu = pickNRandom(detailMerchant.menu, 3);
    setDetailMerchant(detailMerchant);
    setPickedMenus(randomMenu);
  };

  const resetStates = () => {
    setPickedMerchant(undefined);
    setDetailMerchant(undefined);
    setIsMerchantDetailShown(false);
    setMustStartRandomizing(false);
    refetch();
  };

  const onChangeTab = (newTab) => {
    setPickedMerchant(undefined);
    setDetailMerchant(undefined);
    setIsMerchantDetailShown(false);
    setMustStartRandomizing(false);
    setRandomizerMode(newTab);
  };

  const handleResetClick = () => {
    sendEvent({
      category: 'interaction',
      action: `button`,
      label: 'reset'
    });
    resetStates();
  };

  const handleCheckbox = (selected) => {
    sendEvent({
      category: 'interaction',
      action: `checkbox`,
      label: selected
    });
    setTypeSelect(selected);
    resetStates();
  };

  const onFinishRandomizing = useCallback(() => {
    setIsMerchantDetailShown(true);
    setMustStartRandomizing(false);
  }, []);

  useEffect(() => {
    if (merchants) {
      const randomMerchants = pickNRandom(merchants, 10);
      const newWheelData = randomMerchants.map((merch) => {
        return {
          option: `${merch.name.substring(0, 25)}...`
        };
      });
      setOptionsList(newWheelData);
    }
  }, [merchants]);

  const randomizeText = randomizerMode === 'wheel' ? 'Spin' : 'Randomize';

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
        ) : isFetching || isLoading || optionsList === undefined ? (
          <p>Loading merchants data...</p>
        ) : isError || posError ? (
          <p>Error: {isError ? error.message : posError.message}</p>
        ) : (
          <>
            <section>
              <WiredTabs
                selected={randomizerMode}
                onselected={(e) => onChangeTab(e.detail.selected)}
              >
                <WiredTab name="wheel" hasBorder={false}>
                  <Wheel
                    mustStartSpinning={
                      randomizerMode === 'wheel' && mustStartRandomizing
                    }
                    prizeNumber={prizeNumber}
                    outerBorderWidth={3}
                    fontSize={10}
                    radiusLineWidth={3}
                    data={optionsList}
                    onStopSpinning={onFinishRandomizing}
                  />
                </WiredTab>
                <WiredTab name="text" hasBorder={false}>
                  <TextBlinkRandomizer
                    onFinishRandomizing={onFinishRandomizing}
                    mustStartRandomizing={
                      randomizerMode === 'text' && mustStartRandomizing
                    }
                    pickedMerchant={pickedMerchant}
                    optionsList={optionsList}
                  />
                </WiredTab>
              </WiredTabs>

              {mustStartRandomizing ? (
                <p>Waiting to {randomizeText}...</p>
              ) : (
                <div>
                  <WiredButton elevation={2} onClick={handleSpinClick}>
                    {randomizeText}
                  </WiredButton>
                  <WiredButton
                    className="btn-reset"
                    elevation={2}
                    onClick={handleResetClick}
                  >
                    RE-LOAD
                  </WiredButton>
                </div>
              )}
            </section>
            <section>
              {detailMerchant !== undefined &&
                pickedMerchant !== undefined &&
                isMerchantDetailShown && (
                  <>
                    <h2 className="txt-resto text-center">
                      {pickedMerchant.name}
                    </h2>

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
              {detailMerchant !== undefined && pickedMerchant !== undefined && (
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
