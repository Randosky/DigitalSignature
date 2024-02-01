import './App.css';
import {useEffect, useState} from "react";
import {
    addAttachedSignature,
    addDetachedSignature,
    createAttachedSignature,
    createDetachedSignature, createHash,
    getUserCertificates
} from "crypto-pro-js";

function App() {

    const [userCerts, setUserCerts] = useState([]);
    const [returnedSign, setReturnedSign] = useState("");
    const [returnedHash, setReturnedHash] = useState("");

    const [currentCert, setCurrentCert] = useState(null);
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentFile, setCurrentFile] = useState(null);
    const [currentSignType, setCurrentSignType] = useState("");

    useEffect(() => {
        getUserCertificates().then(data => setUserCerts(data))
    }, [])

    function onCurrentCert(name) {
        setCurrentCert(userCerts.find(cert => cert.name === name))
    }

    function onSign(msg, file, cert, signType) {
        // if (file) {
        //     createHash(file).then((hash) => {
        //             setReturnedHash(hash)
        //             switch (signType) {
        //                 case "attached":
        //                     addAttachedSignature(cert.thumbprint, "").then((s) => setReturnedSign(s))
        //                     break
        //                 case "detached":
        //                     addDetachedSignature(cert.thumbprint, "", hash).then((s) => setReturnedSign(s))
        //                     break
        //                 default:
        //                     break
        //             }
        //         }
        //     )
        // } else if (msg) {
        createHash(msg).then((hash) => {
                setReturnedHash(hash)
                switch (signType) {
                    case "attached":
                        createAttachedSignature(cert.thumbprint, msg).then((s) => setReturnedSign(s))
                        break
                    case "detached":
                        createDetachedSignature(cert.thumbprint, hash).then((s) => setReturnedSign(s))
                        break
                    default:
                        break
                }
            }
        )
        // }
    }

    return (
        <div className="app">
            <div className="app__create">
                <div className="app__block">
                    <p>
                        Подписываемое сообщение
                    </p>
                    <textarea onChange={(e) => setCurrentMessage(e.target.value)} value={currentMessage}/>
                </div>
                <div className="app__block">
                    <p>
                        Или выберите файл для подписи:
                    </p>
                    <input type="file" accept=".pdf" onChange={(e) => setCurrentFile(e.target.value)}/>
                </div>
                <div className="app__block">
                    <p>
                        Сертификат:
                    </p>
                    <select onChange={(e) => onCurrentCert(e.target.value)} defaultValue="">
                        <option value="" disabled>
                            Выберите сертификат
                        </option>
                        {
                            userCerts.map((cert, ind) =>
                                <option value={cert.name} key={ind}>
                                    CN = {cert.name};
                                    Действителен до {cert.validTo.split("T")[0].split("-").reverse().join(".")}
                                </option>
                            )
                        }
                    </select>
                </div>
                <div className="app__block">
                    <p>
                        Тип подписи:
                    </p>
                    <div className="app__block-checkbox">
                        <input type="checkbox"
                               onChange={() => setCurrentSignType("attached")}
                               checked={currentSignType === "attached"}/>
                        <span>Совмещенная</span>
                    </div>
                    <div className="app__block-checkbox">
                        <input type="checkbox"
                               onChange={() => setCurrentSignType("detached")}
                               checked={currentSignType === "detached"}/>
                        <span>Отсоединенная</span>
                    </div>
                </div>
                <button className="app__button"
                        onClick={() => onSign(currentMessage, currentFile, currentCert, currentSignType)}>
                    Подписать
                </button>
            </div>
            {
                returnedSign
                    ?
                    <div className="app__result">
                        <div className="app__block">
                            <p>
                                Хеш
                            </p>
                            <p className="app__block-text">
                                {returnedHash}
                            </p>
                        </div>
                        <div className="app__block">
                            <p>
                                Подпись
                            </p>
                            <p className="app__block-text">
                                {returnedSign}
                            </p>
                        </div>
                    </div>
                    : ""
            }
        </div>
    );
}

export default App;
