from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)
app.config["DEBUG"] = True
SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{stagomon}:{commentsdb}@{hostname}/{databasename}".format(
    username="the username from the 'Databases' tab",
    password="the password you set on the 'Databases' tab",
    hostname="the database host address from the 'Databases' tab",
    databasename="the database name you chose, probably yourusername$comments",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


comments = []

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("main_page.html", comments=comments)
    elif request.method == "POST":
        comments.append(request.form["contents"])
        return redirect(url_for('index'))

