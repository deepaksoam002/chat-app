import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../utils/apiAuth";


function PublicRoute(){

    const { accessToken } = useAuth();

    if( accessToken){

        return <Navigate to='/user/chat-space' replace/>
    }

    return <Outlet/>

}


export default PublicRoute;
