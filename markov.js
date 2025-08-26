/**
 * 与えられたテキストからマルコフ連鎖モデルを作成し、それにしたがってテキストを生成する
 * @param {String} text 入力テキストデータ
 * @param {Number} maxLen 生成する文字列の最大長
 * @example createMarkovChain("しかのこのこのここしたんたん",30);
 */
function createMarkovChain(text, maxLen) {

    // 単語ごとに分割する
    const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
    const split = Array.from(segmenter.segment(text), e => e.segment);

    // 文章中の単語について、次にどの単語が来るかを調べる
    const markovChain = {};
    const len = split.length;

    for (let i = 0; i < len; i++) {

        // 処理中の単語
        const current = split[i];
        const next = split[(i + 1) % len];

        // データを追加
        markovChain[current] ??= [];
        markovChain[current].push(next);
    }

    // テキストを生成
    let current = split[0];
    let str = current;

    // テキストの長さが超過するまで
    while (true) {

        // 現在の単語から、次の単語をランダムに選ぶ
        const c = markovChain[current];
        current = c[Math.random() * c.length | 0];

        // 長さが超えていたら終了
        if (str.length + current.length > maxLen) {
            console.log(str);
            break;
        }

        str += current;
    }
}

/*
    注意！！
    テキストにオブジェクトのプロパティ名が含まれている場合、正常に動作しないことがあります。
    特に"constructor"が含まれていると、エラーが発生する可能性があります。
    取り敢えず日本語の文章なら平気です。

    改善案:Mapで実装
*/