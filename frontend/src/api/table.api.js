import api from "../utils/axios.js";

const getTables = () => {
    return api.get("/tables");
}

const createTable = (tableData) => {
    return api.post("/tables", tableData);
}

export { getTables, createTable };