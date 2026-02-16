

const sequelize1 = require("../config/sequlize");
// const Earning = require("../Model/Earning.model");

const UnitData = require("../Model/Zonal/UnitData.model");
const ZonalData = require("../Model/Zonal/ZonalData.model");

// Helper function to get current date and time
const getCurrentDateTime = (): string => {
    const now = new Date();
    // Simple format: YYYY-MM-DD HH:MM:SS
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Helper coercion functions to ensure correct types with nulls for missing/empty values
// const toNullableString = (value: any): string | null => {
//     if (value === undefined || value === null) return null;
//     const str = String(value).trim();
//     return str.length === 0 ? null : str;
// };

const toNullableInteger = (value: any): number | null => {
    if (value === undefined || value === null) return null;
    const num = parseInt(String(value).trim(), 10);
    return Number.isNaN(num) ? null : num;
};

// Cast all values to string for most tables (except WorkingExpenditure and PlanHead)
const toStringValue = (value: any): string => {
    if (value === undefined || value === null) return '';

    // Handle special cases
    if (typeof value === 'number') {
        return value.toString();
    }

    if (typeof value === 'boolean') {
        return value.toString();
    }

    const str = String(value).trim();

    // Handle empty strings and whitespace-only strings
    if (str === '' || str.length === 0) {
        return '';
    }

    // Truncate if longer than 250 characters to avoid database issues
    return str.length > 250 ? str.substring(0, 250) : str;
};

// New helper function for tables that should convert empty strings to null (except WorkingExpenditure and PlanHead)
const toStringValueWithNull = (value: any): string | null => {
    if (value === undefined || value === null) return null;

    // Handle special cases
    if (typeof value === 'number') {
        return value.toString();
    }

    if (typeof value === 'boolean') {
        return value.toString();
    }

    const str = String(value).trim();

    // Handle "NIL" values - convert to null
    if (str.toUpperCase() === 'NIL') {
        return null;
    }

    // Handle empty strings and whitespace-only strings - return null for empty values
    if (str === '' || str.length === 0) {
        return null;
    }

    // Truncate if longer than 250 characters to avoid database issues
    return str.length > 250 ? str.substring(0, 250) : str;
};

// Helper function for fields that should never be null (like division and date)
const toStringValueRequired = (value: any): string => {
    if (value === undefined || value === null) return '';

    // Handle special cases
    if (typeof value === 'number') {
        return value.toString();
    }

    if (typeof value === 'boolean') {
        return value.toString();
    }

    const str = String(value).trim();

    // Handle "NIL" values - convert to empty string for required fields
    if (str.toUpperCase() === 'NIL') {
        return '';
    }

    // Handle empty strings and whitespace-only strings - return empty string for required fields
    if (str === '' || str.length === 0) {
        return '';
    }

    // Truncate if longer than 250 characters to avoid database issues
    return str.length > 250 ? str.substring(0, 250) : str;
};

interface SheetEntry {
    [key: string]: any;
}

interface SheetDataPayload {
    division: string;
    selectedMonthYear: string;
    UnitData: SheetEntry[];
    ZonalData: SheetEntry[];
}


export const createZonalEntry = async (data: SheetDataPayload) => {
    console.log("starting entry log")
    // await Promise.all([
    //     // Earning.sync({ alter: true }),
    //     WorkingExpenditure.sync({ alter: true }),


    // ]);
    console.log("vbnm")
    const createPromises = [];
    // Step 1: Delete existing records for the selected month/year
    if (data.selectedMonthYear) {
        await Promise.all([
            //   Earning.destroy({
            //     where: { date: data.selectedMonthYear, division: data.division },
            //   }),
            UnitData.destroy({
                where: { date: data.selectedMonthYear, division: data.division },
            }),
            ZonalData.destroy({
                where: { date: data.selectedMonthYear, division: data.division },
            }),
        ]);
    }
    console.log("lkjhg", Array.isArray(data.UnitData))
    if (Array.isArray(data.UnitData) && data.UnitData.length > 0) {
        console.log("Processing UnitData...");

        const UnitDatatoinsert = data.UnitData.map((item) => ({
            division: item.division,
            date: toStringValueRequired(item.date),
            figure: item.figure,
            index: item.index,
            au: item.au,
            planheadname: item.planheadname,
            rglastyear: item.rglastyear,
            actualtotheendoflastyear: item.actualtotheendoflastyear,
            actualforthemonthlastyear: item.actualforthemonthlastyear,
            actualforthemonth: item.actualforthemonth,
            percentageutilization: item.percentageutilization,
        }));
        console.log("Uploading UnitData:", UnitDatatoinsert.length);
        createPromises.push(UnitData.bulkCreate(UnitDatatoinsert));
    }

    if (Array.isArray(data.ZonalData) && data.ZonalData.length > 0) {
        console.log("Processing ZonalData...");

        const ZonalDatatoinsert = data.ZonalData.map((item) => ({
            division: item.division,
            date: toStringValueRequired(item.date),
            figure: item.figure,
            index: item.index,
            planheadno: item.planheadno,
            planheadname: item.planheadname,
            fglastyear: item.fglastyear,
            actualforthemonthlastyear: item.actualforthemonthlastyear,
            actualforthemonththisyear: item.actualforthemonththisyear,
            rgbopenline: item.rgbopenline,
            rgbconst: item.rgbconst,
            rgbtotal: item.rgbtotal,
            actualuptothemonthlastyearopenline: item.actualuptothemonthlastyearopenline,
            actualuptothemonthlastyearconst: item.actualuptothemonthlastyearconst,
            actualuptothemonthlastyeartotal: item.actualuptothemonthlastyeartotal,
            actualforthemonthopenline: item.actualforthemonthopenline,
            actualforthemonthconst: item.actualforthemonthconst,
            actualforthemonthtotal: item.actualforthemonthtotal,
            actualforthemonthlastyearopenline: item.actualforthemonthlastyearopenline,
            actualforthemonthlastyearconst: item.actualforthemonthlastyearconst,
            actualforthemonthlastyeartotal: item.actualforthemonthlastyeartotal,
            utilizationofopenline: item.utilizationofopenline,
            utilizationofconst: item.utilizationofconst,
            utilizationoftotal: item.utilizationoftotal,
        }));
        console.log("Uploading ZonalData:", ZonalDatatoinsert.length);
        createPromises.push(ZonalData.bulkCreate(ZonalDatatoinsert));
    }

    await Promise.all(createPromises);
    console.log("Entry log completed successfully");
    return { success: true, message: "Data inserted successfully" };
};
