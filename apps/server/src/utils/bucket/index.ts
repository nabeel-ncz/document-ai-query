import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = process.env.S3_BUCKET_NAME as string;
const bucketLocation = process.env.S3_BUCKET_LOCATION as string;
const awsAccessKey = process.env.AWS_ACCESS_KEY as string;
const awsSecretKey = process.env.AWS_SECRET_KEY as string;

const s3 = new S3Client({
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey
    },
    region: bucketLocation
})

export const putObject = async (
    filename: string,
    buffer: any,
    content_type: string
) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: content_type
    });
    await s3.send(command);
}

export const getObjectSignedUrl = async (
    filename: string,
    expires: number = (60 * 60)
) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: filename,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: expires });
    return url;
}

export const deleteObject = async (
    filename: string
) => {
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filename
    });
    await s3.send(command);
}

