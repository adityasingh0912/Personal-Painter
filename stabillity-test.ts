var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "key" : "CTrUImCbjDMjGYH8fPys9UYBqhem6sMiVSoSvdKSKDhl13pvIRpyZSmPuKq3", // Remember to put your API key!
    "prompt": "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner))",
    "negative_prompt": "bad quality",
    "width": "512",
    "height": "512",
    "safety_checker": false,
    "seed": null,
    "samples":1,
    "base64":false,
    "webhook": null,
    "track_id": null
});

// Explicitly type 'requestOptions' as RequestInit
const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' // Keep 'follow' as a string
};

fetch("https://modelslab.com/api/v6/realtime/text2img", requestOptions)
    .then(response => response.json()) // Use response.json() as discussed
    .then(result => console.log(result))
    .catch(error => console.log('error', error));