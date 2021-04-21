const dispatchNetworkError = () => ({ success: false, error: 'Network Error' });

const parseJsonResponse = async (data) => {
  const response = await data.json();
  return response;
};

const apiRequest = async (method, url, body = {}) => {
  let payload = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  let reqUrl = `${url}?`;
  if (method === 'GET') {
    Object.keys(body).forEach((key) => {
      reqUrl += `${key}=${body[key]}&`;
    });
  } else {
    payload = { ...payload, body: JSON.stringify(body) };
  }
  try {
    const data = await fetch(reqUrl, payload);
    return parseJsonResponse(data);
  } catch (err) {
    return dispatchNetworkError();
  }
};

export default apiRequest;
