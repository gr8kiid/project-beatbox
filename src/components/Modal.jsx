import React, { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserDataContext } from './context/UserDataContext';



function Modal({ cardBtn, couponCode, points, cost, user, i, updatePointsFireStore, updatePoints }) {
  const [showModal, setShowModal] = useState(false);
  const { fetchUserData } = useContext(UserDataContext);

  const handleButtonClick = () => {
    if (points >= cost) {
      points = points - cost;
      updatePointsFireStore(user, points, i);
      updatePoints(points);
      setShowModal(true);
    }
    else {
      toast("You do not have enough points to redeem this gift card", {
        position: toast.POSITION.TOP_CENTER
      });
      return;
    }
  }

  const handleCopyCode = () => {
    const copyText = document.getElementById("coupon-code");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value)
  }

  const handleClose = () => {
    setShowModal(false);
    fetchUserData(user);
  }

  return (
    <>
      <ToastContainer />
      <button onClick={handleButtonClick} className={cardBtn}>
        Redeem
      </button>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h1 className="text-2xl leading-6 font-bold text-purple-900">
                    Congratulations
                  </h1>
                  <div className="mt-2">
                    <p className="text-sm text-purple-500">
                      Coupon Code:
                    </p>
                    <input type="text" id='coupon-code' value={couponCode} className="border border-gray-400 px-4 py-2 w-full rounded mt-2" />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex justify-end">
                <button onClick={handleClose} className="mr-4 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-base hover:bg-red-700 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                  Close
                </button>
                <button onClick={handleCopyCode} className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-500 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm">
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
