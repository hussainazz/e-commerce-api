import sequelize from "../../../config/db.js";
import Users from "../usersModel.js";
import { DataTypes } from "sequelize";

const Carts = sequelize.define("carts", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
});

Carts.belongsTo(Users, { foreignKey: "user_id" });
Users.hasOne(Carts, { foreignKey: "user_id" });

export default Carts;
