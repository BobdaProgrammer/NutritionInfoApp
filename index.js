  const scanner = new Html5QrcodeScanner("reader", {
    qrbox: {
      width: 250,
      height: 250,
    },
    fps: 50,
  });
  scanner.render(success, error)

function breakfast() {

}

function custom(event) {
              let hundred = document.getElementById("hundred").innerHTML;
              hundred = hundred.split("<br>");
              let custom = document.getElementById("custom");
              custom.innerHTML = "<h4>Custom values:</h4>";
              for (let i = 0; i < hundred.length-1; i++) {
                let splitline = hundred[i].split(": ");
                custom.innerHTML +=
                  splitline[0] +
                  ": " +
                  JSON.stringify(
                    Number(splitline[1]) * (Number(event.target.value)/100)
                  ) +
                  "<br>";
              }
}

function success(result) {
  let resultEl = document.getElementById("result");
  resultEl.style.display = "block";
  document.getElementById("imghold").style.display="block"
    resultEl.innerHTML = `found. Qrcode: ${result}. retrieving data...`;
    fetch(`https://world.openfoodfacts.org/api/v2/product/${result}.json`)
      .then(response => {
        if (response.status == "0") {
          console.log("couldn't find item")
        }
        return response.json();
      })
      .then(data => {
        if (data.status == 0) {
          console.log("couldn't find product");
          resultEl.innerHTML =
            "<div style='text-align: center;'>Could't find item please try again<br><button onclick='location.reload()'>Try again</button></div>";
          return;
        }
        document.getElementById(
          "imghold"
        ).innerHTML = `</div><img src="${data["product"]["image_url"]}"><br>`;
        let nutriments = data["product"]["nutriments"];
        console.log(data);
        let name = "";
        let val = 0;
        let serve = false;

        resultEl.innerHTML = `<center><h2>${data["product"]["product_name"]}</h2><h5>Last updated: ${data["product"]["last_edit_dates_tags"][0]}</h5>Add to:<br><button onclick="breakfast()">Breakfast</button><button onclick="lunch()">Lunch</button><button onclick="dinner()">Dinner</button><button onclick="snack()">Snack</button><br><input style="margin-top: 8px" class="selector" type="number" onchange="custom(event)" min=0>g</center><div id="custom"></div><h4>Typical values per 100g:</h4></center>`;
        let res = `<div id="hundred">`
        // Loop through the keys of the nutriments object
        Object.keys(nutriments).forEach((key) => {
          if (!key.includes("_")) {
            if (name==""||!key.startsWith(name)) {
              name = key;
              val = nutriments[key]
              serve = true
            }
          } else if (serve&&key.endsWith("_unit")) {
            let unit = nutriments[key];
            res +=
              name[0].toUpperCase() +
              name.slice(1, name.length) +
              ` (${unit}): ${val}<br>`;
            serve = false;
          }
        });
        res+="</div>"
        if (nutriments["carbohydrates_serving"] != undefined) {
          res += `<h4>Typical values per serving:</h4>`;
          Object.keys(nutriments).forEach((key) => {
            if (key.endsWith("_serving")) {
              name = key.split("_")[0].split("-").join(" ");
              val = nutriments[key];
              serve = true;
            } else if (serve) {
              if (key.endsWith("_unit")) {
                let str = key.split("-");
                let unit = nutriments[key]
                if (str.length == 1 || !str[1].toLowerCase().startsWith(unit.toLowerCase())) {
                  res +=
                    name[0].toUpperCase() +
                    name.slice(1, name.length) +
                    ` (${unit}): ${val}<br>`;
                }
              }
              serve = false;
            }
          });
        }
        res+="<h5>Ingredients:</h5>"
        for (let i = 0; i < data["product"]["ingredients"].length; i++) {
          res +=
            `<li>${data["product"]["ingredients"][i]["text"]}</li><br>`.replace(
              /_/g,
              ""
            );
        }
        let nutriscore = data["product"]["nutriscore_grade"];
        let nutri = "";
        nutri += "<span id='nutri'>Nutri Score: </span>";
        nutri +=
          nutriscore == "a"
            ? "<label for='nutri' style='color:green;'>A</label>"
            : nutriscore == "b"
            ? "<label for='nutri' style='color:blue;'>B</label>"
            : nutriscore == "c"
            ? "<label for='nutri' style='color:orange;'>C</label>"
            : `<label for='nutri' style='color:red;'>${nutriscore.toUpperCase()}</label>`;
        res += nutri;
        resultEl.innerHTML+=res
      })
      .catch(error => {

      })
    scanner.clear()
} 
function error(err) {
  }
  