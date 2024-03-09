const siteName = "lesterleefat";
const email = "leefat0418@gmail.com";
const address = "Kwai Tsing, New Territories, Hong Kong";
const phone = "+852 67464970";
const yearExperience = "8";
const completedProjects = "40";
const github = "https://github.com/lesterleefat0418?tab=repositories";


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

const github_elements = document.querySelectorAll("#github");
github_elements.forEach(element => {
    element.setAttribute("href", github);
    element.setAttribute("target", "_blank");
});

const yearExperience_elements = document.querySelectorAll("#yearExperience");
yearExperience_elements.forEach(element => {
    element.innerHTML = yearExperience;
});

const yearExperienceName_elements = document.querySelectorAll("#yearExperienceName");
yearExperienceName_elements.forEach(element => {
    element.innerHTML = yearExperience + " Years Experience";
});

const completedProjects_elements = document.querySelectorAll("#completedProjects");
completedProjects_elements.forEach(element => {
    element.innerHTML = completedProjects;
});
