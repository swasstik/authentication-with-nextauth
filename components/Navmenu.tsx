"use client"
import {signIn,signOut,useSession} from "next-auth/react"


function AuthButton(){
    const {data:session}=useSession();
    if(session){
        return(
          <>
         hello {session.user?.name}<br />
        
          <button onClick={()=>signOut()}>Sign Out</button>
          </>
        );
    }
    return(
        <>
        Not signed in <br/>
        <button onClick={()=>signIn()}>sign In</button>
        </>
    );
}

export default function NavMenu(){
    return(
        <div>
            <AuthButton/>
        </div>
    );
}