const axios = require("axios");
const fs = require("fs");

async function getForm() {
  try {
    const url =
      "https://docs.google.com/forms/d/e/1FAIpQLSf-6W0hI4JFju1Je8TYoQoWL8Ksh3R2dR0-Tgn60Wv9J3Y7VQ/viewform";
    const response = await axios.get(url);
    fs.writeFileSync("form.html", response.data);
    console.log("Form HTML saved to form.html");
  } catch (error) {
    console.error("Error fetching form:", error.message);
  }
}

getForm();
