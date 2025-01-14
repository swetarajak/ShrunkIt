import Url from '../models/urlModels.js';
import shortid from 'shortid';
import QRCode from 'qrcode';
import validator from 'validator';

// Function to create a short url for every user input Url
export const shortenedUrl = async(req, res) => {
    const { originalUrl } = req.body;
    const shortenUrl = shortid.generate();

    const newUrl = new Url({
        originalUrl,
        shortenUrl
    });

    try{
        await newUrl.save();
        res.json({ shortUrl: `http://localhost:8000/api/${shortenUrl}`});
    } catch(err) {
        
        res.status(500).json({error : 'Server error'});
    }
};

// function to get back the original url of the shortened version
export const originalUrl = async(req,res) =>{
    const { shortenUrl } = req.params;

    try{
        const url = await Url.findOne({ shortenUrl });
        console.log(url);
        console.log(url.originalUrl);
        if(url) {
            res.json(url.originalUrl)
        } else {
            res.status(404).json({error : 'Url Not Found'});
        }
    } catch(err){
        res.status(500).json({error : 'Server error'});
    }
};

// export const qrGenerator = async (req, res) => {
//     const { originalUrl } = req.body;

//     if (!originalUrl || !validator.isURL(originalUrl)) {
//         return res.status(400).json({ error: 'Invalid or missing Url' });
//     }

//     try {
    
//         const qrCodeImg = await QRCode.toBuffer(originalUrl);
        
//         const newQR = new Url({
//             originalUrl: originalUrl,
//             qrCode: qrCodeImg,
//         });

//         await newQR.save();

//         res.setHeader('Content-Type', 'image/png');
//         res.status(200).send(qrCodeImg);  // Sends the QR code as an image buffer

//     } catch (err) {
//         console.error(err.message || err); // Log the error
//         res.status(500).json({ error: 'Failed to generate QR Code' });
//     }
// };

export const qrGenerator = async (req, res) => {
    const { originalUrl } = req.body;

    // Validate the input URL
    if (!originalUrl || !validator.isURL(originalUrl)) {
        return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    try {
        // Generate QR code buffer
        let qrCodeImg;
        try {
            qrCodeImg = await QRCode.toBuffer(originalUrl);
        } catch (err) {
            console.error('QRCode.toBuffer Error:', err.message || err);
            return res.status(500).json({ error: 'Failed to generate QR Code buffer' });
        }

        // Save to database
        try {
            const newQR = new Url({
                originalUrl,
                qrCode: qrCodeImg,
            });
            await newQR.save();
        } catch (err) {
            console.error('Database Save Error:', err.message || err);
            return res.status(500).json({ error: 'Failed to save QR Code to database' });
        }

        // Respond with the QR code as an image
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(qrCodeImg);

    } catch (err) {
        console.error('Error:', err.stack || err.message || err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Function to retrieve the QR Code Image
// export const getQrCode = async(req,res) =>{

//     const { url } = req.params;

//     try{
//         const qrRecord = await Url.findOne({ url });

//         if(!qrRecord) {
//             return res.status(404).json({ error: 'QR code not found for the given url '})
//         }

//         const qrCodeBase64 = `data:image/png;base64,${qrRecord.qrCode.toString( 'base64' )}`;

//         res.status(200).json({ success: true, qrCode: qrCodeBase64 });
//     } catch(error) {
//         console.error('Error fetching QR Code:', error);
//         res.status(500).json({ error: 'Failed to fetch QR Code' });
//     }
    
// }import shortid from 'shortid';
export const shortenedCustomUrl = async (req, res) => {
    const { originalUrl, customCode } = req.body;

    // Validate the original URL
    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required.' });
    }

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL format.' });
    }

    try {
        // Generate a short code if no custom code is provided
        const shortenUrl = customCode || shortid.generate();

        // Check if the custom code already exists
        if (customCode) {
            const existingUrl = await Url.findOne({ shortenUrl: customCode });
            if (existingUrl) {
                return res.status(400).json({ error: 'Custom code already exists. Please choose another.' });
            }
        }

        // Save the URL and short code to the database
        const newUrl = new Url({
            originalUrl,
            shortenUrl
        });

        await newUrl.save();

        res.json({ shortUrl: `http://localhost:8000/api/${shortenUrl}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};
