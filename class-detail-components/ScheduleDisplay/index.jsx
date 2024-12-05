import TimeSlotScheduler from "../TimeSlotScheduler";

function ScheduleDisplay({ timeSlotOptions }) {
  return (
    <div className="flex justify-center items-stretch flex-col grow-0 shrink-0 basis-auto">
      <p className="[font-family:'DM_Sans',sans-serif] text-base font-medium text-[black] grow-0 shrink-0 basis-auto m-0 p-0">Wednesday, 10 November 2024</p>
      <TimeSlotScheduler timeSlotOptions={timeSlotOptions} />
    </div>
  );
}

export default ScheduleDisplay;
