import "./navbar.css";
import "./../menu/menu.css";
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import useWindowSize from "../../hooks/useWindowSize";
import Menu_Admin_Structure from "../menu/Menu_Admin_Structure";
import Menu_RegisteredUser from "../menu/Menu_RegisteredUser";
import Menu_Admin from "../menu/Menu_Admin";
import Menu_Guest from "../menu/Menu_Guest";
import Menu_RegisteredUser_Structure from "../menu/Menu_RegisteredUser_Structure";
import Menu_Guest_Structure from "../menu/Menu_Guest_Structure";

const Navbar = () => {
  const { auth } = useAuthContext();
  const screenSize = useWindowSize();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleHide, true);

    return () => {
      document.removeEventListener("click", handleHide, true);
    };
  }, []);

  useEffect(() => {
    setShowMenu(false);
  }, [screenSize]);

  const handleHide = () => {
    setShowMenu(false);
  };

  const menuSelector = () => {
    if (auth.assignedRoles == 2010) {
      return <Menu_RegisteredUser_Structure />;
    } else if (auth.assignedRoles == 2030) {
      return <Menu_Admin_Structure />;
    } else {
      return <Menu_Guest_Structure />;
    }
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/">
          <span className="logo nowrap">Meridian Hosts</span>
        </Link>
        <div className="navContainerimgDiv">
          <img
            src="/pictures/free-american-flag.jpg"
            alt="American Flag"
            width="50"
            height="50"
          />
        </div>

        <div className="menu-bar">
          <ul>
            {/* <li className='navSpan navSpan1'><Link to={'/just'}>USD</Link></li> */}
            {/* <li className='navButton navButton1'><img src='../pictures/free-american-flag.jpg' alt='' width="20" height="20" /></li> */}
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/login"}>Sign in</Link>
              <div className="sub-menu-1">
                <ul>
                  <li>
                    <Link to={"/register"}>Sign up</Link>
                  </li>
                  <li>
                    <Link to={"/logout"}>Sign out</Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a href="#">About Us</a>
              <div className="sub-menu-1">
                <ul>
                  <li>
                    <a href="#">Mission</a>
                  </li>
                  <li>
                    <a href="#">Vision</a>
                  </li>
                  <li>
                    <a href="#">Team</a>
                  </li>
                  <li>
                    <a href="#">Contact us</a>
                  </li>
                </ul>
              </div>
            </li>
            {auth.accessToken && (
              <li>
                <Link to={"/users/myaccount"}>My account</Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="navbarMainMenu">
        <p onClick={() => setShowMenu(true)}>Menu</p>
        {showMenu && menuSelector()}
      </div>
    </div>
  );
};

export default Navbar;
