/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

function Card({
  app,
  analysis,
  requestCount,
  isRequestedByClient,
}) {
  console.log(app, analysis, requestCount, isRequestedByClient);

  return (
    <div className="card">
      <div className="card__wrapper">
        <div className="card__container">
          <div className="card__top">
            <div className="card__icon" />
            <div className="card__right">
              <div className="card__row--def" />
              <div
                style={{
                  display: 'flex',
                }}
              >
                <div className="card__chip" />
                <div className="card__chip" />
              </div>
            </div>
          </div>
          <div className="card__row--sm" />
          <div className="card__bottom">
            <div className="card__button" />
            <div className="card__button" />
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  app: PropTypes.object.isRequired,
  analysis: PropTypes.object.isRequired,
  requestCount: PropTypes.number.isRequired,
  isRequestedByClient: PropTypes.bool.isRequired,
};

export default Card;
