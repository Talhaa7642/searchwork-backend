const d7NetworksConfig = {
  apiKey: process.env.D7_API_KEY,
};

export const d7NetworksRequestConfig = {
  apiUrl: 'https://api.d7networks.com/messages/v1/send',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  authorization: `Bearer ${d7NetworksConfig.apiKey}`,
};
