import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import FormComponent from './Form';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

function ViewResult({token}) {

    const [regulation, setRegulation] = useState("V20");
    const [batch, setBatch] = useState("2021");
    const [branch, setBranch] = useState("CSE");
    const [semester, setSemester] = useState("I");
    const [subjects, setSubjects] = useState({});
    const [sections,setSections] = useState(["A","B","C","D"]);
    const[selectedsec,setSelectedsec] = useState("A");
    const [ccode,setCcode] = useState("");
    const [exam_type,setExam_type] = useState("MID-1");
    const [result,setResult] = useState([]);
    const [buttonname,setButtonname] = useState("View Result");
    const [displayres,setDisplayres] = useState(true);
    const [setDisplay] = useState(0);
    const [subjectText, setSubjectText] = useState("LINEAR ALGEBRA AND DIFFERNTIAL EQUATIONS");

    const handleregulation = (selectedBatch,selectedbranch) => {
    axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/getregulation`, {
      headers:{Authorization:token},
      withCredentials: true,
      params: { batch: selectedBatch, branch:selectedbranch }
    })
    .then(res => {
      console.log(res.data);
      setRegulation(res.data[0].regulation);
      setSections(res.data[0].sections);
    })
    .catch(err => alert(err));
  };

  const handleresult =(e)=>{
    e.preventDefault();
    axios.get(`http://${import.meta.env.VITE_HOST}:8080/teacher/getresultslist`,{headers:{Authorization:token},
      withCredentials: true,params:{batch:batch,branch:branch,coursecode:ccode,exam_type:exam_type,semester:semester,section:selectedsec}})
    .then(res=>{setResult(res.data);if(res.data.length==0){setDisplayres(1);}})
    .catch(err=>{alert(err);})
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


const handleDownload = () => {
  const filteredData = result.map((item, index) => ({
    SNO: index + 1,
    ROLLNO: item.username,
    SEMESTER: item.semester,
    EXAM: item.examType,
    SUBJECT: subjectText,
    MARKS: item.marks,
  }));
  const ws = XLSX.utils.json_to_sheet(filteredData);
  ws['!cols'] = [
    { wch: 6 },   // SNO
    { wch: 15 },  // ROLLNO
    { wch: 10 },  // SEMESTER
    { wch: 10 },  // EXAM
    { wch: 50 },  // SUBJECT
    { wch: 10 },  // MARKS
  ];
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = XLSX.utils.encode_cell({ r, c });
      if (!ws[cell]) continue;
      const isHeader = r === range.s.r;
      ws[cell].s = {
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
        font: {
          name: 'Calibri',
          sz: isHeader ? 12 : 11,
          bold: isHeader,
        },
      };
    }
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${branch+"_"+selectedsec+"_SEMESTER"+semester+"_"+exam_type+"_"}_RESULTS.xlsx`);
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
        selectedsec = {selectedsec}
        setSelectedsec = {setSelectedsec}
        setDisplay={setDisplay}
        buttonname = {buttonname}
        setButtonname = {setButtonname}
        handleregulation={handleregulation}
        handlequestions={handleresult}
        setSubjectText={setSubjectText}
        
       />
      {Array.isArray(result) && result.length > 0 && (
        <center>
        <table className='table-bordered w-75' style={{ marginTop: '20px', width: '100%',borderCollapse:'collapse',borderColor:'black' }}>
          <thead>
            <tr style={{backgroundColor:'gray'}}>
              <th><center>SNO</center></th>
              <th><center>USERNAME</center></th>
              <th><center>MARKS</center></th>
            </tr>
          </thead>
          <tbody>
            {result.map((res, index) => (
              <tr key={res.username + index}>
                <td align='center'>{index + 1}</td>
                <td align='center'>{res.username}</td>
                <td align='center'>{res.marks}</td>
              </tr>
            ))}
          </tbody>
        </table><br />
        <button type="button" className="btn btn-info" onClick={handleDownload}>DOWNLOAD</button>
        </center>
        )}

        {result.length === 0 && displayres===1 && ("NO RESULT")}


    </div>
  )
}
export default ViewResult;