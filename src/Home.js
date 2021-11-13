import React, { useState, useRef } from 'react';
import { useQuery, useInfiniteQuery } from 'react-query';
import { fetchRandom } from './api/profiles';
// import { useParams } from 'react-router-dom';
import { sendEvent } from './libs/ga-analytics';

// error on esm import
import { WiredButton, WiredCard } from 'wired-elements-react';
// const { WiredButton, WiredCard } = require('wired-elements-react');

function Home() {
  // const [lastDirection, setLastDirection] = useState('');
  const boxCard = useRef({});

  const { data, error, isLoading, isError, isFetching, refetch } = useQuery(['profiles'], () => fetchRandom());

  const onButton = () => {
    console.log('Hit Button');

    sendEvent({
      category: 'interaction',
      action: `button`,
      label: 'hit'
    });
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <WiredCard elevation={3} ref={boxCard}>
            <section>
              <WiredButton elevation={2} onClick={() => onButton()}>
                Click Me
              </WiredButton>
            </section>
          </WiredCard>
        </>
      )}
    </div>
  );
}

export default Home;
