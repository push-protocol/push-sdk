export async function httpRequest(url: RequestInfo, options?: RequestInit): Promise<Response> {
    const { body, ...customConfig } = options ?? {};
    const headers = { "Content-Type": "application/json" };
    const config: RequestInit = {
      method: options?.method,
      ...customConfig,
      headers: {
        ...(body ? headers : {}),
        ...customConfig.headers,
      },
    };
  
    if (body) {
      config.body = JSON.stringify(body);
    }
  
    let data!: Response;
    try {
      const response = await window.fetch(url, config);
      data = await response.json();
      if (response.ok) {
        return data;
      }
      throw new Error(response.statusText);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return Promise.reject(err.message ? err.message : data);
    }
}