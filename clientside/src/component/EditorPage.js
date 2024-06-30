/** @format */

import React, { useState,useRef, useEffect } from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom"
import { initSocket } from "../socket";
import toast from 'react-hot-toast';

import Client from "./Client";
import Editor from "./Editor";
const EditorPage = () => {
	
	const codeRef = useRef(null);
	const socketRef=useRef(null)
	const location=useLocation();
	const {roomId}=useParams();
	const navigate=useNavigate()
  const [clients, setClients]=useState([])
  
  useEffect(()=>{
	const init=async()=>{
		socketRef.current= await initSocket();
		socketRef.current.on("connect_error",(err)=>handleError(err))
		const handleError=(error)=>{
			console.log("Connection failed");
			toast.error("connection Failed")
			navigate("/")

		}
		socketRef.current.emit("join",{
			roomId,
			username:location.state.userName
		})
		socketRef.current.on("joined",({clients,username,socketId})=>{
			if(location.state.userName!==username){
				toast.success(`${username} is connected`)
			}
			setClients(clients);
	        socketRef.current.emit("code-sync",{
				code:codeRef.current,
				socketId,
			})
			
		})
		socketRef.current.on("disconnected",({socketId,username})=>{
			toast.success(`${username} is disconnected`);
			setClients((prev)=>{
				return prev.filter((client)=> client.socketId!==socketId)
			})
		})
		
		
	}
	init()

	return ()=>{
		(socketRef.current && socketRef.current.disconnect());
		socketRef.current.off("joined")
		socketRef.current.off("disconnected")
	}

  },[])

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`room Id is copied`);
    } catch (error) {
      console.log(error);
      toast.error("unable to copy the room Id");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };
	return (
		<div className='h-screen w-screen md:flex text-white'>
			<div className='md:w-2/12 overflow-x-scroll bg-slate-800 md:h-screen no-scrollbar '>
				<li className='text-3xl font-bold text-green-400 mx-auto list-none w-full pb-4 border-b-2 text-center'>Code Sync</li>
				<div className='my-3 flex md:flex-col md:mb-auto'>
       				 {
         				 clients.map((client,i)=>(
           				 <Client key={client.socketId} username={client.username}/>
          					))
        			}
        
        </div>
				<div className=' flex flex-wrap justify-center my-2'>
					<button className=' p-1 bg-green-400 rounded-lg mx-2 mb-2' onClick={copyRoomId}>
						Copy Room Id
					</button>
					<button className=' p-1 bg-red-600 rounded-lg mb-2' onClick={leaveRoom}>Leave Room</button>
				</div>
			</div>


			{/* code part */}
			<div className='md:w-10/12 h-full bg-slate-950'>
        <Editor socketRef={socketRef} roomId={roomId}
			onCodeChange={(code) => {
              codeRef.current = code;
            }}
		/>
      </div>
		</div>
	);
};

export default EditorPage;
