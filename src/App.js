import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

const App = () => {
  const [upload, setUpload] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = event => {
    if (event.target.files[0]) {
      var u = [];
      for (var key in event.target.files) {
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

    for (var i = 0; i < uploads.length; i++) {
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

          // Get codes
          // let pattern = /\b\w{10,10}\b/g;
          // let patterns = result.data.text.match(pattern);

          setDocuments(
            documents.concat({ text: text, confidence: confidence })
          );
          setLoading(false);
        });
    }
  };

  return (
    <div className="app">
      <header className="header">{/* <h1>Exemplo OCR</h1> */}</header>
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
        <button onClick={generateText} className="button">
          Ler arquivo
        </button>
        {loading && <h1>Carregando...</h1>}
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
                <div className="results__result__info__codes">
                  <small>
                    <strong>Pattern Output:</strong>{' '}
                    {/* {value.pattern.map(pattern => {
                        return pattern + ', ';
                      })} */}
                  </small>
                </div>
                <div className="results__result__info__text">
                  <small>
                    <strong>Texto completo:</strong> {value.text}
                  </small>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default App;
