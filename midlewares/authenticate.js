const { default: axios } = require("axios");
require('dotenv').config();

const env = process.env;

const regName = env.REG_NAME;
const clientId = env.CLIENT_ID;
const clientSecret = env.CLIENT_SECRET;
const baseUrl = env.BASE_URL;

const authenticate = async (req, res, next) => {
  const instance = axios.create({
    baseURL: `https://platform-keycloak.apps.${baseUrl}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  data = {
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  };

  const url = `/auth/realms/${regName}-external-system/protocol/openid-connect/token`;

  const token = await instance.post(url, data);

  const { access_token } = token.data;
 
  req.token = access_token;
	
  next();
};

module.exports = authenticate;
