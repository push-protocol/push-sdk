import { useState, useEffect } from 'react';
import * as PUSHAPI from '@pushprotocol/restapi';
import { ENV } from '../../config';

export const usePushGetPfp = (account: string, env: ENV) => {
  const [response, setResponse] = useState({});
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PUSHAPI.user.get({
          account: account,
          env: env,
        });
        setResponse(response);
      } catch (err: Error | any) {
        console.log(err.message);
        setError(err.message);
      }
    };

    fetchData();
  }, [account, env]);

  return { response, error };
};
