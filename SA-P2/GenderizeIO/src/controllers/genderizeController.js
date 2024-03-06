const axios = require('axios');
const genderizeOptions = {};

const apiUrl = 'https://api.genderize.io/';
//https://api.agify.io/?name=michael

genderizeOptions.calculateGender = (req, res) => {
    const { name } = req.query;
    const params = {
        name: name
    }
    console.log('Params:', params);
    console.log('URL:', apiUrl)
    axios.get(apiUrl, { params })
    .then(response => {
        console.log('Respuesta:', response.data);
        res.status(200).json(response.data);
    })
    .catch(error => {
        console.error('Error al hacer la solicitud:', error);
        res.status(500).json({error});
    });
}


module.exports = genderizeOptions;