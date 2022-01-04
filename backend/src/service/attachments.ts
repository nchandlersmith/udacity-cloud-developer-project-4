import { createSignedUrl } from "../persistence/attachmentRepository";

export function createUploadUrl(todoId: string): string {
    return createSignedUrl(todoId)
}