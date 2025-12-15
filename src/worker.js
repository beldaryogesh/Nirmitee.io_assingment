import { parentPort, workerData } from "worker_threads";
import { importApiDiamond, importDiamondThroughExcel, importSolitaireDiamondThroughExcel } from "../controllers/diamond.master.controller.js";
import { dcstrURL } from "../middlewares/decrypt.data.middleware.js";
import mongoose from "mongoose";
import ApiResponse from "../models/api.response.model.js"
import { importColorDiamonds } from "../constants/color.diamonds.master.js";
import { importSoulmateDiamond } from "../constants/soulmate.diamond.constant.js";
import siteConstant from "../constants/site.constant.js";

(async () => {
  try {
      await mongoose.connect(process.env.MONGODB_API, {
            serverSelectionTimeoutMS: 20000 
      });
    console.log("Worker thread MongoDB connected", process.env.MONGODB_API);
    if (workerData?.type === "Excel") {
      let result
      if(workerData.body.parameterFor == siteConstant.parameterFor.Solitaire){
        result = await importSolitaireDiamondThroughExcel(workerData);
      }else if(workerData.body.parameterFor == siteConstant.parameterFor.Classic_Solitaire){        
        result = await importDiamondThroughExcel(workerData);
      }else if(workerData.body.parameterFor == siteConstant.parameterFor.Color || workerData.body.parameterFor == siteConstant.parameterFor.Exclusive_Diamond){
        result = await importColorDiamonds(workerData, workerData.data, workerData.body.vendorId, workerData.body.site, workerData.body.parameterFor);
      }else if(workerData.body.parameterFor == siteConstant.parameterFor.Soulmate_Solitair_Pair){
        result = await importSoulmateDiamond(workerData, workerData.body.vendorId,  workerData.body.site, workerData.body.parameterFor, workerData.data);
      };  
      console.log('result', result);
      
      if(result?.errorCode == 200){
        await ApiResponse.create({
          vendorName : workerData?.vendor,
          vendorId : workerData.body.vendorId,
          message : result?.message ? result?.message : undefined,
          insertDiamonds : result?.insertedDiamonds ? result?.insertedDiamonds : 0,
          updatedDiamonds : result?.updatedDiamonds ?  result?.updatedDiamonds : 0,
          deletedDiamonds : result?.deletedDiamonds ?result?.deletedDiamonds : 0,
          totalRejectedDiamond : result?.totalRejectedDiamonds ? result?.totalRejectedDiamonds : 0,
          type : workerData?.type,
          diamondType : workerData.body.parameterFor,
          rejectedDiamondUrl : result?.issueSheet || undefined
        });
      } else if(result){
        await ApiResponse.create({
          vendorName : workerData?.vendor,
          vendorId : workerData.body.vendorId,
          message : result?.message ? result?.message : undefined,
          insertDiamonds : result?.insertedDiamonds ? result?.insertedDiamonds : 0,
          updatedDiamonds : result?.updatedDiamonds ?  result?.updatedDiamonds : 0,
          deletedDiamonds : result?.deletedDiamonds ? result?.deletedDiamonds : 0,
          totalRejectedDiamond : result?.totalRejectedDiamonds ? result?.totalRejectedDiamonds : 0,
          type : workerData?.type,
          diamondType : workerData.body.parameterFor,
          rejectedDiamondUrl : result?.issueSheet || undefined
        });
      }
      
      parentPort.postMessage({ errorCode: 200, message: "Diamond import successfully..!", data: result });
    }
    else if(workerData.type == "API"){
      const result = await importApiDiamond(workerData?.vendorId, workerData?.parameterFor);
      console.log(new Date().toLocaleDateString(), 'result', result);
      if(result){
        await ApiResponse.create({
          vendorName : workerData?.vendor,
          vendorId :  workerData.vendorId,
          message : result?.message ? result?.message : undefined,
          insertDiamonds : result?.insertedDiamonds || 0,
          updatedDiamonds : result?.updatedDiamonds || 0,
          deletedDiamonds : result?.deletedDiamonds || 0,
          totalRejectedDiamond : result?.totalRejectedDiamonds || 0, 
          totalRejectedDiamondInPrice : result?.rejectedPrice || 0,
          totalDiamonds : result?.totalDiamonds || 0,
          tanishqRejectedDiamonds : result?.tanishqRejectedDiamonds || 0,
          zoyaRejectedDiamond : result?.zoyaRejectedDiamond || 0,
          tanishqInsertedDiamond : result?.tanishqInsertedDiamond || 0, 
          zoyaInsertedDiamond : result?.zoyaInsertedDiamond || 0,
          rejectedTanishqDiamondInPrice : result?.rejectedTanishqDiamondInPrice || 0,
          rejectedZoyaDiamondInPrice : result?.rejectedZoyaDiamondInPrice || 0,
          type : 'API',
          diamondType : workerData?.parameterFor,
          tanishqUpdatedCount : result?.tanishqUpdatedCount || 0,
          zoyaUpdatedCount : result?.zoyaUpdatedCount || 0,
          tanishqDeteledDiamond : result?.tanishqDeteledDiamond || 0,
          zoyaDeteledDiamond : result?.zoyaDeteledDiamond || 0
        })
      }
      parentPort.postMessage(result);
    };
  } catch (error) {
    parentPort.postMessage({ errorCode: 500, message: error.message });
  }
})();
