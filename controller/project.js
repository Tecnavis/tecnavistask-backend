const Model = require('../models/project');
const asyncHandler = require("express-async-handler");


exports.create = asyncHandler(async (req, res) => {
    const { project, description } = req.body;
    const projectData = await Model.create({ project, description });
    res.status(200).json(projectData);
})

exports.getAll = asyncHandler(async (req, res) => {
    const projects = await Model.find();
    res.status(200).json(projects);
})

exports.get = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Model.findById(id);
    res.status(200).json(project);
})

exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    res.status(200).json(project);
})

exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Model.findByIdAndDelete(id);
    res.status(200).json(project);
})


exports.deleteAll = asyncHandler(async (req, res) => {
    const project = await Model.deleteMany();
    res.status(200).json(project);
})