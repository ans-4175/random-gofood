import { useCallback, useRef } from 'react';
import { WiredButton, WiredLink } from 'wired-elements-react';

import PhotoPlaceholder from './PhotoPlaceholder';
import useClickOutside from '../libs/use-click-outside';

export default function DetailMerchant({
  pickedMerchant,
  detailMerchant,
  pickedMenus,
  setIsResultModalOpen,
  isResultModalOpen
}) {
  const modalSectionRef = useRef(null);
  const onClickOutside = useCallback(() => {
    setIsResultModalOpen(false);
  }, [setIsResultModalOpen]);

  useClickOutside({ ref: modalSectionRef, onClickOutside, isResultModalOpen });

  return (
    <section className="result-modal-section" ref={modalSectionRef}>
      <div className="result-modal-resto-information">
        <div>
          <h2 className="txt-resto text-center">{pickedMerchant.name}</h2>

          {/* TODO(imballinst): instead of bull-separated, we can add SVG icons instead. */}
          <ul className="list-style-none divider-bull flex txt-resto-info">
            {pickedMerchant.eta_cooking_minutes ||
            pickedMerchant.eta_delivery_minutes ? (
              <li>
                <TotalWaitingTime
                  preparingTime={pickedMerchant.eta_cooking_minutes}
                  deliveryTime={pickedMerchant.eta_delivery_minutes}
                />
              </li>
            ) : null}
            {pickedMerchant.price_level && (
              <li>
                <PriceLevel level={pickedMerchant.price_level} />
              </li>
            )}
            {detailMerchant.phone_number !== '' && (
              // For some reason, the `phone_number` field in the GoFood List API
              // is always an empty string. Hence, we need to use `detailMerchant` for this one.
              <li>{detailMerchant.phone_number}</li>
            )}
          </ul>
        </div>

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
      </div>

      <h3 className="cuisine-section-title text-center">Cuisines</h3>

      <div className="result-modal-resto-cuisines">
        <ul className="list-style-none spacing-y-8">
          {pickedMenus.map((menu, key) => (
            <li key={key}>
              <CuisineListItem
                name={menu.name}
                image={menu.image}
                price={menu.price}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="text-right result-modal-action-wrapper">
        <WiredButton onClick={() => setIsResultModalOpen(false)}>
          Close
        </WiredButton>
      </div>
    </section>
  );
}

function PriceLevel({ level }) {
  // This is the number of "greyed out" $ characters.
  const numberOfInactiveCharacters = 4 - level;

  return (
    <>
      <span>{''.padEnd(level, '$')}</span>

      {numberOfInactiveCharacters > 0 && (
        <span className="txt-resto-price-info-grey">
          {''.padEnd(numberOfInactiveCharacters, '$')}
        </span>
      )}
    </>
  );
}

/**
 * Renders a cuisine's image, name, and price.
 * @param {Object} props
 * @param {string} props.name
 * @param {string} props.image
 * @param {number} props.price
 */
function CuisineListItem({ name, image, price }) {
  // Replace the comma with dot, because in Indonesia, we use the comma
  // for the decimals below the integer number instead.
  const formattedPrice = price.toLocaleString('en-ID').replace(/,/g, '.');

  return (
    <article className="menu-list-item">
      <div className="menu-image">
        {image ? <img alt={name} src={image} /> : <PhotoPlaceholder />}
      </div>

      <div className="menu-information-wrapper">
        <h4 className="menu-title">{name}</h4>
        <p className="menu-price">{formattedPrice}</p>
      </div>
    </article>
  );
}

function TotalWaitingTime({ preparingTime = 0, deliveryTime = 0 }) {
  // Number(null) resolves to `0`, so we can ignore that case.
  // When the props are undefined, then they will fall back to 0.
  const total = Number(preparingTime) + Number(deliveryTime);

  return <span>{total} minutes</span>;
}
