const fs = require('fs').promises;
const  axios = require('axios');
const { XMLParser } = require('fast-xml-parser');


const xml = `
<?xml version="1.0" encoding="windows-1251"?>
<Data>
<Document>
<!--Серія та номер документу-->
<Document_Seria_Number>ЦФ165278</Document_Seria_Number>
<!--Поточній номер документу-->
<Current_Number>41</Current_Number>
<!--Тип документа 1: Складська квитанція-->
<Document_Type>4</Document_Type>
<!--Номер реєстру накладних-->
<Invoice_Number>1093</Invoice_Number>
<!--Дата прийняття зерна-->
<Grain_Receive_Date>04.12.2024 00:00:00</Grain_Receive_Date>
<!--Вид зберігання 1: Загальне-->
<Grain_Type>1</Grain_Type>
<!--Ідентифікатор виду зерна-->
<Grain_Kind>404</Grain_Kind>
<!--Ідентифікатор класу зерна-->
<Grain_Class>437</Grain_Class>
<!--Рік врожаю-->
<Harvest_Year>2024</Harvest_Year>
<!--Вага зерна залікова-->
<Grain_Weight>24986</Grain_Weight>
<!--Вага зерна фізична-->
<Grain_Weight_All>25700</Grain_Weight_All>
<!--інші показники якості зерна-->
<Grain_Quality_Other> Битые и поеденные 2,2 Зерна других культур  Кислотное число  Крупная примесь  Масличная примесь 13,2 Натура 385 Обрушенные и частично обрушенные 11 Органическая примесь 2,4 Поврежденные  Проросшие  Проход сита 3,3</Grain_Quality_Other>
<!--Кількість зерна для видачі-->
<Grain_For_Issue>згідно акта розрахунку</Grain_For_Issue>
<!--Номер документу, що засвідчує якість зерна-->
<Attest_Document_Number>438</Attest_Document_Number>
<!--Назва документу, що засвідчує якість зерна-->
<Attest_Document_Name>Аналізна картка</Attest_Document_Name>
<!--Дата документу, що засвідчує якість зерна-->
<Attest_Document_Date>04.12.2024 00:00:00</Attest_Document_Date>
<!--Ким видано документ, що засвідчує якість зерна-->
<Attest_Document_Issuer>Товариство з обмеженою відповідальністю "Саратський КХП"</Attest_Document_Issuer>
<!--Кінцева дата зберігання-->
<Shelf_Life_Date>30.04.2025 00:00:00</Shelf_Life_Date>
<!--Тип зберігання-->
<Storage_Type>2</Storage_Type>
<!--Примітки про зерно-->
<Description>на зберігання</Description>
<!--тип особи-->
<Client_Type>1</Client_Type>
<!--Код ЄДРПОУ/ідентиф. код клиента-->
<Client_Code>31454383</Client_Code>
<!--Назва організації/ПІБ особи клієнта-->
<Client_Name>ТОВ "КЕРНЕЛ-ТРЕЙД"</Client_Name>
<!--Адреса клієнта-->
<Client_Address>Украина, 01001, м.Київ, провулок Шевченка Тараса,буд.3</Client_Address>
<!--Номер договору з клієнтом-->
<Agreement_Number>42</Agreement_Number>
<!--Дата договору з клієнтом-->
<Agreement_Date>01.05.2024 00:00:00</Agreement_Date>
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
<Value>не виявлено</Value>
</GrainParameter>
<!--влажность зерна-->
<GrainParameter>
<Id>8</Id>
<TypeOfValue>3</TypeOfValue>
<Value>8,00</Value>
</GrainParameter>
<!--сорность-->
<GrainParameter>
<Id>10</Id>
<TypeOfValue>3</TypeOfValue>
<Value>5,70</Value>
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

const getStockId = async (Client_Code) => {

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

	const obj = JSON.parse(stockId.data['resultVariables']['data']);
	const clients = obj[0].clients;

	const stock = clients.find(item => item.stockClientEdrpou == Client_Code);

	return stock;

}

// const test = () => {
// 	const arr = '[
//   '[{"organizationId":"1f1af0cf-2549-49b9-85ad-426c730429d4",
//   	 "stockShortName":"ТОВ \\"САРАТСЬКИЙ КОМБІНАТ ХЛІБОПРОДУКТІВ\\"",
// 	 "stockName":"ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ  \\"САРАТСЬКИЙ КОМБІНАТ ХЛІБОПРОДУКТІВ\\"",
// 	 "stockAffiliateName":null,
// 	 "stockAddress":"68200, Одеська обл., Саратський р-н, смт. Сарата, вул. Заводська, буд. 9",
// 	 "stockCode":"1534",
// 	 "stockIdOld":3462,
// 	 "stockEdrpou":"41198678",
// 	 "stockRegion":{
// 			"katottgLevel4":null,
// 			"katottgLevel5":null,
// 			"katottgLive":true,
// 			"katottgId":"2e74ade8-c3e7-45c8-a08f-f1208dc431a3",
// 			"katottgCategory":"O",
// 			"katottgName":"Одеська",
// 			"katottgLevel1":"UA51000000000030770",
// 			"katottgLevel2":null,
// 			"katottgLevel3":null},
// 	"stockArea":{
// 		"katottgLevel4":null,
// 		"katottgLevel5":null,
// 		"katottgLive":false,
// 		"katottgId":"ee9b84a3-425f-4b6c-b9af-ec1a4e3c6355",
// 		"katottgCategory":"P",
// 		"katottgName":"Саратський",
// 		"katottgLevel1":"UA51000000000030770",
// 		"katottgLevel2":"саратський",
// 		"katottgLevel3":null},
// 		"stockId":"4df4cb8b-bd61-4451-88df-74c4c75cc7fa",
// 		"clients":[
// 				{"stockClientNameShort":"СВК \\"Борисівський\\"",
// 				"stockClientIdOld":375576,
// 				"stockClientPersonDocumentType":null,
// 				"stockClientIpn":null,
// 				"stockClientPersonType":{
// 					"personTypeLive":true,
// 					"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f",
// 					"personTypeCode":"Legal_Entity",
// 					"personTypeIdOld":1,
// 					"personTypeName":"Юридична особа"},
// 					"stockClientAgreementNumber":"27",
// 					"stockClientDocumentIssueDate":null,
// 					"stockClientName":"СВК \\"Борисівський\\"",
// 					"stockClientAgreementId":"e40adba3-fecf-4727-ae3e-b14c588c62ef",
// 					"stockClientId":"0d5cca50-e4f0-405a-a571-3f25095a0243",
// 					"stockClientEdrpou":"32199812",
// 					"stockClientDocumentIssuingAuthority":null,
// 					"stockClientDocumentNumber":null,
// 					"stockClientAddress":"68112Одеська обл,Татарбунарський р-н,с.Борисівка,вул Жовтнева,78",
// 					"stockClientAgreementEndDate":"2025-04-30",
// 					"stockClientAgreementStartDate":"2023-06-27",
// 					"stockClientCountry":{
// 						"countryId":"29f4a042-3979-4ba2-ab9e-d207997b34ad",
// 						"countryName":"Україна",
// 						"countryLive":true,
// 						"countryIdOld":1,
// 						"countryCode":"UKR",
// 						"countryPhoneCode":null}},{
// 					"stockClientNameShort":"СФГ \\"МарІчка\\"",
// 					"stockClientIdOld":558946,
// 					"stockClientPersonDocumentType":null,
// 					"stockClientIpn":null,
// 					"stockClientPersonType":{
// 						"personTypeLive":true,
// 						"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f",
// 						"personTypeCode":"Legal_Entity",
// 						"personTypeIdOld":1,
// 						"personTypeName":"Юридична особа"},
// 					"stockClientAgreementNumber":"1",
// 					"stockClientDocumentIssueDate":null,
// 							"stockClientName":"СФГ \\"МарІчка\\"","stockClientAgreementId":"ca4c1161-2a43-4e15-8450-cf4b31f87dc9","stockClientId":"412ce99f-b3df-467b-a251-4faedbb9e4f5","stockClientEdrpou":"25948697","stockClientDocumentIssuingAuthority":null,"stockClientDocumentNumber":null,"stockClientAddress":"68152, 
// Одеська обл., Татарбунарський р-н., с. Маразліївка, вул. Садова, буд.29-А","stockClientAgreementEndDate":"2025-04-30","stockClientAgreementStartDate":"2023-06-01","stockClientCountry":{"countryId":"29f4a042-3979-4ba2-ab9e-d207997b34ad","countryName":"Україна","countryLive":true,"countryIdOld":1,"countryCode":"UKR","countryPhoneCode":null}},{"stockClientNameShort":"ПП \\" Перемога ЛП \\"","stockClientIdOld":558990,"stockClientPersonDocumentType":null,"stockClientIpn":null,"stockClientPersonType":{"personTypeLive":true,"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f","personTypeCode":"Legal_Entity","personTypeIdOld":1,"personTypeName":"Юридична особа"},"stockClientAgreementNumber":"7","stockClientDocumentIssueDate":null,"stockClientName":"ПП \\" Перемога ЛП \\"","stockClientAgreementId":"3a6a23d2-0993-4226-82db-6341ae1e11bb","stockClientId":"ccd98014-4958-4519-928d-d3fc44f2a342","stockClientEdrpou":"37232204","stockClientDocumentIssuingAuthority":null,"stockClientDocumentNumber":null,"stockClientAddress":"Україна, 68200, Одеська обл., смт Сарата, вул. Чкалова,66","stockClientAgreementEndDate":"2025-04-30","stockClientAgreementStartDate":"2024-06-24","stockClientCountry":{"countryId":"29f4a042-3979-4ba2-ab9e-d207997b34ad","countryName":"Україна","countryLive":true,"countryIdOld":1,"countryCode":"UKR","countryPhoneCode":null}},{"stockClientNameShort":"ФЕРМЕРСЬКЕ ГОСПОДАРСТВО \\"ПАНІОТ\\"","stockClientIdOld":594136,"stockClientPersonDocumentType":null,"stockClientIpn":null,"stockClientPersonType":{"personTypeLive":true,"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f","personTypeCode":"Legal_Entity","personTypeIdOld":1,"personTypeName":"Юридична особа"},"stockClientAgreementNumber":"14","stockClientDocumentIssueDate":null,"stockClientName":"ФЕРМЕРСЬКЕ ГОСПОДАРСТВО \\"ПАНІОТ\\"","stockClientAgreementId":"34a1e863-1d1e-4615-ac54-714b8c2c208c","stockClientId":"65add56a-afc8-4d87-8c6e-d82680a275fe","stockClientEdrpou":"35090962","stockClientDocumentIssuingAuthority":null,"stockClientDocumentNumber":null,"stockClientAddress":"68232, Одеська обл., Саратський р-н, с.Плахтіївка, вул.Миру,79","stockClientAgreementEndDate":"2025-04-30","stockClientAgreementStartDate":"2023-06-21","stockClientCountry":{"countryId":"29f4a042-3979-4ba2-ab9e-d207997b34ad","countryName":"Україна","countryLive":true,"countryIdOld":1,"countryCode":"UKR","countryPhoneCode":null}},{"stockClientNameShort":"ФОП Колісник Юрій Іванович","stockClientIdOld":608024,"stockClientPersonDocumentType":null,"stockClientIpn":null,"stockClientPersonType":{"personTypeLive":true,"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f","personTypeCode":"Legal_Entity","personTypeIdOld":1,"personTypeName":"Юридична особа"},"stockClientAgreementNumber":"11","stockClientDocumentIssueDate":null,"stockClientName":"ФОП Колісник Юрій Іванович","stockClientAgreementId":"533c7014-2be6-4d14-99d5-3fa990a75fc8","stockClientId":"a21902e0-4773-4f65-87f4-ea6b54712ef2","stockClientEdrpou":"2321313679","stockClientDocumentIssuingAuthority":null,"stockClientDocumentNumber":null,"stockClientAddress":"Украина, 68200, Одеська обл., Саратський р-н, смт Сарата, вул.Леніна, буд.17, кв.1","stockClientAgreementEndDate":"2025-04-30","stockClientAgreementStartDate":"2023-06-15","stockClientCountry":{"countryId":"29f4a042-3979-4ba2-ab9e-d207997b34ad","countryName":"Україна","countryLive":true,"countryIdOld":1,"countryCode":"UKR","countryPhoneCode":null}},{"stockClientNameShort":"ТОВ \\"Єнікіой \\"","stockClientIdOld":610785,"stockClientPersonDocumentType":null,"stockClientIpn":null,"stockClientPersonType":{"personTypeLive":true,"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f","personTypeCode":"Legal_Entity","personTypeIdOld":1,"personTypeName":"Юридична особа"},"stockClientAgreementNumber":"2","stockClientDocumentIssueDate":null,"stockClientName":"ТОВ \\"Єнікіой \\"","stockClientAgreementId":"00b7311d-e209-4e91-86a0-aa235e5cf6c1","stockClientId":"ef910bba-c09a-409c-9a30-debb2a013070","stockClientEdrpou":"03766033","stockClientDocumentIssuingAuthority":null,"stockClientDocumentNumber":null,"stockClientAddress":"Украина, 68320, Одеська обл., Кілійський р-н, с. Новоселівка, вул. Бессарабська,буд. 65 А","stockClientAgreementEndDate":"2025-04-30","stockClientAgreementStartDate":"2024-06-10","stockClientCountry":{"countryId":"29f4a042-3979-4ba2-ab9e-d207997b34ad","countryName":"Україна","countryLive":true,"countryIdOld":1,"countryCode":"UKR","countryPhoneCode":null}},{"stockClientNameShort":"ТОВ \\"Єнікіой \\"","stockClientIdOld":610785,"stockClientPersonDocumentType":null,"stockClientIpn":null,"stockClientPersonType":{"personTypeLive":true,"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f","personTypeCode":"Legal_Entity","personTypeIdOld":1,"personTypeName":"Юридична особа"},"stockClientAgreementNumber":"1","stockClientDocumentIssueDate":null,"stockClientName":"ТОВ \\"Єнікіой \\"","stockClientAgreementId":"a40040aa-7965-474e-83c9-96e44d44dcd8","stockClientId":"ef910bba-c09a-409c-9a30-debb2a013070","stockClientEdrpou":"03766033","stockClientDocumentIssuingAuthority":null,"stockClientDocumentNumber":null,"stockClientAddress":"Украина, 68320, Одеська обл., Кілійський р-н, с. Новоселівка, вул. Бессарабська,буд. 65 А","stockClientAgreementEndDate":"2025-04-30","stockClientAgreementStartDate":"2024-04-10","stockClientCountry":{"countryId":"29f4a042-3979-4ba2-ab9e-d207997b34ad","countryName":"Україна","countryLive":true,"countryIdOld":1,"countryCode":"UKR","countryPhoneCode":null}},{"stockClientNameShort":"ФГ \\"КОШЕЛЬНИК \\"","stockClientIdOld":625070,"stockClientPersonDocumentType":null,"stockClientIpn":null,"stockClientPersonType":{"personTypeLive":true,"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f","personTypeCode":"Legal_Entity","personTypeIdOld":1,"personTypeName":"Юридична особа"},"stockClientAgreementNumber":"9","stockClientDocumentIssueDate":null,"stockClientName":"ФГ \\"КОШЕЛЬНИК \\"","stockClientAgreementId":"c3c3af68-bfdd-4377-8ba2-2d8d665afa41","stockClientId":"3cf5b726-90cc-47ea-a8ab-c56da6999114","stockClientEdrpou":"43981042","stockClientDocumentIssuingAuthority":null,"stockClientDocumentNumber":null,"stockClientAddress":"Укр24","stockClientCountry":{"countryId":"29f4a042-3979-4ba2-ab9e-d207997b34ad","countryName":"Україна","countryLive":true,"countryIdOld":1,"countryCode":"UKR","countryPhoneCode":null}},{"stockClientNameShort":"СФГ \\"САМІ \\"","stockClientIdOld":628257,"stockClientPersonDocumentType":null,"stockClientIpn":null,"stockClientPersonType":{"personTypeLive":true,"personTypeId":"47d58861-3781-477f-83ba-cdd16122dc4f","personTypeCode":"Legal_Entity","personTypeIdOld":1,"personTypeName":"Юридична особа"}]'




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

const getGrainProductClasses = async (productId, classNumber) => {

	const token = await getToken();

	const url = `/api-grain-product-classes?gpDocClassProduct=${productId}`;

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const grainProductClasses = await instance.get(url);

	let grainProductClassCode = '';

	switch (classNumber) {
		case 417:
			grainProductClassCode = '1';
			break;
		case 398:
			grainProductClassCode = '2';
			break;
		case 437:
			grainProductClassCode = 'NotClassed';
			break;
	}

	const grainProductClass = grainProductClasses.data.find(item => item.grainProductClassCode === grainProductClassCode);
	console.log(grainProductClass);

	return grainProductClass;

}


//  п 4.7

const getProductQis = async (grainProductId, blankTypeId, grainProductClass, GrainParameters) => {

	const token = await getToken();

	const url = `/api-product-qis?gpDocQiSetGpId=${grainProductId}&gpDocQiSetBlankTypeId=${blankTypeId}&gpDocQiSetGpClassId=${grainProductClass}`;

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const productQis = await instance.get(url);

	let gpDocQiName = '';
	const QiArray = [];

	GrainParameters.GrainParameter.map(item => {
		switch (item.Id) {
			case 4:
				gpDocQiName = 'Белок';
				break;
			case 5:
				gpDocQiName = 'Клейковина (якість)';
				break;
			case 6:
				gpDocQiName = 'Клейковина (кількість)';
				break;	
			case 7:
				gpDocQiName = 'Зараженість';
				break;
			case 8:
				gpDocQiName = 'Вологість';
				break;
			case 9:
				gpDocQiName = 'Зернова домішка';
				break;
			case 10:
				gpDocQiName = 'Сміттєва домішка';
				break;
		}

		const QiValue = item.Value;
		const {gpDocQiId} = productQis.data.find(item => item.gpDocQiName === gpDocQiName);

		QiArray.push({
						productQi: gpDocQiId,
						productQiValue: QiValue
		});
		
		// console.log(QiArray);
	})

	// console.log(productQis.data);

	return QiArray;

}

// п 4.8

const getQdocTypes = async (Attest_Document_Name) => {

	const token = await getToken();

	const url = '/api-qdoc-types';

	const instance = axios.create({
		baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
		headers: { Authorization: `Bearer ${token}` },
	});

	const qdocTypes = await instance.get(url);

	let qdocTypeCode = '';

	if (Attest_Document_Name === 'Аналізна картка') {
		qdocTypeCode = 'AnalisCard';
	}

	const qdocType = qdocTypes.data.find(item => item.qdocTypeCode === qdocTypeCode);

	return qdocType;
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

const formatDate = (dateStr) => {

	const dd = dateStr.substr(0, 2);
	const mm = dateStr.substr(3, 2);
	const yyyy = dateStr.substr(6, 4);

	return yyyy + '-' + mm + '-' + dd;
}





const importCDZ = async (cdz) => {
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



const getAllData = async () => {
	const storageKind = await getStorageKinds(document.Grain_Type);
	const grainProduct = await getGrainProducts(document.Grain_Kind);
	const NormativeDocuments = await getNormativeDocuments(grainProduct.grainProductId);
	const grainProductClasses = await getGrainProductClasses(grainProduct.grainProductId, document.Grain_Class);
	const storageType = await getStorageType(document.Storage_Type);
	const blankTypes = await getBlankTypes(document.Document_Type);
	const stock = await getStockId(document.Client_Code);
	const qdocType = await getQdocTypes(document.Attest_Document_Name);
	const productQis = await getProductQis(grainProduct.grainProductId, 
											blankTypes.blankTypeId, 
											grainProductClasses.grainProductClass,
											document.GrainParameters);

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
					stockClientAgreement: stock.stockClientAgreementId,
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
					productQis: productQis,
					productQdocType: qdocType.qdocTypeId,
					productQdocNumber: document.Attest_Document_Number,
					productQdocStartDate: formatDate(document.Attest_Document_Date),
					productQdocIssuer: document.Attest_Document_Issuer,
					productArrived: true,
					productArrivalDate: (document.Grain_Receive_Date ? formatDate(document.Grain_Receive_Date ) : ""),
					productKeepOnDemand: true,
					productKeepUntilDate: (document.Shelf_Life_Date ?  formatDate(document.Shelf_Life_Date) : ""),
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

	// importCDZ(cdz);

}






getAllData();

// console.log(formatDate(document.Shelf_Life_Date));

// formatDate(document.Grain_Receive_Date);