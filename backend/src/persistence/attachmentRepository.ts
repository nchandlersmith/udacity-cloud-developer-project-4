import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const attachmentBucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

export function createSignedUrl(todoId: string): string {
    return s3.getSignedUrl('putObject', {
        Bucket: attachmentBucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}