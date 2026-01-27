import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";

function PublicLayout (){
    return(
        <>
        <Topbar />
        <Outlet />
        </>
    )
}

export default PublicLayout;