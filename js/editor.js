const editor = document.getElementById("editor");
let editorPos = 0;
/** @type { Array<Note> } */
let editorNotes = new Array(0);

let editorSnap = 1000 ;

let editorTypingCommand = false;
let editorCommand = "";

class Note {
    lane = 0;
    time = 0;
    length = 0;

    constructor(lane, time, length=0.0) {
        this.lane = lane;
        this.time = time;
        this.length = length;
    }
}

function update() {
    editorNotes.sort((a, b) => a.time != b.time? a.time - b.time : a.lane - b.lane);
    
    editor.innerHTML = `Beat: ${editorPos.toFixed(3)} &NewLine;`;
    for (let i = 0; i < 40; i++) editor.innerHTML += "=";
    editor.innerHTML += "&NewLine;";

    for (let i = 0; i < 8; i++) {
        let pos = -(8 - i) / editorSnap;
        let beatpos = (editorPos + pos);
        editor.innerHTML += `|  ${beatpos < 0? "     " : search(pos)}  | ${beatpos < 0? "" : beatpos.toFixed(3)} &NewLine;`;
    }

    editor.innerHTML += `<mark style="color: #fff; background-color: #f70">| [${search(0)}] | ${editorPos.toFixed(3)}</mark> &NewLine;`

    for (let i = 0; i < Math.floor(editor.clientHeight / 16) - 13; i++) {
        let pos = (i + 1) / editorSnap;
        let beatpos = (editorPos + pos);
        editor.innerHTML += `|  ${search(pos)}  | ${(beatpos).toFixed(3)} &NewLine;`;
    }
}

let colors = [
    "#0c1",
    "#0c1",
    "#0c1",
    "#0c1",
    "#0c1",
]

/**
 * @param { number } index 
 * @returns { string }
 */
function search(index) {
    let notes = ["-","-","-","-","-"];

    let find = 0;
    while (true) {
        if (find >= editorNotes.length)
            break;

        let note = editorNotes[find];
        if (note.time != index + editorPos) {
            if (note.time > index + editorPos) {
                break;
            }
        } else {
            notes[note.lane] = `<mark style="color: #fff; background-color: ${colors[note.lane]}">^</mark>`;
        }

        find++;
    }

    let string = "";
    for (let j = 0; j < 5; j++)
        string = string.concat(notes[j]);

    return string;
}

let keys = ["1", "2", "3", "4", "5"]

update();
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
        editorPos += 1 / editorSnap;
    }
    if (e.key === "ArrowUp") {
        editorPos = Math.max(editorPos - 1 / editorSnap, 0);
    }

    for (let i = 0; i < keys.length; i++) {
        if (e.key == keys[i]) {
            let find = 0;
            let place = true;
            while (true) {
                if (find >= editorNotes.length) {
                    break;
                }

                let note = editorNotes[find];
                if (note.time != editorPos) {
                    if (note.time > editorPos) {
                        break;
                    }
                } else {
                    if (note.lane == i) {
                        editorNotes.splice(find, 1);
                        place = false;
                        break;
                    }
                }

                find++;
            }

            if (place) {
                editorNotes.push(new Note(i, editorPos));
            }

            break;
        }
    }
    update();
});