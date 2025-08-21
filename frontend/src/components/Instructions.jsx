import React from 'react'
import { useNavigate } from 'react-router-dom';

function Instructions(props) {
    const navigate = useNavigate();
    const name=props.name;
    const batch= props.batch; 
    const branch= props.branch;
    const coursecode= props.coursecode;
    const examtype= props.examtype;
    const semester= props.semester;
    const section= props.section;
    const username= props.username;
    const token = props.token;
    const role = props.role;
    const image = props.image;

    const handleexam = (e)=>{
      e.preventDefault();
      goFullscreen();
      navigate("/exam",{state:{name:name,batch:batch,branch:branch,coursecode:coursecode,examtype:examtype,semester:semester,section:section,username:username,image:image,session:true,role:role,token:token}});
    }
    const goFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) =>
            console.error('Fullscreen error:', err)
        );
        } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
        }
    };

  return (
     <div className='p-4 w-100' style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <center>
    <div className='p-3' style={{borderRadius:'10px',border:'1px solid skyblue'}}>
      <center><h4>INSTRUCTIONS</h4></center>
      <form onSubmit={handleexam}>
      <ul style={{textAlign:'left'}}>
        <li>The Duration of the contest is 20 Minutes.</li>
        <li>There are a total of 20 questions, and 1/2 marks are awarded for every correct response.</li>
        <li>There are four options for each MCQ out of which only one will be correct.</li>
        <li>If you finished your exam then please submit the exam. If time limit has reached then your answers will be submitted automatically.</li>
        <li>Please submit a response to an MCQ once you are sure, as you cannot change it once submitted.</li>
        <li>The maximum mark for the contest is 10.</li>
      </ul>
      <div style={{marginLeft:'15px',display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
          <input type="checkbox" name="checkbox" id="checkbox" style={{width:'18px',height:'18px'}} required/>
          <label htmlFor="checkbox">&nbsp; Mark as if you read all the instructions mentioned above.</label>
      </div>
      <div>&nbsp;</div>
      <center>
        <button type="submit" className="btn btn-info">START</button>
      </center>
      </form>
    </div></center>
    </div>
  )
}

export default Instructions
