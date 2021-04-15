/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import history from '@app/history';
import { toast } from '@app/utils';

function Card({
  app,
  analysis,
  requestCount,
  isRequestedByClient,
  isFlat,
}) {
  const {
    image, name, genres, link, appId,
  } = app;
  const { isFinished } = analysis;
  const isPlural = requestCount && requestCount > 1;
  const cardClass = `card ${isFlat ? 'flat' : ''}`;

  const {
    actualName,
    email,
    firstName,
    lastName,
  } = useSelector((state) => state.users, shallowEqual);
  const dispatch = useDispatch();

  const handleFormFailure = (error = 'Network Error') => {
    toast.dispatchNotification(error, toast.ERROR_TOAST);
  };
  const handleFormSuccess = () => {
    toast.dispatchNotification('Success', toast.SUCCESS_TOAST);
  };
  const handleSubmit = async () => {
    try {
      const response = await apiRequest('POST', '/request-analysis', {
        email, firstName, lastName, username: actualName, url,
      });
      if (response.success) {
        handleFormSuccess();
        setAppData(response.data);
        setSubmitted(true);
      } else {
        handleFormFailure(response.error);
      }
    } catch (error) {
      handleFormFailure();
    }
  };

  const handleLinkOpen = () => {
    const resp = confirm(`This will open ${link} in a new window, continue?`);
    if (resp) {
      window.open(link);
    }
  };

  function analysisUi() {
    if (isFinished) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push(`/app/${appId}`)}
        >
          View Analysis
        </Button>
      );
    }
    if (isRequestedByClient) {
      return (
        <Button
          variant="contained"
          color="primary"
          disabled
        >
          Requested
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        color="primary"
      >
        Request Analysis
      </Button>
    );
  }

  return (
    <div className={cardClass}>
      <div className="card__container">
        <div className="card__top">
          <div className="card__icon">
            <img alt="application" src={image} />
          </div>
          <div className="card__right">
            <h3 style={{ margin: '0', marginBotton: '1rem' }}>{name}</h3>
            <div className="card__chips">
              {genres.map((genre, idx) => (
                <Chip
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  label={genre}
                  size="small"
                  className="card__chip"
                />
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {requestCount && (
            <div className="card__requesters">
              {requestCount}
              {isPlural ? ' people' : ' person'}
              {isPlural ? ' have ' : ' has '}
              requested an analysis.
            </div>
          )}
          <div className="card__row--sm" />
          <div className="card__bottom">
            {analysisUi()}
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLinkOpen}
            >
              Open App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  app: PropTypes.object.isRequired,
  analysis: PropTypes.object.isRequired,
  requestCount: PropTypes.number,
  isRequestedByClient: PropTypes.bool,
  isFlat: PropTypes.bool,
};

Card.defaultProps = {
  requestCount: null,
  isRequestedByClient: true,
  isFlat: true,
};

export default Card;
