import axios from "./axiosConfig.js";

const getProds = async () => {
    try {
        const response = await axios.get("/main", {});
        console.log("Server response:", response.data);
      } catch (err) {
        console.log(err);
      }
};

const addProd = async () => {
    try {
        const response = await axios.post("/add", {
            prodName: "test",
            username: "test"
        });
        console.log("Server response:", response.data.data)
    } catch (err) {
        console.log(err);
    }
};

await getProds();
await addProd();