const Option = require('../model/option');

// Create a new option
const createOption = async (req, res) => {
  try {
    const { text, imageUrl } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for creating an option',
      });
    }


    const newOption = new Option({
      text,
      imageUrl,
    });

    await newOption.save();

    res.status(201).json({
      success: true,
      message: 'Option created successfully',
      option: newOption,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create option',
      error: error.message,
    });
  }
};

// Update an existing option (text or image)
const updateOption = async (req, res) => {
  try {
    const { optionId } = req.params;
    const { text, imageUrl } = req.body;

    const option = await Option.findById(optionId);

    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'Option not found',
      });
    }

    // Update text or imageUrl if provided
    if (text !== undefined) {
      option.text = text;
    }

    if (imageUrl !== undefined) {
      option.imageUrl = imageUrl;
    }

    await option.save();

    res.status(200).json({
      success: true,
      message: 'Option updated successfully',
      option,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update option',
      error: error.message,
    });
  }
};

// Delete an option by ID
const deleteOption = async (req, res) => {
  try {
    const { optionId } = req.params;

    const option = await Option.findById(optionId);

    if (!option) {
      return res.status(404).json({
        success: false,
        message: 'Option not found',
      });
    }

    await option.delete();

    res.status(200).json({
      success: true,
      message: 'Option deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete option',
      error: error.message,
    });
  }
};

module.exports = {
  createOption,
  updateOption,
  deleteOption,
};
