// const p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('pippo');
//         resolve();
//     }, 2000);
// });
// console.log(p1);
// setTimeout(() => console.log(p1), 2300);

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 2000);
})

function onSuccess() {
    console.log('Alé');
}

function onError(error) {
    console.log('Che disdetta!', error);
}

p2.then(onSuccess);
p2.catch(onError);


$("#btnXXX").on("click", () => {
    $.getJSON({
        url: `https://reqres.in/api/users?page=2`,
        success: page => {
            page.data.forEach(user => {
                $.getJSON({
                    url: getUserURL(user.id),
                    success(u) {
                        updateUI(
                            u.data,
                        );
                    },
                    error: onError
                });
            });
        },
        error: onError
    });
});

function getUsersPage() {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: `https://reqres.in/api/users?page=2`,
            success: resolve,
            error: reject
        })
    })
}

function getUserURL(id) {
    return `https://reqres.in/api/users/${id}`;
}

function getSingleUser(id) {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: getUserURL(id),
            success: resolve,
            error: reject
        });
    })
}

function updateUI(user) {
    let current = $('#app').html();
    current = current.concat(`<p>${user.first_name}</p>`);
    $('#app').html(current);
}

$('#btn33333').on('click', () => {
    const promiseOfAUsersPage = getUsersPage();
    promiseOfAUsersPage.then(page => {
        page.data.forEach(user => {
            const promiseOfAUser = getSingleUser(user.id);
            promiseOfAUser.then(singleuser => updateUI(singleuser.data));
            promiseOfAUser.catch(onError);
        });
    });
    promiseOfAUsersPage.catch(onError);
});

// --------------------------

function getPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
    })
}

function log1() {
    console.log('Log 1');
    return 'messaggio di log 1';
}

function log2(msg) {
    console.log(`Log 2 ${msg}`);
    return `${msg}-${msg}`;
}

function log3(msg) {
    console.log(`Log 3 ${msg}`);
    return `Pippo ${msg}`;
}

// getPromise()
//     .then(log1)
//     .then(log2, onError)
//     .then(function (response) {
//         console.log(response);
//     }, function (error) {
//         console.log(error);
//     })
//     .then((msg) => console.log(msg));

// --------------------


// function setToken() {
$.ajaxSetup({
    headers: {
        'Authorization': 'token 6d06cb3b15e737d972f0db16f66338bb7ede383a',
    }
});
// }

function getWeatherURL([city, state]) {
    return `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=1c9757fa5ff23bdc1a6c53c918eaa094`;
}

function getUserFromGithub(id) {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: `https://api.github.com/users/${id}`,
            success: resolve,
            error: reject
        });
    });
}

function getWeather(user) {
    let delay = 0;
    // prima era solo user e il delay non veniva settato
    if (user.login === 'marcofabbri') {
        delay = 4000;
    }
    // return new Promise((resolve, reject) => {
    //     $.getJSON({
    //         url: getWeatherURL(user.location.split(',')),
    //         success(weather) {
    //             resolve({
    //                 user: user,
    //                 weather: weather.weather[0].description
    //             })
    //         },
    //         error: reject
    //     });
    // });
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Tempo per ${user.login}`);
            resolve({
                user: user,
                weather: 'molto nuvoloso'
            });
        }, delay);
    });
}

function updateGithubUI(userAndWeather) {
    let current = $('#app').html();
    current = current
        .concat(`<p>${userAndWeather.user.login}</p><p>${userAndWeather.weather}</p>`);
    $('#app').html(current);
}

const usersname = ['marcofabbri', 'FrancescoOrifici6'];

$('#btn').on('click', () => {
    Promise.all(usersname.map(username => getUserFromGithub(username).then(getWeather))).then(weathers => weathers.forEach(
        weather => updateGithubUI(weather)));
    // Promise.race(usersname.map(username => getUserFromGithub(username).then(getWeather)))
    //     .then(weather => updateGithubUI(weather));
})

$('#btn1').on('click', async () => {
    const user = await getUserFromGithub('marcofabbri');
    const userAndWeather = await getWeather(user);
    updateGithubUI(userAndWeather);
})

$('#btn4').on('click', () => {
    getUserFromGithub('marcofabbri')
        .then(getWeather)
        .then((weather) => updateGithubUI(weather))
        .catch(onError);
})

$('#btn444').on('click', () => {
    setToken();
    getUserFromGithub('marcofabbri', user => {
        getWeather(user, (weather) => {
            updateGithubUI({
                user: user,
                weather: weather
            });
        }, onError)
    }, onError);
});

