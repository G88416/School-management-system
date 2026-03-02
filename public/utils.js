/**
 * utils.js - Utility functions for the School Management System
 *
 * Provides shared helpers used by index.html, including CSV parsing
 * and validation used for bulk student/teacher uploads.
 */

/**
 * Parse a CSV string into an array of row objects.
 *
 * @param {string} csv - Raw CSV text (first row is treated as headers).
 * @returns {{ success: boolean, data?: Object[], headers?: string[], error?: string }}
 */
function parseCSV(csv) {
  try {
    if (!csv || typeof csv !== 'string') {
      return { success: false, error: 'Invalid CSV content.' };
    }

    // Normalize line endings and split into lines, ignoring empty trailing lines
    const lines = csv.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const nonEmptyLines = lines.filter(line => line.trim() !== '');

    if (nonEmptyLines.length < 2) {
      return { success: false, error: 'CSV must contain a header row and at least one data row.' };
    }

    const headers = parseCSVRow(nonEmptyLines[0]);

    if (headers.length === 0) {
      return { success: false, error: 'Could not parse CSV headers.' };
    }

    const data = [];
    for (let i = 1; i < nonEmptyLines.length; i++) {
      const values = parseCSVRow(nonEmptyLines[i]);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] !== undefined ? values[index] : '';
      });
      data.push(row);
    }

    return { success: true, data, headers };
  } catch (err) {
    return { success: false, error: 'Failed to parse CSV: ' + err.message };
  }
}

/**
 * Parse a single CSV row, handling quoted fields that may contain commas or newlines.
 *
 * @param {string} row - A single CSV row string.
 * @returns {string[]} Array of field values.
 */
function parseCSVRow(row) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote ("")
        if (i + 1 < row.length && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }

  fields.push(current.trim());
  return fields;
}

/**
 * Validate that all required fields are present as headers in the parsed CSV data.
 *
 * @param {Object[]} data         - Array of row objects returned by parseCSV.
 * @param {string[]} requiredFields - Column names that must be present.
 * @returns {{ valid: boolean, error?: string }}
 */
function validateCSVData(data, requiredFields) {
  if (!data || data.length === 0) {
    return { valid: false, error: 'No data rows found in the CSV file.' };
  }

  const headers = Object.keys(data[0]);
  const missing = requiredFields.filter(field => !headers.includes(field));

  if (missing.length > 0) {
    return {
      valid: false,
      error: 'Missing required columns: ' + missing.join(', ') +
             '. Please ensure your CSV file includes all required headers.'
    };
  }

  return { valid: true };
}
