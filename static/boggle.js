class BoggleGame {
  /* make a new game at this board id */

  constructor(boardId, secs = 60) {
    this.secs = secs;     // time length of game
    this.showTimer();

    this.score = 0;
    this.words = new Set();
    this.board = $("#" + boardId);

    // "tick", every 1000 mse
    this.timer = setInterval(this.tick.bind(this), 1000);

    $(".submit", this.board).on("click", this.handleSubmit.bind(this));
  }

  showWord(word) {
    /* show word in list of words */
    $(".words", this.board).append($("<li>", { text: word }));
  }

  showScore() {
    /* show game score */
    $(".score", this.board).text(this.score);
  }

  showMessage(msg, cls) {
    /* show a status message */
    $(".msg", this.board).text(msg).removeClass().addClass(`msg ${cls}`);
  }

  showTimer() {
    /* show uptated timer in DOM */
    $(".timer", this.board).text(this.secs);
  }

  async handleSubmit(evt) {
    /* handle word submission: if unique and valid, score and show */
    evt.preventDefault();
    const $word = $(".word", this.board);

    let word = $word.val();
    if (!word) return;

    if (this.words.has(word)) {
      this.showMessage(`Already found ${word}`, "err");
      return;
    }

    /* chek server for validity */
    const resp = await axios.get("/check-word", { params: { word: word }});
    if (resp.data.result === "not-word") {
      this.showMessage(`${word} is not a valid English word`, "err")
    } else if (resp.data.result === "not-on-board") {
      this.showMessage(`${word} is not a valid word on this board`, "err");
    } else {
      this.showWord(word);
      this.score += word.length;
      this.showScore();
      this.words.add(word);
      this.showMessage(`Added: ${word}`, "ok")
    }

    $word.val("").focus();
  }

  async tick() {
    /* Handle a second passing in game. */
    this.secs -= 1;
    this.showTimer();

    if (this.secs === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }

  async scoreGame() {
    /* End of game: score and update message. */
    $(".guess", this.board).hide();    // hide the form
    const resp = await axios.post("/post-score", { score: this.score });
    if (resp.data.brokeRecord) {
      this.showMessage(`New record: ${this.score}`, "ok");
    } else {
      this.showMessage(`Final score: ${this.score}`, "ok");
    }
  }
}
