import { createSignedUrl } from "../persistence/attachmentRepository";
import { updateAttachmentUrlByTodoAndUserIds } from "../persistence/todoRepository";

export async function createUploadUrl(todoId: string, userId: string): Promise<string> {
    const signedUrl = createSignedUrl(todoId)
    await updateAttachmentUrlByTodoAndUserIds(todoId, userId, signedUrl)
    return signedUrl
}