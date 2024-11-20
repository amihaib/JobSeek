// Utility function to parse salary string
exports.parseSalary = function (salary) {
  // Check if the salary is a number or a string containing 'k' (e.g., "15k")
  if (typeof salary === "string") {
    // Remove commas or spaces from the salary string
    salary = salary.replace(/,/g, "").trim();

    // If the salary ends with 'k', multiply by 1000
    if (salary.endsWith("k")) {
      return parseFloat(salary) * 1000;
    }

    // Try to parse the salary as a float number
    const parsedSalary = parseFloat(salary);

    // If parsing fails (NaN), return null
    if (isNaN(parsedSalary)) {
      return null;
    }

    return parsedSalary;
  }

  // If salary is already a number, return it directly
  return typeof salary === "number" ? salary : null;
};
