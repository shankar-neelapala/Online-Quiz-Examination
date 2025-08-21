import React from 'react'
import axios from 'axios';
import { useState,useEffect } from 'react';
import FormComponent from './Form';

function ViewQuestions({username,token}) {
     const [regulation, setRegulation] = useState("V20");
      const [batch, setBatch] = useState("2021");
      const [branch, setBranch] = useState("CSE");
      const [semester, setSemester] = useState("I");
      const [subjects, setSubjects] = useState({});
      const [sections,setSections] = useState(["ALL"]);
      const [ccode,setCcode] = useState("");
      const [exam_type,setExam_type] = useState("MID-1");
      const [displayque,setDisplayque] = useState(0);
      const [question,setQuestion] = useState([]);
      const [buttonname,setButtonname] = useState("View Questions");
      const [ subjectText,  setSubjectText] = useState("");
      const [updatebutton,setUpdatebutton] = useState("UPDATE");

    const handleregulation = (selectedBatch) => {
    axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/getregulation`, {
      headers:{Authorization:token},
      withCredentials: true,
      params: { batch: selectedBatch,branch:branch}
    })
    .then(res => {
      console.log(res.data[0].regulation);
      setRegulation(res.data[0].regulation);
    })
    .catch(err => {alert(err);setSubjects([""])});
  };

  const handleviewquestions =(e)=>{
    e.preventDefault();
    axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/checkeligibility`,{headers:{Authorization:token},
      withCredentials: true,params:{username:username,coursecode:ccode}})
    .then(res =>{
      if(res.data.output==="eligible"){
          axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/getquestions`,{headers:{Authorization:token},
      withCredentials: true,params:{batch:batch,exam_type:exam_type,branch:branch,coursecode:ccode}})
          .then(res =>{ if(res.data!=""){setQuestion(res.data);setDisplayque(1);}
                        else{alert("No Questions entered.");}
          })
          .catch(err => alert(err))
        }
        else{
          setDisplayque(0);
          alert("you are not eligible to view questions to this subject.");
        }
    })  
  }

  const handleupdateque = (e,index)=>{
      e.preventDefault();
      axios.put(`http://${import.meta.env.VITE_HOST}:8080/teacher/updatequestion`,{id: question[index].id,batch: batch,exam_type: exam_type,
                                                                          branch: branch,semester: question[index].semester,
                                                                          coursecode: ccode,question_no: question[index].question_no,
                                                                          question: question[index].question,options: question[index].options,
                                                                          answer: question[index].answer},
                                                                        {headers:{Authorization:token},
                                                                        withCredentials: true,})
          .then(res =>{ console.log(res.data);if(res.data==1){alert("Updated");}})
          .catch(err => alert(err))
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
    })
    .catch(err => alert(err));
  }, [branch, regulation, semester]);


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
        displayque = {displayque}
        setDisplay={setDisplayque}
        buttonname = {buttonname}
        setButtonname = {setButtonname}
        handleregulation={handleregulation}
        handlequestions={handleviewquestions}
        setSubjectText={setSubjectText}
      />
        {(displayque===1 && Array.isArray(question))?(
        question.map((result,index)=>(<form key={index} onSubmit={handleupdateque} id="que-form"><div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',marginBottom:'20px'}}>
                <div style={{display:'none'}}>{subjectText}</div>
                <div style={{display:'flex',width:'95%',padding:'10px',marginBottom:'10px'}}>
                  <div style={{display:'none'}}>{result.id}</div>
                  <div style={{width:'5%',display:'flex',alignItems:'center',justifyContent:'center'}}>Q{result.question_no}:</div>
                  <div style={{width:'95%'}}><textarea id='textarea' style={{height:'100%',width:'100%'}} value={result.question} onChange={(e)=>{ const updated = [...question];updated[index] = {...updated[index],question: e.target.value};setQuestion(updated);}} onClick={()=>{setUpdatebutton("UPDATE")}}  required/></div>
                </div>
                <div style={{width:'95%',display:'flex',flexDirection:'column'}}>
                    {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ display: 'flex',gap:'10px',marginLeft:'60px',marginBottom:'8px' }}>
                      <div>
                        {String.fromCharCode(65 + i)} : <input type="text" id={`Q${index}input${i}`} value={result.options[i] || ""} onChange={(e) => { const updated = [...question];const updatedOptions = [...updated[index].options];updatedOptions[i] = e.target.value;updated[index].options = updatedOptions;setQuestion(updated);}} onClick={()=>{setUpdatebutton("UPDATE")}} required />
                      </div>
                    </div>
                    ))}
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div style={{width:'50%',marginLeft:'60px',marginTop:'10px',color:'green'}}><b>ANSWER : </b><input type='text' id='ans' name='ans' value={result.answer} onChange={(e) => {const updated = [...question];updated[index].answer = e.target.value;setQuestion(updated);}} onClick={()=>{setUpdatebutton("UPDATE")}} required /></div>
                      <div style={{width:'20%',display:'flex',justifyContent:'space-evenly'}}>
                          <div style={{display:'flex',justifyContent:'space-evenly',gap:'12px'}}>
                                      <button id='updatebutton' className='button' onClick={(e)=>{handleupdateque(e,index);setUpdatebutton("UPDATED")}} >{updatebutton}</button>
                          </div>
                          {/* <button className='button'>CANCEL</button> */}
                      </div>
                    </div>
                </div>
              </div>
              </form>
            ))):(null)}
    </div>
  )
}

export default ViewQuestions