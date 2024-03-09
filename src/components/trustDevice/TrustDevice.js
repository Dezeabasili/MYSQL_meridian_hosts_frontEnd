import "./trustDevice.css";
import { Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuthContext, baseURL } from "../../context/authContext";
import {RotatingLines} from 'react-loader-spinner'
import { useNavigate, useLocation } from "react-router-dom";


const TrustDevice = () => {
  
  const [loading, setLoading] = useState(true);
  const runOnce = useRef(false)
  const navigate = useNavigate();
  const location = useLocation();

  const { auth, setAuth, trustThisDevice } = useAuthContext();

  useEffect(() => {
    if (runOnce.current === false) {
      const getNewAccessToken = async () => {
        setLoading(true);
        try {
          if (trustThisDevice) {
            const res = await axios.get(baseURL + "api/v1/auth/renew_access_token", {
              withCredentials: true,
            });
            const accessToken = res.data.accessToken;
            const assignedRoles = res.data.assignedRoles;
            setAuth((prev) => {
              return {
                ...prev,
                accessToken,
                assignedRoles,
              };
            });
          }
        } catch (err) {
          if (err.response.data.message) {
            navigate('/handleerror', {state: {message: err.response.data.message, path: location.pathname}})
          } else {
            navigate('/somethingwentwrong')
          }
        } finally {
          setLoading(false);
        }
      };
  
      auth.accessToken ? setLoading(false) : getNewAccessToken();
    }

    return () => {
      runOnce.current = true
    }

  }, []);

  return (
    <>
      {trustThisDevice ? (
        <div className="trustDevice">
          {loading ? 
          <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
          /> : 
          <Outlet />
          }
        </div>
      ) : (
        <div className="trustDevice">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default TrustDevice;
