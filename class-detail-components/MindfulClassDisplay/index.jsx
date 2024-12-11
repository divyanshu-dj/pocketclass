import MindfulClassCard from "../MindfulClassCard";

function MindfulClassDisplay({ packages }) {
  return (
    <div className="w-[100.00%] box-border mt-10">
      {packages?.map((data) => (
        <MindfulClassCard {...data} key={data.id} />
      ))}
    </div>
  );
}

export default MindfulClassDisplay;
