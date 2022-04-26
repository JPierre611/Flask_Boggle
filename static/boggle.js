class BoggleGame {
  /* make a new game at this board id */

  constructor(boardId) {
    this.score = 0;
    this.words = new Set();
    this.board = $("#" + boardId);
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
}
