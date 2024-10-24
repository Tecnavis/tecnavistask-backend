const Logo = require('../models/logo');
const asyncHandler = require("express-async-handler");
// Create logo
exports.createLogo = asyncHandler(async (req, res) => {
    const image = req.file.filename;
    const logo = await Logo.create({ image });
    res.status(200).json(logo);
})

// get all logo
exports.getAllLogo = asyncHandler(async (req, res) => {
    const logo = await Logo.find();
    res.status(200).json(logo);
})
// Update logo
exports.updateLogo = asyncHandler(async (req, res) => {
    const image = req.file.filename;
    const logo = await Logo.findByIdAndUpdate(req.params.id, { image }, {
        new: true
    });
    res.status(200).json(logo);
});

// delete all logo
exports.deleteLogo = asyncHandler(async (req, res) => {
    const logo = await Logo.deleteMany();
    res.status(200).json(logo);
})