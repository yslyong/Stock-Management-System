import { Link } from "react-router-dom";

function NavIcon() {
  var permission = 99;
  const userInfo = JSON.parse(localStorage.getItem("user"));

  if (userInfo.Role_Name === "Owner") permission = 0;
  if (userInfo.Role_Name === "Admin") permission = 1;
  if (userInfo.Role_Name === "Sales") permission = 2;
  if (userInfo.Role_Name === "Logistic") permission = 3;

  return (
    <div className="nav">
      <div className="flex flex-col justify-between items-center bg-white height lg:visible invisible shadow-xl">
        <div className="flex flex-col space-y">
          <Link to="/Dashboard/">
            <div className="hover:bg-gray-300 p-3 flex flex-row items-center">
              <div className="w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
            </div>
          </Link>
          <Link to="/Dashboard/StockAvailability">
            <div className="hover:bg-gray-300 p-3  flex flex-row items-center">
              <div className="w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path
                    fillRule="evenodd"
                    d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>
          {(permission === 2 || permission === 0) && (
            <Link to="/Dashboard/Sales">
              <div className="hover:bg-gray-300 p-3 flex flex-row items-center">
                <div className="w-10 h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
          {(permission === 3 || permission === 0) && (
            <Link to="/Dashboard/StockTransfer">
              <div className="hover:bg-gray-300 p-3 flex flex-row items-center">
                <div className="w-10 h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
          {permission < 2 && (
            <>
              <Link to="/Dashboard/Purchases">
                <div className="hover:bg-gray-300 p-3 flex flex-row items-center">
                  <div className="w-10 h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M10.81393,6.33442c.93205,0,1.77489-.015,2.61659.0066a.57421.57421,0,0,1,.61724.60532q.00977,3.05289-.00086,6.10579a.59065.59065,0,0,1-.66894.609q-3.37118.01242-6.74241.00037a.60332.60332,0,0,1-.681-.64615q-.00534-3.03.00183-6.05992a.58948.58948,0,0,1,.65723-.6179c.84217-.0149,1.68488-.00442,2.59437-.00442v2.1946h1.606Z" />
                      <path d="M13.1639,4.06985c.57017-.33849,1.02223-.62733,1.50073-.87417a.59246.59246,0,0,1,.44429.09218A7.74468,7.74468,0,0,1,18.91773,8.851c.639,4.46738-2.50317,8.34235-7.3801,9.189-.41314.07172-.83541.10033-1.24527.148-.02453.03618-.058.06235-.05694.08734.04162.98658-.2877.80169-.91455.40541-.55379-.3501-1.13333-.6666-1.69441-1.00751-.38392-.23327-.38343-.37112.00392-.60568.61781-.37412,1.238-.74574,1.87087-1.09824a2.758,2.758,0,0,1,.58713-.17222c.04261.16989.08713.33942.12677.50987a1.50384,1.50384,0,0,1,.021.17345c2.037.36968,5.12866-1.41816,6.29159-3.6318a5.88278,5.88278,0,0,0,.33652-4.95421A6.89446,6.89446,0,0,0,13.1639,4.06985Z" />
                      <path d="M9.75945,1.77994c.08769-.95311.08776-.95321.97867-.42684.55187.326,1.10022.65711,1.65641.977.34742.19983.34381.38509.00593.58434-.66541.3924-1.32677.79049-1.995,1.17883-.46863.27233-.59889.20147-.62152-.31973-.00386-.089-.01161-.17788-.01715-.2607-2.0944-.32964-5.12182,1.41839-6.27748,3.609a5.89878,5.89878,0,0,0-.34185,4.99746,6.92892,6.92892,0,0,0,3.70115,3.8141c-.58093.33726-1.06.63556-1.56591.89033-.09.04535-.30973-.0655-.43814-.14554A7.694,7.694,0,0,1,3.57994,4.27534a9.28207,9.28207,0,0,1,5.45388-2.389c.21808-.022.43567-.04795.65334-.0732A.373.373,0,0,0,9.75945,1.77994Z" />
                    </svg>
                  </div>
                </div>
              </Link>
              <Link to="/Dashboard/Expenses">
                <div className="hover:bg-gray-300 p-3 flex flex-row items-center">
                  <div className="w-10 h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
        <div className="flex flex-col space-y">
          {permission < 2 && (
            <>
              <Link to="/Dashboard/AccountCreate">
                <div className="hover:bg-gray-300 px-3 py-3 flex flex-row items-center">
                  <div className="w-10 h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                  </div>
                </div>
              </Link>
              <Link to="/Dashboard/Config/">
                <div className="hover:bg-gray-300 px-3 py-3 flex flex-row items-center">
                  <div className="w-10 h-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default NavIcon;
