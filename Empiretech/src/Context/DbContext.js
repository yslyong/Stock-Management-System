import { db, firestore } from "../Firebase";
import Moment from "moment";

export async function addProduct(data, outlets) {
  const productRef = db.collection("product");

  const duplicateProducts = await db
    .collection("product")
    .where("Product_ID", "==", data.productCode.toUpperCase())
    .limit(1)
    .get();
  const duplicateProduct = duplicateProducts.docs.map((doc) => doc.data());

  //outlet to every while create product
  const Qty = {};
  outlets.map((outlet, idx) => {
    if (data.Outlet_Name === outlet.Outlet_Name) {
      Qty[outlet.Outlet_Name] = parseInt(data.productQty);
    } else {
      Qty[outlet.Outlet_Name] = 0;
    }
  });

  //suffixes Product_ID
  const str = data.productCode;
  var suffixes = [];
  for (var i = 1; i < str.length; i++) {
    suffixes.push(str.substr(i, str.length));
  }

  if (duplicateProduct.length < 1) {
    return productRef.add({
      Product_ID: data.productCode.toUpperCase(),
      Product_ID_Suffixes: suffixes,
      Product_Name: data.productName,
      Product_Desc: data.productName,
      Product_Price: parseFloat(data.productPrice),
      Product_Cost: parseFloat(data.productCost),
      Product_Category: data.ProductCategory.toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      Product_Qty: Qty,
    });
  } else {
    throw Error;
  }
}

export async function getProduct() {
  const productList = await db.collection("product").orderBy("Product_ID", "asc").get();

  return productList.docs.map((doc) => doc.data());
}

export async function getOutlet() {
  const outletList = await db.collection("outlet").orderBy("Outlet_ID", "asc").get();

  return outletList.docs.map((doc) => doc.data());
}

export async function getRole() {
  const roleList = await db.collection("role").orderBy("Role_ID", "asc").get();

  return roleList.docs.map((doc) => doc.data());
}

export async function getUserByEmail(email) {
  const user = db.collection("staff").doc(email);
  const doc = await user.get();

  return doc.data();
}

export async function getProductByID(proID) {
  const productList = await db.collection("product").where("Product_ID", "==", proID).get();

  return productList.docs.map((doc) => doc.data());
}

export async function updateProduct(data) {
  const Qty = data.productQty.reduce((o, key) => Object.assign(o, { [key[0]]: parseInt(key[1]) }), {});

  db.collection("product")
    .where("Product_ID", "==", data.productCode.toUpperCase())
    .limit(1)
    .get()
    .then((snapshot) => {
      snapshot.docs.map((doc) =>
        db
          .collection("product")
          .doc(doc.id)
          .update({
            Product_ID: data.productCode.toUpperCase(),
            Product_Name: data.productName,
            Product_Desc: data.productName,
            Product_Price: parseFloat(data.productPrice),
            Product_Cost: parseFloat(data.productCost),
            Product_Category: data.ProductCategory.toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            Product_Qty: Qty,
          })
      );
    });
}

export async function createSales(data, userInfo, productData) {
  const salesRef = db.collection("sales");
  var leftQty = 0;
  var sales = 1;
  const CustomerRef = db.collection("customer").doc(data.Customer.toString());
  const cust = await CustomerRef.get();
  var monthCreated = Moment(Date.now()).format("MMMM YYYY");
  var dayCreated = Moment(Date.now()).format("DD-MM-YYYY");
  db.collection("sales")
    .orderBy("Sales_ID", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length === 0) {
        salesRef.doc(sales.toString()).set({
          Sales_ID: sales,
          Outlet_Name: userInfo.Outlet_Name,
          Staff_Nickname: userInfo.Staff_Nickname,
          Sales_Date: firestore.Timestamp.fromDate(new Date()),
          Sales_Month: monthCreated,
          Customer: cust.data(),
          PayMethod_Name: data.Payment_Method,
          Product: productData,
          Total: data.Total,
        });
      } else {
        snapshot.docs.map(
          (doc) => (
            (sales = sales + doc.data().Sales_ID),
            salesRef.doc(sales.toString()).set({
              Sales_ID: sales,
              Outlet_Name: userInfo.Outlet_Name,
              Staff_Nickname: userInfo.Staff_Nickname,
              Sales_Date: firestore.Timestamp.fromDate(new Date()),
              Sales_Month: monthCreated,
              Customer: cust.data(),
              PayMethod_Name: data.Payment_Method,
              Product: productData,
              Total: data.Total,
            })
          )
        );
      }
    })
    .then(
      productData.map((product, idx) => {
        db.collection("product")
          .where("Product_ID", "==", product.Product_ID)
          .limit(1)
          .get()
          .then((snapshot) => {
            snapshot.docs.map(
              (doc) => (
                (leftQty = parseInt(doc.data().Product_Qty[userInfo.Outlet_Name]) - parseInt(product.Purchased)), // - parseInt(product.Purchased)
                db
                  .collection("product")
                  .doc(doc.id)
                  .update({
                    [`Product_Qty.${userInfo.Outlet_Name}`]: leftQty,
                  })
              )
            );
          });
      })
    )
    .then(
      db
        .collection("sales")
        .doc("index")
        .update({
          [`Total.${monthCreated}.${userInfo.Outlet_Name}`]: firestore.FieldValue.increment(parseFloat(data.Total)),
          [`Total.${monthCreated}.Total`]: firestore.FieldValue.increment(parseFloat(data.Total)),
          [`TotalDaily.${monthCreated}.${dayCreated}.${userInfo.Staff_Nickname}`]: firestore.FieldValue.increment(
            parseFloat(data.Total)
          ),
          [`TotalDaily.${monthCreated}.${dayCreated}.${userInfo.Outlet_Name}`]: firestore.FieldValue.increment(
            parseFloat(data.Total)
          ),
          [`TotalDaily.${monthCreated}.${dayCreated}.Total`]: firestore.FieldValue.increment(parseFloat(data.Total)),
        })
    );
}

export async function createTransfer(data, UserInfo, productData) {
  const transferRef = db.collection("transfer");
  var transfer = 1;
  var leftQty = 0;

  db.collection("transfer")
    .orderBy("Transfer_ID", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length === 0) {
        transferRef.doc(transfer.toString()).set({
          Transfer_ID: transfer,
          Transfer_By: UserInfo.Staff_Nickname,
          Transfer_ReceivedBy: "",
          Transfer_Date: firestore.Timestamp.fromDate(new Date()),
          Transfer_ReceivedDate: "",
          Transfer_From: data.Outlet_From,
          Transfer_To: data.Outlet_To,
          Transfer_Product: productData,
          Transfer_Received: false,
        });
      } else {
        snapshot.docs.map(
          (doc) => (
            (transfer = transfer + doc.data().Transfer_ID),
            transferRef.doc(transfer.toString()).set({
              Transfer_ID: transfer,
              Transfer_By: UserInfo.Staff_Nickname,
              Transfer_ReceivedBy: "",
              Transfer_Date: firestore.Timestamp.fromDate(new Date()),
              Transfer_ReceivedDate: "",
              Transfer_From: data.Outlet_From,
              Transfer_To: data.Outlet_To,
              Transfer_Product: productData,
              Transfer_Received: false,
            })
          )
        );
      }
    })
    .then(
      productData.map((product, idx) => {
        db.collection("product")
          .where("Product_ID", "==", product.Product_ID)
          .limit(1)
          .get()
          .then((snapshot) => {
            snapshot.docs.map(
              (doc) => (
                (leftQty = parseInt(doc.data().Product_Qty[data.Outlet_From]) - parseInt(product.Transfered)),
                db
                  .collection("product")
                  .doc(doc.id)
                  .update({
                    [`Product_Qty.${data.Outlet_From}`]: leftQty,
                  })
              )
            );
          });
      })
    );
}

export async function getTransferByID(transferCode) {
  const transferRef = db.collection("transfer").doc(transferCode.toString());

  const doc = await transferRef.get();

  return doc.data();
}

export async function getTransferByOutlet(outlet) {
  const transferList = await db
    .collection("transfer")
    .where("Transfer_To", "==", outlet)
    .orderBy("Transfer_ID", "desc")
    .limit()
    .get();

  return transferList.docs.map((doc) => doc.data());
}

export async function getTransferByOutletNonReceived(outlet) {
  const transferList = await db
    .collection("transfer")
    .where("Transfer_To", "==", outlet)
    .where("Transfer_Received", "==", false)
    .limit()
    .get();

  return transferList.docs.map((doc) => doc.data());
}

export async function receiveTransfer(data, userInfo) {
  const transferRef = db.collection("transfer");
  var leftQty = 0;

  const doc = transferRef.doc(data.Transfer_ID).get();

  transferRef
    .doc(data.Transfer_ID)
    .update({
      Transfer_Received: true,
      Transfer_ReceivedBy: userInfo.Staff_Nickname,
      Transfer_ReceivedDate: firestore.Timestamp.fromDate(new Date()),
    })
    .then(
      (await doc).data().Transfer_Product.map((pro) =>
        db
          .collection("product")
          .where("Product_ID", "==", pro.Product_ID)
          .limit(1)
          .get()
          .then((snapshot) => {
            snapshot.docs.map(
              (doc) => (
                (leftQty = parseInt(doc.data().Product_Qty[data.Transfer_To]) + parseInt(pro.Transfered)),
                db
                  .collection("product")
                  .doc(doc.id)
                  .update({
                    [`Product_Qty.${data.Transfer_To}`]: leftQty,
                  })
              )
            );
          })
      )
    );
}

export async function createExpenses(data, userInfo) {
  const expensesRef = db.collection("expenses");
  var expenses = 1;
  var monthCreated = Moment(Date.now()).format("MMMM YYYY");
  var ref = "-";
  if (data.Ref !== "") ref = data.Ref;

  db.collection("expenses")
    .orderBy("Expenses_ID", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length === 0) {
        expensesRef.doc(expenses.toString()).set({
          Expenses_ID: expenses,
          Created_By: userInfo.Staff_Nickname,
          Created_Date: firestore.Timestamp.fromDate(new Date()),
          Created_Month: monthCreated,
          Expenses_Desc: data.expenses,
          Expenses_Total: parseFloat(data.SubTotal),
          Expenses_Ref: ref,
        });
      } else {
        snapshot.docs.map(
          (doc) => (
            (expenses = expenses + doc.data().Expenses_ID),
            expensesRef.doc(expenses.toString()).set({
              Expenses_ID: expenses,
              Created_By: userInfo.Staff_Nickname,
              Created_Date: firestore.Timestamp.fromDate(new Date()),
              Created_Month: monthCreated,
              Expenses_Desc: data.expenses,
              Expenses_Total: parseFloat(data.SubTotal),
              Expenses_Ref: ref,
            })
          )
        );
      }
    })
    .then(
      db
        .collection("expenses")
        .doc("index")
        .update({
          [`Total.${monthCreated}`]: firestore.FieldValue.increment(parseFloat(data.SubTotal)),
        })
    );
}

export async function getExpensesTotal() {
  const expensesRef = db.collection("expenses").doc("index");

  const doc = await expensesRef.get();

  return doc.data();
}

export async function getExpensesByMonth(month) {
  const expensesList = await db.collection("expenses").where("Created_Month", "==", month).get();

  return expensesList.docs.map((doc) => doc.data());
}

export async function getExpensesByID(expensesID) {
  const expensesRef = db.collection("expenses").doc(expensesID.toString());

  const doc = await expensesRef.get();

  return doc.data();
}

export async function createSupplier(data) {
  const suppplierRef = db.collection("supplier");
  var supplier = 1;

  db.collection("supplier")
    .orderBy("Supplier_ID", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length === 0) {
        suppplierRef.doc(supplier.toString()).set({
          Supplier_ID: supplier,
          Supplier_Name: data.Supplier_Name,
          Supplier_Contact: data.Supplier_Contact,
          Supplier_Email: data.Supplier_Email.toLowerCase(),
          Supplier_Address: data.Supplier_Address,
          Supplier_Zip: parseInt(data.Supplier_Postcode),
        });
      } else {
        snapshot.docs.map(
          (doc) => (
            (supplier = supplier + doc.data().Supplier_ID),
            suppplierRef.doc(supplier.toString()).set({
              Supplier_ID: supplier,
              Supplier_Name: data.Supplier_Name,
              Supplier_Contact: data.Supplier_Contact,
              Supplier_Email: data.Supplier_Email,
              Supplier_Address: data.Supplier_Address,
              Supplier_Zip: parseInt(data.Supplier_Postcode),
            })
          )
        );
      }
    });
}

export async function getSupplier() {
  const supplierList = await db.collection("supplier").orderBy("Supplier_ID", "asc").get();
  return supplierList.docs.map((doc) => doc.data());
}

export async function getSupplierByID(supplierID) {
  const supplierRef = db.collection("supplier").doc(supplierID.toString());

  const doc = await supplierRef.get();

  return doc.data();
}

export async function updateSupplier(data) {
  const supplierRef = db.collection("supplier").doc(data.Supplier_ID.toString());

  supplierRef.update({
    Supplier_ID: parseInt(data.Supplier_ID),
    Supplier_Name: data.Supplier_Name,
    Supplier_Contact: data.Supplier_Contact,
    Supplier_Email: data.Supplier_Email.toLowerCase(),
    Supplier_Address: data.Supplier_Address,
    Supplier_Zip: parseInt(data.Supplier_Postcode),
  });
}

export async function createPurchases(data, userInfo, productData) {
  const purchasesRef = db.collection("purchases");
  var purc_ID = 1;
  var monthCreated = Moment(Date.now()).format("MMMM YYYY");
  const supplierRef = db.collection("supplier").doc(data.Supplier.toString());

  const sup = await supplierRef.get();

  console.log(sup.data());

  db.collection("purchases")
    .orderBy("Purchases_ID", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length === 0) {
        purchasesRef.doc(purc_ID.toString()).set({
          Purchases_ID: purc_ID,
          To_Outlet: userInfo.Outlet_Name,
          Staff_Nickname: userInfo.Staff_Nickname,
          Purchases_Date: firestore.Timestamp.fromDate(new Date()),
          Purchases_Month: monthCreated,
          Purchases_Ref: data.Ref,
          Supplier: sup.data(),
          Product: productData,
          Total: data.SubTotal,
        });
      } else {
        snapshot.docs.map(
          (doc) => (
            (purc_ID = purc_ID + doc.data().Purchases_ID),
            purchasesRef.doc(purc_ID.toString()).set({
              Purchases_ID: purc_ID,
              To_Outlet: userInfo.Outlet_Name,
              Staff_Nickname: userInfo.Staff_Nickname,
              Purchases_Date: firestore.Timestamp.fromDate(new Date()),
              Purchases_Month: monthCreated,
              Purchases_Ref: data.Ref,
              Supplier: sup.data(),
              Product: productData,
              Total: data.SubTotal,
            })
          )
        );
      }
    })
    .then(
      productData.map((product, idx) => {
        db.collection("product")
          .where("Product_ID", "==", product.Product_ID)
          .limit(1)
          .get()
          .then((snapshot) => {
            snapshot.docs.map((doc) =>
              db
                .collection("product")
                .doc(doc.id)
                .update({
                  [`Product_Qty.${userInfo.Outlet_Name}`]: firestore.FieldValue.increment(parseInt(product.Purchased)),
                })
            );
          });
      })
    )
    .then(
      db
        .collection("purchases")
        .doc("index")
        .update({
          [`Total.${monthCreated}`]: firestore.FieldValue.increment(parseFloat(data.SubTotal)),
        })
    );
}

export async function getPurchasesTotal() {
  const expensesRef = db.collection("purchases").doc("index");

  const doc = await expensesRef.get();

  return doc.data();
}

export async function getPurchasesByMonth(month) {
  const expensesList = await db.collection("purchases").where("Purchases_Month", "==", month).get();

  return expensesList.docs.map((doc) => doc.data());
}

export async function getPurchasesByID(purchasesID) {
  const purchasesRef = db.collection("purchases").doc(purchasesID.toString());

  const doc = await purchasesRef.get();

  return doc.data();
}

export async function getProductMovementByProduct(productID) {
  const productList = await db
    .collection("productmovement")
    .where("Product_ID", "==", productID)
    .orderBy("ProductStatus_Date", "asc")
    .get();

  return productList.docs.map((doc) => doc.data());
}

export async function getCustomer() {
  const customerList = await db
    .collection("customer")
    .where("Customer_ID", "!=", 0)
    .orderBy("Customer_ID", "asc")
    .get();
  return customerList.docs.map((doc) => doc.data());
}

export async function getCustomerByID(customerID) {
  const supplierRef = db.collection("customer").doc(customerID.toString());

  const doc = await supplierRef.get();

  return doc.data();
}

export async function createCustomer(data) {
  const customerRef = db.collection("customer");
  var customer = 1;

  db.collection("customer")
    .orderBy("Customer_ID", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length === 0) {
        customerRef.doc(customer.toString()).set({
          Customer_ID: customer
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          Customer_Name: data.Customer_Name,
          Customer_Contact: data.Customer_Contact,
          Customer_Email: data.Customer_Email.toUpperCase(),
          Customer_Address: data.Customer_Address,
          Customer_Zip: parseInt(data.Customer_Postcode),
        });
      } else {
        snapshot.docs.map(
          (doc) => (
            (customer = customer + doc.data().Customer_ID),
            customerRef.doc(customer.toString).set({
              Customer_ID: customer,
              Customer_Name: data.Customer_Name.toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              Customer_Contact: data.Customer_Contact,
              Customer_Email: data.Customer_Email.toUpperCase(),
              Customer_Address: data.Customer_Address,
              Customer_Zip: parseInt(data.Customer_Postcode),
            })
          )
        );
      }
    });
}

export async function updateCustomer(data) {
  const supplierRef = db.collection("customer").doc(data.Customer_ID.toString());

  supplierRef.update({
    Customer_ID: parseInt(data.Customer_ID),
    Customer_Name: data.Customer_Name.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    Customer_Contact: data.Customer_Contact,
    Customer_Email: data.Customer_Email,
    Customer_Address: data.Customer_Address,
    Customer_Zip: parseInt(data.Customer_Postcode),
  });
}

export async function getPaymentMethod() {
  const customerList = await db.collection("paymentmethod").orderBy("PayMethod_ID", "asc").get();
  return customerList.docs.map((doc) => doc.data());
}

export async function createPaymentMethod(data) {
  const paymethodRef = db.collection("paymentmethod");
  var paymentmethod = 1;

  db.collection("paymentmethod")
    .orderBy("PayMethod_ID", "desc")
    .limit(1)
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length === 0) {
        paymethodRef.doc(paymentmethod.toString()).set({
          PayMethod_ID: paymentmethod,
          PayMethod_Name: data.PayMethod_Name,
        });
      } else {
        snapshot.docs.map(
          (doc) => (
            (paymentmethod = paymentmethod + doc.data().PayMethod_ID),
            paymethodRef.doc(paymentmethod.toString()).set({
              PayMethod_ID: paymentmethod,
              PayMethod_Name: data.PayMethod_Name,
            })
          )
        );
      }
    });
}

export async function getPaymentMethodByID(paymethodID) {
  const paymethodRef = db.collection("paymentmethod").doc(paymethodID.toString());

  const doc = await paymethodRef.get();

  return doc.data();
}

export async function updatePaymentMethod(data) {
  const paymethodRef = db.collection("paymentmethod").doc(data.PayMethod_ID.toString());

  paymethodRef.update({
    PayMethod_Name: data.PayMethod_Name,
  });
}

export async function getSalesIndex() {
  const salesIndexRef = db.collection("sales").doc("index");

  const doc = await salesIndexRef.get();

  return doc.data();
}

export async function getSalesbyOutletLimit(outlet) {
  const salesList = await db
    .collection("sales")
    .orderBy("Sales_ID", "desc")
    .where("Outlet_Name", "==", outlet)
    .limit(5)
    .get();

  return salesList.docs.map((doc) => doc.data());
}

export async function getSalesByMonth(month) {
  const salesList = await db.collection("sales").where("Sales_Month", "==", month).get();

  return salesList.docs.map((doc) => doc.data());
}

export async function getSalesByID(salesID) {
  const salesRef = db.collection("sales").doc(salesID.toString());

  const doc = await salesRef.get();

  return doc.data();
}

export async function getSalesLast() {
  const salesRef = await db.collection("sales").orderBy("Sales_ID", "desc").limit(1).get();

  return salesRef.docs.map((doc) => doc.data());
}
