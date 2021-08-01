import './App.css';
import {useState, useCallback, useEffect} from 'react';

function Uploader(props) {
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
          name: f.name,
          data
        })
      }).finally(() => {
        setStatus('ready');
        props.onDone();
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
  useEffect(() => {
    onClick();
  }, [props._id]);
  return <div>
    <p>{props.name}</p>
    {
      imageData == null ? null : <img src={imageData} />
    }
  </div>;
}

function ImageList(props) {
  const [imageList, setImageList] = useState([]);
  useEffect(async () => {
    const response = await fetch('/images', {
      method: 'GET'
    });
    const data = await response.json();
    setImageList(data);
  }, [props.counter]);
  return <div>
    {imageList.map((imageData, idx) => {
      return <SingleImage {...imageData} key={idx} />
    })}
  </div>;
}

function App() {
  const [counter, setCounter] = useState(0);
  return <div>
    <Uploader onDone={() => {setCounter(x => x+1)}} />
    <ImageList counter={counter} />
  </div>;
}

export default App;
