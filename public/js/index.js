$("#error").hide();
$("#subscribed").hide();

$(document).ready(() => {
  getLocation();
});

//validates email on subscribtion
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

ScrollReveal({ reset: true });

// location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log(error);
  }
}

let map;

// for mobile users
var lat = 00;
var lon = 00;

function showPosition(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
}

// if value valid send to mongo subscribe collection
$("#emailclick").click(() => {
  const email = $("#emailval").val();
  $("#emailval").val("");
  const date = new Date();
  if (validateEmail(email)) {
    console.log(email);
    $.ajax({
      url: "/",
      type: "POST",
      data: { email: email, lat: lat, lon: lon, date: date },
      success: function (res) {
        // console.log(res)
        if (res.alreadysubscribed == "404") {
          $("#error").hide();
          $("#subscribed").fadeIn();
          $("#subscribed code")
            .delay(100)
            .fadeIn()
            .text("Already Subscribed 🛐");
        } else {
          $("#subscribed").fadeIn();
          $("#subscribed code").fadeIn().text("Subscribed Sucessfully 🔥");
          $("#error").hide();
        }
      },
    });
  } else {
    $("#subscribed").hide();
    $("#error").fadeIn();
  }
});
