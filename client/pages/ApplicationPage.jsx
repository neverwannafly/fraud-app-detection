import React from 'react';
import { useParams } from 'react-router-dom';

import { Navbar } from '@app/components';

function ApplicationPage() {
  const { appId } = useParams();

  function mainUi() {

  }

  return (
    <div className="application">
      <Navbar
        canGoBack
        goBackUrl="/discover"
      />
      <div className="sr-container application__box">
        {mainUi()}
      </div>
    </div>
  );
}

export default ApplicationPage;
