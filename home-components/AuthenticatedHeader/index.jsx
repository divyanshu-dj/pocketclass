import MusicClassroomLayout from "../MusicClassroomLayout";
import React from "react";
import NewHeader from "../../components/NewHeader";

function AuthenticatedHeader() {
  return (
    <div className="bg-[white] box-border max-w-[1440px] mx-auto sticky top-0">
      <NewHeader />
      <MusicClassroomLayout />
    </div>
  );
}

export default AuthenticatedHeader;
