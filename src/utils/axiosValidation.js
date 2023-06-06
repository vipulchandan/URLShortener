const axios = require('axios');

const checkValidUrl = async (url) => {
    try {
        if(!url) {
            return {
                isValid: false,
                statusCode: 400,
                message: 'Please provide a url'
            }
        }

        const response = await axios.get(url);
        if(response.status === 200) {
            return {
                isValid: true,
                statusCode: 200,
                message: 'Url is valid'
            }
        } else {
            return {
                isValid: false,
                statusCode: response.status,
                message: 'Please provide a valid url'
            }
        }

    } catch (error) {
        return {
            isValid: false,
            statusCode: 500,
            message: error.message
        }
    }
}

module.exports = {
    checkValidUrl
}