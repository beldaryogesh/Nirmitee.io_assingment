const aws = require("aws-sdk")

aws.config.update({
  accessKeyId: "AKIAY3L35MCRZNIRGT6N",
  secretAccessKey: "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",
  region: "ap-south-1"
})


let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    // this function will upload file to aws and return the link
    let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

    var uploadParams = {
      ACL: "public-read",
      Bucket: "classroom-training-bucket", 
      Key: "Nirmitee/" + file.originlname, 
      Body: file.buffer
    } 
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ "error": err })
      }
     
      return resolve(data.Location)
    })
  })
}
/*
const aws = require("aws-sdk");

exports.uploadFile = async (file) => {
  aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1",
  });

  return new Promise((resolve, reject) => {
    const s3 = new aws.S3({ apiVersion: "2006-03-01" });

    const uploadParams = {
      ACL: "public-read",
      Bucket: "classroom-training-bucket",
      Key: `"abc/" + ${file.originalname}`,
      Body: file.buffer,
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject({ error: err });
      }
      return resolve(data.Location);
    });
  });
};
*/
const isValidFiles = function (files) {
  if (files && files.length > 0) {
    return true;
  }else {
    return "please provide clothe image"
  }
};


const isValidRequestBody = function (reqbody) {
  if (!Object.keys(reqbody).length) {
    return false;
  }
  return true;
};

// a function is defined to validate the data provided in the request body
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};




let nameRegex = /^[.a-zA-Z\s]+$/;
let emailRegex =/^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/;
let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
let passRegex =/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
let departmentRegex = /^(Man|Human|Boy|Girl)$/
let sizeRegex = /^(S|XS|M|X|L|XXL|XL)$/

module.exports = {
  uploadFile,
  isValidFiles,
  isValidRequestBody,
  isValid,
  nameRegex,
  emailRegex,
  phoneRegex,
  passRegex,
  departmentRegex,
  sizeRegex
};
