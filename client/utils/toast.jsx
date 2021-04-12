import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

const SUCCESS_TOAST = 'SUCCESS_TOAST';
const ERROR_TOAST = 'ERROR_TOAST';
const DARK_TOAST = 'DARK_TOAST';

export default {
  SUCCESS_TOAST,
  ERROR_TOAST,
  DARK_TOAST,
  dispatchNotification: (text, type) => {
    const settings = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };
    switch (type) {
      case SUCCESS_TOAST: toast.success(text, settings); break;
      case ERROR_TOAST: toast.error(text, settings); break;
      case DARK_TOAST: toast.dark(text, settings); break;
      default: toast(text, settings); break;
    }
  },
  ToastContainer: () => (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  ),
};
