import express from 'express'
import { addUser, deleteUser, getUser, updateUser, autUser, validaCookie, auth_check, updateImage } from '../controllers/user.js'

const router = express.Router()

router.get('/', getUser)

router.post('/register', addUser)

router.post('/login', autUser)
router.post('/valida', validaCookie)
router.post('/auth_check', auth_check)
router.post('/update', updateImage)
// router.post("/auth" authUser)

router.put('/:id', updateUser)

router.delete('/:id', deleteUser)

export default router
