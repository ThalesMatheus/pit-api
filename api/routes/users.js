import express from 'express'
import { addUser, deleteUser, getUser, updateUser, deleteGroup, createGroup, autUser, validaCookie, auth_check, forgotPass, getAllGroups } from '../controllers/user.js'
import { updateImage } from '../controllers/updateImage.js'

const router = express.Router()

router.get('/', getUser)

router.post('/register', addUser)
router.post('/forgotpass', forgotPass)
router.post('/login', autUser)
router.post('/valida', validaCookie)
router.post('/auth_check', auth_check)
router.post('/update', updateImage)
router.put('/:id', updateUser)
router.post('/creategroup', createGroup)
router.post('/groups/delete', deleteGroup)

router.get('/groups', getAllGroups)
// router.post("/auth" authUser)
router.delete('/:id', deleteUser)

export default router
