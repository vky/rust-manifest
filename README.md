# Rust Manifest

An automatically updating list of Rust projects on Github.

## TODO

* Present collected data in nice HTML
* How to store data
* How to use OAuth
* Allow people to add Rust projects not found by search
* Rewrite in Rust

## Presentation description

Seperate out projects that have been updated in the past month and those that have not.

Active (updated since most recent Rust versioned release)

Inactive (last update before most recent Rust versioned release)

project name | author | build status | last commit / date | [ docs ] | forks | star

* project name should link to the project page,
* author to the author's github page
* automatically insert travis ci link for repo even if it doesn't exist.
* last commit to the commits page
* Fork and star do what they would do if one is logged into github. Show the number and icon for both.
* docs will do nothing. I may attempt to run rustdoc on projects automatically/manually, but do that after the core listing processes work.


One big table.

Once the list is in place and works, consider the following:

* tagging projects
* average project rating (1-5 rust icons)

## Problems

astavonin/RustyKext is an example Rust project that won't be found with the criteria of a Rust language project created after 2010 because it is majority C. Need a way for people to add projects not found by search.

## First commit in Rust repo, search criteria setup around this

commit c01efc669f09508b55eced32d3c88702578a7c3e
Author: Graydon Hoare <graydon@mozilla.com>
Date:   Wed Jun 16 14:30:45 2010 -0700

    Initial git commit.
