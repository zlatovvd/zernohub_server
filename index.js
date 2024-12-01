const  axios = require('axios');

baseUrl = "https://platform-keycloak.apps.krrt-dev.ncr.gov.ua";
url = '/auth/realms/mrwdggas-external-system/protocol/openid-connect/token';

data = {
  grant_type: "client_credentials",
  client_id: "sv-test",
  client_secret: "me9fqi3wbdzvghg52outqdibi656p9ezrck6",
};

const fetchApi = axios.create({
  baseURL: "https://platform-keycloak.apps.krrt-dev.ncr.gov.ua",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

const getToken = async () => {
	const token  = await fetchApi.post(url, data);

	const { access_token } = token.data;
	//console.log(access_token);
	return access_token;
}


const getCountries = async () => {
  const token = await getToken();

  const instance = axios.create({
    baseURL:
      "https://external-service-api-mrwdggas-main.apps.krrt-dev.ncr.gov.ua/api/gateway/data-factory",
    //headers: { Authorization: `Bearer ${token}` },
  });

  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const countries = await instance.get("/api-person-doc-types");

  console.log(countries);
}


const cdz = {
	businessProcessDefinitionKey: "gp-doc-import-bp",
	startVariables: {
		organizationId: "b5c43534-5a22-4c9f-a370-de904e11e983",
		docs: [
			{
				blankType: "Ticket",
				blankSeriesCode: "ЙЦ",
				blankNumber: "777007",
				registrationNumber: "3552",
				storageKind: "5252a909-4a97-45ac-867a-bebdb7ec07e7",
				storageType: "224a3f24-09e6-4952-9220-73fc32792a14",
				stockClientAgreement: "7f16208a-d7d5-4c79-8503-f99b083c335e",
				stockClientInvoice: "Тестова накладна 3552",
				stockClientAuthorizedPerson: "Тестова уповноважена особа",
				stockClientAttorneyNumber: "Тестова довіреність 3552",
				stockClientAttorneyDate: "2024-07-13",
				product: "33411400-080b-408d-9988-d6e00ceed1cb",
				productNormDoc: "f6cc5add-b7f0-4dc6-8e1e-452bb043dfbc",
				productClass: "c2719670-ff80-4235-a8c2-6a81c6318e51",
				productHarvestYear: "2024",
				productRawWeight: "10000",
				productNetWeight: "8000",
				productNote: "Примітка",
				productQis: [
					{
						productQi: "ef3ba9d4-f93c-4a33-8efa-b9185cbdac44",
						productQiValue: "5.00"
					},
					{
						productQi: "2113baca-879f-41fa-b677-0a1d48a4a409",
						productQiValue: "4.80"
					},
					{
						productQi: "e98c5a05-69d3-4b87-90c5-a4a0ac2c9745",
						productQiValue: "не виявлено"
					},
					{
						productQi: "388d7292-dc88-49d8-912b-72dba775644f",
						productQiValue: "показник1: 10.23, показник2: 12.22"
					}
				],
				productQdocType: "cfd2b87b-169f-436a-978a-276dc2df8d84",
				productQdocNumber: "331",
				productQdocStartDate: "2024-07-13",
				productQdocIssuer: "ВТЛ даного складу",
				productArrived: true,
				productArrivalDate: "2025-01-13",
				productKeepOnDemand: false,
				productKeepUntilDate: "2025-01-13",
				productIssuanceAmount: "8000",
				assuranceOrg: "Тестова страхова компанія",
				assuranceNumber: "Договір страхування 331",
				assuranceCompensation: "1000000 грн"
			},
		]
	}
};


const importCDZ = async () => {
	const token = await getToken();

	const instance = axios.create({
    baseURL:
      "https://bp-webservice-gateway-mrwdggas-main.apps.krrt-dev.ncr.gov.ua/api",
    headers: { "Content-Type": "application/json", "x-access-token": token },
  });

	//const headers =  { "Content-Type": "application/json", "x-access-token": token }

const res = await instance.post("/start-bp", cdz);

	console.log("-----------------Answer--------------------------------------");
	
	console.log(headers);
}




importCDZ();


