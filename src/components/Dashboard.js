import React, { useEffect, useState } from 'react'
import Select from "react-select";
import Modal from 'react-modal'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import axios from 'axios';
import env from 'react-dotenv'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

function Dashboard() {  
  Modal.setAppElement('#root');  

  
  // var curr = new Date; // get current date
  // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  // var last = first + 6; // last day is the first day + 6
  // var firstday;
  // var lastday;  
  let [isDateRange,seIsDateRange] =useState(true);
  let [isSubmit,setIsSubmit] = useState(true);
  let [isError,setIsError] = useState(false);
  let [isSuccess,setIsSuccess] = useState(false);
  const error="Please fill all the details";  
    
  var param ={
    user: localStorage.getItem('userId'),
    fromDate:"",
    toDate:""
  }

  useEffect(async()=>{      
    //  firstday = new Date(curr.setDate(first)).toLocaleDateString('en-CA');
    //  lastday = new Date(curr.setDate(last)).toLocaleDateString('en-CA');
    //  param.fromDate = firstday
    //  param.toDate = lastday
    //  console.log(first,firstday)
    //  console.log(last,lastday)
    // setDashFromDate(new Date);
    // setDashToDate(lastday);
    let user = localStorage.getItem('userId');
    let data = await axios.post(env.API_URL+"get-data/",{user})
    setTableData(data.data.data)    
  },[])


  let [selectedValue,setSelectedValue] = useState("");
  const [modalShow, setModalShow] = useState(false);  
  const [value, setValue] = useState('Income');
  const [income,setIncome] = useState(0);
  const [dashFromDate,setDashFromDate] = useState()
  const [dashToDate,setDashToDate] = useState()
  const [date,setDate] =useState();  
  const [desc,setDesc] = useState("");
  const [expense,setExpense] = useState(0);
  const [division,setDivision] = useState("Perosnal");  

  const [fuel,setFuel] = useState(0);  
  const [grocery,setGroc] = useState(0);  
  const [movie,setmovie] = useState(0);  
  const [loan,setLoan] = useState(0);  
  const [medical,setMed] = useState(0);  
  const [other,setOther] = useState(0);  

  const [checked,setChecked] = useState([
    {name:"fuel","sel":true, "value":0},
    {name:"grocery","sel":true, "value":0},
    {name:"movie","sel":true, "value":0},
    {name:"loan","sel":true, "value":0},
    {name:"medical","sel":true, "value":0},
    {name:"other","sel":true, "value":0},
  ])  
  const [tableData,setTableData] = useState([]);  

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles) => {      
      return {
        ...styles        
      };
    }
  };  
  
  const customStyles = {
    content: {
      top: "80px",      
      bottom: 'auto',      
      margin:'10rem',
      width: "auto",
      left: "25%",
      right:"28%"
    },
  };
  
  const items = [
    { label: "Date Range", value: "Date Range" , key :"D"},
    { label: "Weekly expeses", value: "Weekly expeses" , key :"W"},
    { label: "Monthly expenses", value: "Monthly expeses", key :"M"},
    { label: "Yearly expenses", value: "Yearly expeses", key :"Y"}
  ];

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);    
  };
  const getValue = async(data)=>{    
    setSelectedValue(data.key);
    let user = localStorage.getItem('userId');
    if(data.key === "D"){
      seIsDateRange(true)
    }
   else{
    seIsDateRange(false);
    let user = localStorage.getItem('userId');
    let data = await axios.post(env.API_URL+"get-data/",{user})
    setTableData(data.data.data);
   }     
  }   

  const handleCheck =(e)=>{    
    let newArr = [...checked];
    newArr.find(el=> el.name ==e.target.value).sel = !e.target.checked;
    newArr.find(el=> el.name ==e.target.value).value = e.target.value ==="fuel" ? fuel : e.target.value ==="grocery" ? grocery :  e.target.value ==="movie" ? movie :  e.target.value ==="loan" ? loan : 
     e.target.value ==="medical" ? medical : other

     setChecked(newArr)    
  }
  
  var curr = new Date; // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6
  var firstday;
  var lastday 

const handleSumbit =async()=>{
  let user = localStorage.getItem('userId'); 
  console.log(checked)  
  if(value ==="Income"){
    setIsError(false)
    if(date && income>0 && desc.length>0){      
      let data = await axios.post(env.API_URL+"income/",{user,date,income,desc});      
      if(data.data.status===200){
        setIsSuccess(true);
        setTimeout(()=>{setModalShow(false)},2000);
      }
      else{
        error=data.data.messsage;
        setIsError(true);        
      }
    }
    else{
      setIsError(true)
    }
  }
  else{
    let i=0;
    checked.forEach(e=>{if(e.value>0){i=1; }})
    if(date && desc.length>0 && expense>0 && i>0)       
      {
        setIsError(false)
        let exp = await axios.post(env.API_URL+"expense/",{user,date,division,checked,expense})
        if(exp.data.status===200){
          setIsSuccess(true);
          setTimeout(()=>{setModalShow(false)},2000);
        }
      }
    else{
      setIsError(true)
    }    
  }
}

const hadleRadio =(e)=>{
  setDivision(e.target.value);
}

const handleExpense =(event)=>{
  setIsSubmit(false);
  let amt = 0;
  console.log(expense);
  checked.forEach(e=>{
    amt += e.value;
  })  
  setExpense(amt);
}
const getData =async()=>{  
  console.log(dashFromDate,"===", dashToDate,"====")  
  if(dashFromDate && dashToDate){
    param.fromDate=dashFromDate;
    param.toDate = dashToDate;
    let data = await axios.post(env.API_URL+"get-exp-inc/",param);
    setTableData(data.data.data);
  }
  else{    
    setIsError(true)
  }
}

  return (
    <>
        <div className='dashboard'>Dashboard</div>        
        <button className='btn btn-success margin5Rem ' onClick={() => {setModalShow(true); setIsError(false); setIsSuccess(false);setExpense(0)}}>Add New Income/Expense</button>  
            <div className='form-group drop-down' >              
                <Select
                    defaultValue={items[0]}
                    label="Single select"
                    options={items}
                    styles={colourStyles}
                    onChange = {getValue}
                />                                 
            </div>  
            {
              isDateRange ? <div style={{"display":"flex","justifyContent":"center"}} >                   
              <div className="form-group col-md-2 col-lg-2 col-xs-2">
                  <label>From Date</label>
                  <input type="date" className="form-control" value={dashFromDate} required  onChange={(e)=>setDashFromDate(e.target.value)}/>    
                </div>         
                <div className="form-group col-md-2 col-lg-2 col-xs-2">
                  <label>To Date</label>
                  <input type="date" className="form-control" value={dashToDate} required onChange={(e)=>setDashToDate(e.target.value)}/>    
                </div>   
                <button className='btn btn-success' style={{"margin": "3rem"}} required onClick={() => getData()}>Get Data</button>                
            </div>    : ''
            }
                  
        <div style={{"display":"flex"}}>
            
          <Modal
            isOpen={modalShow}        
            style={customStyles}
            contentLabel="Example Modal">        

          <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Income" value="Income" />
              <Tab label="Expense" value="Expense" />            
            </TabList>
          </Box>
          <TabPanel value="Income">
            <div style={{"display":"flex","justifyContent":"center"}}>
              <div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-control" placeholder="Enter income received date" onChange={(e)=>setDate(e.target.value)}/>    
                </div>                   
                <div className="form-group">
                  <label>Income</label>
                  <input type="number" className="form-control" placeholder="Enter income" onChange={(e)=>setIncome(e.target.value)}/>    
                </div>  
                <div className="form-group">
                  <label>Description</label>
                  <input type="text" className="form-control" placeholder="Enter description" onChange={(e)=>setDesc(e.target.value)}/>    
                </div>                   
              </div>               
            </div> 
          </TabPanel>
          <TabPanel value="Expense">
          <div style={{"display":"flex","justifyContent":"center"}}>
              <div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-control" placeholder="Enter expense date" onChange={(e)=>setDate(e.target.value)}/>    
                </div>                   
                <div className="form-group">
                <FormLabel id="demo-radio-buttons-group-label">Division</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Personal"
                    name="radio-buttons-group">
                    <FormControlLabel value="Personal" control={<Radio onChange={hadleRadio} />} label="Personal" />
                    <FormControlLabel value="Office" control={<Radio onChange={hadleRadio} />} label="Office" />                    
                  </RadioGroup>
                </div>  
                <div className="form-group">
                  <label>Description</label>
                  <input type="text" className="form-control" placeholder="Enter description" onChange={(e)=>setDesc(e.target.value)}/>    
                </div>  
                <div className="form-group" style={{"marginTop":'15px'}}>
                  <label>Total Expense</label>
                  <div style={{"display":"flex"}}>
                    <input type="number" min={0} className="form-control" disabled={true} placeholder="Total Expense" value={expense} onChange={(e)=>setExpense(e.target.value)}/> 
                    <button className='btn btn-success calc'  onClick={() => handleExpense()}>Calculate</button>    
                  </div>
                </div>                
              </div> 
              <div>                              
                <div className="form-group">
                <FormLabel id="demo-radio-buttons-group-label">Category</FormLabel>
                <FormGroup >
                  <div style={{"display":"flex"}}>
                    <div style={{"display":"flex", "flexDirection":"column"}}>
                      <FormControlLabel control={<Checkbox onChange={handleCheck}  />} label="fuel" value="fuel"  />                             
                      <FormControlLabel control={<Checkbox onChange={handleCheck}  />} label="grocery" value="grocery" />
                      <FormControlLabel control={<Checkbox onChange={handleCheck}  />} label="movie" value="movie" />                      
                      <FormControlLabel control={<Checkbox onChange={handleCheck}  />} label="loan" value="loan" />
                      <FormControlLabel control={<Checkbox onChange={handleCheck}  />} label="medical" value="medical" />
                      <FormControlLabel control={<Checkbox onChange={handleCheck}  />} label="other" value="other" />
                    </div>
                    <div>                      
                    <input type="number" className="form-control"  min={0}  placeholder="Enter amount" disabled={checked[0].sel} onChange={(e)=>{checked[0].value= parseInt(e.target.value)}}/> 
                    <input type="number" className="form-control"  min={0}  placeholder="Enter amount" disabled={checked[1].sel} onChange={(e)=>checked[1].value= parseInt(e.target.value)}/> 
                    <input type="number" className="form-control"  min={0}  placeholder="Enter amount" disabled={checked[2].sel}  onChange={(e)=>checked[2].value= parseInt(e.target.value)}/> 
                    <input type="number" className="form-control"  min={0}  placeholder="Enter amount" disabled={checked[3].sel} onChange={(e)=>checked[3].value= parseInt(e.target.value)}/> 
                    <input type="number" className="form-control" min={0} placeholder="Enter amount" disabled={checked[4].sel} onChange={(e)=>checked[4].value= parseInt(e.target.value)}/>                     
                    <input type="number" className="form-control" min={0} placeholder="Enter amount" disabled={checked[5].sel} onChange={(e)=>checked[5].value= parseInt(e.target.value)}/> 
                    </div>                    
                  </div>
                </FormGroup>                               
                </div>
              </div>                   
            </div> 
            <span style={{"color":"red"}}>{isError ? error : ''}</span>
            <span style={{"color":"green"}}>{isSuccess ? "Data Inserted successfully" : ''}</span>
          </TabPanel>        
        </TabContext>
        <div style={{"display":"flex","justifyContent":"flex-end"}}>              
          <button className='btn btn-success add'  onClick={() => handleSumbit()}>submit</button>  &nbsp;&nbsp;&nbsp;
          <button className='btn btn-danger add' onClick={() => setModalShow(false)}>close</button>  
        </div>
        </Modal>

        <table className="table table-striped table-data">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Date</th>              
              <th scope="col">Division</th>              
              <th scope="col">Expenses</th>
              <th scope="col">Items</th>
            </tr>
          </thead>
          <tbody>  
            {tableData.map((e,i)=> {    
              return <tr key={e._id}>
                <td>{i+1}</td>
                <td>{e.date}</td>                
                <td>{e.division}</td>                
                <td>{e.expense}</td>
                <td>{e.checked.map(el=>el.value > 0 ? el.name + ':' + el.value+' ' : ' ')}</td>
              </tr>
            }
            )}
          </tbody>
        </table> 
      </div>      
    </>
    
  )
}

export default Dashboard