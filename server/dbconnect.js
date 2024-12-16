const mongoose = require("mongoose");
const connect = async () => {
    try {
        const ress = await mongoose.connect('mongodb+srv://sonishivam457:admin1990@cluster0.cdy7lqj.mongodb.net', {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("database connected!");
    } catch (error) {
        console.log(error.message);
        process.exit;
    }
};

module.exports = connect;