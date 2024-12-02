const  axios = require('axios');

const regName = 'mrwdggas';


// Продакс сервер

const clientId = 'zernohub-api-9sd6tkv';

const clientSecret = 'nkvbhjk3hr73t8wamktalb99dzyqp9y4req6';

const baseUrl = 'krrt.ncr.gov.ua';

const organizationId = '1f1af0cf-2549-49b9-85ad-426c730429d4';

const stockId = '4df4cb8b-bd61-4451-88df-74c4c75cc7fa';



// Тестовий сервер

// const clientId = 'sv-test';

// const clientSecret = 'me9fqi3wbdzvghg52outqdibi656p9ezrck6';

// const baseUrl = 'krrt-dev.ncr.gov.ua';


//baseUrl = "https://platform-keycloak.apps.krrt-dev.ncr.gov.ua";



// п2.1

const getToken = async () => {

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

	const token  = await instance.post(url, data);

	const { access_token } = token.data;
	//console.log(access_token);
	return access_token;
}

// П 3.1
const getPersonTypes = async () => {
	
	const token = await getToken();

	const url = '/api-person-types';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const personTypes = await instance.get(url);

	console.log(personTypes.data);


}


// п.3.2
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


// п 3.3
const getPersonDocTypes = async () => {

	const token = await getToken();

	url = '/api-person-doc-types';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	})

	const personDocTypes = await instance.get(url);

	console.log(personDocTypes.data);

}

// п.3.4

const getStockId = async () => {

	const token = await getToken();

	const url = '/start-bp';

	const data = {
		businessProcessDefinitionKey: "organization-clients-bp",
		startVariables: {
			organizationId: organizationId
		}
	};
	
	const instance = axios.create({
		baseURL: `https://bp-webservice-gateway-${regName}-main.apps.${baseUrl}/api`,
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': token
		}
	});

	const stockId = await instance.post(url, data);

	const obj = JSON.parse(stockId.data.resultVariables.data);

	console.log(obj[0]);

}


// п 4.1

const getBlankTypes = async () => {
	const token = await getToken();

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	})

	const blankTypes = await instance.get('/api-blank-types')
	console.log(blankTypes);
}


//  4.2

const getStorageKinds = async () => {

	const token = await getToken();

	const url = '/api-storage-kinds';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const storageKinds = await instance.get(url);

	console.log(storageKinds.data);

}

// п 4.3

const getStorageType = async () => {

	const token = await getToken();

	const url = '/api-storage-types';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },		
	});

	const storageType = await instance.get(url);

	console.log(storageType.data);

}


//  п 4.4

const getGrainProducts = async () => {

	const token = await getToken();

	const url = '/api-grain-products';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	})

	const grainProducts = await instance.get(url);

	console.log(grainProducts.data)

}


// п 4.5


const getNormativeDocuments = async () => {

	const grainProductId = 'c714a4ef-1cdf-4be7-9d26-4404e79ebbb0';

	const token = await getToken();

	const url = `/api-normative-documents?grainProductId=${grainProductId}`;

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const normativeDocuments = await instance.get(url);

	console.log(normativeDocuments.data);

}


// п 4.6

const getGrainProductClasses = async () => {

	const grainProductId = 'c714a4ef-1cdf-4be7-9d26-4404e79ebbb0'; 

	const token = await getToken();

	const url = `/api-grain-product-classes?gpDocClassProduct=${grainProductId}`;

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const grainProductClasses = await instance.get(url);

	console.log(grainProductClasses.data);

}


//  п 4.7

const getProductQis = async () => {

	const grainProductId = 'c714a4ef-1cdf-4be7-9d26-4404e79ebbb0';

	const token = await getToken();

	const url = `/api-product-qis?gpDocQiSetGpId=${grainProductId}`;

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const productQis = await instance.get(url);

	console.log(productQis.data);

}

// п 4.8

const getQdocTypes = async () => {

	const token = await getToken();

	const url = '/api-qdoc-types';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const qdocTypes = await instance.get(url);

	console.log(qdocTypes);

}

// п 4.9

const getStockBlankTypes = async () => {

	const token = await getToken();

	const url = `/api-stock-blank-types?blankStockId=${stockId}`;

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	})

	const stockBlankTypes = await instance.get(url);
	
	console.log("-----------------Answer--------------------------------------");

	console.log(stockBlankTypes.data);
}





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




//importCDZ();

// getBlankTypes();

// getStockBlankTypes();

// getStorageKinds();

// getStorageType();

getStockId();

// getPersonTypes();
// getPersonDocTypes();

// getGrainProducts();

// getNormativeDocuments();

// getGrainProductClasses();

// getProductQis();

// getQdocTypes();


const cdz = {
	businessProcessDefinitionKey: "gp-doc-import-bp",
	startVariables: {
		organizationId: "b5c43534-5a22-4c9f-a370-de904e11e983",
		docs: [
			{
				blankType: "eTicket",
				blankSeriesCode: "ЦФ",
				blankNumber: "165273",
				registrationNumber: "47",
				storageKind: "83f995cc-ac69-4064-a784-640d3e4827ac",
				storageType: "bcb0e274-0565-431f-8588-0159cd3a993e",
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
