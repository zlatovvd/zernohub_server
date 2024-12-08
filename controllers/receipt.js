const { default: axios } = require('axios');
const { XMLParser } = require('fast-xml-parser');
const formatDate = require('../helpers/formatDate');
require("dotenv").config();

const env = process.env;

const regName = env.REG_NAME;
const baseUrl = env.BASE_URL;
const organizationId = env.ORGANIZATION_ID;

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

const obj = parser.parse(xml);

const document = obj.Data.Document;

let token = '';

const getReceipt = async (req, res) => {

	token = req.token;

	const storageKind = await getStorageKinds(document.Grain_Type);
	const grainProduct = await getGrainProducts(document.Grain_Kind);
	const NormativeDocument = await getNormativeDocuments(grainProduct.grainProductId);
	const grainProductClass = await getGrainProductClasses(grainProduct.grainProductId, document.Grain_Class);
	const storageType = await getStorageType(document.Storage_Type);
	const blankType = await getBlankTypes(document.Document_Type);
	const stock = await getStockId(document.Client_Code);
	const qdocType = await getQdocTypes(document.Attest_Document_Name);
	const productQis = await getProductQis(
    grainProduct.grainProductId,
    blankType.blankTypeId,
    grainProductClass.grainProductClass,
    document.GrainParameters
	);
	
	const cdz = {
    businessProcessDefinitionKey: "gp-doc-import-bp",
    startVariables: {
      organizationId: organizationId,
      docs: [
        {
          blankType: blankType.blankTypeCode,
          blankSeriesCode: document.Document_Seria_Number.substr(0, 2),
          blankNumber: document.Document_Seria_Number.substr(2, 6),
          registrationNumber: document.Current_Number,
          storageKind: storageKind.storageKindId,
          storageType: storageType.storageTypeId,
          stockClientAgreement: stock.stockClientAgreementId,
          stockClientInvoice: "",
          stockClientAuthorizedPerson: "",
          stockClientAttorneyNumber: "",
          stockClientAttorneyDate: "",
          product: grainProduct.grainProductId,
          productNormDoc: NormativeDocument.normativeDocumentId,
          productClass: grainProductClass.grainProductClass,
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
          productArrivalDate: document.Grain_Receive_Date
            ? formatDate(document.Grain_Receive_Date)
            : "",
          productKeepOnDemand: true,
          productKeepUntilDate: document.Shelf_Life_Date
            ? formatDate(document.Shelf_Life_Date)
            : "",
          productIssuanceAmount: document.Grain_For_Issue,
          assuranceOrg: "",
          assuranceNumber: "",
          assuranceCompensation: "",
        },
      ],
    },
  };	

	res.json({
    storageKind,
    grainProduct,
    NormativeDocument,
    grainProductClass,
    storageType,
    blankType,
    stock,
    qdocType,
    productQis,
    cdz,
  });

}

async function getStorageKinds(grainType) {

  const url = "/api-storage-kinds";

  const instance = axios.create({
    baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const storageKinds = await instance.get(url);

  let kindCode = "";

  if (grainType === 1) {
    kindCode = "1";
  }

  const storageKind = storageKinds.data.find(
    (item) => item.storageKindCode === kindCode
  );

  return storageKind;
}

async function getGrainProducts(product) {

  const url = "/api-grain-products";

  const instance = axios.create({
    baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const grainProducts = await instance.get(url);

  let productName = "";

  switch (product) {
    case 38:
      productName = "Горох";
      break;
    case 44:
      productName = "Кукурудза";
      break;
    case 401:
      productName = "Насіння ріпаку";
      break;
    case 406:
      productName = "Просо";
      break;
    case 400:
      productName = "Пшениця м'яка";
      break;
    case 404:
      productName = "Соняшник";
      break;
    case 409:
      productName = "Сорго";
      break;
    case 410:
      productName = "Сочевиця";
      break;
    case 402:
      productName = "Соя";
      break;
    case 67:
      productName = "Ячмінь";
      break;
  }

  const grainProduct = grainProducts.data.find(
    (item) => item.grainProductName === productName
  );

  return grainProduct;
}

async function getNormativeDocuments(productId) {
  
  const url = `/api-normative-documents?grainProductId=${productId}`;

  const instance = axios.create({
    baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const normativeDocuments = await instance.get(url);

  return normativeDocuments.data[0];
};

async function getGrainProductClasses(productId, classNumber) {

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

	return grainProductClass;

}

async function getStorageType (storage_Type) {

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

async function getBlankTypes(documentType) {
 
  const instance = axios.create({
    baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const blankTypes = await instance.get("/api-blank-types");

  let blankTypeCode = "";

  if (documentType === 4) {
    blankTypeCode = "eTicket";
  }

  const blankType = blankTypes.data.find(
    (item) => item.blankTypeCode === blankTypeCode
  );
  return blankType;
};

async function getStockId(Client_Code) {
 
  const url = "/start-bp";

  const data = {
    businessProcessDefinitionKey: "organization-clients-bp",
    startVariables: {
      organizationId: organizationId,
    },
  };

  const instance = axios.create({
    baseURL: `https://bp-webservice-gateway-${regName}-main.apps.${baseUrl}/api`,
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  const stockId = await instance.post(url, data);

  const obj = JSON.parse(stockId.data["resultVariables"]["data"]);

	// if (obj) {
	//   const clients = obj[0].clients;

	// 	const stock = clients.find((item) => item.stockClientEdrpou == Client_Code);
	// 	return stock;
	// } 
		
	return obj; 
  
};

async function getQdocTypes(Attest_Document_Name) {
  
  const url = "/api-qdoc-types";

  const instance = axios.create({
    baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const qdocTypes = await instance.get(url);

  let qdocTypeCode = "";

  if (Attest_Document_Name === "Аналізна картка") {
    qdocTypeCode = "AnalisCard";
  }

  const qdocType = qdocTypes.data.find(
    (item) => item.qdocTypeCode === qdocTypeCode
  );

  return qdocType;
};

async function getProductQis(
  grainProductId,
  blankTypeId,
  grainProductClass,
  GrainParameters
) {
  
  const url = `/api-product-qis?gpDocQiSetGpId=${grainProductId}&gpDocQiSetBlankTypeId=${blankTypeId}&gpDocQiSetGpClassId=${grainProductClass}`;

  const instance = axios.create({
    baseURL: `https://external-service-api-${regName}-main.apps.${baseUrl}/api/gateway/data-factory`,
    headers: { Authorization: `Bearer ${token}` },
  });

  const productQis = await instance.get(url);

  let gpDocQiName = "";
  const QiArray = [];

  GrainParameters.GrainParameter.map((item) => {
    switch (item.Id) {
      case 4:
        gpDocQiName = "Белок";
        break;
      case 5:
        gpDocQiName = "Клейковина (якість)";
        break;
      case 6:
        gpDocQiName = "Клейковина (кількість)";
        break;
      case 7:
        gpDocQiName = "Зараженість";
        break;
      case 8:
        gpDocQiName = "Вологість";
        break;
      case 9:
        gpDocQiName = "Зернова домішка";
        break;
      case 10:
        gpDocQiName = "Сміттєва домішка";
        break;
    }

    const QiValue = item.Value;
    const { gpDocQiId } = productQis.data.find(
      (item) => item.gpDocQiName === gpDocQiName
    );

    QiArray.push({
      productQi: gpDocQiId,
      productQiValue: QiValue,
      gpDocQiName,
    });

    // console.log(QiArray);
  });

  // console.log(productQis.data);

  return QiArray;
};

module.exports = getReceipt;