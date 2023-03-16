import React from "react";
import logo from "../../assets/images/Logo.svg";

export default class LetterHead extends React.Component {
  render() {
    return (
      <div className="mb-3">
        <div className="flex flex-row">
          <div className="flex w-auto">
            <div>
              <img src={logo} alt="logo" className="mx-auto max-h-20 w-auto" />
              <h1 className="text-center text-lg font-bold text-gray-900 mt-0 leading-4">Empire Tech</h1>
            </div>
          </div>
          <div className="flex flex-col text-left pl-5">
            <h1 className="text-xl font-bold text-gray-900 mt-0">Empire Tech</h1>
            <h1 className="text-lg text-gray-900 mt-0 leading-6">DY Solution Enterprise (003048123-A)</h1>
            <h1 className="text-lg text-gray-900 mt-0 leading-6">Block A6-2-28, Jalan Mewah 4,</h1>
            <h1 className="text-lg text-gray-900 mt-0 leading-6">Taman Pandan Mewah, 68000 Ampang, Selangor.</h1>
          </div>
        </div>
      </div>
    );
  }
}
