from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)
app.config["DEBUG"] = True

comments = []

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("go_page.html", comments=comments)
    elif request.method == "POST":
        return






# app = Flask(__name__)
# app.config["DEBUG"] = True

# comments = []

# @app.route("/", methods=["GET", "POST"])
# def index():
#     if request.method == "GET":
#         return render_template("go_page.html", comments=comments)
#     elif request.method == "POST":
#         comments.append(request.form["contents"])
#         return redirect(url_for('index'))

