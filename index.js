const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
app = express();

let redirects = {}

async function getRedirects() {
  redirects = await (await fetch("https://raw.githubusercontent.com/STForScratch/website3/main/data/redirects.json?nocache=" + Date.now().toString())).json()
  return redirects
}
getRedirects()

app.get("/index.js", async function (req, res) {
  res.sendStatus(404);
});

app.get("/style.css", async function (req, res) {
  res.sendFile(path.join(__dirname, "/style.css"));
});

const PORT = 3000;
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);

async function getUsercount() {
  return (
    await (
      await fetch(
        "https://raw.githubusercontent.com/STForScratch/website3/main/data/usercount.json"
      )
    ).json()
  ).count;
}

app.get("/", async function (req, res) {
  res.render(path.join(__dirname, "/pages/index.html"), {
    count: await getUsercount(),
  });
});

app.get("/scratchformat/", async function (req, res) {
  res.sendFile(path.join(__dirname, "/pages/scratchformat.html"));
});

app.get("/goodbye/", async function (req, res) {
  res.sendFile(path.join(__dirname, "/pages/goodbye.html"));
});

app.get("/contributors/", async function (req, res) {
  res.render(path.join(__dirname, "/pages/contributors.html"), {
    credits: btoa(JSON.stringify(await (await fetch("https://raw.githubusercontent.com/STForScratch/website3/main/data/contributors.json")).json()))
  });
});

app.get("/credits/", async function (req, res) {
  res.render(path.join(__dirname, "/pages/contributors.html"), {
    credits: btoa(JSON.stringify(await (await fetch("https://raw.githubusercontent.com/STForScratch/website3/main/data/contributors.json")).json()))
  });
});

app.get("/feedback/", async function (req, res) {
  res.sendFile(path.join(__dirname, "/pages/feedback.html"));
});

app.get("/features/", async function (req, res) {
  res.render(path.join(__dirname, "/pages/features.html"), {
    features: btoa(JSON.stringify(await (await fetch("https://raw.githubusercontent.com/STForScratch/website3/main/data/features.json")).json())),
  });
});

app.get("/discord/", function(req, res) {
  res.redirect("https://discord.gg/rwAs5jDrTQ")
})

app.get("/docs/", function(req, res) {
  res.redirect("https://docs.scratchtools.app/docs/intro")
})

app.get("/blog/", function(req, res) {
  res.redirect("https://docs.scratchtools.app/blog")
})

app.get("/images/:file", function (req, res) {
  res.sendFile(path.join(__dirname, "/images/" + req.params.file));
});

app.get("/cache/", async function(req, res) {
  await getRedirects()
  res.send({
    success: true,
  })
})

app.get("/:code", function(req, res, next) {
  if (redirects[req.params.code]) {
    res.redirect(redirects[req.params.code])
  } else {
    next()
  }
})

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, "/pages/404.html"));
})

app.listen(PORT);
