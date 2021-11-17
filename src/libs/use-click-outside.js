import { useEffect } from 'react';

export default function useClickOutside({
  ref,
  onClickOutside,
  isResultModalOpen
}) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current !== null &&
        !ref.current.contains(event.target) &&
        isResultModalOpen
      ) {
        // Only close if the previous modal state is open.
        // Otherwise, if we open the modal after the first mount, it will create a
        // some kind of race condition that causes the modal to close it right away.
        onClickOutside();
      }
    }

    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  }, [ref, onClickOutside, isResultModalOpen]);
}
