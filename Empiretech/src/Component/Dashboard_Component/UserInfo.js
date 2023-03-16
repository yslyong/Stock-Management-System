import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getSalesIndex } from "../../Context/DbContext";
import Moment from "moment";
import DashboardStockTransfer from "./DashboardStockTransfer";
import DashboardSales from "./DashboardSales";
import DashboardAdmin from "./DashboardAdmin";

export default function UserInfo() {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [chartData, setChartData] = useState({});
  const [state, setstate] = useState("0");
  const [month] = useState([]);
  const [firestoreData, setFirestoreData] = useState([]);
  const [data] = useState([]);

  const chart = () => {
    let da = {};
    getSalesIndex()
      .then((value) => {
        da = Object.assign(value);
        setFirestoreData(value);
      })
      .then(() => {
        for (var i = 6; i >= 0; i--) {
          var days = Moment(Date.now()).subtract(i, "days").format("DD-MM-YYYY");
          var Month = Moment(Date.now()).subtract(i, "days").format("MMMM YYYY");
          month.push(days);
          if (da.TotalDaily[Month] !== undefined && da.TotalDaily[Month][days] !== undefined) {
            if (
              da.TotalDaily[Month][days][userInfo.Outlet_Name] !== undefined &&
              da.TotalDaily[Month][days][userInfo.Outlet_Name] > 0
            ) {
              data.push(da.TotalDaily[Month][days][userInfo.Outlet_Name]);
            } else {
              data.push(0);
            }
          } else {
            data.push(0);
          }
        }
      })
      .then(() => {
        setChartData({
          labels: month,
          datasets: [
            {
              label: `Total Sales By Day For ${userInfo.Outlet_Name}`,
              data: data,
              borderColor: "rgba(33, 145, 81, 1)",
              backgroundColor: "rgba(33, 145, 81, 0)",
              borderWidth: 2,
            },
          ],
        });
      });
  };

  useEffect(() => {
    chart();
  }, []);

  useEffect(() => {
    if (state === "1") {
      var dataList = [];
      var labelList = [];

      for (var i = 6; i >= 0; i--) {
        var days = Moment(Date.now()).subtract(i, "days").format("DD-MM-YYYY");
        var Month = Moment(Date.now()).subtract(i, "days").format("MMMM YYYY");
        labelList.push(days);
        if (firestoreData.TotalDaily[Month] !== undefined && firestoreData.TotalDaily[Month][days] !== undefined) {
          if (
            firestoreData.TotalDaily[Month][days][userInfo.Outlet_Name] !== undefined &&
            firestoreData.TotalDaily[Month][days][userInfo.Outlet_Name] > 0
          ) {
            dataList.push(firestoreData.TotalDaily[Month][days][userInfo.Outlet_Name]);
          } else {
            dataList.push(0);
          }
        } else {
          dataList.push(0);
        }
      }

      setChartData({
        labels: labelList,
        datasets: [
          {
            label: `Total Sales By Day For ${userInfo.Outlet_Name}`,
            data: dataList,
            borderColor: "rgba(33, 145, 81, 1)",
            backgroundColor: "rgba(33, 145, 81, 0)",
            borderWidth: 2,
          },
        ],
      });
    }
    return setstate(0);
  }, [state, setChartData, firestoreData, data, month, userInfo.Outlet_Name, chartData]);

  useEffect(() => {
    if (state === "2") {
      var labelList = [];
      var dataList = [];

      for (var i = 28; i >= 0; i--) {
        var days = Moment(Date.now()).subtract(i, "days").format("DD-MM-YYYY");
        var Month = Moment(Date.now()).subtract(i, "days").format("MMMM YYYY");
        labelList.push(days);
        if (firestoreData.TotalDaily[Month] !== undefined && firestoreData.TotalDaily[Month][days] !== undefined) {
          if (
            firestoreData.TotalDaily[Month][days][userInfo.Outlet_Name] !== undefined &&
            firestoreData.TotalDaily[Month][days][userInfo.Outlet_Name] > 0
          ) {
            dataList.push(firestoreData.TotalDaily[Month][days][userInfo.Outlet_Name]);
          } else {
            dataList.push(0);
          }
        } else {
          dataList.push(0);
        }
      }

      setChartData({
        labels: labelList,
        datasets: [
          {
            label: `Total Sales By Day For ${userInfo.Outlet_Name}`,
            data: dataList,
            borderColor: "rgba(33, 145, 81, 1)",
            backgroundColor: "rgba(33, 145, 81, 0)",
            borderWidth: 2,
          },
        ],
      });
    }
    return setstate(0);
  }, [state, setChartData, userInfo.Outlet_Name, firestoreData]);

  useEffect(() => {
    if (state === "3") {
      var labelList = [];
      var dataList = [];
      for (var i = 2; i >= 0; i--) {
        var Month = Moment(Date.now()).subtract(i, "months").format("MMMM YYYY");
        labelList.push(Month);
        if (firestoreData.Total[Month] !== undefined) {
          if (
            firestoreData.Total[Month][userInfo.Outlet_Name] !== undefined &&
            firestoreData.Total[Month][userInfo.Outlet_Name] > 0
          ) {
            dataList.push(firestoreData.Total[Month][userInfo.Outlet_Name]);
          } else {
            dataList.push(0);
          }
        } else {
          dataList.push(0);
        }
      }

      setChartData({
        labels: labelList,
        datasets: [
          {
            label: `Total Sales By Month For ${userInfo.Outlet_Name}`,
            data: dataList,
            borderColor: "rgba(33, 145, 81, 1)",
            backgroundColor: "rgba(33, 145, 81, 0)",
            borderWidth: 2,
          },
        ],
      });
    }
    return setstate(0);
  }, [state, setChartData, userInfo.Outlet_Name, firestoreData]);

  useEffect(() => {
    if (state === "4") {
      var labelList = [];
      var dataList = [];
      for (var i = 12; i >= 0; i--) {
        var Month = Moment(Date.now()).subtract(i, "months").format("MMMM YYYY");
        labelList.push(Month);
        if (firestoreData.TotalDaily[Month] !== undefined) {
          if (
            firestoreData.Total[Month][userInfo.Outlet_Name] !== undefined &&
            firestoreData.Total[Month][userInfo.Outlet_Name] > 0
          ) {
            dataList.push(firestoreData.Total[Month][userInfo.Outlet_Name]);
          } else {
            dataList.push(0);
          }
        } else {
          dataList.push(0);
        }
      }

      setChartData({
        labels: labelList,
        datasets: [
          {
            label: `Total Sales By Month For ${userInfo.Outlet_Name}`,
            data: dataList,
            borderColor: "rgba(33, 145, 81, 1)",
            backgroundColor: "rgba(33, 145, 81, 0)",
            borderWidth: 2,
          },
        ],
      });
    }
    return setstate(0);
  }, [state, setChartData, userInfo.Outlet_Name, firestoreData]);

  function updateValue(e) {
    setstate(e);
  }

  return (
    <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-10">
      <h1 className="lg:text-4xl text-2xl text-center font-bold mb-5">Dashboard</h1>
      <div className="flex flex-col h-full">
        <div className="flex lg:flex-row flex-col mb-5">
          <div className="flex flex-col w-full border-gray-200 border p-5">
            <h1 className="font-bold text-xl mb-3">Total Sales for {userInfo.Outlet_Name}</h1>
            <div className="w-full lg:h-72 h-56 ">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  tooltips: {
                    mode: "index",
                    intersect: false,
                  },
                }}
              ></Line>
            </div>
            <div className="flex lg:flex-row flex-col items-baseline mt-3">
              <label htmlFor="Ref" className="flex mr-3 font-semibold text-lg text-gray-800">
                Date Range :
              </label>
              <select
                id="ChartSelection"
                className="md:mt-2 rounded-md lg:w-1/5 relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                name="ChartSelection"
                type="text"
                autoComplete="ChartSelection"
                required
                onChange={(e) => updateValue(e.target.value)}
              >
                <option value="1">Last 7 Days</option>
                <option value="2">Last 28 Days</option>
                <option value="3">Last 3 Months</option>
                <option value="4">Last 12 Months</option>
              </select>
            </div>
          </div>
        </div>
        {(userInfo.Role_Name === "Admin" || userInfo.Role_Name === "Owner") && (
          <div className="flex flex-col w-full border-gray-200 border p-5 mb-5">
            <DashboardAdmin />
          </div>
        )}
        {(userInfo.Role_Name === "Logistic" || userInfo.Role_Name === "Owner") && (
          <div className="flex flex-col w-full border-gray-200 border p-5 mb-5">
            <DashboardStockTransfer />
          </div>
        )}
        {(userInfo.Role_Name === "Sales" || userInfo.Role_Name === "Owner") && (
          <div className="flex flex-col w-full border-gray-200 border p-5 mb-5">
            <DashboardSales />
          </div>
        )}
      </div>
    </div>
  );
}
