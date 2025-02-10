var fs = require('fs');
var path = require('path');
/**
 * The classes folder which contains each year folder
 */
let classesFolder;
try {
    classesFolder = fs.readdirSync("cards");
} catch (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
}
var cardJson = { "cards": [] };

/** iterates through every drug card */
classesFolder.forEach(function (fileName, index) {
    /**
     * The card json which contains all our meta information we want
     */

    let actualFilePath = path.join("cards/", fileName);
    let cardJsonListing = {};
    let fileEnding = getFileEnding(actualFilePath);
    if (fileEnding === "json") {
        let file;
        try {
            file = fs.readFileSync(actualFilePath, "utf8");
        } catch (err) {

        }
        file = JSON.parse(file);
        verifyClassPropery(file, "name", actualFilePath);
        verifyClassPropery(file, "skill_level", actualFilePath);
        verifyClassPropery(file, "class", actualFilePath);
        verifyClassPropery(file, "indications", actualFilePath);
        verifyClassPropery(file, "contraindications", actualFilePath);
        verifyClassPropery(file, "side_effects", actualFilePath);
        verifyClassPropery(file, "routes", actualFilePath);
        verifyClassPropery(file, "dose", actualFilePath);
        verifyClassPropery(file, "protocols", actualFilePath);

        cardJsonListing.name = file.name;
        cardJsonListing.skill_level = file.skill_level;
        cardJsonListing.class = file.class;
        cardJsonListing.indications = file.indications;
        cardJsonListing.contraindications = file.contraindications;
        cardJsonListing.side_effects = file.side_effects;
        cardJsonListing.routes = file.routes;
        cardJsonListing.dose = file.dose;
        cardJsonListing.protocols = file.protocols;

        // Optional fields
        if (file.hasOwnProperty("alt_names")) {
            cardJsonListing.alt_names = file.alt_names;
        }
        if (file.hasOwnProperty("interactions")) {
            cardJsonListing.interactions = file.interactions;
        }
        if (file.hasOwnProperty("pearls")) {
            cardJsonListing.pearls = file.pearls;
        }

        cardJson.cards.push(cardJsonListing);
    }

    try { fs.rmdirSync("target", { recursive: true }) }
    catch (err) {
        console.error("failed to remove old target dir", err);
    }
    try { fs.mkdirSync("target",) }
    catch (err) {
        console.error("failed to make new target dir", err);
        process.exit(1);
    }
    // Here we need to write the yearJson out to its `year-classes.json` file
    try { fs.writeFileSync("target/drug_cards.json", JSON.stringify(cardJson), { flag: 'w', force: true }) }
    catch (err) {
        console.error("failed to write drug_cards.json", err);
        process.exit(1);
    }
    try { fs.cpSync("site", "target", { recursive: true, force: true }) }
    catch (err) {
        console.error("failed to cp site", err);
        process.exit(1);
    }
    try { fs.cpSync("cards", "target/cards", { recursive: true, force: true }) }
    catch (err) {
        console.error("failed to cp cards", err);
        process.exit(1);
    }
});

function getFileEnding(filePath) {
    var fileEnding = filePath.split(".");
    fileEnding = fileEnding.at(fileEnding.length - 1);
    return fileEnding
}

function verifyClassPropery(file, verifyProp, filepath) {
    if (!file.hasOwnProperty(verifyProp)) {
        console.error("Listing for class did not include all required fields - Missing field: {" + verifyProp + "} for file: {" + filepath + "}");
        process.exit(1);
    }
}

function sortByMonth(arr) {
    var months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    arr.sort(function (a, b) {
        return months.indexOf(a.month)
            - months.indexOf(b.month);
    });
}
