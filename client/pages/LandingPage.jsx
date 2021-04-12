import React from 'react';
import Button from '@material-ui/core/Button';

import { navigateTo } from '@app/utils';
import { Navbar } from '@app/components';

function LandingPage() {
  function ctaUi() {
    return (
      <>
        <Button
          className="m-v-5"
          variant="contained"
          color="secondary"
          onClick={navigateTo('/request-analysis')}
        >
          Request Analysis
        </Button>
        <Button
          className="m-v-5"
          variant="outlined"
          color="primary"
          onClick={navigateTo('/discover')}
        >
          Search Database
        </Button>
      </>
    );
  }

  function mainUi() {
    return (
      <>
        <div className="landing__title">
          deMystify.app
        </div>
        <div className="landing__sub-title">
          Unmasking fradulent applications
        </div>
        <div className="landing__body">
          <div className="landing__description">
            <p>
              &nbsp;
              <span className="underline bold">
                deMysity
              </span>
              &nbsp;is a step in the direction to help people detect fradulent
              applications ahead of time so they can safeguard their confidential
              data.
            </p>
            <p>
              It&apos;s simple to use! Either request an analysis of the application
              from our servers or lookup the name of that application in our database.
            </p>
          </div>
          <div className="landing__cta">
            {ctaUi()}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="landing">
      <Navbar />
      <div className="sr-container landing__box">
        {mainUi()}
      </div>
    </div>
  );
}

export default LandingPage;
