import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { loadApplications } from '@app/store/application';
import { Navbar } from '@app/components';

function DiscoverPage() {
  const {
    data,
    isLoading,
    error,
  } = useSelector((state) => state.applications, shallowEqual);
  const { actualName } = useSelector((state) => state.users, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    const options = {
      query: '',
      username: actualName,
    };
    dispatch(loadApplications(options));
  }, []);

  function contentUi() {
    if (isLoading) {
      return <span>Loading</span>;
    }
    if (error) {
      return <span>error!</span>;
    }
    return <span>Yippeee</span>;
  }

  return (
    <div className="discover">
      <Navbar canGoBack />
      <div className="discover__box sr-container">
        {contentUi()}
      </div>
    </div>
  );
}

export default DiscoverPage;
