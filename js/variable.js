const siteName = "lesterleefat";
const email = "leefat0418@gmail.com";
const address = "Kwai Tsing, New Territories, Hong Kong";
const phone = "+852 67464970";

const siteName_elements = document.querySelectorAll("#siteName");
siteName_elements.forEach(element => {
    element.innerHTML = siteName;
});

const email_elements = document.querySelectorAll("#email");
email_elements.forEach(element => {
    element.innerHTML = email;
});

const address_elements = document.querySelectorAll("#address");
address_elements.forEach(element => {
    element.innerHTML = address;
});

const phone_elements = document.querySelectorAll("#phone");
phone_elements.forEach(element => {
    element.innerHTML = phone;
});
