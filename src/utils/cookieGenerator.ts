


const cookieGenerator = async (user: any, res: any, message: string) => {
    //jwt  accessToken creation
    const accessToken = await user.jwtAccessTokenCreation();

    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // Secure: true,
    };
    //refreshToken
    const refreshToken = await user.jwtRefreshTokenCreation();


    user.password = undefined;
    //cookie creations
    res.cookie("token", refreshToken, options);
    res.status(200).json({
        success: true,
       data:{
        access_token: accessToken,
        email:user.email,isloggedin:true,
        name: user.name,
        message: message,
       },

    });
};

export default cookieGenerator