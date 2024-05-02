import { useEffect, useState } from "react";
// Assuming you want to use FontAwesome for the bank icon, ensure it's installed and imported correctly.
import { FaBank } from "react-icons/fa"; // This line is to show how you might import an icon with React Icons, adjust as necessary.

function PaymentSelect({ setWithdrawDisabled ,accountNumber}) {
  const [bankAccounts, setBankAccounts] = useState([]);
  

  useEffect(() => {
    fetch("/api/getApprovedBankAccounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({ connectedAccountId: accountNumber }),
    }).then((res) => {
      res.json().then((bankAccountsReceived) => {
        if (!bankAccountsReceived.data) {
          return;
        }
        let finalItems = bankAccountsReceived.data.map((item) => ({
          ...item,
          checked: item.checked ? item.checked : false,
        }));
        if(finalItems.length > 0){
        setBankAccounts(finalItems);
        }
        console.log("Bank accounts fetched: ", finalItems);
      });
    });
  }, []);

  return (
    <div>
      {
      bankAccounts.map((item, id) => (
        <div
          className="flex items-center my-3 px-3 py-3 border rounded"
          key={id}
        >
          <input
            className="form-radio text-blue-600 mr-2 ml-0"
            type="radio"
            name="flexRadioDefault"
            id={item.id}
            checked={item.checked}
            onChange={() => {
              let finalItems = bankAccounts.map((acc) =>
                acc.id === item.id ? { ...acc, checked: true } : acc
              );

              setWithdrawDisabled({ accountId: item.id, disabled: false });
              // Ensure you have a dispatch method or remove this if not using Redux or similar.
              // dispatch({
              //   type: "GET_BANK_ACCOUNT",
              //   payload: finalItems,
              // });
              setBankAccounts(finalItems);
            }}
          />
          <label
            className="flex justify-between items-center w-full"
            htmlFor={item.id} // React uses htmlFor instead of for
          >
            <p className="mb-0">
              Withdraw with <strong>{item.bank_name}</strong> Ending with{" "}
              <strong>{item.last4}</strong>
            </p>
            {/* <FaBank className="h-5 w-5" /> Example icon usage */}
            
          </label>
        </div>
      ))
      }
    </div>
  );
}

export default PaymentSelect;
