var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var raw = JSON.stringify({
    "key": " ", // Remember to put your API key!
    "prompt": "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner))",
    "negative_prompt": "bad quality",
    "width": "512",
    "height": "512",
    "safety_checker": false,
    "seed": null,
    "samples": 1,
    "base64": false,
    "webhook": null,
    "track_id": null
});
// Explicitly type 'requestOptions' as RequestInit
var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow' // Keep 'follow' as a string
};
fetch("https://modelslab.com/api/v6/realtime/text2img", requestOptions)
    .then(function (response) { return response.json(); }) // Use response.json() as discussed
    .then(function (result) { return console.log(result); })
    .catch(function (error) { return console.log('error', error); });
