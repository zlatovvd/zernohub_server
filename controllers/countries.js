const { default: axios } = require('axios');

const getCountries = async (req, res) => {

	const token = req.token;

   const instance = axios.create({
     baseURL:
       "https://external-service-api-mrwdggas-main.apps.krrt-dev.ncr.gov.ua/api/gateway/data-factory",
   });

   instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

   const countries = await instance.get("/api-person-doc-types");

   res.json(countries.data);
};

module.exports = getCountries;
