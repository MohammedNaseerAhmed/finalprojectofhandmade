const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).send({ message: 'Missing token' })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).send({ message: 'Invalid or expired token' })
    }
}

function authorizeRoles(...allowed) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).send({ message: 'Unauthenticated' })
        if (!allowed.includes(req.user.role)) {
            return res.status(403).send({ message: 'Forbidden' })
        }
        next()
    }
}

module.exports = { authenticate, authorizeRoles }


