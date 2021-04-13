import React, { useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {
  navigateTo, toast, apiRequest, validators,
} from '@app/utils';
import { Navbar, Modal } from '@app/components';

function LandingPage() {
  const { actualName } = useSelector((state) => state.users, shallowEqual);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    url: '',
  });
  const handleModalClose = () => setModalOpen(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleChange = (prop) => (event) => {
    setFormData({ ...formData, [prop]: event.target.value });
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
        ...formData,
        username: actualName,
      });
      if (response.success) {
        handleFormSuccess();
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
              error={!validators.isStringValid(formData.first_name)}
              label="First Name"
              variant="filled"
              onChange={handleChange('first_name')}
            />
            <TextField
              required
              error={!validators.isStringValid(formData.last_name)}
              label="Last Name"
              variant="filled"
              onChange={handleChange('last_name')}
            />
          </div>
          <div className="form-input">
            <TextField
              required
              error={!validators.isEmailValid(formData.email)}
              label="Email"
              variant="filled"
              onChange={handleChange('email')}
            />
          </div>
          <div className="form-input">
            <TextField
              required
              label="App link"
              variant="filled"
              onChange={handleChange('url')}
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

  function ctaUi() {
    return (
      <>
        <Button
          className="m-v-5"
          variant="contained"
          color="secondary"
          onClick={handleModalOpen}
        >
          Request Analysis
        </Button>
        <Button
          className="m-v-5"
          variant="outlined"
          color="primary"
          onClick={navigateTo('/discover')}
        >
          Search Database
        </Button>
      </>
    );
  }

  function mainUi() {
    return (
      <>
        <div className="landing__title">
          DeMystify.io
        </div>
        <div className="landing__sub-title">
          Unmasking fradulent applications
        </div>
        <div className="landing__body">
          <div className="landing__description">
            <p>
              &nbsp;
              <span className="underline bold">
                deMysity
              </span>
              &nbsp;is a step in the direction to help people detect fradulent
              applications ahead of time so they can safeguard their confidential
              data.
            </p>
            <p>
              It&apos;s simple to use! Either request an analysis of the application
              from our servers or lookup the name of that application in our database.
            </p>
          </div>
          <div className="landing__cta">
            {ctaUi()}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="landing">
      <Navbar />
      <div className="sr-container landing__box">
        {mainUi()}
      </div>
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
      >
        {formUi()}
      </Modal>
    </div>
  );
}

export default LandingPage;
