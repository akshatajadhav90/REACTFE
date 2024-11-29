import { useNavigate } from "react-router-dom"

const HomePage = () => {

    const navigate =  useNavigate()
return (

    <>
    <button onClick={ () =>{
        navigate("/login")
    }}> Login </button>

    <button onClick={ () =>{
        navigate("/signup")
    }}> SignUp </button>

    </>
)


}

export default HomePage