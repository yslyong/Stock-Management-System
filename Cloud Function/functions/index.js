const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");
const db = require("firebase-admin");
db.initializeApp();

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("Product");

exports.addToIndex = functions.firestore.document("product/{Product_ID}").onCreate((snapshot) => {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return index.saveObject({ ...data, objectID });
});

exports.updateIndex = functions.firestore.document("product/{Product_ID}").onUpdate((change) => {
  const newData = change.after.data();
  const objectID = change.after.id;

  return index.saveObject({ ...newData, objectID });
});

exports.deleteFromIndex = functions.firestore
  .document("product/{Product_ID}")
  .onDelete((snapshot) => index.deleteObject(snapshot.id));

exports.salesToMovement = functions.firestore.document("sales/{Sales_ID}").onCreate((snapshot) => {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return data.Product.forEach((element) => {
    db.firestore().collection("productmovement").add({
      ProductStatus_Date: data.Sales_Date,
      ProductStatus_Sender: data.Outlet_Name,
      ProductStatus_Receiver: "Sales",
      Product_ID: element.Product_ID,
      Product_QTY: element.Purchased,
      ProductStatus_Type: "Sales",
      ProductStatus_Ref: data.Sales_ID,
    });
  });
});

exports.transferToMovement = functions.firestore.document("transfer/{Transfer_ID}").onCreate((snapshot) => {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return data.Transfer_Product.forEach((element) => {
    db.firestore().collection("productmovement").add({
      ProductStatus_Date: data.Transfer_Date,
      ProductStatus_Sender: data.Transfer_From,
      ProductStatus_Receiver: data.Transfer_To,
      Product_ID: element.Product_ID,
      Product_QTY: element.Transfered,
      ProductStatus_Type: "Transfer",
      ProductStatus_Ref: data.Transfer_ID,
    });
  });
});

exports.receivedTransferToMovement = functions.firestore.document("transfer/{Transfer_ID}").onUpdate((change) => {
  const data = change.after.data();
  const objectID = data.id;

  return data.Transfer_Product.forEach((element) => {
    db.firestore().collection("productmovement").add({
      ProductStatus_Date: data.Transfer_ReceivedDate,
      ProductStatus_Sender: data.Transfer_From,
      ProductStatus_Receiver: data.Transfer_To,
      Product_ID: element.Product_ID,
      Product_QTY: element.Transfered,
      ProductStatus_Type: "Receive",
      ProductStatus_Ref: data.Transfer_ID,
    });
  });
});

exports.purchasesToMovement = functions.firestore.document("purchases/{Purchases_ID}").onCreate((snapshot) => {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return data.Product.forEach((element) => {
    db.firestore().collection("productmovement").add({
      ProductStatus_Date: data.Purchases_Date,
      ProductStatus_Sender: "Supplier",
      ProductStatus_Receiver: data.To_Outlet,
      Product_ID: element.Product_ID,
      Product_QTY: element.Purchased,
      ProductStatus_Type: "Purchases",
      ProductStatus_Ref: data.Purchases_ID,
    });
  });
});
