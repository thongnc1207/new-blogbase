import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
  getFavorite,
  addFavorite,
  getFollowing,
  addFollowing
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);
router.get('/favorite/:userId', getFavorite);
router.put('/save/:postId', verifyToken, addFavorite);
router.get('/getfollowing/:userId', getFollowing);
router.put('/follow/:userId', verifyToken, addFollowing);

export default router;
