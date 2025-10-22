import axios from "axios";
import dotenv from "dotenv";
dotenv.config({path: "../.env.local"});
const KEY = process.env.HUGGING_FACE_API;
let prompt = 1;

function getLength(l){
    if(l === "s") {prompt = 2 ;return {max_length: 70, min_length: 20}}
    else if(l === "m") {prompt = 4 ; return {max_length: 140, min_length: 60}}
    else {prompt = 4 ; return {max_length: 240, min_length: 140}}
}

export async function  generateSummary(text,length){
     if(!text || text.trim().length < 30){
        return `${text} (Too short to summarize bro!)`;
     }

      const {max_length,min_length} = getLength(length);
      try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/google/pegasus-xsum",
            {
                 inputs: `Summarize the following text in ${max_length} characters. Only include factual points. Do not add any extra information at all:
            \n${text}` ,
             parameters : {max_length: max_length,min_length: min_length}
            }, 
            {  headers: {
                    Authorization: `Bearer ${KEY}`,
                    "Content-Type": "application/json"
                },
               
                timeout: 60000
            }
     ) ;

     if(!response.data ||  !Array.isArray(response.data) || !response.data[0]?.summary_text){
        throw new Error("Empty or invalid response from HuggingFace API.");
     }

     const summary = response.data[0].summary_text;
     return summary;
    } catch (err) {
    console.error("Hugging Face Generate Summary API Error:", err.message);
    return "Error in generating summary. Please try again.";
  }
    }