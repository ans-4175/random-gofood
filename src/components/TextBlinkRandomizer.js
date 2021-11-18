import { useEffect, useState } from 'react';

// This component uses https://codepen.io/paulborm/pen/pYVYve as reference.
export default function TextBlinkRandomizer({
  onFinishRandomizing,
  mustStartRandomizing,
  pickedMerchant,
  optionsList,
  interval = 100,
  duration = 3000
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
    return <span>Press "Start" button below to start randomizing.</span>;
  }

  return <span>{shownText}</span>;
}

// Helper functions.
async function wait(duration) {
  return new Promise((res) => {
    setTimeout(() => res(undefined), duration);
  });
}
