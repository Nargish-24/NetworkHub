import { BASE_URL } from '@/config';
import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import styles from './index.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';


export default function MyConnectionsPage() {

  const dispatch = useDispatch();

  const authState = useSelector((state)=> state.auth)
useEffect(()=>{
     dispatch(getMyConnectionRequests({token: localStorage.getItem("token")})); 
},[]);


const router = useRouter();


useEffect(()=>{
   if(authState.connectionRequests.length !=0){
    console.log(authState.connectionRequests)
   }
},[authState.connectionRequests]);

  return (
    <UserLayout>
    <DashBoardLayout>
        <div style ={{display:"flex" , flexDirection:"column", gap:"1.7rem"}}>
         <h4>My Connections</h4>
         {authState.connectionRequests.length ===0 && <h1>No Connections Requests Pending</h1>}
         {authState.connectionRequests.length !== 0 && authState.connectionRequests.filter((connection)=> connection.status_accepted ===null).map((user,index) => {
           return (
            <div onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)  
            }} className={styles.userCard} key={index} >
                <div style={{display :"flex", alignItems:"center" , gap:"1.2rem", justifyContent:"center"}} >
               <div className= {styles.profilePicture} >
                <img src= {`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
               </div> 
               <div className={styles.userInfo}>
                 <h3>{user.userId.name}</h3>
                 <p>{user.userId.username}</p>                    
                </div> 
                <button onClick={(e)=>{
                   e.stopPropagation();

                   dispatch(AcceptConnection({
                    connectionId: user._id,
                    token:localStorage.getItem("token"),
                    action: "accept"
                   }))
                }} className={styles.connectedButton}>Accept</button>
             </div>
            </div>
           )
         })}
          <h4>My Network </h4>
        
        { authState.connectionRequests.filter((connection) => connection.status_accepted !== null).map((user, index) => {
             return(
              <div onClick={() => {
                router.push(`/view_profile/${user.userId.username}`)  
              }} className={styles.userCard} key={index}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "center" }}>
                      <div className={styles.profilePicture}>
                          <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                      </div> 
                      <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p> 
                                        
                      </div> 
                  </div>
              </div>
             )

                        })}
             
        </div>
    </DashBoardLayout>
  </UserLayout>
    
  )
}
