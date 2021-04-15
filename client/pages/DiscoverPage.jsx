import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { loadApplications, changeQuery } from '@app/store/application';
import {
  Navbar,
  Loader,
  Card,
  RequestAnalysis,
} from '@app/components';
import { debounce } from '@app/utils';

function DiscoverPage() {
  const {
    data,
    isLoading,
    error,
    query,
  } = useSelector((state) => state.applications, shallowEqual);
  const { actualName: username } = useSelector((state) => state.users, shallowEqual);
  const dispatch = useDispatch();

  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(loadApplications({ username }));
  }, [username, query]);

  const handleRetry = useCallback(() => (
    dispatch(loadApplications({ username }, true))
  ), [username, query]);

  const handleSearchChange = debounce((value) => {
    dispatch(changeQuery(value, { username }));
  }, 369);

  const handleSearch = useCallback((event) => (
    handleSearchChange(event.target.value)
  ), []);

  function cardUi() {
    const {
      apps,
      analyses,
      userAnalysis,
      currentUserAnalysis,
    } = data;

    if (apps) {
      return (
        <>
          {apps.map((app) => {
            const appAnalysis = analyses.filter(
              (a) => a.appId === app.appId,
            )[0];
            const { _id: analysisId } = appAnalysis;

            const appUserAnalysis = userAnalysis.filter(
              // eslint-disable-next-line no-underscore-dangle
              (ua) => ua._id === analysisId,
            );
            const appCurrentUserAnalysis = currentUserAnalysis.filter(
              (cua) => cua.analysisId === analysisId,
            );

            return (
              <Card
                key={app.appId}
                app={app}
                analysis={appAnalysis}
                requestCount={appUserAnalysis.length > 0 && appUserAnalysis[0].count}
                isRequestedByClient={appCurrentUserAnalysis.length > 0}
              />
            );
          })}
        </>
      );
    }

    return null;
  }

  function contentUi() {
    if (isLoading) {
      return (
        <div className="discover__loader">
          <Loader />
        </div>
      );
    }
    if (error) {
      return (
        <div className="discover__error">
          <h3>Failed to load data</h3>
          <Button
            onClick={handleRetry}
            variant="contained"
            color="primary"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="discover__content">
          {cardUi()}
        </div>
        <div className="discover__fab">
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpen}
          >
            <AddIcon />
          </Fab>
        </div>
      </>
    );
  }

  return (
    <div className="discover">
      <Navbar
        canGoBack
        canSearch
        onSearch={handleSearch}
      />
      <div className="discover__box sr-container">
        {contentUi()}
      </div>
      <RequestAnalysis
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}

export default DiscoverPage;
