import axios from "axios";
const openaiApiKey = process.env.OPENAI_SECRET as string;

const generateEmbeddings = async (text: string = "") => {
    try {
        const response = await axios.post('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
            "inputs": {
                "source_sentence": "Title: Understanding Climate Change. Introduction: Climate change refers to long-term changes in temperature, precipitation, wind patterns, and other elements of the Earth's climate system. These changes can be due to natural processes, such as volcanic eruptions, and human activities, like burning fossil fuels and deforestation. Chapter 1: Causes of Climate Change. The primary causes of climate change include greenhouse gas emissions from burning fossil fuels, deforestation, and industrial processes. Greenhouse gases trap heat in the Earth's atmosphere, leading to global warming.",
                "sentences": [
                    "Title: Understanding Climate Change.",
                    "Introduction: Climate change refers to long-term changes in temperature, precipitation, wind patterns, and other elements of the Earth's climate system. These changes can be due to natural processes, such as volcanic eruptions, and human activities, like burning fossil fuels and deforestation.",
                    "Chapter 1: Causes of Climate Change. The primary causes of climate change include greenhouse gas emissions from burning fossil fuels, deforestation, and industrial processes. Greenhouse gases trap heat in the Earth's atmosphere, leading to global warming."
                ]
            }

        }, {
        headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_APISECRET}`
        }
    });
    return response.data;
} catch (error: any) {
    console.log("error from generate embeddings", error?.message);
    throw new Error("error from generate embeddings")
}
};

const getAnswer = async (query: string, context: string[]) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: `Context: ${context}\n\nQuestion: ${query}\nAnswer:`,
            max_tokens: 150,
            n: 1,
            stop: ["\n"]
        }, {
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].text.trim();
    } catch (error: any) {
        console.log(error?.message, "error from get answer");
        throw new Error("error from get answer");
    }
};


export {
    generateEmbeddings,
    getAnswer
};