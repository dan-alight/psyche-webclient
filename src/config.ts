const protocol = import.meta.env.VITE_API_PROTOCOL;
const host = import.meta.env.VITE_API_HOST;
const port = import.meta.env.VITE_API_PORT;

const portString = port === "80" || port === "443" || !port ? "" : `:${port}`;
const baseUrl = `${protocol}://${host}${portString}`;

const wsProtocol = protocol === "https" ? "wss" : "ws";
const wsBaseUrl = `${wsProtocol}://${host}${portString}`;

const config = {
  HTTP_URL: baseUrl,
  WS_URL: wsBaseUrl,
  API_HOST: host,
  API_PORT: port,
  API_PROTOCOL: protocol,
};

export default config;
