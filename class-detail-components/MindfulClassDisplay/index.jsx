import MindfulClassCard from "../MindfulClassCard";

function MindfulClassDisplay({ packages, classId, mindfulClassCardOptions }) {
  return (
    <div className="w-[100.00%] box-border mt-10">
      {packages?.map((data) => (
        <MindfulClassCard
          {...data}
          key={data.id}
          classId={classId}
          mindfulClassCardOptions={mindfulClassCardOptions}
        />
      ))}
    </div>
  );
}

export default MindfulClassDisplay;
