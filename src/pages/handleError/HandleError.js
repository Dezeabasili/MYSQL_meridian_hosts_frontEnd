import { useNavigate, useLocation } from 'react-router-dom'

const HandleError = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // console.log(location)


  const goBack = () => {
    navigate("/")
    
  }
 
  return (
    <div>
      <p>{location.state.message}</p>
      <br />
      <h4 onClick={goBack} style={{cursor: 'pointer'}}>Go to the Home page</h4>
    </div>
 
  )
}

export default HandleError