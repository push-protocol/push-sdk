import { useCallback, useEffect, useState } from 'react';
import { resolveWeb3Name } from '../helpers';
import { ENV } from '../config';

export const useDomianName = (address: string, env: ENV) => {
  const [name, setName] = useState<string | null>(null);

  const getName = useCallback(async () => {
    const result = await resolveWeb3Name(address, env);
    if (result) setName(result);
  }, [address, env]);

  useEffect(() => {
    (async () => {
      await getName();
    })();
  }, [address, env]);

  return name;
};
