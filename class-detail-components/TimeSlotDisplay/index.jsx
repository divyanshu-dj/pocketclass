function TimeSlotDisplay({ timeSlotStartTime1, timeSlotStartTime, timeSlotEndTime, fontFamilyStyleProp }) {
  return (
    <div className="flex justify-center items-stretch flex-row gap-[7px] h-[43px] grow-0 shrink-0 basis-auto box-border pr-[84px]">
      <div className="border box-border flex justify-center items-center flex-col grow-0 shrink-0 basis-auto px-[21px] rounded-[100px] border-solid border-[#7d797a]">
        <p className="text-sm font-medium text-[#7d797a] whitespace-pre-wrap grow-0 shrink-0 basis-auto m-0 p-0" style={{ fontFamily: fontFamilyStyleProp }}>
          {timeSlotStartTime1}
        </p>
      </div>
      <div className="border box-border flex justify-center items-center flex-col grow-0 shrink-0 basis-auto px-[20.5px] rounded-[100px] border-solid border-[#7d797a]">
        <p className="[font-family:Inter,sans-serif] text-sm font-medium text-[#7d797a] whitespace-pre-wrap grow-0 shrink-0 basis-auto m-0 p-0">{timeSlotStartTime}</p>
      </div>
      <div className="border box-border flex justify-center items-center flex-col grow-0 shrink-0 basis-auto px-[21.5px] rounded-[100px] border-solid border-[#7d797a]">
        <p className="[font-family:Inter,sans-serif] text-sm font-medium text-[#7d797a] whitespace-pre-wrap grow-0 shrink-0 basis-auto m-0 p-0">{timeSlotEndTime}</p>
      </div>
    </div>
  );
}

export default TimeSlotDisplay;
