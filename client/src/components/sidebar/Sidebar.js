/* eslint-disable jsx-a11y/anchor-is-valid */
import "./Sidebar.css";
import logo from "../../assets/logo.png";
import { Link , useParams ,useNavigate, Navigate} from 'react-router-dom';
const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  const {title}=useParams();
  const navigate = useNavigate()
  const Logout=(e)=>{
    e.preventDefault();
    try{
      fetch("http://localhost:5000/api/logoutAdmin", {
                      method: "GET",
                      credentials: "include",
                      headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                          "Access-Control-Allow-Credentials": true,
                      }
                    })
                    .then((response) => {
                      if (response.status === 200) return response.json();
                    })
                    .then((resObject) => {
                    navigate('/')
                    window.location.reload('false')
                      return;
                      })
                      .catch((err) => {
                          console.log(err);
                      });
    }catch(err){
      console.log(err)
  }
  }
  return (
    <div className={sidebarOpen ? "sidebar_responsive" : ""} id="sidebar">
      <div className="sidebar__title">
        <div className="sidebar__img">
          <img src={logo} alt="logo" />
          <h1>Manga || Anime Website</h1>
        </div>
        <i
          onClick={() => closeSidebar()}
          className="fa fa-times"
          id="sidebarIcon"
          aria-hidden="true"
        ></i>
      </div>

      <div className="sidebar__menu">
        {title === 'Admin' ?
        <div className="sidebar__link active_menu_link">
          <i className="fa fa-home"></i>
          <Link to="/admin/Dashboard/Admin">Dashboard</Link>
        </div>
        : <div className="sidebar__link">
        <i className="fa fa-home"></i>
        <Link to="/admin/Dashboard/Admin">Dashboard</Link>
      </div>
        }

        <h2>Admin Side</h2>
        {title === 'Admin Management' ?
        <div className="sidebar__link active_menu_link">
          <i className="fa fa-user-secret" aria-hidden="true"></i>
          <Link to="/admin/Dashboard/Admin Management">Admin Management</Link>
        </div>
        :<div className="sidebar__link">
        <i className="fa fa-user-secret" aria-hidden="true"></i>
        <Link to="/admin/Dashboard/Admin Management">Admin Management</Link>
      </div>
        }

        {title==='Contracts'?
        <div className="sidebar__link active_menu_link">
        <i className="fa fa-handshake-o"></i>
        <Link to="/admin/Dashboard/Contracts">Contracts</Link>
      </div> :
        <div className="sidebar__link">
          <i className="fa fa-handshake-o"></i>
          <Link to="/admin/Dashboard/Contracts">Contracts</Link>
        </div>
      }

        <h2>Users</h2>

        {title === 'Users' ? 
        <div className="sidebar__link active_menu_link">
          <i className="fa fa-question"></i>
          <Link to="/admin/Dashboard/Users">Show All</Link>
        </div> :
        <div className="sidebar__link">
        <i className="fa fa-question"></i>
        <Link to="/admin/Dashboard/Users">Show All</Link>
      </div>
        }

        {title === 'Users=[Message]' ?
        <div className="sidebar__link active_menu_link">
        <i className="far fa-envelope"></i>
        <Link to="/admin/Dashboard/Users=[Message]">Send A Message</Link>
        </div> : 
        <div className="sidebar__link">
        <i className="far fa-envelope"></i>
        <Link to="/admin/Dashboard/Users=[Message]">Send A Message</Link>
        </div>}
        
        <h2>Mangas</h2>

        {title === 'Manga' ?
         <div className="sidebar__link active_menu_link">
          <i className="fa fa-question"></i>
          <Link to="/admin/Dashboard/Manga">Show All</Link>
        </div> : <div className="sidebar__link">
          <i className="fa fa-question"></i>
          <Link to="/admin/Dashboard/Manga">Show All</Link>
        </div>}
        

        <h2>Geners</h2>

        {title === 'Geners' ?
        <div className="sidebar__link active_menu_link">
          <i className="fa fa-question"></i>
          <Link to="/admin/Dashboard/Geners">Show All</Link>
        </div> : 
        <div className="sidebar__link">
        <i className="fa fa-question"></i>
        <Link to="/admin/Dashboard/Geners">Show All</Link>
      </div>}
        
        <div className="sidebar__logout">
          <i className="fa fa-power-off"></i>
          <a onClick={(e)=>{Logout(e)}} style={{cursor:'pointer'}}>Log out</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;