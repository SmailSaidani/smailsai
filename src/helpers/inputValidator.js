export default function validate(values) {
  let errors = { }

  const { name, username, email, password, confirmPassword } = values
  // const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/                                                                                                 //eslint-disable-line
  
  const nameRegex = /^[ a-zA-Z]+$/;
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if(username.length === 0){
    errors.erUsername = 'Username must not be empty' 
    
  }else if (username.length < 3 && username.length < 8 || username.length >  3 && username.length  >  8 ){
      errors.erUsername ='the username must contain between 3 and 8 characters'
    }else if (!usernameRegex.test(username)) {
      errors.erUsername = 'Username is invalid'

    }
      
  

  if(name.length === 0){
    errors.erName = 'Full Name must not be empty' 
  } else if (name.length < 3 && name.length < 20 || name.length >  3 &&  name.length  >  20 ){
      errors.erUsername ='the name must contain between 3 and 20 characters'
  }else if (!nameRegex.test(name)) {
    errors.erName= 'name is invalid'

  }

  if (!email) {
    errors.erEmail = 'Email address is required'
  } else if (!emailRegex.test(email)) {   
    errors.erEmail = 'Email address is invalid'
  }


  if (!password) {
    errors.erPassword = 'Password is required'
  } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/.test(password)) {
    errors.erPassword = 'Password must contain atleast 8 characters, an number, an uppercase, a lowercase, and a special character'
  }


  if(password !== confirmPassword){
      errors.erPasswords = 'Passwords are not identical'
  }

  let {erName, erUsername, erEmail, erPassword, erPasswords} = errors

  if(erName){
    return erName
  } else {
    if (erUsername){
      return erUsername
    } else {
      if (erEmail){
        return erEmail
      } else {
        if (erPassword){
          return erPassword
        } else {
          if (erPasswords){
            return erPasswords
          } else {
            return ''
          }
        }
      }
    }
  }
    
}