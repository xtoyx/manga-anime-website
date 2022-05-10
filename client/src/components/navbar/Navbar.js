import "./Navbar.css";
import avatar from "../../assets/avatar.svg";
import { Link , useParams ,useNavigate, Navigate} from 'react-router-dom';

const Navbar = ({ sidebarOpen, openSidebar }) => {
  return (
    <nav className="navbar">
      <div className="nav_icon" onClick={() => openSidebar()}>
        <i className="fa fa-bars" aria-hidden="true"></i>
      </div>
      <div className="navbar__left">
       
        <Link className="active_link" to="/admin/Dashboard/Admin">
          Admin
        </Link>
      </div>
      <div className="navbar__right">
      <Link className="active_link" to="/admin/Dashboard/Admin">
          <img width="30" src={avatar} alt="avatar" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;