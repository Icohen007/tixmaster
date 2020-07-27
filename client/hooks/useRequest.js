import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';

const useRequest = ({
  url, method, body, onSuccess = () => {},
}) => {
  const [errors, setErrors] = useState([]);

  const doRequest = useCallback(async (extraBody = {}) => {
    try {
      setErrors([]);
      const response = await axios[method](url, { ...body, ...extraBody });
      onSuccess(response.data);
      return response.data;
    } catch (err) {
      setErrors(err.response.data.errors);
      return null;
    }
  }, [errors, method, url, body]);

  return useMemo(() => ({ doRequest, errors }), [doRequest]);
};

export default useRequest;
