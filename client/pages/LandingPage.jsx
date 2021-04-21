import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import { navigateTo } from '@app/utils';
import { Navbar, RequestAnalysis } from '@app/components';

function LandingPage() {
  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function ctaUi() {
    return (
      <>
        <Button
          className="m-v-5"
          variant="contained"
          color="secondary"
          onClick={handleOpen}
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
          DeMystify.io
        </div>
        <div className="landing__sub-title">
          Unmasking fradulent applications
        </div>
        <div className="landing__body">
          <div className="landing__description">
            <p>
              &nbsp;
              <span className="underline bold">
                deMystify
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
      <RequestAnalysis
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}

export default LandingPage;
