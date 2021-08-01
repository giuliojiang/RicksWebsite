import './App.css';
import {useState, useCallback} from 'react';

function Uploader() {
  const [status, setStatus] = useState('ready'); // ready, uploading
  const handleChange = (event) => {
    setStatus('uploading');
    const f = event.target.files[0];
    console.info(f);
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => {
      const data = reader.result;
      fetch('/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'test',
          data
        })
      }).finally(() => {
        setStatus('ready');
      })
    };
  }
  return <>
    <input type="file" onChange={handleChange}></input>
    {
      (() => {
        if (status === 'ready') {
          return <p>Ready</p>;
        } else {
          return <p>Uploading</p>;
        }
      })()
    }
  </>;
}

function App() {
  return (
    <Uploader />
  );
}

export default App;
