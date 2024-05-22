import axios from "axios";

const huggingFaceSentenceTransformerApi = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
const huggingFaceApiSecret = process.env.HUGGINGFACE_API_SECRET as string;

const generateEmbeddings = async ({
    source_sentence,
    sentences
}: {
    source_sentence: string,
    sentences: string[]
}) => {
    try {
        const response = await axios.post(huggingFaceSentenceTransformerApi, {
            "inputs": {
                "source_sentence": source_sentence,
                "sentences": sentences
            }
        }, {
            headers: {
                'Authorization': `Bearer ${huggingFaceApiSecret}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.log("error from generate embeddings", error?.message);
        throw new Error("error from generate embeddings")
    }
};

export {
    generateEmbeddings
};