import React, {useState,useEffect} from 'react'
import backdrop from '../../assets/backdrop.png'
import './Login.css'
import Spinner from '../../elements/Spinner/Spinner'
import validate from '../../helpers/inputValidator'
import {actionTypes} from '../../contexts/StateReducers'
import {useStateValue} from '../../contexts/StateContextProvider'
import {ReactComponent as Logo }  from '../../assets/Logo.svg'

import { createUserWithEmailAndPassword,GoogleAuthProvider } from 'firebase/auth';
import {auth, db} from "../../firebase/firebase";
import { Timestamp, doc, setDoc,query,collection,limit, where,getDocs} from "firebase/firestore";
const Login = () => {
    const [auths, setAuth] = useState(false)        
    const initialSignup = {
        name            : '',
        username        : '',
        email           : '',
        password        : '',
        confirmPassword : ''
    }
    const initialLogin = {
        email           : '',
        password        : ''
    }
    const [{user},dispatch] = useStateValue()
    const [signupState, setSignupState] = useState(initialSignup)
    const [loginState, setLoginState] = useState(initialLogin)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [isSigning, setIsSigning] = useState(false)

    const cleanupState = () => {
        setIsSigning(false)
        setSignupState(initialSignup)
        setLoginState(initialLogin)
        setError('')
        setLoading(false)
    }

    const toggleAuth = () => {
        setAuth(auths =>!auths)
        cleanupState()
    }

    const authss = (user) => {
        try {
            user.password = undefined
            localStorage.setItem('noctua_user', JSON.stringify(user))
            
            dispatch({
                type: actionTypes.SET_USER,
                user : JSON.parse(localStorage.getItem('noctua_user'))
            })
            
            setLoading(false)         
        } catch (error) {
            console.log(error)
            setLoading(false)
            return
        }
    }   

   
    const onSubmitLogin = async (e) => {  
        const {email, password} = loginState
        e.preventDefault()
        setLoading(true)
       const q= query(collection(db,'users'), where('email', '==', email), where('password','==', password), limit(1));
          
         await  getDocs(q)
            .then(snapshot=>{
                if(!snapshot.docs.length){
                    setError('Invalid credential')
                return
                } else {
                    return {id: snapshot.docs[0].id, ...snapshot.docs[0].data()}
                }
            })
            .then(res=>{
                if(res){
                    authss(res)
                } else {
                    setError('An error occured, please try again')
                    setLoading(false)
                }
            })
            .catch(error=>{
                setLoading(false)
                setError('An error occured, please try again')
                return
            }
        )

    }
        
    const [users, setUsers] = useState([]);
  const userCollecionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollecionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();

    users.map((user) => {
      if (user.username === signupState.username) {
        alert("username existe déja");
     
      }
      if (user.email === signupState.email) {
        alert("email existe déja");
    
      }
    });
  }, [signupState.username, signupState.email]);








    const preSignup = async (e) => {
   const {name, username, email, password } = signupState
        e.preventDefault()
        setIsSigning(true)
        setError(validate(signupState))

    if(user){}

        if (isSigning && !error.length){
            setLoading(true)
            try {
                const result = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                ); 
             await setDoc(doc(db, 'users', result.user.uid), {
                 uid:result.user.uid,
                 displayName: name,
                 username,
                 email,
                 password,
                 createdAt:Timestamp.fromDate(new Date()),
                 bio:'',
                 photoURL: '',
                 wallpaper:'',
                 contactes:[],
                 followers: [],
                 following: [],
                 verified:true,
                 
             })
                .then(res=>{
                    console.log(res)
                    toggleAuth()
                })                    
            } catch (error) {
                console.log(error)
                return
            }
        }


    }
    

    return (
        <section className='login__section'>
            <div className={`login__container ${auths ? 'active': ''}`}>
            <div className="user signinBc">
                <div className="imgBc"><img src={backdrop} alt='backdrop' /></div>
                <div className="formBc">
                 {/* <button onClick={signInWithGoogle}> Sign In with Google </button> */}
                    <form autoComplete="off" onSubmit={onSubmitLogin}>
                    <div className="logo_noctua"> 
                     <Logo />
                     </div>
                        <h2>Log In</h2>
                        <input type="email"    name='email'    placeholder='Email'    value={loginState.email}    onChange={e=>setLoginState({...loginState, email:e.target.value})}/>
                        <input type="password" name='password' placeholder='Password' value={loginState.password} onChange={e=>setLoginState({...loginState, password:e.target.value})} required/>
                        <button type='submit' className='button1'>{loading? <Spinner /> : 'Log in'}</button>
                        {error.length>0 && <div className='error'>{error}</div>}
                        <p className="signup">Don't have an account? <span onClick={toggleAuth}>Sign up</span></p>
                    </form>
                </div>
                
            </div>
            <div className="user signupBc">
                <div className="formBc">
                    <form autoComplete="off" onSubmit={preSignup}>
                    <div className="logo_noctua">
                     <Logo />
                     </div>
                        <h2>Create your Account</h2>
                        <input type="text"     name="name"        placeholder='Full Name'        value={signupState.name}        onChange={(e)=>setSignupState({...signupState, name: e.target.value})}/>
                        <input type="text"     name="username"        placeholder='Username'        value={signupState.username}        onChange={(e)=>setSignupState({...signupState, username: e.target.value})}/>
                        <input type="text"    name="email"           placeholder='Email'           value={signupState.email}           onChange={(e)=>setSignupState({...signupState, email: e.target.value})}/>
                        <input type="password" name="password"        placeholder='Create Password' value={signupState.password}        onChange={(e)=>setSignupState({...signupState, password: e.target.value})}/>
                        <input type="password" name="confirmPassword" placeholder='Confirm Password'value={signupState.confirmPassword} onChange={(e)=>setSignupState({...signupState, confirmPassword: e.target.value})}/>
                        {error.length>0 && <div className='error'>{error}</div>}
                        <button type='submit' className='button1'>{loading? <Spinner /> : 'Sign up'}</button>
                        <p className="signup">have an account? <span onClick={toggleAuth}>Log in</span></p>
                    </form>
                </div>
                <div className="imgBc"><img src={backdrop} alt='backdrop' /></div>
            </div>

            </div>        
        </section>
    )
}

export default Login
