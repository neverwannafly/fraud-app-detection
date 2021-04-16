import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  toast, apiRequest, validators,
} from '@app/utils';
import { useMobile } from '@app/hooks';
import { changeUserData, loadUserData } from '@app/store/user';
import Modal from './Modal';
import Submission from './Submission';

function RequestAnalysis({ isOpen, onClose, appUrl }) {
  const {
    actualName,
    email,
    firstName,
    lastName,
  } = useSelector((state) => state.users, shallowEqual);
  const dispatch = useDispatch();

  const [url, setUrl] = useState(appUrl);
  const [appData, setAppData] = useState({});
  const [isSubmitted, setSubmitted] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    dispatch(loadUserData());
  }, []);

  useEffect(() => {
    setUrl(appUrl);
  }, [appUrl]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    const nameFields = (shouldSpace = true) => {
      if (!shouldSpace) {
        return (
          <>
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
          </>
        );
      }
      return (
        <>
          <div className="form-input">
            <TextField
              required
              error={!validators.isStringValid(firstName)}
              label="First Name"
              variant="filled"
              defaultValue={firstName}
              onChange={handleChange('firstName')}
            />
          </div>
          <div className="form-input">
            <TextField
              required
              error={!validators.isStringValid(lastName)}
              label="Last Name"
              variant="filled"
              defaultValue={lastName}
              onChange={handleChange('lastName')}
            />
          </div>
        </>
      );
    };
    return (
      <form className="form-control" noValidate autoComplete="off">
        <div className="form-header">
          <h2>
            Submit an Analysis Request
          </h2>
        </div>
        <div className="form-input no-margin">
          {isMobile ? nameFields() : (
            <div className="form-group">
              {nameFields(false)}
            </div>
          )}
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
              defaultValue={url}
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
            type="submit"
            onClick={handleSubmit}
          >
            Submit Request
          </Button>
        </div>
      </form>
    );
  }

  function contentUi() {
    if (isSubmitted && appData) {
      return <Submission appData={appData} />;
    }

    return formUi();
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
    >
      {contentUi()}
    </Modal>
  );
}

RequestAnalysis.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appUrl: PropTypes.string,
};

RequestAnalysis.defaultProps = {
  appUrl: '',
};

export default RequestAnalysis;
