const fs = require('fs').promises;
const  axios = require('axios');
const { XMLParser } = require('fast-xml-parser');


const xml = `
<?xml version="1.0" encoding="windows-1251"?>
<Data>
<Document>
<!--Серія та номер документу-->
<Document_Seria_Number>ЦФ165273</Document_Seria_Number>
<!--Поточній номер документу-->
<Current_Number>47</Current_Number>
<!--Тип документа 1: Складська квитанція-->
<Document_Type>4</Document_Type>
<!--Номер реєстру накладних-->
<Invoice_Number>1047</Invoice_Number>
<!--Дата прийняття зерна-->
<Grain_Receive_Date>28.11.2024 00:00:00</Grain_Receive_Date>
<!--Вид зберігання 1: Загальне-->
<Grain_Type>1</Grain_Type>
<!--Ідентифікатор виду зерна-->
<Grain_Kind>38</Grain_Kind>
<!--Ідентифікатор класу зерна-->
<Grain_Class>130</Grain_Class>
<!--Рік врожаю-->
<Harvest_Year>2024</Harvest_Year>
<!--Вага зерна залікова-->
<Grain_Weight>594660</Grain_Weight>
<!--Вага зерна фізична-->
<Grain_Weight_All>594660</Grain_Weight_All>
<!--інші показники якості зерна-->
<Grain_Quality_Other> Органическая примесь 0,4 Поврежденные 0,6 Проход сита 1,6 Щуплые  Битые и поеденные 5,8</Grain_Quality_Other>
<!--Кількість зерна для видачі-->
<Grain_For_Issue>згідно акта розрахунку</Grain_For_Issue>
<!--Номер документу, що засвідчує якість зерна-->
<Attest_Document_Number>423</Attest_Document_Number>
<!--Назва документу, що засвідчує якість зерна-->
<Attest_Document_Name>Аналізна картка</Attest_Document_Name>
<!--Дата документу, що засвідчує якість зерна-->
<Attest_Document_Date>28.11.2024 00:00:00</Attest_Document_Date>
<!--Ким видано документ, що засвідчує якість зерна-->
<Attest_Document_Issuer>Товариство з обмеженою відповідальністю "Саратський КХП"</Attest_Document_Issuer>
<!--Тип зберігання-->
<Storage_Type>2</Storage_Type>
<!--Примітки про зерно-->
<Description>на зберігання</Description>
<!--тип особи-->
<Client_Type>1</Client_Type>
<!--Код ЄДРПОУ/ідентиф. код клиента-->
<Client_Code>45369450</Client_Code>
<!--Назва організації/ПІБ особи клієнта-->
<Client_Name>ТОВ "ВЕСТ ЕУНОМІЯ ГРУП"</Client_Name>
<!--Адреса клієнта-->
<Client_Address>Украина, 46001, Тернопільська, Тернопільській, Тернопіль, Лукіяновича Дениса, дом № 8</Client_Address>
<!--Номер договору з клієнтом-->
<Agreement_Number></Agreement_Number>
<!--Дата договору з клієнтом-->
<Agreement_Date>.. 00:00:00</Agreement_Date>
<!--Надходження зерна:-->
<!--1 - Так-->
<!--0 - Ні-->
<Revenue>1</Revenue>
<!--Показники якості зерна-->
<GrainParameters>
<!-- зараженность-->
<GrainParameter>
<Id>7</Id>
<TypeOfValue>4</TypeOfValue>
<Value>виявлено</Value>
</GrainParameter>
<!--влажность зерна-->
<GrainParameter>
<Id>8</Id>
<TypeOfValue>3</TypeOfValue>
<Value>13,30</Value>
</GrainParameter>
<!--зерновая примесь-->
<GrainParameter>
<Id>9</Id>
<TypeOfValue>3</TypeOfValue>
<Value>6,40</Value>
</GrainParameter>
<!--сорность-->
<GrainParameter>
<Id>10</Id>
<TypeOfValue>3</TypeOfValue>
<Value>2,00</Value>
</GrainParameter>
</GrainParameters>
</Document>
</Data>
`;

const parser = new XMLParser();

let obj = parser.parse(xml);

const document = obj.Data.Document;



const regName = 'mrwdggas';

// Продакс сервер

const clientId = 'zernohub-api-9sd6tkv';

const clientSecret = 'nkvbhjk3hr73t8wamktalb99dzyqp9y4req6';

const baseUrl = 'krrt.ncr.gov.ua';

const organizationId = '1f1af0cf-2549-49b9-85ad-426c730429d4';



// Тестовий сервер

// const clientId = 'sv-test';

// const clientSecret = 'me9fqi3wbdzvghg52outqdibi656p9ezrck6';

// const baseUrl = 'krrt-dev.ncr.gov.ua';


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

	// console.log(obj[0]);

	return stockId;

}


// п 4.1

const getBlankTypes = async (documentType) => {
	const token = await getToken();

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	})

	const blankTypes = await instance.get('/api-blank-types');

	let blankTypeCode = '';

	if (documentType === 4) {
		blankTypeCode = 'eTicket';
	}

	const blankType = blankTypes.data.find(item => item.blankTypeCode === blankTypeCode);
	return blankType;

}


//  4.2

const getStorageKinds = async (grainType) => {

	const token = await getToken();

	const url = '/api-storage-kinds';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const storageKinds = await instance.get(url);

	let kindCode = '';

	if (grainType === 1) {
		kindCode = '1';
	};

	const storageKind = storageKinds.data.find(item => item.storageKindCode === kindCode);

	return storageKind;

}

// п 4.3

const getStorageType = async (storage_Type) => {

	const token = await getToken();

	const url = '/api-storage-types';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },		
	});

	const storageTypes = await instance.get(url);

	let storageTypeCode = '';

	if (storage_Type === 1) {
		storageTypeCode = 'Separated';
	} else {
		storageTypeCode = 'Impersonal';
	}

	const storageType = storageTypes.data.find(item => item.storageTypeCode === storageTypeCode);

	return storageType;

}


//  п 4.4

const getGrainProducts = async (product) => {

	const token = await getToken();

	const url = '/api-grain-products';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	})

	const grainProducts = await instance.get(url);

	let productName = '';

	switch(product) {
		case 38:
			productName = 'Горох';
			break;
		case 44:
			productName = 'Кукурудза';
			break;
		case 401:
			productName = 'Насіння ріпаку';
			break;
		case 406:
			productName = 'Просо';
			break;			
		case 400:
			productName = 'Пшениця м\'яка';
			break;			
		case 404:
			productName = 'Соняшник';
			break;			
		case 409:
			productName = 'Сорго';
			break;			
		case 410:
			productName = 'Сочевиця';
			break;			
		case 402:
			productName = 'Соя';
			break;			
		case 67:
			productName = 'Ячмінь';
			break;				
	}

	const grainProduct = grainProducts.data.find(item => item.grainProductName === productName)

	return grainProduct;

}


// п 4.5


const getNormativeDocuments = async (productId) => {

	const token = await getToken();

	const url = `/api-normative-documents?grainProductId=${productId}`;

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const normativeDocuments = await instance.get(url);

	return normativeDocuments.data[0];

}


// п 4.6

const getGrainProductClasses = async (productId) => {

	const token = await getToken();

	const url = `/api-grain-product-classes?gpDocClassProduct=${productId}`;

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const grainProductClasses = await instance.get(url);

	return grainProductClasses.data[0];

}


//  п 4.7

const getProductQis = async () => {

	const grainProductId = 'c2db7c1e-e7ee-4bbf-afe4-560a97f66bc6';
	const blankTypeId = '5772e505-bc06-42bd-8133-a202317f7a08';
	const grainProductClass = '63a260cf-0e2c-4f13-b688-bc15d7ab3733';

	const token = await getToken();

	const url = `/api-product-qis?gpDocQiSetGpId=${grainProductId}&gpDocQiSetBlankTypeId=${blankTypeId}&gpDocQiSetGpClassId=${grainProductClass}`;

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
	console.log(stockId);
	console.log("-----------------Answer 2-------------------------------------");
	console.log(stockBlankTypes.data);
}





const importCDZ = async () => {
	const token = await getToken();

	const instance = axios.create({
    baseURL:
      `https://bp-webservice-gateway-${regName}-main.apps.${baseUrl}/api`,
    headers: { "Content-Type": "application/json", "x-access-token": token },
  });


	const res = await instance.post("/start-bp", JSON.stringify(cdz));

	console.log("-----------------Answer--------------------------------------");
	
	console.log(res.data);
}




//  importCDZ();

// getBlankTypes();

// getStockBlankTypes();

// getStorageKinds(document.Grain_Type);

// getStorageType();

// getStockId();

// getPersonTypes();
// getPersonDocTypes();

// getGrainProducts(document.Grain_Kind);

// getNormativeDocuments();

// getGrainProductClasses();

// getProductQis();

// getQdocTypes();



const stockId = 'f69402fc-4d45-4c35-9832-cc2649024745';
const blankType = "eTicket";




// const storageTypeId = 'bcb0e274-0565-431f-8588-0159cd3a993e';
const stockClientAgreementId = '7c7a8343-45ef-4614-8ab1-bad084c9a98e';
// const grainProductId = 'c2db7c1e-e7ee-4bbf-afe4-560a97f66bc6';
// const normativeDocumentId = 'bd498db5-4c5b-476c-bae9-a0ad866ef022';
// const grainProductClass =  '63a260cf-0e2c-4f13-b688-bc15d7ab3733';
const qdocTypeId = 'ef8134f6-a0f1-4689-8d1b-434515f6d9bb';


const getAllData = async () => {
	const storageKind = await getStorageKinds(document.Grain_Type);
	const grainProduct = await getGrainProducts(document.Grain_Kind);
	const NormativeDocuments = await getNormativeDocuments(grainProduct.grainProductId);
	const grainProductClasses = await getGrainProductClasses(grainProduct.grainProductId);
	const storageType = await getStorageType(document.Storage_Type);
	const blankTypes = await getBlankTypes(document.Document_Type);
	const stock = await getStockId();
	console.log(stock.data);


	const cdz = {
		businessProcessDefinitionKey: "gp-doc-import-bp",
		startVariables: {
			organizationId: organizationId,
			docs: [
				{
					blankType: blankTypes.blankTypeCode,
					blankSeriesCode: document.Document_Seria_Number.substr(0,2),
					blankNumber: document.Document_Seria_Number.substr(2,6),
					registrationNumber: document.Current_Number,
					storageKind: storageKind.storageKindId,
					storageType: storageType.storageTypeId,
					stockClientAgreement: stockClientAgreementId,
					stockClientInvoice: "",
					stockClientAuthorizedPerson: "",
					stockClientAttorneyNumber: "",
					stockClientAttorneyDate: "",
					product: grainProduct.grainProductId,
					productNormDoc: NormativeDocuments.normativeDocumentId,
					productClass: grainProductClasses.grainProductClass,
					productHarvestYear: document.Harvest_Year,
					productRawWeight: document.Grain_Weight_All,
					productNetWeight: document.Grain_Weight,
					productNote: document.Description,
					productQis: [
						{
							productQi: "2236540b-f927-45e5-9ea3-6f0ecef59555",
							productQiValue: "13.3"
						},
						{
							productQi: "2079cbf2-6e36-4f86-a535-d95da2ab25ed",
							productQiValue: "2.00"
						},
						{
							productQi: "86c75224-ea8b-4774-8373-89e7be155769",
							productQiValue: "6.40"
						}
					],
					productQdocType: qdocTypeId,
					productQdocNumber: document.Attest_Document_Number,
					productQdocStartDate: document.Attest_Document_Date,
					productQdocIssuer: document.Attest_Document_Issuer,
					productArrived: true,
					productArrivalDate: document.Grain_Receive_Date,
					productKeepOnDemand: false,
					productKeepUntilDate: document.Shelf_Life_Date,
					productIssuanceAmount: document.Grain_For_Issue,
					assuranceOrg: "",
					assuranceNumber: "",
					assuranceCompensation: ""
				},
			]
		}
	};	

	console.log('---------------------------------------------------');

	console.log(cdz.startVariables.docs);
}






getAllData();