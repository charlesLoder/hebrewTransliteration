---
title: About
description: "About the site"
layout: "page.njk"
---

##### The Author

My name is Charles Loder, and I'm a web developer by trade and a Hebraist by training. I received an
MA in Jewish Studies from Rutgers University and currently work as a frontend developer. JavaScript
and Hebrew are my favorite languages to learn.

<div class="dropdown-divider my-15"></div>

##### The Site

This site is a user interface for the
<a href="https://www.npmjs.com/package/hebrew-transliteration" target="_blank" rel="noopener noreferrer">
hebrew transliteration </a> node package. It can be fully customized to meet your transliteration
needs.

<div class="dropdown-divider my-15"></div>

##### Transliteration

Though the advent of Unicode has allowed many scripts to live in the digital world, transliteration
is still useful. To learn more about transliteration, checkout this blog post
<a href="https://taatik.org/blog/what-is-transliteration/" target="_blank" rel="noopener noreferrer">
here.</a>

<div class="dropdown-divider my-15"></div>

##### Other uses

Besides the main page, the JavaScript package can be embedded in web pages to provide an interactive
experience. When you click on the Hebrew text —
<span class="heb-text-area" style="cursor: pointer;">שָׁלֹום</span>— it is transliterated. This opens
up opportunities for eBooks and web pages to include transliteration without manually having to
create them.

<div class="dropdown-divider my-15"></div>

##### The Structure Page

The <a href='{{ "/structure" | url }}'>Structure</a> page is designed to help break up verses into
readable chunks based on the taamim (i.e. cantillation or accents).

It was designed by [Doug Smith](https://mbts.academia.edu/DougSmith) and developed with his input.

The current version only supports a limited number of taamim for prose texts.

<script src="/assets/about.js"></script>
