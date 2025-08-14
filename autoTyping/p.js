(async function () {

    function autoKeyPress(key) {
        let code, keyCode;
        if (/^[a-z]$/.test(key)) {
            code = "Key" + key.toUpperCase();
            keyCode = key.charCodeAt() - 32;
        } else if (" " == key) {
            code = "Space";
            keyCode = 32;
        } else {
            code = "Minus";
            keyCode = 189;
        }

        const o = { key, code, keyCode };

        document.dispatchEvent(new KeyboardEvent("keydown", o));
        document.dispatchEvent(new KeyboardEvent("keyup", o));
    }

    while (1) {
        await new Promise(async or => {

            let syllable = null;

            await new Promise(rs => {
                const id = setInterval(() => {
                    syllable = document.querySelector(".syllable");
                    if (syllable) {
                        clearInterval(id);
                        rs();
                    } else {
                        // スペースキーを押してスタート
                        autoKeyPress(" ");
                    }
                });
            }).then(async () => {

                function getString() {
                    return Array.from(syllable.children).map(e => e.children[0].textContent).join("").toLowerCase();
                }

                // 現在タイプする文字列
                let currentString = "";

                // 20問分
                for (let i = 0; i < 20; i++) {

                    await new Promise(rs => {
                        const id = setInterval(() => {

                            // タイプする文字列を取得
                            const string = getString();

                            // 更新されているか
                            if (currentString != string) {

                                clearInterval(id);
                                rs();

                                currentString = string;
                                const len = currentString.length;
                                // キー入力
                                for (let i = 0; i < len; i++) {
                                    autoKeyPress(currentString[i]);
                                }
                            }
                        });
                    });
                }

                await new Promise(rs => {
                    const id = setInterval(() => {

                        // リザルト画面に移ったか
                        if (document.querySelector("[class^=ExpBar")) {
                            clearInterval(id);
                            rs();
                        }
                    });
                }).then(() => {
                    const id = setInterval(() => {

                        // リトライキー
                        autoKeyPress("r");

                        // タイピング画面に移ったか
                        if (document.querySelector(".space")) {
                            clearInterval(id);
                            or();
                        }
                    });
                });
            });
        });
    }
})();
