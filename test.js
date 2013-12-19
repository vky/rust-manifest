var request = require('request');
var qs = require('querystring');

var auth = {
    username: '',
    password: ''
};

var github = "https://api.github.com";
var method = "/search/repositories";

// Can only get 100 items max per request.
// In the headers, there's a link attribute which lets you know where you
// are in the set of results.
var query = {
    q: "created:>2010-01-01 language:Rust",
    per_page: 100,
    page: 10
};

function callback (err, response, body, thing) {
    //console.log(err);
    console.log(response.headers.link);
    //console.log(response);

    function getRepoAttributes (element) {
        var project = {
            name: element.name,
            url: element.owner.html_url,
            author: element.owner.login,
            updated: element.updated_at,
            forks: element.forks_count,
            stars: element.stargazers_count
        }
        return project;
    }

    var results = JSON.parse(body);

    //console.log(results.items.length);

    repos = results.items;
    var stuff = repos.map(getRepoAttributes);
    return response.headers.link;
}

var request = request.defaults({
    "auth": auth,
    headers: {
        "User-Agent": "Rust-Manifest"
    }
});

var test = request({
    method: 'GET',
    uri: github+method,
    "qs": query
}, callback);
console.log(test[1]);
