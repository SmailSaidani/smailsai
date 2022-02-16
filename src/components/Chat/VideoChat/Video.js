import React,{ useRef, useState } from "react";


import {db} from "../../../firebase/firebase"
import{addDoc,getDoc,setDoc,doc,collection,onSnapshot, query} from "firebase/firestore";

import { ReactComponent as HangupIcon } from "./icons/hangup.svg";
import { ReactComponent as MoreIcon } from "./icons/more-vertical.svg";
import { ReactComponent as CopyIcon } from "./icons/copy.svg";


import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import "./Video.css";
import "../../BarMiddle/BarMiddle.css";
import Contact from "../Contact";


// Initialize WebRTC
const servers = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
    iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [joinCode, setJoinCode] = useState("");

    
    return (
        <div className="app">
            {currentPage === "home" ? (
                <Menu
                    joinCode={joinCode}
                    setJoinCode={setJoinCode}
                    setPage={setCurrentPage}
                />
            ) : (
                <Videos
                    mode={currentPage}
                    callId={joinCode}
                    setPage={setCurrentPage}
                />
            )}
        </div>
    );
}

function Menu({ joinCode, setJoinCode, setPage }) {
    const history =useHistory();
    return (
        <div className="home">
            <div className="create box">
            
                 
                <button onClick={() => setPage("create")}>Create Call</button>
                <ArrowBackOutlinedIcon   onClick={()=>history.push("")}/>
              
            </div>

            <div className="answer box">
                <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Join with code"
                />
                <button onClick={() => setPage("join")}>Answer</button>
            </div>
        </div>
    );
}

function Videos({ mode, callId, setPage }) {
    const [webcamActive, setWebcamActive] = useState(false);
    const [roomId, setRoomId] = useState(callId);

    const localRef = useRef();
    const remoteRef = useRef();

    const setupSources = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        const remoteStream = new MediaStream();

        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        localRef.current.srcObject = localStream;
        remoteRef.current.srcObject = remoteStream;

        setWebcamActive(true);

        if (mode === "create") {
            const callDoc = await addDoc(collection(db,"calls"),{});
            const offerCandidates = collection(callDoc,"offerCandidates");
            const answerCandidates = collection(callDoc,"answerCandidates");

            setRoomId(callDoc.id);

            pc.onicecandidate = (event) => {
                event.candidate && addDoc(offerCandidates,event.candidate.toJSON());
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };

            await setDoc(callDoc,{ offer });

           onSnapshot( callDoc,(snapshot) => {
                const data = snapshot.data();
                if ((!pc.currentRemoteDescription && data.answer))
                 {
                    const answerDescription = new RTCSessionDescription(
                        data.answer
                    );
                    pc.setRemoteDescription(answerDescription);
                }
            });
            onSnapshot(answerCandidates,(snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const candidate = new RTCIceCandidate(
                            change.doc.data()
                        );
                        pc.addIceCandidate(candidate);
                    }
                });
            });
        } else if (mode === "join") {
            const callDoc = doc(db,"calls",callId)
            const answerCandidates = collection(callDoc,"answerCandidates");
            const offerCandidates =collection(callDoc,"offerCandidates");

            pc.onicecandidate = (event) => {
                event.candidate &&
                    addDoc(answerCandidates,event.candidate.toJSON());
            };

            const callData = (await getDoc(callDoc)).data();

            const offerDescription = callData.offer;
            await pc.setRemoteDescription(
                new RTCSessionDescription(offerDescription)
            );

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await setDoc(callDoc,{ answer });

            onSnapshot(offerCandidates,(snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        let data = change.doc.data();
                        pc.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            });
        }

        pc.onconnectionstatechange = (event) => {
            if (pc.connectionState === "disconnected") {
                hangUp();
            }
        };
    };

    const hangUp = async () => {
        pc.close();

        if (roomId) {
            let roomRef = doc(db,"calls",roomId)
            
            const j = query(collection(roomRef,"answerCandidates"))    
            onSnapshot(j,snapshot => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });
 
                
            const q = query(collection(roomRef,"offerCandidates"))    
            onSnapshot(q,snapshot => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });

            
        }

        window.location.reload();
    };

    return (
        <div className="videos">
            <video
                ref={localRef}
                autoPlay
                playsInline
                className="local"
                muted
            />
            <video ref={remoteRef} autoPlay playsInline className="remote" />

            <div className="buttonsContainer">
                <button
                    onClick={hangUp}
                    disabled={!webcamActive}
                    className="hangup button"
                >
                    <HangupIcon />
                </button>
                <div tabIndex={0} role="button" className="more button">
                    <MoreIcon />
                    <div className="popover">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(roomId);
                            }}
                        >   
                            <CopyIcon/>Copy joining code
                        </button>
                    </div>
                </div>
            </div>

            {!webcamActive && (
                <div className="modalContainer">
                    <div className="modal">
                        <h3>
                            Turn on your camera and microphone and start the
                            call
                        </h3>
                        <div className="container">
                            <button
                                onClick={() => setPage("home")}
                                className="secondary"
                            >
                                Cancel
                            </button>
                            <button onClick={setupSources}>Start</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
