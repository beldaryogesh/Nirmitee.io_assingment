const clotheModel = require("../models/clotheModel");
const user = require("../models/userModel");
const mongoose = require("mongoose");

const {
  uploadFile,
  isValidFiles,
  isValidImg,
  isValidRequestBody,
  isValid,
  nameRegex,
  departmentRegex,
  sizeRegex,
} = require("../validations/validator");
const { isValidObjectId } = require("mongoose");

const createClotes = async function (req, res) {
  try {
    const data = req.body;
    let files = req.files;
    if (!isValidRequestBody(data)) {
      return res.status(400).send({
        status: false,
        message: "Provide the data in request body for clothe creation.",
      });
    }
    let { clotheName, style, department, price, color, size, description } =
      data;
    // ---------------------------------clotheName validation---------------------------------//
    if (!isValid(clotheName)) {
      return res.status(400).send({
        status: false,
        message: "Provide the clothe name in request body for clothe creation.",
      });
    }
    if (!nameRegex.test(clotheName)) {
      return res.status(400).send({
        status: false,
        message: "clothe name should contain alphabets only.",
      });
    }
    // ---------------------------------style validation---------------------------------//
    if (!isValid(style)) {
      return res.status(400).send({
        status: false,
        message: "please provide style for clothe creation.",
      });
    }
    if (!nameRegex.test(style)) {
      return res.status(400).send({
        status: false,
        message: "clothe style should contain alphabets only.",
      });
    }
    // ---------------------------------department validation---------------------------------//
    if (!isValid(department)) {
      return res.status(400).send({
        status: false,
        message:
          "please provide department (Man|Human|Boy|Girl) for clothe creation.",
      });
    }
    if (!departmentRegex.test(department)) {
      return res.status(400).send({
        status: false,
        message: "please provide department (Man|Human|Boy|Girl) only.",
      });
    }
    // ---------------------------------price validation---------------------------------//
    if (!isValid(price)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide clothe price." });
    }
    if (!Number(price)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide numerical price" });
    }
    // ---------------------------------color validation---------------------------------//
    if (!isValid(color)) {
      return res.status(400).send({
        status: false,
        message: "please provide clothe color for clothe creation.",
      });
    }
    if (!nameRegex.test(color)) {
      return res.status(400).send({
        status: false,
        message: "please provide clothe color in alphabets only.",
      });
    }
    // ---------------------------------size validation---------------------------------//
    if (!size) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide size" });
    }
    if (size.length < 1) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter size of clothe" });
    }
    sizeArr = size.replace(/\s+/g, "").split(",");

    let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"];
    let flag;
    for (let i = 0; i < sizeArr.length; i++) {
      flag = arr.includes(sizeArr[i]);
    }
    if (!flag) {
      return res.status(400).send({
        status: false,
        data: "Enter a valid size S or XS or M or X or L or XXL or XL ",
      });
    }
    data["size"] = sizeArr;
    if (!isValid(description)) {
      return res.status(400).send({
        status: false,
        message: "please Enter clothe discription for clothe creation ",
      });
    }
    const clothes = await clotheModel.create(data);
    return res.status(201).send({
      status: true,
      message: "clothe create successfully",
      data: clothes,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getClothes = async function (req, res) {
  try {
    const data = req.body;
    if (!isValidRequestBody(data)) {
      return res.status(400).send({
        status: false,
        message: "Provide the data in request body for get clothe .",
      });
    }
    let { clotheId, clotheName, style, department, price, color, size } = data;
    //---------------------------------clotheId--------------------------------------
    if (clotheId !== undefined) {
      if (!isValid(clotheId)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide clotheId" });
      }
      if (!isValidObjectId(clotheId)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide valid clotheId" });
      }
      let CheckclotheId = await clotheModel.findById({ _id: clotheId });
      if (!CheckclotheId) {
        return res
          .status(404)
          .send({ status: false, msg: "clotheId is not exist in database" });
      }
      let clotheData = await clotheModel.find({
        clotheId: clotheId,
        isDeleted: false,
      });
      if (clotheData.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such clothe are found for this clotheId",
        });
      } else {
        return res.status(200).send({ data: clotheData });
      }
    }

    //---------------------------------clotheName--------------------------------------
    else if (clotheName !== undefined) {
      if (!isValid(clotheName)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide clotheName" });
      }
      if (!nameRegex.test(clotheName))
        return res.status(400).send({
          status: false,
          message: "clotheName should contain alphabets only.",
        });
      let checkclotheName = await clotheModel.find({
        clotheName: clotheName,
      });
      if (checkclotheName.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such similar clothe are find by thes clotheName",
        });
      } else {
        return res.status(200).send({ status: true, data: checkclotheName });
      }
    }

    //---------------------------------style--------------------------------------
    else if (style !== undefined) {
      if (!isValid(style)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide style" });
      }
      if (!nameRegex.test(style))
        return res.status(400).send({
          status: false,
          message: "style should contain alphabets only.",
        });
      let checkStyle = await clotheModel.find({
        style: style,
      });
      if (checkStyle.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such similar clothe are find by thes style",
        });
      } else {
        return res.status(200).send({ status: true, data: checkStyle });
      }
    }

    //---------------------------------department--------------------------------------
    else if (department !== undefined) {
      if (!isValid(department)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide department" });
      }
      if (!departmentRegex.test(department))
        return res.status(400).send({
          status: false,
          message: "please provide department (Man|Human|Boy|Girl) only.",
        });
      let checkDepartment = await clotheModel.find({
        department: department,
      });
      if (checkDepartment.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such similar clothe are find by thes department",
        });
      } else {
        return res.status(200).send({ status: true, data: checkDepartment });
      }
    }

    //---------------------------------price--------------------------------------
    else if (price !== undefined) {
      if (!isValid(price)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide price" });
      }
      if (!Number(price))
        return res.status(400).send({
          status: false,
          message: "price should contain numaric value only.",
        });
      let checkPrice = await clotheModel.find({
        price: price,
      });
      if (checkPrice.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such similar clothe are find by thes price",
        });
      } else {
        return res.status(200).send({ status: true, data: checkPrice });
      }
    }
    //---------------------------------color--------------------------------------
    else if (color !== undefined) {
      if (!isValid(color)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide color" });
      }
      if (!nameRegex.test(color))
        return res.status(400).send({
          status: false,
          message: "color should contain alphabets only.",
        });
      let checkcolor = await clotheModel.find({
        color: color,
      });
      if (checkcolor.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such similar clothe are find by thes color",
        });
      } else {
        return res.status(200).send({ status: true, data: checkcolor });
      }
    }

    //---------------------------------size--------------------------------------
    else if (size !== undefined) {
      if (!isValid(size)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide size" });
      }
      if (!sizeRegex.test(size))
        return res.status(400).send({
          status: false,
          message: "size should contain S, XS, M, X, L, XXL, XL only.",
        });
      let checkSize = await clotheModel.find({ size: size });
      if (checkSize.length == 0) {
        return res.status(404).send({
          status: false,
          msg: "No such similar clothe are find by thes size",
        });
      } else {
        return res.status(200).send({ status: true, data: checkSize });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateClotheById = async function (req, res) {
  try {
    let clotheId = req.params.clotheId;
    let data = req.body;
    let files = req.files;
    // ------------------------------------All validation-----------------------------------------------

    if (!isValidObjectId(clotheId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid clotheId" });
    }
    let clotheData = await clotheModel.findById({ _id: clotheId });
    if (!clotheData)
      return res
        .status(404)
        .send({
          status: false,
          message: "clothe is not found in the DATABASE.",
        });
    if (clotheData.isDeleted == true)
      return res
        .status(400)
        .send({ status: false, msg: "clothe is already deleted." });
    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide data for update" });
    }
    let {
      clotheName,
      clotheImage,
      style,
      department,
      price,
      color,
      size,
      description,
    } = data;
    let bodyFromReq = JSON.parse(JSON.stringify(data));
    let newObj = {};
    // --------------------------------------clothe validation------------------------------//
    if (bodyFromReq.hasOwnProperty("clotheName")) {
      if (!isValid(clotheName)) {
        return res
          .status(400)
          .send({ status: false, msg: "Provide the clotheName" });
      }
      if (!nameRegex.test(clotheName))
        return res.status(400).send({
          status: false,
          message: "clotheName should contain alphabets only.",
        });
      const clotheNameData = await clotheModel.findOne({
        clotheName: clotheName,
      });
      if (clotheNameData)
        return res
          .status(400)
          .send({ status: false, msg: `${clotheName} is already present` });
    }
    newObj["clotheName"] = clotheName;
    // --------------------------------------clothe image------------------------------//
    let uploadedFileURL;
    if (files) {
      if (files && files.length > 0) {
        let url = await uploadFile(files[0]);
        data["clotheImage"] = url;
      }
      newObj["clotheImage"] = uploadedFileURL;
    }
    // --------------------------------------style validation------------------------------//
    if (bodyFromReq.hasOwnProperty("style")) {
      if (!isValid(style)) {
        return res
          .status(400)
          .send({ status: false, msg: "Provide the style" });
      }
      if (!nameRegex.test(style))
        return res.status(400).send({
          status: false,
          message: "style should contain alphabets only.",
        });
      const styleData = await clotheModel.findOne({
        style: style,
      });
      if (styleData)
        return res
          .status(400)
          .send({ status: false, msg: `${style} is already present` });
    }
    newObj["style"] = style;
    // --------------------------------------department validation------------------------------//

    if (bodyFromReq.hasOwnProperty("department")) {
      if (!isValid(department)) {
        return res
          .status(400)
          .send({ status: false, msg: "Provide the department" });
      }
      if (!departmentRegex.test(department))
        return res.status(400).send({
          status: false,
          message: "please provide department (Man|Human|Boy|Girl) only.",
        });
      const departmentData = await clotheModel.findOne({
        department: department,
      });
      if (departmentData)
        return res
          .status(400)
          .send({ status: false, msg: `${department} is already present` });
    }
    newObj["department"] = department;

    // --------------------------------------price validation------------------------------//

    if (bodyFromReq.hasOwnProperty("price")) {
      if (!isValid(price)) {
        return res
          .status(400)
          .send({ status: false, msg: "Provide the price" });
      }
      if (!Number(price))
        return res.status(400).send({
          status: false,
          message: "please provide numarical value only.",
        });
      const priceData = await clotheModel.findOne({
        price: price,
      });
      if (priceData)
        return res
          .status(400)
          .send({ status: false, msg: `${price} is already present` });
    }
    newObj["price"] = price;

    // --------------------------------------color validation------------------------------//

    if (bodyFromReq.hasOwnProperty("color")) {
      if (!isValid(color)) {
        return res
          .status(400)
          .send({ status: false, msg: "Provide the color" });
      }
      if (!nameRegex.test(color))
        return res.status(400).send({
          status: false,
          message: "color should contain alphabets only.",
        });
      const colorData = await clotheModel.findOne({
        color: color,
      });
      if (colorData)
        return res
          .status(400)
          .send({ status: false, msg: `${color} is already present` });
    }
    newObj["color"] = color;
    // --------------------------------------size validation------------------------------//
    if (bodyFromReq.hasOwnProperty("size")) {
      if (!isValid(size)) {
        return res.status(400).send({ status: false, msg: "Provide the size" });
      }
      if (!sizeRegex.test(size))
        return res.status(400).send({
          status: false,
          message: "Enter a valid size S or XS or M or X or L or XXL or XL ",
        });
      const sizeData = await clotheModel.findOne({
        size: size,
      });
      if (sizeData)
        return res
          .status(400)
          .send({ status: false, msg: `${size} is already present` });
    }
    newObj["size"] = size;
    // --------------------------------------discription validation------------------------------//
    if (bodyFromReq.hasOwnProperty("description")) {
      if (!isValid(description)) {
        return res
          .status(400)
          .send({ status: false, msg: "Provide the description" });
      }
      const descriptionData = await clotheModel.findOne({
        description: description,
      });
      if (descriptionData)
        return res
          .status(400)
          .send({ status: false, msg: `${description} is already present` });
    }
    newObj["description"] = description;

    const updateClothe = await clotheModel.findByIdAndUpdate(
      { _id: clotheId },
      { $set: newObj },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "clothe update successfully",
        data: updateClothe,
      });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const deleteClotheById = async function (req, res) {
  try {
    let clotheId = req.params.clotheId;
    if (!isValidObjectId(clotheId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide valid clotheId" });
    }
    let clothe = await clotheModel.findById(clotheId);
    if (clothe.isDeleted === true) {
      return res
        .status(400)
        .send({ status: false, message: "This clothe is already deleted." });
    }
    await clotheModel.findOneAndUpdate(
      { _id: clotheId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res
      .status(200)
      .send({ status: true, message: "clothe deleted succesfully." });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createClotes,
  getClothes,
  updateClotheById,
  deleteClotheById,
};
