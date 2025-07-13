import jsPDF from "jspdf";
import moment from "moment-timezone";
import "jspdf-autotable";

const InvoiceModal = ({ isOpen, onClose, appointment, classData }) => {
  if (!isOpen || !appointment || !classData) return null;

  const {
    student_name,
    groupEmails,
    createdAt,
    startTime,
    price,
    packageDiscount = 0,
    voucherDiscount = 0,
    processingFee = 0,
    total,
    timeZone,
  } = appointment;

  const formatCurrency = (val) => `CA $${parseFloat(val || 0).toFixed(2)}`;
  const formatDateTime = (dt) =>
    moment(dt).tz(timeZone || "America/Toronto").format("h:mm A, D MMM YYYY");

  const subTotal = price - packageDiscount - voucherDiscount;
  const calculatedTotal = total !== undefined ? total : subTotal + processingFee;

  const handleDownload = async () => {
    const doc = new jsPDF();

    const getBase64ImageFromURL = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = (error) => reject(error);
        img.src = url;
      });

    try {
      const imageData = await getBase64ImageFromURL("/assets/image_5c0480a2.png");
      doc.addImage(imageData, "PNG", 14, 10, 40, 0);
    } catch (err) {
      console.error("Could not load logo", err);
    }

    doc.setFontSize(18);
    doc.text("Invoice", 14, 35);

    doc.setFontSize(12);
    doc.text(`Billed To: ${student_name}`, 14, 45);
    doc.text(`Email: ${groupEmails[0]}`, 14, 52);
    doc.text(`Booking Created: ${moment(createdAt?.seconds * 1000).format("D MMM YYYY [at] h:mm A")}`, 14, 59);
    doc.text(`Class: ${classData.Name}`, 14, 66);
    doc.text(`Address: ${classData.Address}`, 14, 73);
    doc.text(`Class Start Time: ${moment(startTime).format("D MMM YYYY [at] h:mm A")}`, 14, 80);

    doc.autoTable({
      startY: 90,
      head: [["Item", "Amount"]],
      body: [
        ["Lesson Price", formatCurrency(price)],
        ["Package Discount", formatCurrency(packageDiscount)],
        ["Voucher Discount", formatCurrency(voucherDiscount)],
        ["Processing Fee", formatCurrency(processingFee)],
        ["Subtotal", formatCurrency(subTotal)],
        ["Total", formatCurrency(calculatedTotal)],
      ],
      styles: { halign: "left" },
      headStyles: { fillColor: [255, 0, 0] },
    });

    doc.save(`Invoice_${appointment.id || "download"}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-white z-[99999999] flex flex-col overflow-y-auto">
      {/* Top Buttons Row */}
      <div className="w-full flex justify-between items-center px-6 py-4 border-b">
        <button
          onClick={onClose}
          className="text-3xl text-gray-500 hover:text-black"
        >
          &times;
        </button>
        <button
          onClick={handleDownload}
          className="text-white bg-black font-medium text-sm border border-black px-4 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Download PDF
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Invoice</h2>

        <div className="border rounded-lg p-4 sm:p-6 space-y-4 text-sm text-gray-700">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <p className="font-semibold text-black">{classData.Name}</p>
              <p>{classData.Address}</p>
              <p>
                {moment(createdAt?.seconds * 1000).format("D MMM YYYY [at] h:mm A")}
              </p>
            </div>
            <div>
              <p>Billed To:</p>
              <p className="text-black">{student_name}</p>
              <p className="text-logo-red break-words">{groupEmails[0]}</p>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-between">
            <span>
              Lesson Price
              <br />
              <span className="block mt-2 text-gray-500">
                {moment(startTime).format("D MMM YYYY")}
              </span>
            </span>
            <span className="font-medium">{formatCurrency(price)}</span>
          </div>

          {/* Discounts */}
          <div className="pt-4 border-t space-y-2">
            <p className="uppercase text-gray-400 text-xs font-semibold">Discounts</p>
            <div className="flex justify-between">
              <span>Package Discount</span>
              <span>{formatCurrency(packageDiscount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Voucher Discount</span>
              <span>{formatCurrency(voucherDiscount)}</span>
            </div>
          </div>

          {/* Subtotal & Fees */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span>{formatCurrency(processingFee)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t text-base font-semibold flex justify-between">
            <span>
              Total
              <p className="mt-1 text-sm text-gray-500">
                {moment(createdAt?.seconds * 1000).format("D MMM YYYY [at] h:mm A")}
              </p>
            </span>
            <span>{formatCurrency(calculatedTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
