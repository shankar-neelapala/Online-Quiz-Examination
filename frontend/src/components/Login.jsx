import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Login() {
const navigate = useNavigate();
    const [empusername,setEmpUsername] = useState("");
    const [emppassword,setEmppassword] = useState("");
    const [stuusername,setStuUsername] = useState("");
    const [stupassword,setStupassword] = useState("");
    const [emperr,setEmperr] = useState();
    const [stuerr,setStuerr] = useState();
    const emp_handle_login = (e) => {
      e.preventDefault();
      axios.post(`http://${import.meta.env.VITE_HOST}:8080/noauth/loginemp`,null, {
        params: { username: empusername, password: emppassword }
      })
      .then(res => {
        const data = res.data;
        if (!data || !Array.isArray(data.details) || data.details.length === 0) {
          setEmperr("Invalid Username And Password");
          return;
        }
        const user = data.details[0];
        if (user.role?.toLowerCase() === "teacher" || user.role?.toLowerCase() === "hod" ) {
          navigate("/employee", {
            state: { details: data.details, token: data.token }
          });
        }
      })
      .catch(err => {
        console.error("Employee login error:", err);
        setEmperr("Login failed. Please try again.");
      });
    };

    const stu_handle_login = (e) => {
      e.preventDefault();
      axios.post(`http://${import.meta.env.VITE_HOST}:8080/noauth/loginstu`,null, {
        params: { username: stuusername, password: stupassword }
      })
      .then(res => {
        const data = res.data;
        if (!data || !Array.isArray(data.details) || data.details.length === 0) {
          setStuerr("Invalid Username And Password");
          return;
        }
        const user = data.details[0];
        if (user.role?.toLowerCase() === "student") {
          navigate("/student", {
            state: { details: data.details, token: data.token }
          });
        } else {
          setStuerr("Invalid Username And Password");
        }
      })
      .catch(err => {
        console.error("Student login error:", err);
        setStuerr("Login failed. Please try again.");
      });
    };

  return (
    <div style={{width:'100%',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',gap:'10%',border:'1px solid'}}>
      <form onSubmit={emp_handle_login}>
        <center><h6 style={{fontWeight:'bold',color:'red'}}>{emperr}</h6></center>
        <div className="row mb-3 mw-100 border row-gap-3" style={{width:'100%',display:'flex',flexDirection:'column',borderRadius:'20px',paddingTop:'0 0 0 0'}}>
            <p className="fs-2 fw-medium border-bottom" style={{padding:'15px 15px 15px 15px',backgroundColor:'skyblue',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',textAlign:'center'}}>EMPLOYEE</p>
            <div className="col-sm-10 gap-3" style={{width:'fit-content',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <b>USERNAME</b><input type="text" name="Username" value={empusername} onChange={(e)=>{setEmpUsername(e.target.value)}} autoComplete='on' style={{position:'relative'}} className="form-control h-25 d-inline-block" placeholder="Enter Username" required />
            </div>
            <div className="col-sm-10 gap-3" style={{width:'fit-content',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <b>PASSWORD</b><input type="password" name="password" value={emppassword} onChange={(e)=>{setEmppassword(e.target.value)}} autoComplete='on' className="form-control h-25 d-inline-block" placeholder="Enter Password" required />
            </div>
            <center><button type="submit" className="btn btn-primary btn-sm " style={{width:'fit-content',backgroundColor:'skyblue',marginBottom:'15px'}}>LOGIN</button></center>
        </div>

        </form>

      <form onSubmit={stu_handle_login}>
        <center><h6 style={{fontWeight:'bold',color:'red'}}>{stuerr}</h6></center>
        <div className="row mb-3 mw-100 border row-gap-3" style={{width:'100%',display:'flex',flexDirection:'column',borderRadius:'20px',paddingTop:'0 0 0 0'}}>
            <p className="fs-2 fw-medium border-bottom" style={{padding:'15px 15px 15px 15px',backgroundColor:'skyblue',borderTopLeftRadius:'20px',borderTopRightRadius:'20px',textAlign:'center'}}>STUDENT</p>
            <div className="col-sm-10 gap-3" style={{width:'fit-content',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <b>USERNAME</b><input type="text" name="Username" value={stuusername} onChange={(e)=>{setStuUsername(e.target.value)}} autoComplete='on' style={{position:'relative'}} className="form-control h-25 d-inline-block" placeholder="Enter Username" required />
            </div>
            <div className="col-sm-10 gap-3" style={{width:'fit-content',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <b>PASSWORD</b><input type="password" name="password" value={stupassword} onChange={(e)=>{setStupassword(e.target.value)}} autoComplete='on' className="form-control h-25 d-inline-block" placeholder="Enter Password" required />
            </div>
            <center><button type="submit" className="btn btn-primary btn-sm " style={{width:'fit-content',backgroundColor:'skyblue',marginBottom:'15px'}}>LOGIN</button></center>
        </div>

        </form>
    </div>
  )
}

export default Login
