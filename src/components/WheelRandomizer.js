import { Wheel } from 'react-custom-roulette';
import { WiredButton } from 'wired-elements-react';

export default function WheelRandomizer({
  onFinishRandomizing,
  mustStartRandomizing,
  prizeNumber,
  merchantsList,
  onStartRandomizing,
  onReloadMerchantsList
}) {
  if (merchantsList === undefined) {
    return null;
  }

  return (
    <>
      <Wheel
        mustStartSpinning={mustStartRandomizing}
        prizeNumber={prizeNumber}
        outerBorderWidth={3}
        fontSize={10}
        radiusLineWidth={3}
        data={merchantsList}
        onStopSpinning={onFinishRandomizing}
      />
      {mustStartRandomizing ? (
        <p>Waiting to spin...</p>
      ) : (
        <>
          <WiredButton elevation={2} onClick={onStartRandomizing}>
            SPIN
          </WiredButton>
          <WiredButton
            className="btn-reset"
            elevation={2}
            onClick={onReloadMerchantsList}
          >
            RE-LOAD
          </WiredButton>
        </>
      )}
    </>
  );
}
