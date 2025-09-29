import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Products = sequelize.define(
    "products",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

export default Products;