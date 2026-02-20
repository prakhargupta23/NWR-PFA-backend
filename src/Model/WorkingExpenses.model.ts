import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const WorkingExpenses = sequelize.define(
  "WorkingExpenses",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    division: { type: DataTypes.STRING, allowNull: true },
    date: { type: DataTypes.STRING, allowNull: true },
    figure: { type: DataTypes.STRING, allowNull: true },

    sno: { type: DataTypes.STRING, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true }, // SMH-1, SMH-8 etc

    actualLastFY: { type: DataTypes.STRING, allowNull: true },
    obg: { type: DataTypes.STRING, allowNull: true },
    rbg: { type: DataTypes.STRING, allowNull: true },
    bpToEndMonth: { type: DataTypes.STRING, allowNull: true },

    actualForMonth: { type: DataTypes.STRING, allowNull: true },
    actualToEndCurrentYear: { type: DataTypes.STRING, allowNull: true },
    actualToEndLastYear: { type: DataTypes.STRING, allowNull: true },

    diffActualVsBP: { type: DataTypes.STRING, allowNull: true },
    diffCurrentVsLastYear: { type: DataTypes.STRING, allowNull: true },

    percentVariationBP: { type: DataTypes.STRING, allowNull: true },
    percentVariationLastYear: { type: DataTypes.STRING, allowNull: true },

    selectedMonthYear: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [{ fields: ["uuid"] }],
  }
);

export default WorkingExpenses;
