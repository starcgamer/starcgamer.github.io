
const DOMAIN = "learn.reboot01.com"
const API_URL = `https://${DOMAIN}/api/graphql-engine/v1/graphql`
const URL_SIGNIN = `https://${DOMAIN}/api/auth/signin`

const graphqlQuery = {
    query: `    query {
        user {
          id
          login
          attrs
          email
          campus
          profile
          lastName
          firstName
          auditRatio
          totalUp
          totalDown
          roles { slug }
          labels { labelName, labelId }
          records {
            banEndAt
            message
          }
          transactions (
            order_by: [{ type: desc }, { amount: desc }]
            distinct_on: [type]
            where: { 
              type: { _like: "skill_%" }
            },
          ) 
          { 
            type
            amount
          }
        }
      }
        `
}

async function fetchData() {
    const jwtToken = localStorage.getItem('jwtToken');

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(graphqlQuery)
    })

    if (!response.ok) {
        console.log(response.error)
    }

    let data = await response.json()

    return data;
}
const displayData = async () => {
    const result = await fetchData();
    console.log(result);
    user = result.data.user[0];
    document.getElementById('user').innerText = user.firstName + ' ' + user.lastName;
    for (let key in user) {
        if (key !== 'firstName' && key !== 'lastName') {
            // document.getElementById(key).innerText = user[key];
            // append to the table
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            // if value is an object, convert to string
            if (typeof user[key] === 'object') {
                user[key] = JSON.stringify(user[key]);
            }
            
            
            td1.innerText = key;
            td2.innerText = user[key];
            tr.appendChild(td1);
            tr.appendChild(td2);
            document.getElementById('data').appendChild(tr);
        }
    }
}




const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/pages/404.html",
    "/": "/pages/profile.html",
    "/login": "/pages/login.html",
};

const scripts = {
    "/login": "/js/login.js",
    "/": "/js/profile.js",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const data = await fetchData()
    if (data.errors && data.errors[0].message.includes("Could not verify JWT")) {
        if (localStorage.getItem('jwtToken')) {
            localStorage.removeItem('jwtToken')
            window.location.reload()
        }
        if (path === "/") {
            window.history.pushState({}, "", "/login");
            handleLocation();
            return;
        }
    } else {
        if (path === "/login") {
            window.history.pushState({}, "", "/");
            handleLocation();
            return;
        }
    }
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementsByTagName("main")[0].innerHTML = html;
    // load script
    const script = scripts[path];
    if (script) {
        const scriptElement = document.createElement("script");
        scriptElement.src = script;
        document.body.appendChild(scriptElement);
    }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

