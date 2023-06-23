import axios from 'axios';
import { API_BASE_URL } from '../../config';

export const getIceServerConfig = async () => {
  const apiEndpoint = `${API_BASE_URL}/v1/turnserver/iceconfig`;
  const { data } = await axios.get(apiEndpoint);
  return data;
};
