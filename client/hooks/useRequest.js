import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';

const useRequest = ({ url, method, body }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = useCallback(async () => {
    try {
      setErrors([]);
      const response = await axios[method](url, body);
      return response.data;
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  }, [errors, method, url, body]);

  return useMemo(() => ({doRequest, errors}), [doRequest]);
};

export default useRequest;