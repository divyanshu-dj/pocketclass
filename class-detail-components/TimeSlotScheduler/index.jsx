import TimeSlotDisplay from "../TimeSlotDisplay";
const theme = { others: { FONT_FAMILY_3B46DAFB: "'DM Sans', sans-serif", FONT_FAMILY_A025CB13: "Inter, sans-serif" } };


function TimeSlotScheduler({ timeSlotOptions }) {
  const timeSlotFontFamilyStyles = [
    { fontFamilyStyleProp: theme.others.FONT_FAMILY_3B46DAFB },
    { fontFamilyStyleProp: theme.others.FONT_FAMILY_A025CB13 },
    { fontFamilyStyleProp: theme.others.FONT_FAMILY_A025CB13 },
  ];
  return (
    <div className="flex justify-center items-stretch flex-col gap-2 grow-0 shrink-0 basis-auto mt-[26px]">
      {timeSlotOptions.map((data, index) => {
        return <TimeSlotDisplay {...data} key={index} {...timeSlotFontFamilyStyles[index]} />;
      })}
    </div>
  );
}

export default TimeSlotScheduler;
