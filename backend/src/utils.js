import axios from "axios";
import dotenv from "dotenv";
dotenv.config({path: "../.env.local"});
const KEY = process.env.HUGGING_FACE_API;
let prompt = 1;

function getLength(l){
    if(l === "s") {prompt = 2 ;return {max_length: 100, min_length: 20}}
    else if(l === "m") {prompt = 4 ; return {max_length: 200, min_length: 60}}
    else {prompt = 4 ; return {max_length: 300, min_length: 200}}
}

/*

export async function  generateSummary(text,length){
     if(!text || text.trim().length < 30){
        return `${text} (Too short to summarize bro!)`;
     }

      const {max_length,min_length} = getLength(length);
      const data = ({
        messages: [
            {
                role: "user",
                content: `Summarize the following text concisely in ${max_length} characters. 
                Only include information explicitly present in the text. 
                Do NOT add anything extra, do NOT infer, do NOT assume. 
               If the text is too short to summarize, just return it as-is. 
                 :\n${text}`
            },
        ],
        model: "meta-llama/Llama-3.2-1B-Instruct:novita",
        max_new_tokens: max_length,
      })


      try {
        const response = await axios.post(
           "https://router.huggingface.co/v1/chat/completions",
           data,
           {
              headers: {
                    Authorization: `Bearer ${KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 60000
            }
        );
     const summary = response.data.choices[0].message.content;
    if(!summary){
        throw new Error("Empty or invalid response from HuggingFace API.");
     }

     return summary;
    } catch (err) {
    console.error("Hugging Face Generate Summary API Error:", err.message);
    return "Error in generating summary. Please try again.";

}
}
*/



export async function  generateSummary(text,length) {
  if (!text || text.trim().length < 30) {
    return `${text} (Too short to summarize bro!)`;
  }

 const { max_length, min_length } = getLength(length);
const data =({
    messages: [
        {
            role: "user",
            content: `Summarize the following text concisely in ${max_length}characters. 
                 :\n${text}`,
        },
    ],
    model: "meta-llama/Llama-3.2-1B-Instruct:novita",
    max_tokens: max_length,
})

try{
	const response = await fetch(
		"https://router.huggingface.co/v1/chat/completions",
		{
			headers: {
				Authorization:`Bearer ${KEY}`,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
     const summary = result?.choices?.[0]?.message?.content;  
 if(!summary) throw new Error("Inavlid response from hugging face"); 
	return summary;
} catch(error){
  console.log(error.message);
  return "Error in Generating Summary. Please try again."
}

}



  