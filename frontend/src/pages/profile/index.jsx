import DashBoardLayout from '@/layout/DashBoardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect ,useState} from 'react'
import styles from './index.module.css';
import { BASE_URL, clientServer } from '@/config';
import { useDispatch , useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';

export default function ProfilePage() {

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);

     const [userPosts,setUserPosts]= useState([]);

    const [userProfile , setUserProfile] = useState({})

    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [educationModalOpen, setEducationModalOpen] = useState(false);

    const [inputData , setInputData]= useState({company:"", position:"",years:""})

    const [educationInputData , setEducationData] = useState({University:"", Degre:"",Session:""})

  const handleWorkInputChange =(e)=> {
     const {name , value }= e.target;
     setInputData({...inputData ,[name]:value});
  }

  const handleEducationInputChange =(e)=> {
    const {name , value }= e.target;
    setEducationData({...educationInputData ,[name]:value});
 }

   

   
    useEffect(()=>{
      dispatch(getAllPosts());
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }, []);

     const updateProfileData =async() => {
      const request = await clientServer.post("/user_update",{
        token:localStorage.getItem("token"),
        name:userProfile.userId.name,
      });
      const response = await clientServer.post("/update_profile_data",{
         token : localStorage.getItem("token"),
         bio:userProfile.bio,
         currentPost:userProfile.currentPost,
         pastWork:userProfile.pastWork,
         education:userProfile.education
      });

      dispatch(getAboutUser({token:localStorage.getItem("token")}));

     }


    useEffect(()=>{
       
        if(authState.user != undefined){
          setUserProfile(authState.user)
          let post = postReducer.posts.filter((post) => {
            return post.userId.username === authState.user.userId.username;
          });
          console.log(post, authState.user.userId.username)
          setUserPosts(post);
        }

    },[authState.user ,postReducer.posts]);


    const updateProfilePicture = async (file) => {
      const formData = new FormData();
      formData.append("profile_picture", file);
      formData.append("token", localStorage.getItem("token"));

      const response = await clientServer.post('/update_profile_picture', formData ,{
        header:{
          "Content-Type":  "multipart/form-data",
        },
      });

      dispatch(getAboutUser({token:localStorage.getItem("token")}));
      
      
    }

     

  return (
    
    <UserLayout>
        <DashBoardLayout>
            {authState.user && userProfile.userId && 
        <div className={styles.container}>
      <div className={styles.backDropContainer}> 
        <label htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
               <p> 
                   Edit
                </p>
        </label>
        <input 
          type="file" 
          id="profilePictureUpload" 
          hidden 
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              updateProfilePicture(e.target.files[0]);
            }
          }} 
        />
        <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="backdrop" />
         
         </div>
     
      
     
          <div className={styles.profileContainer_details}>
              <div className={styles.profileContainer_flex}>
              
               <div style={{flex:"0.8"}}>
                     
                     <div style={{display:"flex",width:"fit-content",alignItems:"center", gap:"1.2rem"}}>

                     <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) => 
                      setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                    }   
                     />

                          <p style={{color:"grey" }}>   @{userProfile.userId.username} </p>

                      <div onClick={async()=>{
                                const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                              window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                                  }} style={{cursor:"pointer"}}>
                                <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                               </svg>
                        
                          </div>


                    </div>
                         <div>
                            <textarea value={userProfile.bio}
                           onChange={(e)=>{
                            setUserProfile({...userProfile, bio: e.target.value});
                           }}
                            rows={Math.max(3,Math.ceil(userProfile.bio.length/80))}
                           style={{width:"100%"}} placeholder='Add Bio'
                           />  
                        </div>
                       
                    </div>

               <div style={{flex:"0.2"}}>
                 <h3>Recent Activity</h3>
                 {userPosts.map((post)=>{
                  return(
                   <div key={post._id} className={styles.postCard}>
                     <div className={styles.card}>
                        <div className={styles.card_profile_container}>

                          {post.media !== "" ? (<img src={`${BASE_URL}/${post.media}`} alt="" />) 
                          :  
                            <div style ={{width:"3.4rem",height:"3.4em"}}></div>}

                        </div>
                        <p>{post.body}</p>


                     </div>

                   </div>
                  )
                  })}


               </div>


              </div>
          
      </div>

       <div className="workHistory">

        <h4>Work History</h4>

        <div className={styles.workHistoryContainer}>
         
         {
          userProfile.pastWork.map((work, index)=>{
            return(
              <div key={index} className={styles.workHistoryCard}>
                <p style={{fontWeight:"bold", display:"flex",alignItems:"center",gap:"0.8em"}}>{work.company} - {work.position}
                </p>
                <p>{work.years}</p>

              </div>
            )
          })
          }
        

          <button className= {styles.addWorkButton} onClick={()=>{
                 setIsModalOpen(true)
            }}> Add Work  </button>

           </div>

      </div>
      <div className="workHistory">

<h4>Education </h4>

<div className={styles.workHistoryContainer}>
 
 {
  userProfile.education.map((education, index)=>{
    return(
      <div key={index} className={styles.workHistoryCard}>
        <p style={{fontWeight:"bold", display:"flex",alignItems:"center",gap:"0.8em"}}>{education.University} 
        </p>
        <p>{education.degree}</p>
        <p>{education.fieldOfStudy}</p>

      </div>
    )
  })
  }


  <button className= {styles.addWorkButton} onClick={()=>{
        setEducationModalOpen(true)
    }}> Add qualification   </button>

   </div>

</div>

       {userProfile !== authState.user && 
       <div onClick={()=>{
         updateProfileData();
       }} className = {styles.updateProfileBtn}>
        
        UpdateProfile
        
        </div>

                  
        }

     </div>
}

     {
         isModalOpen &&
             <div
                onClick={()=>{
                 setIsModalOpen(false)
                }}
             className={styles.commentsContainer}>
                     <div 
                     onClick={(e)=>{
                      e.stopPropagation()
                     }}
                     className={styles.allCommentsContainer}>
                           <input  onChange={handleWorkInputChange} name ="company" className={styles.inputField}type="text" placeholder='Company Name' />
                           <input  onChange={handleWorkInputChange} name='position' className={styles.inputField}type="text" placeholder='Position' />
                           <input  onChange={handleWorkInputChange} name='years' className={styles.inputField}type="text" placeholder='Years' />
                            <div onClick={()=>{
                              setUserProfile({...userProfile , pastWork :[...userProfile.pastWork , inputData]});
                              setIsModalOpen(false);
                            }} className={styles.updateProfileBtn}>Add Work</div>
                      </div>
                         
             </div>
           }
            {
         educationModalOpen &&
             <div
                onClick={()=>{
                  setEducationModalOpen(false)
                }}
             className={styles.commentsContainer}>
                     <div 
                     onClick={(e)=>{
                      e.stopPropagation()
                     }}
                     className={styles.allCommentsContainer}>
                           <input  onChange={handleEducationInputChange} name ="University" className={styles.inputField}type="text" placeholder='University' />
                           <input  onChange={handleEducationInputChange} name='degree' className={styles.inputField}type="text" placeholder='Degree' />
                           <input  onChange={handleEducationInputChange} name='fieldOfStudy' className={styles.inputField}type="text" placeholder='Session' />
                            <div onClick={()=>{
                              setUserProfile({...userProfile , education :[...userProfile.education , educationInputData]});
                              setEducationModalOpen(false);
                            }} className={styles.updateProfileBtn}>Add Qualifications</div>
                      </div>
                         
             </div>
           }
        </DashBoardLayout>
       
    </UserLayout>
  )
}




