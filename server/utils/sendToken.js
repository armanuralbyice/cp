const sendToken = async (user, statusCode, res) => {
    const token = await user.getJwtToken();
    const options = {
        expiresIn: process.env.JWT_EXPIRE,
        httpOnly: true,
    };
    res.status(200).cookie('token', token, options).json({
        success: true,
        message: 'login successfully',
        user,
        token,
    });
};
module.exports = sendToken;