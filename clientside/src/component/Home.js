import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from 'react-hot-toast';
import {useNavigate} from "react-router-dom"
const Home = () => {
  const navigate=useNavigate();
	const [roomId, setRoomId] = useState("");
	const [userName, setUserName] = useState("");
  const joinRoom=()=>{
    if(!roomId){
      toast.error("Enter RoomID");
      return;
    }
    if(!userName){
      toast.error("Enter UserName");
      return;
    }
    // redirect to editor page
    navigate(`/editor/${roomId}`,{
      state:{
        userName,
      }
    })
    toast.success("Entered in the room")
  }
  const handleInputEnter=(e)=>{
      if(e.code==="ENTER"){
        joinRoom();
      }
  }
	const createNewRoom = (e) => {
		e.preventDefault();
		const id = uuidV4();
		setRoomId(id);
    toast.success("NEW ROOM CREATED")
	};

	return (
		<div className=' h-screen w-full flex justify-center align-middle items-center bg-[#1c1e29]'>
			<div className='flex justify-center flex-col bg-[#282a36] p-4 w-[400px] w-max-[90%] rounded-2xl h-[300px]'>
				<h1 className='text-green-400 text-4xl font-bold  mb-3'>CODE SYNC</h1>
				<h4 className='text-white mb-2'>Paste Invitation Room id</h4>

				<form
					className='flex flex-col'
					action=''
					onSubmit={(e) => e.preventDefault()}>
					<input
						className='rounded-lg p-1 font-semibold'
						value={roomId}
						onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
						type='text'
						placeholder='Room ID'
					/>
					<input
						className='my-2 rounded-lg p-1 font-semibold'
						type='text'
            value={userName}
						onChange={(e) => setUserName(e.target.value)}
            onKeyUp={handleInputEnter}
						placeholder='USER NAME'
					/>
					<button className='bg-green-400 w-16 ml-auto rounded-lg font-semibold p-1 hover:bg-green-500'
          onClick={joinRoom}
          >
						JOIN
					</button>
					<span className='text-white mt-6'>
						if You dont have then create{" "}
						<span onClick={createNewRoom} className='text-green-400 cursor-pointer' href=''>
							new room
						</span>{" "}
					</span>
				</form>
			</div>
		</div>
	);
};

export default Home;
