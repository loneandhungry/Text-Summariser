import axios from "axios";
import dotenv from "dotenv";
dotenv.config({path: "../.env.local"});
const KEY = process.env.HUGGING_FACE_API;
let prompt = 1;

function getLength(l){
    if(l === "s") {prompt = 3 ;return 50;}
    else if(l === "m") {prompt = 5 ; return 100;}
    else {prompt = 7; return 200;   }
}

export async function  generateSummary(text,length){
      const max_length = getLength(length);
      try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-xsum",
            { inputs: `Summarize the following text in ${prompt} sentences:\n${text}` ,
                 parameters : {max_length}},
            { 
                headers: {
                    Authorization: `Bearer ${KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
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