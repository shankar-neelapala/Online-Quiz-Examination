import React from 'react'
import axios from 'axios';
import { useState,useEffect } from 'react';
import FormComponent from './Form';

function UpdateExamSchedule({token}) {

  const [regulation, setRegulation] = useState("V20");
    const [batch, setBatch] = useState("2021");
    const [branch, setBranch] = useState("CSE");
    const [semester, setSemester] = useState("I");
    const [subjects, setSubjects] = useState({});
    const [sections,setSections] = useState(["ALL"]);
    const [ccode,setCcode] = useState("");
    const [exam_type,setExam_type] = useState("MID-1");
    const [displayque,setDisplayque] = useState(0);
    const [buttonname,setButtonname] = useState("SHOW");
    const [ subjectText, setSubjectText] = useState("LINEAR ALGEBRA AND DIFFERNTIAL EQUATIONS");
    const [schedule,setSchedule] = useState({});
    const [starttime,setStarttime] = useState("");
    const [endtime,setEndtime] = useState("");
    const [date,setDate] = useState("");
    const [id,setId] = useState("");
    


    const handleregulation = (selectedBatch,selectedbranch) => {
    axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/getregulation`, {
      headers:{Authorization:token},
      withCredentials: true,
      params: { batch: selectedBatch, branch:selectedbranch }
    })
    .then(res => {
      console.log(res.data[0].regulation);
      setRegulation(res.data[0].regulation);
    })
    .catch(err => alert(err));
  };

  const handlegetschedule =(e)=>{
    e.preventDefault();
      axios.get(`http://${import.meta.env.VITE_HOST}:8080/admin/getschedule`,{headers:{Authorization:token},
      withCredentials: true,params:{exam_type:exam_type,branch:branch,coursecode:ccode,semester:semester,subject:subjectText}})
          .then(res =>{
            setId(res.data[0].id);
            setSchedule(res.data[0]);
            setEndtime(res.data[0].endTime);
            setStarttime(res.data[0].startTime);
            setDate(res.data[0].date);
            setDisplayque(1);
          })
          .catch(err => alert(err))
        }

  const updateschedule =(e)=>{
    e.preventDefault();
    console.log(date,starttime,endtime);
    axios.post(`http://${import.meta.env.VITE_HOST}:8080/admin/updateschedule`,{id:id,examtype:exam_type,branch:branch,semester:semester,coursecode:ccode,subject:subjectText,date:date,startTime:starttime,endTime:endtime},
      {headers:{Authorization:token},
      withCredentials: true,}
    )
    .then(res=>{console.log(res.data);alert("schedule updated")})
  }

  useEffect(() => {
    axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/getsubjects`, {
      headers:{Authorization:token},
      withCredentials: true,
      params: {
        regulation: regulation,
        branch: branch,
        semester: semester
      }
    })
    .then(res => {
      setSubjects(res.data[0]);
      setCcode("-1");
      setSubjectText();
    })
    .catch(err => alert(err));
  }, [branch, regulation, semester]);

  const formatDateToInput = (ddmmyyyy) => {
    const [day, month, year] = ddmmyyyy.split("-");
    return `${year}-${month}-${day}`;
  };

  const formatTimeToInput = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const hh = hour.padStart(2, "0");
  const mm = minute.padStart(2, "0");
  return `${hh}:${mm}`;
};


  return (
    <div>
      <FormComponent
        batch={batch}
        setBatch={setBatch}
        branch={branch}
        setBranch={setBranch}
        semester={semester}
        setSemester={setSemester}
        subjects={subjects}
        ccode={ccode}
        setCcode={setCcode}
        exam_type={exam_type}
        setExam_type={setExam_type}
        sections={sections}
        setSections={setSections}
        setDisplay={setDisplayque}
        buttonname = {buttonname}
        setButtonname = {setButtonname}
        handleregulation={handleregulation}
        handlequestions={handlegetschedule}
        setSubjectText={setSubjectText}
      />
      <div style={{marginTop:'10px',marginBottom:'10px'}}>
      { displayque ===1 &&
      <form onSubmit={updateschedule}>
        <table>
          <thead>
            <tr>
              <th>SNO</th>
              <th>COURSECODE</th>
              <th>SUBJECT</th>
              <th>DATE</th>
              <th>START TIME</th>
              <th>ENDTIME</th>
              {schedule && schedule.id && (
                  <th style={{display:'none'}}>{schedule.id}</th>
                )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{schedule.coursecode}</td>
              <td>{schedule.subject}</td>
              <td><input type='date' value={formatDateToInput(date)} onChange={(e)=>{setDate(formatDateToInput(e.target.value))}}/></td>
              <td><input type='time' value={formatTimeToInput(starttime)} onChange={(e)=>{setStarttime(formatTimeToInput(e.target.value))}} /></td>
              <td><input type='time' value={formatTimeToInput(endtime)} onChange={(e)=>{setEndtime(formatTimeToInput(e.target.value))}} /></td>
              <td><button type='submit'>SAVE</button></td>
            </tr>
          </tbody>
        </table>
      </form>
      }
      </div>
    </div>
  );
}

export default UpdateExamSchedule
