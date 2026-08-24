const encodeCursor = ({ createdAt, _id }) => {
    const cursorData = JSON.stringify({
        createdAt,
        _id
    });

    return Buffer
        .from(cursorData)
        .toString("base64url");
};


const decodeCursor = (cursor) => {
    try {
        const decoded = Buffer
            .from(cursor, "base64url")
            .toString("utf-8");

        return JSON.parse(decoded);

    } catch {
        return null;
    }
};


export {
    encodeCursor,
    decodeCursor
};