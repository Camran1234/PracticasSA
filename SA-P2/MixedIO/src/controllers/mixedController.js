const axios = require('axios');
const mixedOptions = {};

const apiAgify = 'https://agify-service:4000/agify';
const apiGenderize = 'https://genderize-service:4000/genderize';

mixedOptions.calculate = (req, res) => {
    const { name } = req.query;
    const params = {
        name: name
    }
    
    axios.get(apiAgify, { params })
    .then(responseAgify => {
        const {age} = responseAgify.data;
        axios.get(apiGenderize, { params })
        .then(responseGenderize => {
            const {gender} = responseGenderize.data;
            res.status(200).json({name, age, gender});
        })
    })
    .catch(error => {
        console.error('Error al hacer la solicitud:', error);
        res.status(500).json({error});
    });
}


module.exports = mixedOptions;