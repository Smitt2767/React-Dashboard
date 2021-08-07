import React from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import RoomRightPanel from "./RoomRightPanel";
import CreateRoom from "../../Components/Modal/CreateRoom";

import { useSelector } from "react-redux";
const PrivateChat = () => {
  const { activeTab, showCreateRoomModal } = useSelector(
    (state) => state.privateChat
  );
  return (
    <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
      {showCreateRoomModal && <CreateRoom />}
      <div className="h-full w-full overflow-y-hidden flex items-center shadow-xl">
        <LeftPanel />
        {activeTab === 0 ? <RightPanel /> : <RoomRightPanel />}
      </div>
    </div>
  );
};

export default PrivateChat;
