import './App.css';
import {useState, useCallback, useEffect} from 'react';

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

function SingleImage(props) {
  const [imageData, setImageData] = useState(null);
  const onClick = async () => {
    const response = await fetch(`/images/${props._id}`, {
      method: 'GET'
    });
    const jsonData = await response.json();
    setImageData(jsonData.data);
  };
  return <div>
    <p>{props.name}</p>
    <button onClick={onClick}>Download</button>
    {
      imageData == null ? null : <img src={imageData} />
    }
  </div>;
}

function ImageList() {
  const [imageList, setImageList] = useState([]);
  useEffect(async () => {
    const response = await fetch('/images', {
      method: 'GET'
    });
    const data = await response.json();
    setImageList(data);
  }, []);
  return <div>
    {imageList.map((imageData, idx) => {
      return <SingleImage {...imageData} key={idx} />
    })}
  </div>;
}

function App() {
  return <div>
    <Uploader />
    <ImageList />
  </div>;
}

export default App;
