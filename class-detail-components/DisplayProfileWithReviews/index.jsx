import ProfileCard from "../ProfileCard";


function DisplayProfileWithReviews({classId}) {
  return (
    <div className="w-[100.00%] box-border mt-10">
      <ProfileCard classId={classId}/>
    </div>
  );
}

export default DisplayProfileWithReviews;
