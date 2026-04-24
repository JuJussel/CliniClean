import { z } from 'zod'
import User from '../models/user.model'

const bodySchema = z.object({
  username: z.string(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(event, bodySchema.parse)

  // Find User in DB
  const user = await User.findOne({ username })

  if (user && typeof user.password === 'string') {
    const isPasswordValid = await verifyPassword(user.password, password);
    if (isPasswordValid) {
      const { password, ...userWithoutPassword } = user.toObject()  // Exclude password            
      await setUserSession(event, {
        user: {
          username: user.username,
          id: user._id,
          avatar: user.avatar,
          fullName: user.nameLast + ' ' + user.nameFirst
        },
      }, { maxAge: 60 * 60 * 10 }) // Session valid for 10 hours
      return { user: userWithoutPassword }
    }
  }

  throw createError({
    status: 401,
    statusMessage: 'Unauthorized',
    message: 'Invalid username or password'
  })
})