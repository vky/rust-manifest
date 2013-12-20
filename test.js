var request = require('request');
var qs = require('querystring');
var url = require('url');
var fs = require('fs');

var request = request.defaults({
    auth: {
        username: '',
        password: ''
    },
    headers: {
        "User-Agent": "Rust-Manifest"
    }
});

var github_api = "https://api.github.com/search/repositories";
var searchCriteria = "created:>2010-01-01 language:Rust";
var db = [];

function processSearchResults (err, response, body) {
    function getSimpleRepoAttributes (element) {
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

    function nextPage (link) {
        // Split the link string on ">;" or '",'.
        // The first pattern will cut the end of a url and the following item
        // apart, and the second pattern is to cut apart the 'rel' and the url
        // following it.
        // Trim excess whitespace from each of the split items.
        // Remove the beginning '<' from the URLs.
        var links = link.split(/>;|",/).map(function (str) {
            return str.trim();
        }).map(function (str) {
            if (/^</.test(str)) {
                return str.split(/^</)[1];
            }
            else {
                return str;
            }
        });
        // 0 - url
        // 1 - next | first
        // 2 - url
        // 3 - last | prev

        // Get 2nd element from exec call, the capture from the regex
        var next = /rel="(\w+)/.exec(links[1])[1];
        if (next === "next") {
            // Continue on with searches
            var query = url.parse(links[0]).query;
            var page = qs.parse(query).page;
            return page;
        }
    }

    var results = JSON.parse(body);
    var linkHeader = response.headers.link;

    var completeRepos = results.items;
    var simpleRepos = completeRepos.map(getSimpleRepoAttributes);

    var repos = {
        "complete": completeRepos,
        "simple": simpleRepos
    };

    db.push(repos);

    var page = nextPage(linkHeader);
    if (page) {
        // console.log("next: " + page);
        searchGithub(page);
    }
    else {
        callbackNoMore();
    }
}

function searchGithub (page) {
    // Can only get 100 items max per request.
    // In the headers, there's a link attribute which lets you know
    // where you are in the set of results.
    var MAX_RESULTS = 100;

    var query = {
        q: searchCriteria,
        per_page: MAX_RESULTS,
        "page": page,
    };

    request({
        method: 'GET',
        uri: github_api,
        "qs": query
    }, processSearchResults);
}

// Do stuff after all going through all of the search pages.
function callbackNoMore() {
    var simple = [],
        complete = [];

    for (var i = 0; i < db.length; ++i) {
        console.log(i);
        simple = simple.concat(db[i].simple);
        complete = complete.concat(db[i].complete);
    }

    fs.writeFile("simple_repos.json", JSON.stringify(simple, null, 2), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("simple_repos.json file was saved!");
        }
    });
    fs.writeFile("complete_repos.json", JSON.stringify(complete, null, 2), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("complete_repos.json file was saved!");
        }
    });
}

// Start searching from the first page.
searchGithub(1);
