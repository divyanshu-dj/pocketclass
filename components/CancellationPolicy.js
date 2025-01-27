import moment from "moment";
import * as React from "react";

export function CancellationPolicy({ bookingDetails }) {
  return (
    <div className="w-[61%] max-md:w-full">
      <h2 className="mb-2 text-2xl font-bold leading-8 text-black">
        Free cancellation
      </h2>
      <div className="text-sm font-medium leading-5 text-black">
        <p>
          Cancel or reschedule for a 5% fee until {moment.utc(bookingDetails?.startTime).subtract(1, "days").format("DD MMM, YYYY")} at {moment.utc(bookingDetails?.startTime).format("hh:mm A")}.
        </p>
        <br />
        <p>
          At PocketClass, we understand that life is unpredictable, and plans can change. That's why we offer a Free Cancellation policy up to 24 hours to give you the flexibility and peace of mind you deserve.
        </p>
        <br />
        <p>
          Our goal is to make learning stress-free, so you can focus on your growth without worrying about unforeseen circumstances. Check the cancellation details on each booking to know the specific time limits for free cancellation, and enjoy the confidence of booking with no strings attached!
        </p>
      </div>
    </div>
  );
}