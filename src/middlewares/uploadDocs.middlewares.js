import createMulter from "../configs/produto.multer.js";

export const uploadDocument = createMulter({
    folder: 'documents',
    allowedTypes:[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    fileSize: 1010241024
}).single('doc');