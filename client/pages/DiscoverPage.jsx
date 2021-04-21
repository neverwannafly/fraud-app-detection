import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { loadApplications, changeQuery } from '@app/store/application';
import {
  Navbar,
  Card,
  RequestAnalysis,
  AsyncContent,
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
  const [url, setUrl] = useState('');

  const handleOpen = useCallback((link = '') => () => {
    setOpen(true);
    setUrl(link);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setUrl('');
  }, []);

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
                onOpen={handleOpen(app.link)}
              />
            );
          })}
        </>
      );
    }

    return null;
  }

  function contentUi() {
    return (
      <AsyncContent
        isLoading={isLoading}
        onRetry={handleRetry}
        error={error}
      >
        <div className="discover__content">
          {cardUi()}
        </div>
        <div className="discover__fab">
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpen()}
          >
            <AddIcon />
          </Fab>
        </div>
      </AsyncContent>
    );
  }

  return (
    <div className="discover">
      <Navbar
        canGoBack
        canSearch
        defaultSearchValue={query}
        onSearch={handleSearch}
      />
      <div className="discover__box sr-container">
        {contentUi()}
      </div>
      <RequestAnalysis
        isOpen={isOpen}
        onClose={handleClose}
        appUrl={url}
      />
    </div>
  );
}

export default DiscoverPage;
