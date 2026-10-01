const URL = "https://teachablemachine.withgoogle.com/models/GxRPPFET-/";

let model;
let webcam;
let labelContainer;
let maxPredictions;

async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(300, 300, true);

    await webcam.setup();

    await webcam.play();

    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");

    for (let i = 0; i < maxPredictions; i++) {

        labelContainer.appendChild(
            document.createElement("div")
        );

    }
}

async function loop() {

    webcam.update();

    await predict();

    window.requestAnimationFrame(loop);
}

async function predict() {

    const prediction = await model.predict(webcam.canvas);

    for (let i = 0; i < maxPredictions; i++) {

        const className = prediction[i].className;

        const probability = prediction[i].probability;

        labelContainer.childNodes[i].innerHTML =
            className + ": " +
            (probability * 100).toFixed(2) +
            "%";
    }
}