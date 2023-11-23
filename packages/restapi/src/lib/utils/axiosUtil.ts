import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../../restapi/package.json');
const version = packageJson.version;

const addSdkVersionHeader = (
  config?: AxiosRequestConfig
): AxiosRequestConfig => {
  const headers = { ...config?.headers, 'X-JS-SDK-VERSION': version };
  return { ...config, headers };
};

const axiosGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axios.get<T>(url, addSdkVersionHeader(config));
};

const axiosPost = async <T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axios.post<T>(url, data, addSdkVersionHeader(config));
};

const axiosPut = async <T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axios.put<T>(url, data, addSdkVersionHeader(config));
};

const axiosDelete = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axios.delete<T>(url, addSdkVersionHeader(config));
};

export { axiosGet, axiosPost, axiosPut, axiosDelete };
