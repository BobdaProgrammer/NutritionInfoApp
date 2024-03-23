document.addEventListener('DOMContentLoaded', function () {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#barcode-scanner'),
      constraints: {
        width: 480,
        height: 320,
        facingMode: "environment" // use "user" for front camera
      },
    },
    decoder: {
      readers: ["ean_reader"] // specify the type of barcode you want to scan
    }
  }, function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  });
  let detected = false
  Quagga.onDetected(function (result) {
    if (!detected) {
      document.getElementById("foodname").innerHTML="found. retrieving data ..."
      detected =true
      fetch(`https://world.openfoodfacts.org/api/v2/product/${result.codeResult.code}.json`)
        .then(response => {
          console.log(response)
          if (response.status == "0") {
            console.log("couldn't find")
          }
          return response.json();
        })
        .then(data => {
          document.getElementById("foodname").innerHTML = data["product"]["product_name"]
        })
      
    }
    });
    });