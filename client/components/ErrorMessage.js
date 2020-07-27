import React from 'react';
import PropTypes from 'prop-types';

function ErrorMessage({ errors }) {
  return (
    <div className="alert alert-danger">
      <h4>Ooops....</h4>
      <ul className="my-0">
        {errors.map((err) => (
          <li key={err.message}>{err.message}</li>
        ))}
      </ul>
    </div>
  );
}

ErrorMessage.propTypes = {
  errors: PropTypes.array,
};

export default ErrorMessage;
