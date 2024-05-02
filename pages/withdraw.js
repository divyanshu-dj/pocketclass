import React, { useEffect, useFetch } from "react";

import MyBalance from "./../components/MyBalance";
import PaymentSelect from "./../components/PaymentSelect";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth,db } from "../firebaseConfig";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Head from "next/head";
import Footer from "../components/Footer";
const WithdrawTransaction = dynamic(
  () => import("../components/WithdrawTransaction"),
  { ssr: false }
);
import moment from "moment";
function Balance({   }) {
    const [myBalance, setMyBalance] = React.useState(0);
    const [accountBalance, setAccountBalance] = React.useState(0);
    const [withdrawn, setWithdrawn] = React.useState(0);
    const [payouts, setPayouts] = React.useState([]);
  const [withdrawDisabled, setWithdrawDisabled] = React.useState({
    accountId: "",
    disabled: true,
  });

  const [user, authStateLoading, error] = useAuthState(auth);
  const [isTheUser, setIsTheUser] = React.useState(false);
  const [anyPendingBanks, setAnyPendingBanks] = React.useState(false);
  const [paymentDetails, setPaymentDetails] = React.useState({
    amount: "",
    currency: "CAD",
    accountNumber: "",
  });
  const [currency, setCurrency] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [currencySelected, setCurrencySelected] = React.useState("cad");
  const [pendingAmount,setPendingAmount]=React.useState(0);
  const fetchEverthing = async () => {
    toast.loading("Loading Balance and Details...");
    //get account from the firebase
    const accountIdRef= doc(db, "Users", user.uid);
    const accountId = await getDoc(accountIdRef);
   const accountNumber = accountId.data().stripeAccountId;
    if(!accountId.data().stripeAccountId)return;
    const account = await fetch("/api/getValidCurrencies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const pending = await fetch("/api/anyPendingBanks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const pendingBanks = await pending.json();
    setAnyPendingBanks(pendingBanks.anyPending);
    Promise.all([account, pendingBanks]).finally(() => {
      toast.dismiss();
    });

    let validCurrencies = await account.json();
    setPaymentDetails({ ...paymentDetails, accountNumber:accountNumber });
    console.log(accountNumber);
    //remove duplicates
    validCurrencies = [...new Set(validCurrencies)];
    setCurrency(validCurrencies);
    await updatePayoutsAndBalance(accountNumber);
  };
  useEffect(() => {
    if(!user)return;
    if(!window)return;
    setTimeout(() => {
      void fetchEverthing();
    }
    , 1000);
  }, [user]);

  const updatePayoutsAndBalance = async (
    accountNumber = paymentDetails.accountNumber
  ) => {
    console.log(paymentDetails.accountNumber);
    if(!accountNumber)return;
    toast.loading("Loading Balance and Details...");
    let payouts = fetch("/api/getPayouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: accountNumber,
      }),
    }).then((res) => {
      res.json().then((payoutsReceived) => {
        let payoutsReceivedObj = payoutsReceived.map((payout) => {
          return {
            ...payout,
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            location: user?.location,
          };
        });

        let withdrawn = 0;
        payoutsReceived.forEach((payout) => {
          withdrawn += payout.amount;
        });

        setWithdrawn(withdrawn);
        setPayouts(payoutsReceived);
        console.log(payoutsReceived);
      });
    });
    let getBalanceObject = fetch("/api/getBalanceObj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId:accountNumber,
      }),
    });
    getBalanceObject.then((res) => {
      res.json().then((balanceObj) => {
        setAccountBalance(balanceObj.available[0].amount/100);
        setPendingAmount(balanceObj.pending[0].amount/100)
        
      });
    });
    let banks = fetch("/api/getApprovedBankAccounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connectedAccountId: accountNumber,
      }),
    }).then((res) => {
      res.json().then((bankAccountsReceived) => {
        let finalItems = bankAccountsReceived.data.map((item) => ({
          ...item,
          checked: item.checked ? item.checked : false,
        }));
      });
    });
    Promise.all([getBalanceObject, banks, payouts]).finally(() => {
      toast.dismiss();
    });
  };
  const sendEmail = async (targetEmail, targetSubject, targetText, now) => {
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: targetSubject,
          text: `${targetText} \n\nTime:${moment(now)?.format?.(
            "DD-MM-YY / hh:mm A"
          )}`,
          to: targetEmail,
        }),
      });
    } catch (error) {
      console.warn(error);
    }
  };
  
  const handleWithdraw = async () => {
    const { amount, accountNumber } = paymentDetails;
    let currency = currencySelected;
    toast.loading("Processing Withdrawal");
    // if(amount>accountBalance){
    //     alert("Insufficient balance");
    //     return;
    // }
    // Make an API call to your backend to make the payout
    const payout = await fetch("/api/makePayoutToClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        balance: amount,
        account:accountNumber,
        currency: currency,
      }),
    });
 

    if (payout.status === 200) {
      toast.success("Withdrawal Successful");
      updatePayoutsAndBalance();
      await sendEmail( user.email, "Withdrawal Successful", `You have successfully withdrawn ${amount}$ from your account.`, new Date());
    } else {
      let response = await payout.json();
      toast.dismiss();
      toast.error(response.result);
      
    }
  };
  

  return (
    <>
    <div className="mx-auto">
            <Head>
                <title>Wallet</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/pc_favicon.ico" />
            </Head>
            <Header />
            <div className="max-w-7xl mx-auto px-8 py-8 min-h-[80vh] sm:px-16">
          <div className='col-lg-6'>
            {anyPendingBanks && (
              <div className='alert alert-warning' role='alert'>
                Additional information is required to make a withdrawal. Please
                click{" "}
                <button
                  style={{ color: "#0000FF" }}
                  onClick={() => {
                    window.open("https://dashboard.stripe.com/");
                  }}
                >
                  here
                </button>{" "}
                to update your bank details.
              </div>
            )}

            {/* <button
              className='btn btn-primary'
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Add Bank Details
            </button> */}
        <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
  
    <h1 className='text-3xl font-extrabold text-center py-5'>Wallet Management</h1>
  
  <div className='p-6'>
    <form action=''>
      <div className='flex flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 '>
        <div className="flex-col">
        <div className='flex-1'>
          <label htmlFor='inputState' className='text-lg font-medium'>
             Amount
          </label>
          <input
            type='text'
            id="inputState"
            className='w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent focus:outline-none focus:border-logo-red focus:ring-1 focus:ring-logo-red'
            placeholder='Example: 1000'
            max={accountBalance} 
            onChange={(e) => {
              setPaymentDetails({
                ...paymentDetails, 
                amount: e.target.value,
              });
            }}
          />
        </div>
        
        <div className='flex-1   m-0 '>
        {
        paymentDetails.accountNumber&& <PaymentSelect
            setWithdrawDisabled={setWithdrawDisabled} 
            accountNumber={paymentDetails.accountNumber}// Ensure setWithdrawDisabled is defined somewhere in your component
          />}
        </div>
        <div className='flex-1   m-0'>

         {!withdrawDisabled.disabled&& <button
            className=' text-white bg-logo-red px-10 py-4 shadow-md rounded-full font-bold my-8 hover:shadow-2xl hover:scale-105 active:scale-90 transition duration-150'
            type='button'
            onClick={() => {
              handleWithdraw(); // Ensure handleWithdraw is defined somewhere in your component
            }}
            // Ensure withdrawDisabled is correctly managed in your component's state
          >
            Withdraw
          </button>
}
        </div>
        </div>
        <div className='flex flex-col justify-between space-y-4 bg-white p-6 '>
    <div>
        <p className='text-sm font-semibold text-gray-700'>Available</p>
        <h3 className='text-2xl font-bold text-green-600'>{accountBalance + "$"}</h3>
    </div>
    <div>
        <p className='text-sm font-semibold text-gray-700'>Pending Clearance</p>
        <h3 className='text-2xl font-bold text-yellow-600'>{pendingAmount + "$"}</h3>
    </div>
    <div>
        <p className='text-sm font-semibold text-gray-700'>Withdrawn</p>
        <h4 className='text-xl font-bold text-red-600'>{Math.floor(withdrawn)}</h4>
    </div>
</div>

      </div>
    </form>
  </div>
</div>

          </div>
          <div className='col-lg-6'>
            <div className='card'>
              <div className='card-header'>
                <h4 className='text-3xl font-extrabold text-center py-5'>My Balance</h4>
              </div>
              <div className='card-body'>
                
                <div className='my-chart'>
                 { accountBalance>0 && <MyBalance accountBalance={accountBalance} payouts={payouts}/>}
                 { !accountBalance>0 && <div className="text-center">
                  Balance History Not Available
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div className='col-12'>
            <div className='card transparent'>
              <div className='card-header'>
                <h4 className='text-3xl font-extrabold text-center py-5'>Transactions</h4>
              </div>
              <div className='card-body'>
                <div className='rtable rtable--5cols rtable--collapse'>
                  {payouts.length>0&&<WithdrawTransaction payouts={payouts} />}
                  {!payouts.length>0&&
                  <div className="text-center">
                    No Transactions
                  </div>
                  }
                </div>
              </div>
            </div>
          </div>
          </div>
          <Footer />
        </div>

    </>
  );
}
export default Balance;
