import { Wheel } from 'react-custom-roulette';

export default function WheelRandomizer({
  onFinishRandomizing,
  mustStartRandomizing,
  prizeNumber,
  optionsList,
  children
}) {
  return (
    <>
      <Wheel
        mustStartSpinning={mustStartRandomizing}
        prizeNumber={prizeNumber}
        outerBorderWidth={3}
        fontSize={10}
        radiusLineWidth={3}
        data={optionsList}
        onStopSpinning={onFinishRandomizing}
      />

      {children}
    </>
  );
}
