const commonFunction = require('../Utils/common');
const objMessage = require('../Utils/message');
var models = require('../model')
var Emplolyee = models.employeetbl;
const bcrypt = require('bcrypt');
const login = async(req, res) => {
    try {
        const { username, password } = req.body
        const token = req.headers.authorization;
        if (token) {
            const checkTokenStatus = await commonFunction.TokenStatus(token);
            if (checkTokenStatus && checkTokenStatus.status === 'disable') {
                if (username) {
                    const foundUser = await Emplolyee.findOne({ where: { username: username, token: token } });
                    if (foundUser) {
                        const matchPassword = await bcrypt.compare(password, foundUser.password);
                        console.log('matchPassword :', matchPassword);
                        if (matchPassword === true) {
                            const payload = {
                                userId: foundUser.id,
                                username: foundUser.username,
                                email: foundUser.email,
                                status: 'active',
                                name: foundUser.name,
                                role: foundUser.role
                            }
                            const token = commonFunction.Sign(payload);
                            console.log('Update Token :', token);
                            const updateToken = await Emplolyee.update({ token: token, status: 'active' }, { where: { id: foundUser.id } });
                            if (updateToken) {
                                return res.json({ message: "LoggedIn Successfully.", token: token, name: foundUser.name });
                            } else {
                                return res.status(400).json({ message: "Please try again." })
                            }
                        } else {
                            return res.status(500).json({ message: "Incorrect password" })
                        }
                    } else {
                        return res.status(500).json({ message: "Incorrect username" })
                    }
                } else {
                    return res.status(400).json({ message: "Please enter username." })
                }
            } else {
                return res.status(500).json({ message: "You have not authorized. Please provide valid token" });
            }
        } else {
            return res.status(401).json({ message: "Please provide token." })
        }
    } catch (error) {
        console.log('error :', error);
        throw error
    }
}

const logout = async(req, res) => {
    const token = req.headers.authorization;
    console.log('token :', token);
    if (token) {
        const checkTokenStatus = await commonFunction.TokenStatus(token);
        if (checkTokenStatus) {
            if (checkTokenStatus.status && checkTokenStatus.status === 'active') {
                console.log('checkTokenStatus :', checkTokenStatus);
                const payload = {
                    userId: checkTokenStatus.userId,
                    username: checkTokenStatus.username,
                    email: checkTokenStatus.email,
                    name: checkTokenStatus.name,
                    status: 'disable',
                    role: checkTokenStatus.role
                }
                const token = commonFunction.Sign(payload);
                const updateQuery = {
                    status: 'disable',
                    token: token
                }
                const updateStatus = await Emplolyee.update(updateQuery, { where: { id: checkTokenStatus.userId } });
                if (updateStatus) {
                    return res.status(200).json({ message: "LoggedOut Successfully.", token: token })
                } else {
                    return res.status(500).json({ message: "Please try after sometimes." })
                }
            } else {
                return res.status(401).json({ message: "You are already loggedOut. If you want, Then please loggedIn" })
            }
        } else {
            return res.status(500).json({ message: "You have not authorized. Please provide token" });
        }
    } else {
        return res.status(401).json({ message: "Please provide token." })
    }
}

module.exports = {
    login,
    logout
}