function verifyEmail() {
  
    // POST request using fetch()
    let email = document.getElementById("email").value;

    fetch("https://fintech-lite.herokuapp.com/api/v1/users/verify", {
        
        // Adding method type
        method: "POST",
        
        // Adding body or contents to send
        body: JSON.stringify({
            email: email,
        }),
        
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    
    // Converting to JSON
    .then((response, err) => { 
        if(err) {
            return console.log(err);
        } else {
          return   console.log(response)
        }
    })
    
    // Displaying results to console
    .then(json => console.log(json));
  }