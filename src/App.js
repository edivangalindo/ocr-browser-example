import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { HashLoader } from 'react-spinners';
import './App.css';

const App = () => {
  const [upload, setUpload] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = event => {
    if (event.target.files[0]) {
      let u = [];
      for (let key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key];
        u.push(URL.createObjectURL(upload));
      }
      setUpload(u);
    } else {
      setUpload([]);
    }
  };

  const generateText = () => {
    setLoading(true);
    let uploads = upload;

    for (let i = 0; i < uploads.length; i++) {
      Tesseract.recognize(uploads[i], 'por', {
        logger: m => console.log(m)
      })
        .catch(err => {
          console.error(err);
          setLoading(false);
        })
        .then(result => {
          // Obtendo pontuação de acertividade
          let confidence = result.data.confidence;

          // Obtendo todo texto
          let text = result.data.text;

          setDocuments(
            documents.concat({ text: text, confidence: confidence })
          );
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className="app">
        <header className="header">
          <h1>OCR SS Parisi</h1>
        </header>
        <section className="hero">
          <label className="fileUploaderContainer">
            Arraste documentos em formato de imagem
            <input
              type="file"
              id="fileUploader"
              onChange={handleChange}
              multiple
            />
          </label>
          <div>
            {upload.map((value, index) => {
              return <img alt="upload" key={index} src={value} width="100px" />;
            })}
          </div>
          <button onClick={generateText} className="button" hidden={loading}>
            Ler arquivo
          </button>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 15
            }}
          >
            <HashLoader loading={loading} color="#61dafb" />
          </div>
        </section>
        <section className="results">
          {documents.map((value, index) => {
            return (
              <div key={index} className="results__result">
                <div className="results__result__image">
                  <img alt="resultado" src={upload[index]} width="250px" />
                </div>
                <div className="results__result__info">
                  <div className="results__result__info__codes">
                    <small>
                      <strong>Pontuação de acertividade:</strong>{' '}
                      {value.confidence}
                    </small>
                  </div>
                  <div className="results__result__info__codes"></div>
                  <div className="results__result__info__text">
                    <small style={{ whiteSpace: 'pre' }}>
                      <strong>Texto completo:</strong>
                      <br />
                      {value.text}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
};

export default App;
