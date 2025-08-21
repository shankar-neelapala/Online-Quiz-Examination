import React from 'react';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Instructions from './Instructions';

function StudentDashBoard() {
    const location = useLocation();
    let details = location.state?.details || null;
    const token = location.state?.token || null;
    const [exams, setExams] = useState([]);
    const [currentTime, setCurrentTime] = useState("");
    const[start,setStart] = useState(0);
    const [ind,setInd] = useState(-1);


  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear());
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;
    setCurrentTime(formattedTime);

    axios.get(`http://${import.meta.env.VITE_HOST}:8080/student/getexams`, {
      headers:{Authorization:token},
      withCredentials: true,
      params: {
        branch: details[0].branch,
        semester: details[0].semester,
        date: formattedDate
      }
    })
    .then(res => {
      if (res.data.length > 0) {
        setExams(res.data);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Failed to fetch exams.");
    });
  }, [details]);


  const handleExamTime = (now, start, end) => {
    const [currH, currM] = now.split(':').map(Number);
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const currentMinutes = currH * 60 + currM;
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  const handleSubmitOrNot = async (e,exams) => {
    e.preventDefault();
    if (!details[0] || !exams) {
      alert("Incomplete data to start exam.");
      return;
    }
    const allow = handleExamTime("1:05", exams.startTime, exams.endTime);
    if (!allow) {
      alert(`Exam is only allowed between ${exams.startTime} and ${exams.endTime}`);
      return;
    }
    try {
      const res = await axios.get(`http://${import.meta.env.VITE_HOST}:8080/common/getresults`, {
        headers:{Authorization:token},
        withCredentials: true,
        params: {
          batch: details[0].batch,
          branch: details[0].branch,
          coursecode: exams.coursecode,
          exam_type: exams.examtype,
          semester: details[0].semester,
          section: details[0].section,
          username: details[0].username
        }
      });
      if (res.data != [] && Object.keys(res.data).length > 0) {
        alert("Already submitted.");
        return;
      }
      else{
        setStart(1);
      }

    } catch (err) {
      console.error(err);
      alert("Already Submitted !");
    }
  };

  if (!details[0]) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2 style={{ color: 'red' }}>ERROR: YOUR NOT AN AUTHORIZED PERSON.</h2>
      </div>
    );
  }
  return (
    <div style={{display:'flex',flexWrap:'wrap'}}>
        { exams!=[] && start===0 ?(
            exams.map((items,index)=>(
            <div className="card m-3" key={index} style={{width:"18rem",cursor:'pointer'}} onClick={(e)=>{setInd(index);handleSubmitOrNot(e,exams[index])}}>
                <div className="card-body">
                    <h5 className="card-title">{items?.subject}</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">{items?.examtype}</h6>
                    <h6>{items?.startTime}-{items?.endTime}</h6>
                </div>
            </div>))):("")}
        {
            exams.length==0?(<div className='w-100 mt-3' style={{color:'red',textAlign:'center'}}>YOU HAVE NO EXAM TODAY</div>):("")
        }
        {
            start===1?(<Instructions name={details[0].name}
                                    batch={ details[0].batch} 
                                    branch={ details[0].branch}
                                    coursecode={ exams[ind].coursecode}
                                    examtype={ exams[ind].examtype}
                                    semester={ details[0].semester}
                                    section={ details[0].section}
                                    username={ details[0].username}
                                    role={ details[0].role}
                                    image = {details[0].image}
                                    token = {token} />):("")
        }
    </div>
  )
}

export default StudentDashBoard
