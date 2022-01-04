import { S3 } from "aws-sdk";

const attachmentBucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

const s3 = new S3({
    signatureVersion: 'v4'
})

export function createSignedUrl(todoId: string): string {
    return s3.getSignedUrl('putObject', {
        Bucket: attachmentBucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}