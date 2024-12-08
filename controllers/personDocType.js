const { default: axios } = require("axios");
require("dotenv").config();

const env = process.env;

const regName = env.REG_NAME;
const baseUrl = env.BASE_URL;

const getPersonDocTypes = async (req, res) => {
  
	const token = req.token;

  url = "/api-person-doc-types";

  const instance = axios.create({
    baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const personDocTypes = await instance.get(url);

  res.json(personDocTypes.data);
};

module.exports = getPersonDocTypes;
