import React from 'react'
import { useState,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentDashBoard from './StudentDashBoard';
import StuProfile from './StuProfile';
import ExamSchedule from './ExamSchedule';

function Student() {
  const navigate = useNavigate();
  const location = useLocation();
  const details = location.state?.details || null;
  const token = location.state?.token || null;
  const [page,setPage] = useState(<StudentDashBoard details={details} branch={details[0].branch} token={token} />);
  const dashboardRef = useRef(null);
  const profileRef = useRef(null);
  const examsRef = useRef(null);
  const logoutRef = useRef(null);
  if (!details) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2 style={{ color: 'red' }}>ERROR: YOUR NOT AN AUTHORIZED PERSON.</h2>
      </div>
    );
  }

  return (
    <div className='h-100 w-100'>
      <div className="p-2 bg-info bg-gradient text-dark w-100 text-start text-uppercase" style={{backgroundColor:'#99ccff'}}><b>WELCOME {details[0].name || "Student"}</b></div>
        <div className='d-inline-block w-100 d-flex flex-row border' style={{height:'100vh'}}>
          <div className='border vertical list-group' style={{width:'16%',height:'100vh',borderRadius:'0'}}>
            <ul style={{listStyleType:'none',paddingLeft:'0',margin:'0',backgroundColor:'#99ccff'}}>
              <li>
            <button className="list-group-item list-group-item-action active" ref={dashboardRef} data-bs-toggle="list" role="tab" 
            onClick={()=>{ dashboardRef.current.classList.add("active");
                           profileRef.current.classList.remove("active");
                           examsRef.current.classList.remove("active");
                           logoutRef.current.classList.remove("active");
                           setPage(<StudentDashBoard details={details} token={token}/>);
            }}>DashBoard</button></li>
            <li>
            <button className="list-group-item list-group-item-action" ref={profileRef} data-bs-toggle="list" role="tab" 
            onClick={()=>{profileRef.current.classList.add("active");
                          dashboardRef.current.classList.remove("active");
                          examsRef.current.classList.remove("active");
                          logoutRef.current.classList.remove("active");
                          setPage(<StuProfile details={details} token={token}/>);
            }}>Profile</button>
            </li>
            <li>
            <button className="list-group-item list-group-item-action" ref={examsRef} id='exams' data-bs-toggle="list" role="tab" 
            onClick={()=>{dashboardRef.current.classList.remove("active");
                          profileRef.current.classList.remove("active");
                          examsRef.current.classList.add("active");
                          logoutRef.current.classList.remove("active");
                          setPage(<ExamSchedule details={details} branch={details[0].branch} token={token}/>)
            }} >Exam Schedule</button>
            </li>
            <li>
            <button className="list-group-item list-group-item-action" ref={logoutRef} data-bs-toggle="list" role="tab"
             onClick={()=>{dashboardRef.current.classList.remove("active");
                          profileRef.current.classList.remove("active");
                          examsRef.current.classList.remove("active");
                          logoutRef.current.classList.add("active");
                          navigate("/");
            }} >Logout</button>
            </li></ul>
          </div>
          <div className='border h-100' style={{width:'84%'}}>
            {page}
          </div>
        </div>
    </div>
  )
}

export default Student
