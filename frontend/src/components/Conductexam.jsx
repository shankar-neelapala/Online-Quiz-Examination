import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormComponent from './Form';

function ConductExam({username,token}) {
  // console.log(username);

  const [regulation, setRegulation] = useState("V20");
  const [batch, setBatch] = useState("2021");
  const [branch, setBranch] = useState("CSE");
  const [semester, setSemester] = useState("I");
  const [subjects, setSubjects] = useState({});
  const [sections,setSections] = useState(["ALL"]);
  const [ccode,setCcode] = useState("");
  const [exam_type,setExam_type] = useState("MID-1");
  const [displayque,setDisplayque] = useState(0);
  const [question,setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer,setAnswer]=useState("");
  const [qno,setQno] = useState(1);
  const [buttonname,setButtonname] = useState("Upload Questions");
  const [ subjectText, setSubjectText] = useState("");

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

  const handleaddquestions =(e)=>{
    e.preventDefault();
    axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/checkeligibility`,{headers:{Authorization:token},
      withCredentials: true,params:{username:username,coursecode:ccode}})
    .then(res =>{
      if(res.data.output==="eligible"){
          axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/getnumofqueposted`,{headers:{Authorization:token},
      withCredentials: true,params:{batch:batch,exam_type:exam_type,branch:branch,coursecode:ccode}})
          .then(res =>{
            if(res.data===20){
              alert("Already Question are Assigned. Click on view question paper to see.");
            }
            else{
              setDisplayque(1);
              setQno(res.data+1);
            }
          })
          .catch(err => alert(err))
        }
        else{
          setDisplayque(0);
          alert("you are not eligible to assign questions to this subject.");
        }
      
    })
    
  }

  const handlequestion =(e,i=0)=>{
    e.preventDefault();
    axios.post(`http://${import.meta.env.VITE_HOST}:8080/teacher/addquestions`,{batch:batch,exam_type:exam_type,branch:branch,semester:semester,coursecode:ccode,question_no:qno,question:question,options:options,answer:answer},
      {headers:{Authorization:token},
      withCredentials: true,}
    )
    .then(res => {console.log(res.data);
                  if(i===0){setQno(qno+1);}
                  else if(i===13){
                      alert("successfully posted all questions.");
                      setDisplayque(0);
                    }
                    setQuestion("");
                    setOptions(["","","",""]);
                    setAnswer("");
          })
    .catch(err => console.error(err))

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


  var divs = [];
  if(qno<=20){
    divs.push(<form key={qno} id="que-form" onSubmit={handlequestion}><div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',marginBottom:'20px'}}>
                <div style={{display:'flex',width:'90%',padding:'20px',marginBottom:'10px'}}>
                  <div style={{width:'5%',display:'flex',alignItems:'center',justifyContent:'center'}}><h6 style={{height:'35px',display:'flex',alignItems:'center'}}>Q{qno}:</h6></div>
                  <div style={{width:'100%'}}><textarea id='textarea' className="form-control" aria-label="With textarea" placeholder='Enter Question' style={{height:'100%',width:'100%'}} value={question} onChange={(e)=>setQuestion(e.target.value)} required/></div>
                </div>
                <div style={{width:'95%',display:'flex',flexDirection:'column'}}>
                    <div style={{display:'flex',justifyContent:'space-around',paddingBottom:'7px'}}>
                        <div key={"option1"} style={{display:'flex'}}><h6 style={{height:'35px',display:'flex',alignItems:'center'}}>A&nbsp;:</h6> &nbsp;&nbsp;<input type="text" className="form-control" placeholder='option1' name="options" id="options" value={options[0]} required autoComplete='on' onChange={(e)=>{var updated = [...options];updated[0] = e.target.value;setOptions(updated)}} style={{height:'35px'}} /></div>
                        <div style={{display:'flex'}}><h6 style={{height:'35px',display:'flex',alignItems:'center'}}>B&nbsp;:</h6> &nbsp;&nbsp;<input type="text" name="option2" className="form-control" placeholder='option2' id="option2" value={options[1]} required onChange={(e)=>{var updated = [...options];updated[1] = e.target.value;setOptions(updated)}} style={{height:'35px'}} /></div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-around',marginBottom:'20px'}}>
                        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}><h6 style={{height:'35px',display:'flex',alignItems:'center'}}>C&nbsp;:</h6> &nbsp;&nbsp;<input type="text" className="form-control" placeholder='option3' name="option3" id="option3" value={options[2]} required onChange={(e)=>{var updated = [...options];updated[2] = e.target.value;setOptions(updated)}} style={{height:'35px'}}/></div>
                        <div style={{display:'flex'}}><h6 style={{height:'35px',display:'flex',alignItems:'center'}}>D&nbsp;:</h6> &nbsp;&nbsp;<input type="text" className="form-control" placeholder='option4' name="option4" id="option4" value={options[3]} required onChange={(e)=>{var updated = [...options];updated[3] = e.target.value;setOptions(updated)}} style={{height:'35px'}} /></div>
                    </div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                      <div style={{width:'100%',marginLeft:'10%',display:'flex',alignItems:'center'}}><div><h6 style={{height:'35px',display:'flex',alignItems:'center',width:'fit-content'}}>ANSWER :&nbsp;</h6></div><div><input type='text' className="form-control" placeholder='Enter Answer' id='ans' name='ans' value={answer} onChange={(e)=>{setAnswer(e.target.value)}} required /></div></div>
                      <div style={{width:'20%',display:'flex',justifyContent:'space-evenly'}}>
                          {
                            qno===20?(<div style={{display:'flex',justifyContent:'space-evenly',gap:'12px'}}>
                                      <button type="submit"submit id='savebutton' onClick={(e)=>{handlequestion(e,13);}}>SAVE</button>
                                      </div>):(<button type="submit">SAVE & NEXT</button>)
                          }
                      </div>
                    </div>
                </div>
              </div>
              <center><p style={{color:'blue'}}>*Click On Save&Next To Add More Questions</p></center>
              </form>
              );
            }

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
        handlequestions={handleaddquestions}
        setSubjectText={setSubjectText}
      />
      <div style={{marginTop:'10px',marginBottom:'10px'}}>
      <div style={{display:'none'}}>{subjectText}</div>
      {displayque ===1 ? (divs):(null)}
      </div>
    </div>
  );
}

export default ConductExam;