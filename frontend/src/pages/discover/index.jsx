import {getAllPosts} from '@/config/redux/action/postAction';
import {getAllUsers} from '@/config/redux/action/authAction'
import DashBoardLayout from '@/layout/DashBoardLayout';
import UserLayout from '@/layout/UserLayout';
import {useRouter} from 'next/router';
import React,{useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { BASE_URL } from '@/config';
import styles from './index.module.css';



export default function DiscoverPage() {

    const dispatch = useDispatch();
   
    const router = useRouter();
    const authState = useSelector((state) => state.auth); 

    useEffect(() => {
        if (!authState.all_profile_fetched) {
          dispatch(getAllUsers()); 
        }
    }, [])
      

  return (
    <UserLayout>
        <DashBoardLayout>
            <div>
            <h1>Discover</h1>
            <div className={styles.allUserProfile}>

              {authState.all_profiles_fetched && authState.all_users.map((user)=>{
                return(
                     <div onClick={()=>{
                       router.push(`/view_profile/${user.userId.username}`)
                     }} key ={user._id} className={styles.userCard}>
                        <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile" />
                       <div>
                       <h1>{user.userId.name}</h1>
                       <p>@{user.userId.username}</p>
                       </div>
                     </div>
                )
              })}
       


             </div>
            </div>
        </DashBoardLayout>
  </UserLayout>
  )
}
