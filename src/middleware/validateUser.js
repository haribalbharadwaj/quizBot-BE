const validateUser = (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    console.log('Request Body:', req.body);  

    if (!name || !email || !password || !confirmPassword) {
        console.log('Missing Field:', { name, email, password, confirmPassword });
        return res.status(400).json({
            message: 'Provide all the required fields'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            message: 'Passwords do not match'
        });
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Please provide a valid email address',
        });
    }

    next();
};

module.exports = validateUser;
