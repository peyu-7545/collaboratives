(async function () {
    const nextButtonClick = () => document.querySelector("button[class^=RaisedButton]").click();
    const getURL = () => location.href.split("/").at(-1);
    const roundNums = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿";
    const answers = [];
    const coolTime = 50;
    function getAnswer() {
        return new Promise(rs1 => {
            const currentURL = getURL();
            const mulChoice = document.querySelector("button[class*=QuizMultipleChoice]");
            let dropChoice;
            if (mulChoice) {
                mulChoice.click();
            } else {
                [...(dropChoice = document.querySelectorAll("div[class^=QuizDropdown__Menu]"))].forEach(e => e.children[0].click());
            }
            new Promise(rs2 => {
                const interval_1 = setInterval(() => {
                    nextButtonClick();
                    if (ans = [...document.querySelectorAll("p")].find(e => e.textContent.startsWith("正解："))?.textContent.slice(3)) {
                        answers[currentURL - 1] = dropChoice ? ans.split("，").map(e => e.split("　").at(-1).toLowerCase()).map(e => [...dropChoice[0].children].map(p => p.children[0].textContent).indexOf(e)) : roundNums.search(ans);
                        clearInterval(interval_1);
                        rs2();
                    }
                }, coolTime);
            }).then(() => {
                const interval_2 = setInterval(() => {
                    if (currentURL == getURL()) {
                        nextButtonClick();
                    } else {
                        clearInterval(interval_2);
                        rs1();
                    }
                }, coolTime);
            });
        });
    }
    while (true) {
        await getAnswer();
        if (getURL() == "result") break;
    }
    new Promise(rs3 => {
        const interval_3 = setInterval(() => {
            if (getURL() == "result") {
                nextButtonClick();
            } else {
                clearInterval(interval_3);
                rs3();
            }
        }, coolTime);
    }).then(async () => {
        while (true) {
            const currentURL = getURL();
            if (currentURL == "result") break;
            const currentAnswer = answers[currentURL - 1];
            if (typeof currentAnswer == "number") {
                currentAnswer && document.querySelectorAll("button[class*=QuizMultipleChoice]")[currentAnswer].click();
            } else {
                currentAnswer.some(e => e) && [...document.querySelectorAll("div[class^=QuizDropdown__Menu]")].forEach((e, i) => e.children[currentAnswer[i]].click());
            }
            await new Promise(rs4 => {
                const interval_4 = setInterval(() => {
                    if (getURL() == currentURL) {
                        nextButtonClick();
                    } else {
                        clearInterval(interval_4);
                        rs4();
                    }
                }, coolTime);
            });
        }
    });
})();
