  const scanner = new Html5QrcodeScanner("reader", {
    qrbox: {
      width: 250,
      height: 250,
    },
    fps: 50,
  });
  scanner.render(success, error)

function success(result) {
  let resultEl = document.getElementById("result");
  resultEl.style.display = "block";
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
          console.log("couldn't find product")
          resultEl.innerHTML = "<div style='text-align: center;'>Could't find item please try again<br><button onclick='location.reload()'>Try again</button></div>"
          return
        }
        let nutriments = data["product"]["nutriments"]
        let carbs = nutriments["carbohydrates_100g"]
        let energy = nutriments["energy_100g"]
        let energyUnit = nutriments["energy_unit"];
        let fat = nutriments["fat_100g"]
        let fiber = nutriments["fiber_100g"]
        let magnesium = nutriments["magnesium_value"];
        let protein = nutriments["proteins_value"]
        let sodium = nutriments["sodium_value"]
        let sugars = nutriments["sugars_value"]
        resultEl.innerHTML = `<h2>${data["product"]["product_name"]}</h2><h4>Typical values per 100g:</h4>Carbohydrates: ${carbs}<br> Energy (${energyUnit}): ${energy}<br> Fat: ${fat}<br>Fibre: ${fiber}<br>Magnesium (mg): ${magnesium}<br>Sodium (g): ${sodium}<br>Protein (g): ${protein}<br>Sugars (g): ${sugars}<br><img src="${data["product"]["image_url"]}"><br> <h5>Ingredients:</h5>`.replace(/undefined/g, "unknown")
        for (let i = 0; i < data["product"]["ingredients"].length; i++){
          resultEl.innerHTML += `<li>${data["product"]["ingredients"][i]["text"]}</li><br>`.replace(/_/g,"");
        }
        let nutriscore = data["product"]["nutriscore_grade"]
        let nutri = ""
        nutri+="<span id='nutri'>Nutri Score: </span>"
        nutri +=
          nutriscore == "a"
            ? "<label for='nutri' style='color:green;'>A</label>"
            : nutriscore == "b"
            ? "<label for='nutri' style='color:blue;'>B</label>"
            : nutriscore == "c"
            ? "<label for='nutri' style='color:orange;'>C</label>"
                : `<label for='nutri' style='color:red;'>${nutriscore.toUpperCase()}</label>`;
        resultEl.innerHTML+=nutri

    })
      .catch(error => {

      })
    scanner.clear()
} 
function error(err) {
  }
  

/*{
    "carbohydrates": 66.9,
    "carbohydrates_100g": 66.9,
    "carbohydrates_serving": 6.69,
    "carbohydrates_unit": "g",
    "carbohydrates_value": 66.9,
    "energy": 1477,
    "energy-kj": 1477,
    "energy-kj_100g": 1477,
    "energy-kj_serving": 148,
    "energy-kj_unit": "kJ",
    "energy-kj_value": 1477,
    "energy-kj_value_computed": 1476.7,
    "energy_100g": 1477,
    "energy_serving": 148,
    "energy_unit": "kJ",
    "energy_value": 1477,
    "fat": 1.7,
    "fat_100g": 1.7,
    "fat_serving": 0.17,
    "fat_unit": "g",
    "fat_value": 1.7,
    "fiber": 16.5,
    "fiber_100g": 16.5,
    "fiber_serving": 1.65,
    "fiber_unit": "g",
    "fiber_value": 16.5,
    "fruits-vegetables-legumes-estimate-from-ingredients_100g": 0,
    "fruits-vegetables-legumes-estimate-from-ingredients_serving": 0,
    "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0,
    "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0,
    "magnesium": 0.0649,
    "magnesium_100g": 0.0649,
    "magnesium_label": "Magnesium",
    "magnesium_serving": 0.00649,
    "magnesium_unit": "mg",
    "magnesium_value": 64.9,
    "nova-group": 3,
    "nova-group_100g": 3,
    "nova-group_serving": 3,
    "nutrition-score-fr": -4,
    "nutrition-score-fr_100g": -4,
    "proteins": 8.5,
    "proteins_100g": 8.5,
    "proteins_serving": 0.85,
    "proteins_unit": "g",
    "proteins_value": 8.5,
    "salt": 0.5,
    "salt_100g": 0.5,
    "salt_serving": 0.05,
    "salt_unit": "g",
    "salt_value": 0.5,
    "saturated-fat": 0.3,
    "saturated-fat_100g": 0.3,
    "saturated-fat_serving": 0.03,
    "saturated-fat_unit": "g",
    "saturated-fat_value": 0.3,
    "sodium": 0.2,
    "sodium_100g": 0.2,
    "sodium_serving": 0.02,
    "sodium_unit": "g",
    "sodium_value": 0.2,
    "sugars": 2.9,
    "sugars_100g": 2.9,
    "sugars_serving": 0.29,
    "sugars_unit": "g",
    "sugars_value": 2.9,
    "zinc": 0.0016,
    "zinc_100g": 0.0016,
    "zinc_label": "Zinc",
    "zinc_serving": 0.00016,
    "zinc_unit": "mg",
    "zinc_value": 1.6
}*/