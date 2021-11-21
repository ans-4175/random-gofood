import { useEffect, useState } from 'react';

// This component uses https://codepen.io/paulborm/pen/pYVYve as reference.
export default function TextBlinkRandomizer({
  onFinishRandomizing,
  mustStartRandomizing,
  pickedMerchant,
  optionsList,
  interval = 100,
  duration = 3000,
  children
}) {
  const [shownText, setShownText] = useState(undefined);
  const merchantName = pickedMerchant?.name;

  useEffect(() => {
    async function onUpdate() {
      if (!mustStartRandomizing) {
        // Early return when not in randomizing mode.
        return;
      }

      for (let i = 0; i < duration / interval; i++) {
        const index = Math.floor(Math.random() * optionsList.length);

        setShownText(optionsList[index].option);
        await wait(interval);
      }

      setShownText(merchantName);
      await onFinishRandomizing();
    }

    onUpdate();
  }, [
    onFinishRandomizing,
    mustStartRandomizing,
    optionsList,
    merchantName,
    interval,
    duration
  ]);

  if (optionsList === undefined) {
    return null;
  }

  if (shownText === undefined) {
    return (
      <>
        <div className="randomizer-text-container">
          <div>{optionsList[0].option}</div>

          <div className="randomizer-text-helper">
            Press "Randomize" button below to start.
          </div>
        </div>

        {children}
      </>
    );
  }

  return (
    <div className="randomizer-text-container">
      {shownText} {children}
    </div>
  );
}

// Helper functions.
async function wait(duration) {
  return new Promise((res) => {
    setTimeout(() => res(undefined), duration);
  });
}
