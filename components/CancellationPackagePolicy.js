import moment from "moment";
import * as React from "react";

export function CancellationPolicy({ bookingDetails }) {
  return (
    <div className="w-[61%] max-md:w-full">
      <h2 className="mb-2 text-2xl font-bold leading-8 text-black">
        Package Cancellation Policy
      </h2>
      <div className="text-sm font-medium leading-5 text-black">
        <p>
          We understand that plans can change, and we want to offer flexibility
          while keeping things fair for our instructors. If you’ve purchased a
          lesson package, you can reschedule any individual lesson up to 48
          hours before the scheduled start time at no cost.
        </p>
        <br />
        <p>
          This policy helps us provide a seamless experience while respecting
          our instructors’ time. If you have any questions, feel free to reach
          out—we’re happy to assist!
        </p>
      </div>
    </div>
  );
}
