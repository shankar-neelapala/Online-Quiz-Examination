import React, { useState,useRef } from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import ExamSchedule from './ExamSchedule';
import ConductExam from './ConductExam';
import ViewQuestions from './ViewQuestions';
import ViewResults from './ViewResults';
import UpdateExamSchedule from './UpdateExamSchedule';
import GroqChatDirect from './GrokChatDirect';
function Employee() {
  const location = useLocation();
  const navigate = useNavigate();
  const details = location.state?.details || null;
  const token = location.state?.token || null;
  const [page,setPage] = useState(<ExamSchedule branch={details[0].branch} details={details} token={token} />);
  const dashboardRef = useRef(null);
  const conductexamRef = useRef(null);
  const updatescheduleRef = useRef(null);
  const viewqueRef = useRef(null);
  const viewresultRef = useRef(null);
  const logoutRef = useRef(null);
  const [ai,setAi] = useState();
  const tdiv = useRef(null);

  if (!details) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2 style={{ color: 'red' }}>ERROR: YOUR NOT AN AUTHORIZED PERSON.</h2>
      </div>
    );
  }

  return (
    <div className='h-100 w-100'>
      <div className="p-2 bg-info text-dark w-100 text-start text-uppercase" style={{display:'flex',justifyContent:'space-between',cursor:'pointer'}} ><b>WELCOME {details[0]?.name || "Employee"}</b>
        <div style={{marginRight:'2%'}} onClick={()=>setAi(<GroqChatDirect />)}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" fill="currentColor" class="bi bi-chat-text" viewBox="0 0 16 16">
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
          <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8m0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5"/>
        </svg>
        <b onClick={()=>{setAi(<GroqChatDirect />);tdiv.current.style.display="flex"}} style={{cursor:'pointer'}}>CHATBOARD</b></div>
      </div>
        <div className='d-inline-block w-100 d-flex flex-row border' style={{height:'100vh'}}>
          <div className='border vertical list-group' style={{width:'16%',height:'100vh',borderRadius:'0'}}>
            <button className="list-group-item list-group-item-action active" ref={dashboardRef} data-bs-toggle="list" role="tab" 
            onClick={()=>{ dashboardRef.current.classList.add("active");
                           conductexamRef.current.classList.remove("active");
                           viewresultRef.current.classList.remove("active");
                           viewqueRef.current.classList.remove("active");
                           logoutRef.current.classList.remove("active");
                           details[0].role==="HOD"?(updatescheduleRef.current.classList.remove("active")):(null)
                           setPage(<ExamSchedule details={details} branch={details[0].branch} token={token} />)
            }}>DASHBOARD</button>
            <button className="list-group-item list-group-item-action" ref={conductexamRef} data-bs-toggle="list" role="tab" 
            onClick={()=>{conductexamRef.current.classList.add("active");
                          viewresultRef.current.classList.remove("active");
                          dashboardRef.current.classList.remove("active");
                          viewqueRef.current.classList.remove("active");
                          logoutRef.current.classList.remove("active");
                          details[0].role==="HOD"?(updatescheduleRef.current.classList.remove("active")):(null);
                          setPage(<ConductExam username={details[0].username} token={token} />);
            }}>CONDUCT EXAM</button>
            {details[0].role==="HOD"?(
            <button className="list-group-item list-group-item-action" ref={updatescheduleRef} data-bs-toggle="list" role="tab" 
            onClick={()=>{conductexamRef.current.classList.remove("active");
                          viewresultRef.current.classList.remove("active");
                          dashboardRef.current.classList.remove("active");
                          viewqueRef.current.classList.remove("active");
                          logoutRef.current.classList.remove("active");
                          details[0].role==="HOD"?(updatescheduleRef.current.classList.add("active")):(null)
                          setPage(<UpdateExamSchedule username={details[0].username} token={token} />);
            }}>UPDATE EXAM SCHEDULE</button>):(null)}
            <button className="list-group-item list-group-item-action" ref={viewqueRef} id='exams' data-bs-toggle="list" role="tab" 
            onClick={()=>{dashboardRef.current.classList.remove("active");
                          viewresultRef.current.classList.remove("active");
                          conductexamRef.current.classList.remove("active");
                          viewqueRef.current.classList.add("active");
                          logoutRef.current.classList.remove("active");
                          details[0].role==="HOD"?(updatescheduleRef.current.classList.remove("active")):("")
                          setPage(<ViewQuestions username={details[0].username} token={token}/>)
            }} >VIEW QUESTION PAPER</button>
            <button className="list-group-item list-group-item-action" ref={viewresultRef} data-bs-toggle="list" role="tab"
             onClick={()=>{dashboardRef.current.classList.remove("active");
                          conductexamRef.current.classList.remove("active");
                          viewqueRef.current.classList.remove("active");
                          logoutRef.current.classList.remove("active");
                          viewresultRef.current.classList.add("active");
                          details[0].role==="HOD"?(updatescheduleRef.current.classList.remove("active")):("");
                          setPage(<ViewResults username={details[0].username} token={token} />)
            }} >VIEW RESULTS</button>
            <button className="list-group-item list-group-item-action" ref={logoutRef} data-bs-toggle="list" role="tab"
             onClick={()=>{dashboardRef.current.classList.remove("active");
                          viewresultRef.current.classList.remove("active");
                          conductexamRef.current.classList.remove("active");
                          viewqueRef.current.classList.remove("active");
                          logoutRef.current.classList.add("active");
                          details[0].role==="HOD"?(updatescheduleRef.current.classList.remove("active")):("")
                          navigate("/");
            }} >LOGOUT</button>
          </div>
          <div className='border h-100' style={{width:'84%',overflow:'scroll'}}>
            {page}
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',flexWrap:'nowrap'}}>
            <div ref={tdiv} style={{overflow:'scroll',display:'none',position:'absolute',border:'1px solid',backdropFilter:'blur(10px)',height:'315px',width:'30%'}}>
              <div style={{height:'fit-content',width:'99%',display:'flex',justifyContent:'flex-end',marginTop:'5px',cursor:'pointer',zIndex:'1'}}>
                <svg onClick={()=>{setAi("");tdiv.current.style.display="none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" className="bi bi-x-square-fill" viewBox="0 0 16 16" style={{cursor:'pointer'}}>
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
                </svg>
              </div>
              <div style={{position:'absolute'}}>
                {ai}
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Employee
