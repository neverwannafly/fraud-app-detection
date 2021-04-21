/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import Alert from '@material-ui/lab/Alert';
import Chip from '@material-ui/core/Chip';
import Rating from '@material-ui/lab/Rating';
import ThumbsUp from '@material-ui/icons/ThumbUpAlt';
import HRNumbers from 'human-readable-numbers';
import { Splide, SplideSlide } from '@splidejs/react-splide';

import { useSize } from '@app/hooks';
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

  const [width] = useSize();
  const [currentApp, setCurrentApp] = useState(null);
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

  const handleRetry = useCallback(() => {
    dispatch(loadApplication(appId, true));
  }, [appId]);

  function reviewSlidesUi(allReviews, reviewsToDisplay) {
    return (
      <>
        {reviewsToDisplay.map((review) => {
          const reviewId = Object.keys(review)[0];
          const currentReview = allReviews.filter((aReview) => aReview._id === reviewId);
          const {
            rating, title, content,
            author, voteCount, _id,
          } = currentReview[0];

          return (
            <SplideSlide
              key={_id}
            >
              <div className="application__review-container">
                <div className="application__review-rating">
                  <Rating name="star-rating" value={rating} />
                </div>
                <div className="application__review-authoer">
                  {author}
                </div>
                <div className="bold">
                  {title}
                </div>
                <div className="application__review-content">
                  {content}
                </div>
                <div className="application__review-count">
                  <ThumbsUp />
                  &nbsp;
                  {voteCount}
                </div>
              </div>
            </SplideSlide>
          );
        })}
      </>
    );
  }

  function mainUi() {
    const {
      image, name, developer,
      genres, ratings, ratingCount,
    } = currentApp;

    const {
      verdict, reviews,
      goodReviews, badReviews,
    } = data;

    const perPage = Math.max(Math.floor(width / 350) - 1, 1);

    const splideOptions = {
      rewind: true,
      perPage,
      perMove: 1,
      gap: '1rem',
    };

    const verdictUi = () => {
      switch (verdict) {
        case 'Terrible': return (
          <Alert variant="filled" severity="error">
            This app isnt very trusted by its users
          </Alert>
        );
        case 'Bad': return (
          <Alert variant="filled" severity="warning">
            Users are unhappy with app functionality
          </Alert>
        );
        case 'Satisfactory': return (
          <Alert variant="filled" severity="info">
            App provides satisfactory user experience
          </Alert>
        );
        case 'Good': return (
          <Alert variant="filled" severity="info">
            App is user friendly and useful
          </Alert>
        );
        case 'Excellent': return (
          <Alert variant="filled" severity="success">
            This app provides great user experience and is trusted by its users
          </Alert>
        );
        default: return null;
      }
    };

    return (
      <div className="application__container">
        <div className="application__verdict">
          {verdictUi()}
        </div>
        <div className="application__head">
          <div className="application__icon">
            <img
              src={image}
              alt="app"
            />
          </div>
          <div className="application__info">
            <div className="application__title">
              {name}
            </div>
            <div className="application__sub-title">
              {developer}
            </div>
            <div className="application__rating">
              <div className="application__stars">
                <Rating name="star-rating" value={ratings} />
              </div>
              <div className="application__rating-count">
                <span className="bold">
                  {HRNumbers.toHumanString(ratingCount)}
                </span>
                &nbsp;Ratings
              </div>
            </div>
            <div className="application__chips-container">
              {genres.map((genre, idx) => (
                <Chip
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  label={genre}
                  className="application__chip"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="application__break" />
        <div className="application__reviews">
          <h2>Good Reviews</h2>
          <Splide
            className="application__slide"
            options={splideOptions}
          >
            {reviewSlidesUi(reviews, goodReviews, perPage)}
          </Splide>
          <h2>Bad Reviews</h2>
          <Splide
            className="application__slide"
            options={splideOptions}
          >
            {reviewSlidesUi(reviews, badReviews, perPage)}
          </Splide>
        </div>
      </div>
    );
  }

  function contentUi() {
    return (
      <AsyncContent
        isLoading={isLoading || isAppsLoading}
        error={error || appsError}
        onRetry={handleRetry}
      >
        {currentApp && data && data.date && mainUi()}
      </AsyncContent>
    );
  }

  return (
    <div className="application">
      <Navbar
        canGoBack
        goBackUrl="/discover"
      />
      <div className="sr-container">
        {contentUi()}
      </div>
    </div>
  );
}

export default ApplicationPage;
