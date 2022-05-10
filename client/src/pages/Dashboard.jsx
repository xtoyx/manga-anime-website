import { useEffect, useState } from 'react'
import { Link , useParams , useNavigate} from 'react-router-dom';

import Main from "../components/main/Main";
import AdminM from '../components/Admin_Pages/AdminM'; 
import Geners from '../components/Admin_Pages/Geners'; 
import Users from '../components/Admin_Pages/Users'; 
import UserMessage from '../components/Admin_Pages/UserMessage'; 
import Mangas from '../components/Admin_Pages/Mangas'; 
import Manga_wat from '../components/Pages_ForEdit/Manga_wat';

import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import '.././pages-css/dashboard.css';

const Dashboard = ({data}) => {
  const {title,hmn}=useParams();
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const openSidebar = () => {
    setsidebarOpen(true);
  };
  const closeSidebar = () => {
    setsidebarOpen(false);
  };
  if(!data){
    return (
      <div id="preloder">
        <div className="loader"></div>
      </div>
    )
  }
  return (
    <div className="container2">
      <Navbar sidebarOpen={sidebarOpen} openSidebar={openSidebar} />
      
      {title ==='Users' ? <Users Info={data}/> :null} 
     
      {title ==='Users=[Message]' ? <UserMessage Info={data}/> :null}

      {title ==='Admin Management' ? <AdminM Info={data}/> :null}

      {title ==='Geners' ? <Geners Info={data}/> :null}
      {/* {hmn&& title ==='Anime' ? <Users /> : null} */}


      {/* {title ==='Contracts' ? <Contracs Info={data}/> :null} */}

      {title ==='Manga' && !hmn ? <Mangas Info={data}/> :null}
      {hmn&& title ==='Manga' ? <Manga_wat Info={data}/> : null}

      {title==='Admin' ? <Main />: null}
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
    </div>
  )
};

export default Dashboard;