const dispatchNetworkError = () => ({ success: false, error: 'Network Error' });

const parseJsonResponse = async (data) => {
  const response = await data.json();
  return response;
};

const apiRequest = async (method, url, body = null) => {
  let payload = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (method !== 'GET') {
    payload = { ...payload, body: JSON.stringify(body) };
  }
  try {
    const data = await fetch(url, payload);
    return parseJsonResponse(data);
  } catch (err) {
    return dispatchNetworkError();
  }
};

export default apiRequest;
