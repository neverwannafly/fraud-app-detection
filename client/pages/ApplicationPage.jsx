import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { Navbar, AsyncContent } from '@app/components';
import { loadApplication } from '@app/store/currentApp';
import { loadApplications } from '@app/store/application';

function ApplicationPage() {
  const { appId } = useParams();
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    error,
  } = useSelector((state) => state.currentApplication, shallowEqual);

  const {
    data: appsData,
    isLoading: isAppsLoading,
    error: appsError,
  } = useSelector((state) => state.applications, shallowEqual);

  const [currentApp, setCurrentApp] = useState([]);
  const { actualName: username } = useSelector((state) => state.users, shallowEqual);

  useEffect(() => {
    // Loads apps if they havent been previously loaded
    dispatch(loadApplications({ username }));
  }, []);

  useEffect(() => {
    dispatch(loadApplication({ appId, username }));
  }, [appId]);

  useEffect(() => {
    if (appsData && appsData.apps) {
      const { apps } = appsData;
      setCurrentApp(apps.filter(
        (app) => app.appId === appId,
      )[0]);
    }
  }, [appsData]);

  console.log(data, currentApp);

  const handleRetry = useCallback(() => {
    dispatch(loadApplication(appId, true));
  }, [appId]);

  function mainUi() {
    return 'Hello world';
  }

  function contentUi() {
    return (
      <AsyncContent
        isLoading={isLoading || isAppsLoading}
        error={error || appsError}
        onRetry={handleRetry}
      >
        {mainUi()}
      </AsyncContent>
    );
  }

  return (
    <div className="application">
      <Navbar
        canGoBack
        goBackUrl="/discover"
      />
      <div className="sr-container application__box">
        {contentUi()}
      </div>
    </div>
  );
}

export default ApplicationPage;
