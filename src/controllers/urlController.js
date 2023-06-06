const URLModel = require('../models/urlModel');
const validUrl = require('valid-url');
const shortId = require('shortid');
const { SET_ASYNC, GET_ASYNC } = require('../utils/redisClient');
const { checkValidUrl } = require('../utils/axiosValidation');

const createUrl = async (req, res) => {
    try {
        const { longUrl } = req.body;

        if(!longUrl) {
            return res.status(400).json({
                status: false,
                message: 'Please provide a longUrl'
            });
        }

        if(!validUrl.isWebUri(longUrl)) {
            return res.status(400).json({
                status: false,
                message: 'Please provide a valid url'
            });
        }

        const isValidUrl = await checkValidUrl(longUrl);
        if(!isValidUrl.isValid) {
            return res.status(400).json({
                status: false,
                message: "Please provide a valid url(axios)"
            });
        }

        const cachedUrl = await GET_ASYNC(longUrl);
        if(cachedUrl) {
            const result = JSON.parse(cachedUrl);
            return res.status(201).json({
                status: true,
                msg: 'Short url already exists',
                data: {
                    urlCode: result.urlCode,
                    shortUrl: result.shortUrl,
                    longUrl: result.longUrl,

                }
            });
        }

        const url = await URLModel.findOne({ longUrl });
        if(url) {
            await SET_ASYNC(
                longUrl,
                JSON.stringify({
                    urlCode: url.urlCode,
                    shortUrl: url.shortUrl,
                }),
                'EX',
                24 * 60 * 60
            );

            return res.status(201).json({
                status: true,
                msg: 'Short url created',
                data: {
                    shortUrl: url.shortUrl
                }   
            });
        }

        const urlCode = shortId.generate();
        const shortUrl = `${process.env.CLIENT_URL}/${urlCode}`;

        const newUrlData = await URLModel.create({
            urlCode,
            longUrl,
            shortUrl
        });

        await SET_ASYNC(
            longUrl,
            JSON.stringify({
                urlCode: newUrlData.urlCode,
                shortUrl: newUrlData.shortUrl,
                longUrl: newUrlData.longUrl
            }),
            'EX',
            24 * 60 * 60
        );

        res.status(201).json({
            status: true,
            data: newUrlData
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

const getUrl = async (req, res) => {
    try {
        const { urlCode } = req.params;

        const cachedUrl = await GET_ASYNC(urlCode);
        if(cachedUrl) {
            const { longUrl } = JSON.parse(cachedUrl);
            return res.status(302).redirect(longUrl);
        }

        const url = await URLModel.findOne({ urlCode });

        if(!url) {
            return res.status(404).json({
                status: false,
                message: 'Url not found'
            });
        }

        await SET_ASYNC(
            urlCode,
            JSON.stringify({
                longUrl: url.longUrl
            }),
            'EX',
            24 * 60 * 60
        );

        res.status(302).redirect(url.longUrl);

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    createUrl,
    getUrl
}