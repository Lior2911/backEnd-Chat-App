const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = validateRegister = (user)=>{
  error = {} ;
  user.name = isEmpty(user.name)? "" : user.name;
  user.email = isEmpty(user.email)? "" : user.email ; 
  user.password = isEmpty(user.password) ? "" :  user.password ; 
  user.passwordConfirm = isEmpty(user.passwordConfirm) ? "" : user.passwordConfirm;

  if(validator.isEmpty(user.name)) error.name = "first name is require"
  if(validator.isEmpty(user.email)) error.email = "email is require"
  if(validator.isEmpty(user.email)) error.email = "email is not valid"
  if(validator.isEmpty(user.password)) error.password = "password is require"
  if(validator.equals(user.password , user.passwordConfirm)) error.password = "password are not equal"

}