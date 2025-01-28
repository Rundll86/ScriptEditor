import flask

app = flask.Flask(__name__)


@app.route("/")
def index():
    return flask.redirect("/index.html")


@app.route("/<path:page>")
def root(page):
    return flask.send_file("dist/" + page)


app.run("0.0.0.0", 19198)
