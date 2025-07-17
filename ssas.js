async function solve() {
    const nextButtonClick = () => document.querySelector("button[class^=RaisedButton]").click();
    const getURL = () => window.location.href.split("/").at(-1);
    const answers = {};

    // 答えを取得する
    function getAnswer() {

        // 現在のURL
        const currentURL = getURL();

        // 答えが取得できたら解決
        return new Promise(rs => {

            // クイズボタンがあるか確認
            const quizButtons = document.querySelector("button[class*=QuizMultipleChoice]");
            const isOnly = quizButtons !== null;
            let choice;

            if (isOnly) {

                // 答えが一つ
                quizButtons.click();
            } else {

                const selects = [...document.querySelectorAll("div[class^=QuizDropdown__Menu]")];

                // 複数(全ての解答欄で最初の選択肢をクリックする)
                selects.forEach(e => e.children[0].click());
                choice = [...selects[0].children].map(e => e.children[0].textContent);
            }

            // 正解が出現するまでループ
            const interval1 = setInterval(() => {

                // 「解答する」ボタンをクリックし続ける
                nextButtonClick();

                // 答えがある要素
                const answerElement = [...document.querySelectorAll("p")].find(e => e.textContent.startsWith("正解："));

                // 要素が存在するか
                if (answerElement) {

                    // "正解："の後を切り取る
                    const answer = answerElement.textContent.slice(3);

                    if (isOnly) {

                        // 答えが1つのみの場合(丸数字)
                        const roundNums = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿";
                        answers[currentURL] = roundNums.indexOf(answer);

                    } else {

                        // 答えが複数の場合
                        const convert = answer.split("，").map(e => e.split("　").at(-1).toLowerCase());
                        answers[currentURL] = convert.map(e => choice.indexOf(e));
                    }

                    // URL遷移
                    const interval2 = setInterval(() => {
                        if (currentURL == getURL()) {

                            // URLが同じなら次へ進むボタンを押し続ける
                            nextButtonClick();
                        } else {

                            // 次へ進んだので解決
                            rs();
                        }
                    });

                    // ループは切る
                    clearInterval(interval1);
                }
            });
        });
    }

    // 答えを送信する
    function submitAnswer() {

        return new Promise(rs => {
            const currentURL = getURL();
            const isLast = currentURL == Object.keys(answers).at(-1);
            const currentAnswer = answers[currentURL];

            if (typeof currentAnswer == "number") {
                // 数値(答えが1つ)
                document.querySelectorAll("button[class*=QuizMultipleChoice]")[currentAnswer].click();
            } else {
                // 答えが複数
                [...document.querySelectorAll("div[class^=QuizDropdown__Menu]")].forEach((e, i) => e.children[currentAnswer[i]].click());
            }

            // URL遷移
            const interval3 = setInterval(() => {
                if (currentURL == getURL()) {
                    nextButtonClick();
                } else {
                    clearInterval(interval3);
                    rs();
                }
            }, isLast && 3000);
        });
    }

    // 答えを取得する
    while (true) {
        await getAnswer();

        // 結果画面に到達したら終了
        if (getURL() == "result") {
            break;
        }
    }

    // 答えを送信する
    while (true) {
        await submitAnswer();

        // 結果画面に到達したら終了
        if (getURL() == "result") {
            break;
        }
    }
}
