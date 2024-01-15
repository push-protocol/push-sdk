import { getCAIPAddress, getAPIBaseUrls } from '../helpers';
import Constants, {ENV} from '../constants';
import { axiosGet } from '../utils/axiosUtil';

export type UserSubscriptionsOptionsType = {
  user: string;
  env?: ENV;
}

export const getSubscriptions = async (
  options: UserSubscriptionsOptionsType
) => {
  const {
    user,
    env = Constants.ENV.PROD,
  } = options || {};

  const _user = await getCAIPAddress(env, user, 'User');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/users/${_user}/subscriptions`;
  const requestUrl = `${apiEndpoint}`;

  return axiosGet(requestUrl)
    .then((response) => response.data?.subscriptions || [])
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
    });
}
