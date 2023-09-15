import { useState } from 'react';
import './App.css';
import { FaWindowClose } from 'react-icons/fa'
import axios from 'axios';

function App() {
  const [base, setBase] = useState(0);
  const [exponent, setExponent] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setresult] = useState(0);
  const gatewayURL = "https://zn6dl04ya9.execute-api.eu-west-1.amazonaws.com/default/math-function"



  const doCalculation = (e) => {
    e.preventDefault();
    // send to lambda
    axios.post(
      gatewayURL,
      {
        base : base,
        exponent: exponent
      }
    ).then( result => {
      setresult(result.data.result);
      setShowResult(true);
    })
  }

  const closePopup = () => {
    setShowResult(false);
  }



  return (
    <>
    <div className="App">
      <h1>Quick Mafs</h1>
      <p>do some fast fast qalkulation : exponential !!</p>
      <form className='math-form' onSubmit={doCalculation}>
        <div>
          <label htmlFor='base'>Base</label>
          <input name="base" type='number' onChange={e => setBase(e.target.value)}/>
        </div>
        <div>
          <label htmlFor='exponent'>Exponent</label>
          <input name="exponent" type='number' onChange={e => setExponent(e.target.value)}/>
        </div>
        <input type='Submit' value={"Calculate"}/>
      </form>
    </div>
      {
        showResult?
          <Result result={result} closePopup={closePopup}/>
          : <></>
      }
    </>
  );
}


const Result = ({result, closePopup}) => {
  return (
    <div className='result' onClick={closePopup}>
      <div className='popup'>
        <h1>Result</h1>
        <h3>{result}</h3>
      </div>
    </div>
  )
}

export default App;
