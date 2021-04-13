import React from 'react';

function ShimmerLoader() {
  return (
    <div className="shimmer">
      <div className="shimmer__wrapper">
        <div className="shimmer__container">
          <div className="shimmer__top">
            <div className="shimmer__icon shimmer__animate" />
            <div className="shimmer__right">
              <div className="shimmer__row--def shimmer__animate" />
              <div
                style={{
                  display: 'flex',
                }}
              >
                <div className="shimmer__chip shimmer__animate" />
                <div className="shimmer__chip shimmer__animate" />
              </div>
            </div>
          </div>
          <div className="shimmer__row--sm shimmer__animate" />
          <div className="shimmer__bottom">
            <div className="shimmer__button shimmer__animate" />
            <div className="shimmer__button shimmer__animate" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShimmerLoader;
