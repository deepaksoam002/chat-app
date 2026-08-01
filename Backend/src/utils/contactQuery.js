const User = require('../models/user.models.js')
async function searchWithEmail(email){

     try{
        const userData =  await User.find({email});
           
        return userData[0];
     }catch(error){

      console.log(error);

        throw new Error("message: No User Found")
     }


}

async function searchWithUsername(username){

    try{
        
      const userData =  await User.find({username});
     
        return userData[0];
        
     }catch(error){
         console.error(error);
        throw new Error("message: No User Found")
     }
  

}
module.exports = {searchWithEmail, searchWithUsername}