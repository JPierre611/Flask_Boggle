from boggle import Boggle
from flask import Flask, request, render_template, session, jsonify

app = Flask(__name__)
app.config["SECRET_KEY"] = "this_is_a_secret_key"

boggle_game = Boggle()

@app.route('/')
def homepage():
	"""Display board."""

	board = boggle_game.make_board()
	session["board"] = board
	return render_template("index.html", board=board)
