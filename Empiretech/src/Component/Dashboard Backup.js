import { useState } from "react";
import ScrollLock from "react-scrolllock";
import { Switch, Route } from "react-router-dom";
import Logo_Horizontal from "../assets/images/Logo_Horizontal.svg";
import NavIcon from "./NavIcon";
import Nav from "./Nav";
import Error404 from "./Error404";
import UserInfo from "./Dashboard_Component/UserInfo";
import Dropdown from "./Dashboard_Component/Dropdown";
import StockAvailability from "./Dashboard_Component/StockAvailability";
import ProductAdd from "./Dashboard_Component/ProductAdd";
import ProductUpdate from "./Dashboard_Component/ProductUpdate";
import AccountCreate from "./Dashboard_Component/AccountCreate";
import AccountUpdate from "./Dashboard_Component/AccountUpdate";
import Sales from "./Dashboard_Component/Sales";
import Customer from "./Dashboard_Component/Customer";
import CustomerCreate from "./Dashboard_Component/CustomerCreate";
import CustomerUpdate from "./Dashboard_Component/CustomerUpdate";
import StockTransfer from "./Dashboard_Component/StockTransfer";
import TransferCreate from "./Dashboard_Component/TransferCreate";
import ReceiveTransfer from "./Dashboard_Component/ReceiveTransfer";
import PurchasesRecord from "./Dashboard_Component/PurchasesRecord";
import PurchasesCreate from "./Dashboard_Component/PurchasesCreate";
import PurchasesDetails from "./Dashboard_Component/PurchasesDetails";
import PurchasesSingle from "./Dashboard_Component/PurchasesSingle";
import Supplier from "./Dashboard_Component/Supplier";
import SupplierCreate from "./Dashboard_Component/SupplierCreate";
import SupplierUpdate from "./Dashboard_Component/SupplierUpdate";
import ExpensesRecord from "./Dashboard_Component/ExpensesRecord";
import ExpensesCreate from "./Dashboard_Component/ExpensesCreate";
import ExpensesDetails from "./Dashboard_Component/ExpensesDetails";
import ExpensesSingle from "./Dashboard_Component/ExpensesSingle";
import Config from "./Dashboard_Component/Config";
import PaymentMethod from "./Dashboard_Component/PaymentMethod";
import PaymentMethodCreate from "./Dashboard_Component/PaymentMethodCreate";
import PaymentMethodUpdate from "./Dashboard_Component/PaymentMethodUpdate";

function DashboardNew() {
  const [navOpen, setNavOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const setOpen = () => setNavOpen(!navOpen);
  const setOpenU = () => setUserOpen(!userOpen);

  const userInfo = JSON.parse(localStorage.getItem("user"));

  const routes = [
    {
      path: "/",
      exact: true,
      main: () => <UserInfo />,
    },
    {
      path: "/Dashboard",
      exact: true,
      main: () => <UserInfo />,
    },
    {
      path: "/Dashboard/StockAvailability",
      main: () => <StockAvailability />,
    },
    {
      path: "/Dashboard/ProductAdd/",
      main: () => <ProductAdd />,
    },
    {
      path: "/Dashboard/ProductUpdate/",
      main: () => <ProductUpdate />,
    },
    {
      path: "/Dashboard/AccountCreate/",
      main: () => <AccountCreate />,
    },
    {
      path: "/Dashboard/AccountUpdate/",
      main: () => <AccountUpdate />,
    },
    {
      path: "/Dashboard/Sales/",
      main: () => <Sales />,
    },
    {
      path: "/Dashboard/Customer",
      main: () => <Customer />,
    },
    {
      path: "/Dashboard/CustomerCreate",
      main: () => <CustomerCreate />,
    },
    {
      path: "/Dashboard/CustomerUpdate",
      main: () => <CustomerUpdate />,
    },
    {
      path: "/Dashboard/PaymentMethod",
      main: () => <PaymentMethod />,
    },
    {
      path: "/Dashboard/PaymentMethodCreate",
      main: () => <PaymentMethodCreate />,
    },
    {
      path: "/Dashboard/PaymentMethodUpdate",
      main: () => <PaymentMethodUpdate />,
    },
    {
      path: "/Dashboard/StockTransfer/",
      main: () => <StockTransfer />,
    },
    {
      path: "/Dashboard/TransferCreate/",
      main: () => <TransferCreate />,
    },
    {
      path: "/Dashboard/ReceiveTransfer",
      main: () => <ReceiveTransfer />,
    },
    {
      path: "/Dashboard/Purchases",
      main: () => <PurchasesRecord />,
    },
    {
      path: "/Dashboard/PurchasesDetails",
      main: () => <PurchasesDetails />,
    },
    {
      path: "/Dashboard/PurchasesSingle",
      main: () => <PurchasesSingle />,
    },
    {
      path: "/Dashboard/PurchasesCreate",
      main: () => <PurchasesCreate />,
    },
    {
      path: "/Dashboard/Supplier",
      main: () => <Supplier />,
    },
    {
      path: "/Dashboard/SupplierCreate",
      main: () => <SupplierCreate />,
    },
    {
      path: "/Dashboard/SupplierUpdate",
      main: () => <SupplierUpdate />,
    },
    {
      path: "/Dashboard/Expenses",
      main: () => <ExpensesRecord />,
    },
    {
      path: "/Dashboard/ExpensesCreate",
      main: () => <ExpensesCreate />,
    },
    {
      path: "/Dashboard/ExpensesDetails",
      main: () => <ExpensesDetails />,
    },
    {
      path: "/Dashboard/ExpensesSingle",
      main: () => <ExpensesSingle />,
    } /*
    {
      path: "/Dashboard/Config",
      main: () => <Config />,
    },,
    {
      path: "/Dashboard/*",
      main: () => <Error404 />,
    },
    */,
  ];
  if (userInfo.Role_Name === "Owner")
    routes.push({
      path: "/Dashboard/Config",
      main: () => <Config />,
    });
  console.log(routes);
  return (
    <div className="Dashboard">
      <div className="fixed w-full bg-white px-5 py-2 shadow-lg border-b-2 border-gray-200 z-50" id="header">
        <div className="flex flex-row justify-between">
          <div className="flex items-center">
            <button className="flex items-center my-auto h-10 w-10" onClick={setOpen}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <img src={Logo_Horizontal} alt="logo" className="mx-auto h-10 w-auto" />
          </div>
          <div className="flex items-center">
            <button onClick={setOpenU} disabled={navOpen}>
              <div className="rounded-full w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row h-full" id="content">
        {userOpen && <Dropdown />}
        {!navOpen && <NavIcon />}
        {navOpen && <Nav setOpen={setOpen} />}
      </div>
      <ScrollLock isActive={navOpen}>
        <div className="bg-gradient-to-t from-secondary to-primary h-full min-vh flex-1 md:px-80 lg:px-28 xl:px-60 px-5 py-5 text-justify">
          <div>
            <Switch>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} exact={route.exact} children={<route.main />} />
              ))}
            </Switch>
          </div>
        </div>
      </ScrollLock>
    </div>
  );
}

export default DashboardNew;
