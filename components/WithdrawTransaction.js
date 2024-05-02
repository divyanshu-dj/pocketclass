import "jspdf-autotable";
import getSymbolFromCurrency from "currency-symbol-map";
import { useEffect } from "react";
import jsPDF from "jspdf";
import jsPDFInvoiceTemplate from "jspdf-invoice-template";
import { useState } from "react";
import { FaReceipt } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
function WithdrawTransaction({ payouts }) {
  const [showPayouts, setShowPayouts] = useState(payouts.length > 0);
  const [user, authStateLoading] = useAuthState(auth)
  const [userData, setUserData] = useState(null);
  const uid = user?.uid;
	useEffect(() => {
    const getAllData = async () => {
      try {
        
        const uData = await getData(uid, "Users")
        setUserData(await uData);
      } catch (error) {
        toast.error("Class Data loading error !", {
          toastId: "classError3",
        });
        console.error(error);
      }
    };

    if ( !!user) getAllData();
  }, [ user]);
  const getData = async (xid, xcol) => {
    const docRef = doc?.(db, xcol, xid);
    const data = await getDoc?.(docRef);
    return data?.data?.();
  };
  const generatePDF2 = () => {
    const invoiceData = {
      outputType: "save",
      returnJsPDFDocObject: true,
      fileName: "Statement.pdf",
      orientationLandscape: false,
      compress: true,
      logo: {
        src: "/pc_logo3.png",
        width: 53.33, //aspect ratio = width/height
        height: 26.66,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      stamp: {
        inAllPages: true,
        src: "/qr-code.png",
        width: 20, //aspect ratio = width/height
        height: 20,
        margin: {
          top: 0, //negative or positive num, from the current position
          left: 0, //negative or positive num, from the current position
        },
      },
      business: {
        name: "Pocketclass",
        address: "Canada",
        email: "contact.pocketclass@gmail.com",
        phone:"+14163178109",
        website: "https://pocketclass.ca",
      },
      contact:{},
      invoice: {
        label: "Statement",
        invGenDate: `Invoice Date: ${new Date().toLocaleDateString()}`,
        headerBorder: true,
        tableBodyBorder: true,
        header: [
          {
            title: "#",
            style: {
              width: 10,
            },
          },
          {
            title: "Title",
            style: {
              width: 30,
            },
          },
          {
            title: "Description",
            style: {
              width: 30,
            },
          },
          { title: "Amount", style: { width: 20 } },
          { title: "TR_ID", style: { width: 60 } },
          { title: "Currency", style: { width: 20 } },
          { title: "Date", style: { width: 20 } },
        ],
        table: payouts.map((item, id) => [
          id + 1,
          item.description || "Withdrawal",
          item.type,
          item.amount + " " + getSymbolFromCurrency(item.currency),
          item.id,
          "CAD" ?? item.currency.toUpperCase(),
          new Date(item.created).toLocaleDateString(),
        ]),

        invDescLabel: "Invoice Note",
        invDesc: "Thank you for using our Platform.",
      },
      footer: {
        text: "The invoice is created on a computer and is valid without the signature and stamp.",
      },
      pageEnable: true,
      pageLabel: "Page ",
    };
    let name =userData?.firstName + " " + userData?.lastName;
    let email = userData?.email;
    let address = userData?.address;
    let phone = userData?.phoneNumber;
     invoiceData.contact= {
      label:"Issued For:",
      name,
      email,
      phone,
      address,
     }
    jsPDFInvoiceTemplate(invoiceData);
  };
  const generatePDF = (payoutObject) => {
    const pdf = new jsPDF();

    // Extract payoutObject properties
    const {
      id,
      object,
      amount,
      arrival_date,
      automatic,
      balance_transaction,
      created,
      currency,
      description,
      destination,
      livemode,
      method,
      reconciliation_status,
      source_type,
      status,
      type,
    } = payoutObject;

    // Define table data
    const tableData = [
      ["ID", id],
      ["Object", object],
      ["Amount", amount],
      ["Arrival Date", new Date(arrival_date * 1000)],
      ["Automatic", automatic ? "Yes" : "No"],
      ["Balance Transaction", balance_transaction],
      ["Created", new Date(created)],
      ["Currency", currency],
      ["Description", description],
      ["Receipnt", destination],
      ["Method", method],
      ["Reconciliation Status", reconciliation_status],
      ["Source Type", source_type],
      ["Status", status],
      ["Type", type],
    ];
    const logoImagePath = "pc_logo3.png";
    const logoWidth = 40;
    const logoHeight = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Calculate center position for the logo
    const centerX = (pageWidth - logoWidth) / 2;
    const logoMarginTop = 10;
    const logoMarginBottom = 10;

    // Add image
    pdf.addImage(
      logoImagePath,
      "PNG",
      centerX,
      logoMarginTop,
      logoWidth,
      logoHeight
    );
    //

    // Add table to PDF with adjusted margin
    const tableMarginTop = logoMarginTop + logoHeight + logoMarginBottom;
    pdf.autoTable({
      head: [["Transaction Receipt", ""]],
      body: tableData,
      margin: { top: tableMarginTop },
    });
    // Add footer
    const pageHeight = pdf.internal.pageSize.getHeight();
    const footerMargin = 10;
    const footerHeight = 5;
    const footerVerticalPosition = pageHeight - footerMargin - footerHeight;
    pdf.setFontSize(8);

    pdf.text(
      "Date: " + new Date().toLocaleDateString(),
      10,
      footerVerticalPosition + 5,
      { align: "left" }
    );

    // Save PDF
    pdf.save("payout-details.pdf");
  };


  return (
    <>
     {showPayouts && (
  <table className="min-w-full">
    <thead>
      <tr className="bg-gray-100">
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tr ID</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
      </tr>
    </thead>
    <tbody>
      {[...payouts].slice().reverse().map((item, id) => (
        <tr key={id} className="border-b">
          <td className="px-4 py-2">{item.description || "Withdrawal"}</td>
          <td className="px-4 py-2">{item.id}</td>
          <td className="px-4 py-2">{new Date(item.created).toLocaleDateString()}</td>
          <td className="px-4 py-2">{`${item.amount} ${getSymbolFromCurrency("USD")}`}</td>
          <td className="px-4 py-2">{item.status}</td>
          <td className="px-4 py-2 cursor-pointer" onClick={() => generatePDF(item)}>
            <div className="flex justify-center">
              <FaReceipt className="text-red" />

            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

      {(showPayouts === false || payouts.length === 0) && (
       <div className="overflow-x-auto">
       <table className="min-w-full leading-normal">
         <thead>
           <tr>
             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
               Description
             </th>
             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
               TR ID
             </th>
             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
               Date
             </th>
             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
               Amount
             </th>
             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
               Status
             </th>
             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
               Receipt
             </th>
           </tr>
         </thead>
         <tbody>
           {/* Iterate over your payouts data here */}
           {payouts.map((payout, index) => (
             <tr key={index}>
               <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                 <p className="text-gray-900 whitespace-no-wrap">{payout.description}</p>
               </td>
               <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                 <p className="text-gray-900 whitespace-no-wrap">{payout.trId}</p>
               </td>
               <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                 <p className="text-gray-900 whitespace-no-wrap">{payout.date}</p>
               </td>
               <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                 <p className="text-gray-900 whitespace-no-wrap">{payout.amount}</p>
               </td>
               <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                 <p className={`text-sm ${payout.status === "Success" ? "text-green-500" : "text-red-500"} font-semibold`}>{payout.status}</p>
               </td>
               <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                 <a href={payout.receiptLink} className="text-blue-500 underline">View Receipt</a>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
     
      )}
      <button
        className='active:scale-105 w-1/6 active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-2 bg-logo-red rounded-xl text-white font-semibold text-sm mt-4 mb-4 align-bottom'
        onClick={() => {
          generatePDF2();
        }}
        hidden={showPayouts === false || payouts.length === 0}
      >
        Download
      </button>
    </>
  );
}
export default WithdrawTransaction;
