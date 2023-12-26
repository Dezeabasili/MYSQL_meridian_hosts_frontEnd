import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";

const FindUser = () => {
  const [email, setEmail] = useState();

  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    //   let userArray = [];
      const resp = await axiosWithInterceptors.post("/users/finduser", {
        email,
      });
      console.log(resp.data.data);
    //   userArray.push(resp.data.data);
      navigate("/users/getuser", { state: resp.data.data });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <form className="registerContainer" onSubmit={handleSubmit}>
        <h3 className="registerTitle">Provide the user email</h3>

        <div className="registerDiv">
          <label htmlFor="email">User email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>

        <button className="signUpButton" disabled={!email}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default FindUser;