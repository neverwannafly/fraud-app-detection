import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Loader from './Loader';

function AsyncContent({
  isLoading,
  error,
  children,
  onRetry,
}) {
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
          onClick={onRetry}
          variant="contained"
          color="primary"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return children;
}

AsyncContent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.any,
  children: PropTypes.node,
  onRetry: PropTypes.func.isRequired,
};

export default AsyncContent;
