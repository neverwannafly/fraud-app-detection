import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  toast, apiRequest, validators,
} from '@app/utils';
import { changeUserData, loadUserData } from '@app/store/user';
import Modal from './Modal';
import Card from './Card';

function RequestAnalysis({ isOpen, onClose }) {
  const {
    actualName,
    email,
    firstName,
    lastName,
  } = useSelector((state) => state.users, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserData());
  }, []);

  const [url, setUrl] = useState('');
  const [appData, setAppData] = useState({});
  const [isSubmitted, setSubmitted] = useState(false);

  const handleModalClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setUrl('');
    }, 100);
  };
  const handleChange = (prop) => (event) => {
    dispatch(changeUserData({ [prop]: event.target.value }));
  };
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

  function formUi() {
    return (
      <form className="form-control" noValidate autoComplete="off">
        <div className="form-header">
          <h2>
            Submit an Analysis Request
          </h2>
        </div>
        <div className="form-input no-margin">
          <div className="form-group">
            <TextField
              required
              error={!validators.isStringValid(firstName)}
              label="First Name"
              variant="filled"
              defaultValue={firstName}
              onChange={handleChange('firstName')}
            />
            <TextField
              required
              error={!validators.isStringValid(lastName)}
              label="Last Name"
              variant="filled"
              defaultValue={lastName}
              onChange={handleChange('lastName')}
            />
          </div>
          <div className="form-input">
            <TextField
              required
              error={!validators.isEmailValid(email)}
              label="Email"
              variant="filled"
              defaultValue={email}
              onChange={handleChange('email')}
            />
          </div>
          <div className="form-input">
            <TextField
              required
              label="App link"
              variant="filled"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <Button
            size="medium"
            variant="outlined"
            color="primary"
            className="landing__buttons"
            onClick={handleSubmit}
          >
            Submit Request
          </Button>
        </div>
      </form>
    );
  }

  function submittedUI() {
    const { app, analysis } = appData;
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

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
    >
      {isSubmitted
        ? submittedUI() : formUi()}
    </Modal>
  );
}

RequestAnalysis.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RequestAnalysis;
