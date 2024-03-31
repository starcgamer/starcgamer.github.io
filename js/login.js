const jwtToken = localStorage.getItem('jwtToken');


function authenticateUser(username, password) {
    const base64Credentials = btoa(username + ':' + password);

    fetch(URL_SIGNIN, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + base64Credentials,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('jwtToken', data);
            window.location.reload()
        })
        .catch(error => {
            alert("Invalid credentials");
            console.error('There has been a problem with your fetch operation:', error);
        });
}



document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Form submitted');
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    authenticateUser(username, password);
});
