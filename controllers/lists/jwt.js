const { google } = require("googleapis");
const { JWT } = require("google-auth-library");
const credentials = require("../../service.json");

const jwtClient = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/gmail.send"],
});
const sheets = google.sheets({ version: "v4", auth: jwtClient });

async function run() {
  try {
    await jwtClient.authorize();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();

class TestJWT {
  async read(spreadsheetId, range) {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const values = response.data.values;
    //console.log("Data from the spreadsheet:", response, values);
    return values;
  }
  async clear(spreadsheetId, range) {
    const response = await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheetId,
      range: range,
    });
    console.log("Data cleared: ", response.data);
  }
  async update(spreadsheetId, range, data) {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      requestBody: {
        values: data,
      },
    });
    console.log("Data written to the spreadsheet:", response.data);
  }
  async append(spreadsheetId, range, data) {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      requestBody: {
        values: data,
      },
    });
    console.log("Data written to the spreadsheet:", response.data);
  }
}

module.exports = new TestJWT();
