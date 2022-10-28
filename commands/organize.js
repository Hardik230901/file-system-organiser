let fs = require("fs");
let path = require("path");

let types = {
    media: ["mp4", "mkv"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex', 'js', 'md'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

function organizeFn(dirPath) {
    // console.log("Organize command implemented for", dirPath);
    let destinationPath;
    if (dirPath == undefined) {
        destinationPath = process.cwd();
        return;
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        if(doesExist) {
            destinationPath = path.join(dirPath, "Organized_files");
            if (fs.existsSync(destinationPath) == false) {
                fs.mkdirSync(destinationPath);
                console.log("Organised_files created");
            }
        }
        else {
            console.log("Please enter a directory path");
            return;
        }
    }
    organizeHelper(dirPath, destinationPath);
} 


function organizeHelper(src, destination) {
    let fileNames = fs.readdirSync(src);
    for (let i = 0; i < fileNames.length; i++) {
        let fileAddress = path.join(src, fileNames[i]);
        let isFile = fs.lstatSync(fileAddress).isFile();
        if (isFile) {
            let category = getCategory(fileNames[i]);
            sendFile(fileAddress, destination, category);
        }
    }
}

function sendFile(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destinationFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destinationFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName, "copied to", category);
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            } 
        }
    }
    return "others";
}

module.exports = {
    organizeKey: organizeFn
}