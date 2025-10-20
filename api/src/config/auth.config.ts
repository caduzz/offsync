export const authConfig = {
  tokens: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
    expiresInAccess: '300s',
    expiresInRefresh: '7d',
  },
  signOptions: { expiresIn: '1h' },
}