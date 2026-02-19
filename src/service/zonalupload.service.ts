import sequelize from "../config/sequelize";
import ZonalData from "../Model/ZonalData.model";
import UnitData from "../Model/UnitData.model";

type UploadPayload = {
    zonaldata?: Record<string, any>[];
    unitdata?: Record<string, any>[];
    selectedMonthYear?: string;
    division?: string;
};

const clean = (value: any) => {
    if (value === undefined) {
        return null;
    }
    return value;
};

export async function insertZonalUploadData(payload: UploadPayload) {
    console.log("raw payload receiving");
    console.log(JSON.stringify(payload, null, 2));
    console.log("ending ");
    const transaction = await sequelize.transaction();

    try {
        await ZonalData.sync();
        await UnitData.sync();

        const zonalRows = Array.isArray(payload.zonaldata) ? payload.zonaldata : [];
        const unitRows = Array.isArray(payload.unitdata) ? payload.unitdata : [];

        if (zonalRows.length === 0 && unitRows.length === 0) {
            throw new Error("No data provided. zonaldata or unitdata is required.");
        }

        const zonalInsertPayload = zonalRows.map((row) => ({
            division: clean(row.division ?? payload.division),
            date: clean(row.date),
            figure: clean(row.figure),
            index: clean(row.index),
            planheadno: clean(row.planheadno),
            planheadname: clean(row.planheadname),
            fglastyear: clean(row.fglastyear),
            actualforthemonthlastyear: clean(row.actualforthemonthlastyear),
            actualforthemonththisyear: clean(row.actualforthemonththisyear),
            rgbopenline: clean(row.rgbopenline),
            rgbconst: clean(row.rgbconst),
            rgbtotal: clean(row.rgbtotal),
            actualuptothemonthlastyearopenline: clean(row.actualuptothemonthlastyearopenline),
            actualuptothemonthlastyearconst: clean(row.actualuptothemonthlastyearconst),
            actualuptothemonthlastyeartotal: clean(row.actualuptothemonthlastyeartotal),
            actualforthemonthopenline: clean(row.actualforthemonthopenline),
            actualforthemonthconst: clean(row.actualforthemonthconst),
            actualforthemonthtotal: clean(row.actualforthemonthtotal),
            actualforthemonthlastyearopenline: clean(row.actualforthemonthlastyearopenline),
            actualforthemonthlastyearconst: clean(row.actualforthemonthlastyearconst),
            actualforthemonthlastyeartotal: clean(row.actualforthemonthlastyeartotal),
            actualuptothemonthopenline: clean(row.actualuptothemonthopenline),
            actualuptothemonthconst: clean(row.actualuptothemonthconst),
            actualuptothemonthtotal: clean(row.actualuptothemonthtotal),
            utilizationofopenline: clean(row.utilizationofopenline),
            utilizationofconst: clean(row.utilizationofconst),
            utilizationoftotal: clean(row.utilizationoftotal),
            selectedMonthYear: clean(payload.selectedMonthYear),
        }));

        const unitInsertPayload = unitRows.map((row) => ({
            division: clean(row.division ?? payload.division),
            date: clean(row.date),
            figure: clean(row.figure),
            index: clean(row.index),
            au: clean(row.au),
            planheadname: clean(row.planheadname),
            rglastyear: clean(row.rglastyear),
            actualtotheendoflastyear: clean(row.actualtotheendoflastyear),
            actualforthemonthlastyear: clean(row.actualforthemonthlastyear),
            actualforthemonth: clean(row.actualforthemonth),
            percentageutilization: clean(row.percentageutilization),
            selectedMonthYear: clean(payload.selectedMonthYear),
        }));
        // console.log(" going to databse");
        // console.log(JSON.stringify(zonalInsertPayload, null, 2));
        // console.log(" ending here to database");

        if (zonalInsertPayload.length > 0) {
            await ZonalData.bulkCreate(zonalInsertPayload, {
                transaction,
                returning: false,
            });
        }

        if (unitInsertPayload.length > 0) {
            await UnitData.bulkCreate(unitInsertPayload, {
                transaction,
                returning: false,
            });
        }

        await transaction.commit();

        return {
            success: true,
            message: "Zonal upload data inserted successfully",
            data: {
                division: payload.division ?? null,
                selectedMonthYear: payload.selectedMonthYear ?? null,
                zonalInserted: zonalInsertPayload.length,
                unitInserted: unitInsertPayload.length,
            },
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error in insertZonalUploadData:", error);
        if (error?.parent?.errors && Array.isArray(error.parent.errors)) {
            console.error(
                "DB request errors:",
                error.parent.errors.map((e: any) => e.message)
            );
        }
        throw error;
    }
}
