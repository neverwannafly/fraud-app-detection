import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { updateApplication } from '@app/store/application';

import Card from './Card';

function Submission({ appData }) {
  const { app, analysis } = appData;
  console.log(appData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateApplication(appData));
  }, []);

  return (
    <>
      <div className="form-header">
        <h2>
          Your request has been submitted!
        </h2>
        <p>
          We will send you a report by email once your analysis
          is ready.
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Card
          app={app}
          analysis={analysis}
          isFlat={false}
        />
      </div>
    </>
  );
}

Submission.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  appData: PropTypes.object.isRequired,
};

export default Submission;
