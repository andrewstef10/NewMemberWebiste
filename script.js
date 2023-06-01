// Get the video element
const camera = document.getElementById("camera");
const capturedImage = document.getElementById("capturedImage");
let newMemberCount = 0;

// Access the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
.then((stream) => {
    // Set the video source to the live stream from the webcam
    camera.srcObject = stream;
})
.catch((error) => {
    console.log(error);
});


let listOfNewMembers = [];

//used to store the new members image as a string
let imageDataURL = null;

/**
 * Takes a picture and saves the image
 */
function take_snapshot() {
    //document.getElementById("demo").innerHTML = "TEST";

    // Get the video element from the HTML file
    // const video = document.getElementById("camera");

    // Create a canvas element and set its dimensions to match the video element
    const canvas = document.createElement("canvas");
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;

    // Draw the video frame onto the canvas
    const context = canvas.getContext("2d");
    context.drawImage(camera, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL
    const dataURL = canvas.toDataURL("image/jpeg");

    // // Create a link element and set its href and download attributes
    // const link = document.createElement("a");
    // link.href = dataURL;
    // link.download = "photo.jpg";

    // // Click the link to download the image file
    // link.click();

    //display the captured image
    camera.style.display = 'none';
    capturedImage.style.display = 'block';
    capturedImage.src = dataURL;
    document.getElementById("takePictureButton").innerHTML = "Retake Picture"


    imageDataURL = dataURL;
    document.getElementById("errorMessage").innerHTML = '';
}


/**
 * Submits a new member to the list of potential new members
 * @returns void
 */
function submitNewMember() {
    //make sure input if valid
    if (imageDataURL == null) {
        document.getElementById("errorMessage").innerHTML = "Please take your picture";
        return;
    }
    if (document.getElementById("firstName").value == '') {
        document.getElementById("errorMessage").innerHTML = "Please enter your first name";
        return;
    }
    if (document.getElementById("lastName").value == '') {
        document.getElementById("errorMessage").innerHTML = "Please enter your last name";
        return;
    }
    if (document.getElementById("age").value == '') {
        document.getElementById("errorMessage").innerHTML = "Please enter your age";
        return;
    }

    personClass = document.getElementById("class").value;
    if (personClass == '' || !(equalsIgnoringCase('freshman', personClass) || equalsIgnoringCase('sophomore', personClass) ||
    equalsIgnoringCase('junior', personClass) || equalsIgnoringCase('senior', personClass))) {

        document.getElementById("errorMessage").innerHTML = "Please enter either freshman, sophomore, junior, or senior in the class text box";
        return;
    }

    //create person object
    let person = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        age: document.getElementById("age").value,
        class: document.getElementById("class").value,
        picture: imageDataURL
    };
    listOfNewMembers.push(person);

    //reset the values in the text boxes
    document.getElementById("firstName").value = '';
    document.getElementById("lastName").value = '';
    document.getElementById("age").value = '';
    document.getElementById("class").value = '';
    imageDataURL = null;
    document.getElementById("errorMessage").innerHTML = '';

    //reset camera
    capturedImage.style.display = 'none';
    camera.style.display = 'block';
    document.getElementById("takePictureButton").innerHTML = "Take Picture"

    //increment new member count
    newMemberCount++;
    document.getElementById("memberCounter").innerHTML = "Members Submitted: " + newMemberCount;
}

/**
 * 
 * @param {string} text first string to compare
 * @param {string} other second string to compare
 * @returns true if the strings are the same ignoring case
 */
function equalsIgnoringCase(text, other) {
    return text.localeCompare(other, undefined, { sensitivity: 'base' }) === 0;
}

function printNewMemberArr() {
    // document.getElementById("printArr").innerHTML = JSON.stringify(listOfNewMembers);

    // const container = document.getElementById("listOfNewMembers-container");
    // for (let i = 0; i < listOfNewMembers.length; i++) {
    //     const person = listOfNewMembers[i];

    //     // create HTML elements for the person's information
    //     const div = document.createElement("div");
    //     const firstName = document.createElement("h2");
    //     const lastName = document.createElement("h2");
    //     const age = document.createElement("p");
    //     const personClass = document.createElement("p");
    //     const img = document.createElement("img");

    //     //set contents of name and age elements
    //     firstName.textContent = person.firstName;
    //     lastName.textContent = person.lastName;
    //     age.textContent = person.age;
    //     personClass.textContent = person.class;
    //     img.src = person.picture;

    //     //append elements to the container
    //     div.appendChild(img);
    //     div.appendChild(firstName);
    //     div.appendChild(lastName);
    //     div.appendChild(age);
    //     div.appendChild(personClass);
    //     container.appendChild(div);
    // }
    if (listOfNewMembers.length == 0) {
        document.getElementById("errorMessage").innerHTML = "No members have been submitted";
        return;
    }


    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    // console.log(pageWidth);
    // console.log(pageHeight);

    //calculate 4:3 aspect ratio
    const imageWidth = 150;
    const imageHeight = (imageWidth / 4) * 3;
    const imageX = (pageWidth / 2) - (imageWidth / 2);
    const imageY = 10;

    for (let i = 0; i < listOfNewMembers.length; i++) {
        //get current person
        const person = listOfNewMembers[i];

        //add image and image border
        doc.addImage(person.picture, 'JPEG', imageX, imageY, imageWidth, imageHeight);
        doc.setLineWidth(5);
        doc.setDrawColor('#000000');
        doc.rect(imageX, imageY, imageWidth, imageHeight);

        //add name
        doc.setFontSize(25);
        doc.text(person.firstName + " " + person.lastName, 10, imageHeight + 30);

        //add other person fields
        doc.setFontSize(15);
        doc.text("Age: " + person.age, 10, imageHeight + 40);
        doc.text("Class: " + person.class, 10, imageHeight + 50);

        //add another page
        if (i < listOfNewMembers.length - 1) {
            doc.addPage();
        }

    }
    // doc.text("TEST DOCUMENT", 10, 10);
    doc.save('output.pdf');
    
    

}



