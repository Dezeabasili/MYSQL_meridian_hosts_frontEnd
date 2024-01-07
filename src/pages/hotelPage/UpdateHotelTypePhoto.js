import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";

const UpdateHotelTypePhoto = () => {
 
  const [hotelTypeRef, setHotelTypeRef] = useState();
  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
     // Specify the types of files, the size limit in MB, and whether its a single or multiple files
     const fileOptions = {
        types: [".jpg"],
        sizeLimit: 5,
        number: "single",
        code: "hoteltypephoto",
        id: hotelTypeRef,
      };
      navigate("/uploadfiles", { state: fileOptions });
    }
 

  return (
    <div className="register">
      <form className="registerContainer" onSubmit={handleSubmit}>
        <h3 className="registerTitle">Provide city reference</h3>

        <div className="registerDiv">
          <label htmlFor="cityName">City reference:</label>
          <input
            id="cityName"
            type="text"
            value={hotelTypeRef || ''}
            onChange={(e) => setHotelTypeRef(e.target.value)}
            autoComplete="off"
          />
        </div>
        

        <button
          className="signUpButton"
          disabled={
            !hotelTypeRef
          }
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default UpdateHotelTypePhoto;
