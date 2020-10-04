const jwt = require('jsonwebtoken')

module.exports = req => {
    const authHeader = req.get('Authorization')

    let currentUserId

    if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const { userId } = jwt.verify(token, process.env.USER_LOGIN_SECRET)
        currentUserId = userId
    }

    return currentUserId || null
}