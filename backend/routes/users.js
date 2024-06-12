import express  from 'express'
import {createUser, updateUser, deleteUser, singleUser, allUsers} from "./../controllers/UserController.js";




const router = express.Router()

//to create a new user
router.post('/', createUser);

//to update a new user
router.put('/:id', updateUser);

//to delete a new user
router.delete('/:id', deleteUser);

//to get single user
router.get('/:id', singleUser);

//to get all users
router.get('/',allUsers);



// module.exports = router;
export default router;

