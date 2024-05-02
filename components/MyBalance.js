import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

function MyBalance({ payouts, accountBalance }) {
  const [showPayouts, setShowPayouts] = useState(true);
  const user = useAuthState(auth);
  // Sort payouts by date ascending
  console.log("payouts", payouts);
  if (!payouts) return null;
  if(payouts.length<=0)return null;
  payouts.sort((a, b) => new Date(a.created) - new Date(b.created));
 

  let totalWithdrawn = 0;
  payouts.forEach((item) => {
    console.log("item.amount", item.amount);
    totalWithdrawn += item.amount
    console.log(totalWithdrawn)
  });
  let totalBalance = accountBalance + totalWithdrawn;
  console.log("totalBalance", totalBalance);
  console.log('accountBalance',accountBalance)

  // Calculate cumulative balance
  let balanceData = [];
  let cumulativeBalance = 0;
  payouts.forEach((item) => {
    cumulativeBalance += item.amount;
    balanceData.push(totalBalance - cumulativeBalance);
  });
  console.log("balanceData", balanceData);

  const data = {
    labels: payouts.map((item) => {
          return (
            new Date(item.created).getDate() +
            " " +
            new Date(item.created).toLocaleString("default", { month: "short" })
          );
        }) || [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      ,
    datasets: [
      {
        label: "My Balance",
        backgroundColor: "rgba(32, 212, 137, 1)",
        borderColor: "rgba(32, 212, 137, 1)",
        data: balanceData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderWidth: 1,
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      mode: "index",
      intersect: false,
      titleFontColor: "#888",
      bodyFontColor: "#555",
      titleFontSize: 12,
      bodyFontSize: 15,
      backgroundColor: "rgba(256,256,256,0.95)",
      displayColors: true,
      xPadding: 10,
      yPadding: 7,
      borderColor: "rgba(220, 220, 220, 0.9)",
      borderWidth: 2,
      caretSize: 6,
      caretPadding: 5,
    },
  };

  return <Line data={data} height={150} options={options} />;
}

export default MyBalance;
