export const authConfig = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1h' },
}