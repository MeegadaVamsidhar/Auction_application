/**
 * Calculates the base price of a player based on their academic year.
 * @param {string} year - The academic year (e.g., "1ST YEAR", "2ND YEAR", "MTECH").
 * @returns {number} - The base price in Lakhs.
 */
function calculateBasePrice(year) {
    if (!year) return 5;

    const yearUpper = year.toUpperCase();

    if (yearUpper.includes("4TH YEAR") || yearUpper.includes("MTECH")) {
        return 100; // 1 CR
    } else if (yearUpper.includes("3RD YEAR")) {
        return 50; // 50 Lakh
    } else if (yearUpper.includes("2ND YEAR")) {
        return 30; // 30 Lakh (User said 30cr, likely a typo for Lakh)
    } else if (yearUpper.includes("1ST YEAR")) {
        return 20; // 20 Lakh
    }

    return 5; // Default/Minimum
}

module.exports = {
    calculateBasePrice,
};
