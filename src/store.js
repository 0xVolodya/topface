class Store {

    constructor(name) {
        this._dbName = name;

        let data = {
            notes: [],
        };

        localStorage[name] = JSON.stringify(data);

    }

    save(updateData, callbacks) {
        let data = JSON.parse(localStorage[this._dbName]);

        let notes = data.notes;

        updateData.id = new Date().getTime();
        updateData.hashtags = [];
        notes.push(updateData);
        localStorage[this._dbName] = JSON.stringify(data);

        callbacks.call(this, [updateData])
    }

    findAll(callback) {
        callback.call(this, JSON.parse(localStorage[this._dbName]).notes);
    }

    findNotesByTag(tag, callback) {
        let data = JSON.parse(localStorage[this._dbName]);

        let notes = data.notes;
        let findNotes = [];

        const len = notes.length;
        let currentNotes = [];
        for (let i = 0; i < len; i++) {
            console.log(notes[i].hashtags.indexOf(tag));
            console.log(tag);
            if (notes[i].hashtags.indexOf(tag) != -1)
                currentNotes.push(notes[i]);
        }

        callback.call(this, currentNotes)
    }

    find(id, callback) {
        let data = JSON.parse(localStorage[this._dbName]);
        let notes = data.notes;
        // console.log(JSON.stringify(data));
        let findId = {};

        const len = notes.length;
        for (let i = 0; i < len; i++) {
            // console.log(id);
            if (notes[i].id == id) {
                findId = notes[i];
                break;
            }
        }
        callback.call(this, findId);
    }

    remove(id, callbacks) {
        let data = JSON.parse(localStorage[this._dbName]);
        let notes = data.notes;
        // console.log(JSON.stringify(data));

        const len = notes.length;
        for (let i = 0; i < len; i++) {
            // console.log(id);
            if (notes[i].id == id) {
                notes.splice(i, 1);
                break;
            }
        }
        // console.log(JSON.stringify(data));
        localStorage[this._dbName] = JSON.stringify(data);

        callbacks.call(this);
    }

    update(id, title, hashtags, callback) {
        let data = JSON.parse(localStorage[this._dbName]);
        let notes = data.notes;
        // console.log(JSON.stringify(data));

        const len = notes.length;
        for (let i = 0; i < len; i++) {
            // console.log(id);
            if (notes[i].id == id) {
                notes[i].title = title;
                notes[i].hashtags = hashtags;
            }
        }
        localStorage[this._dbName] = JSON.stringify(data);

        callback.call(this);
    }

    createFirst(id) {
        let data = JSON.parse(localStorage[this._dbName]);

        let notes = data.notes;

        notes.push({
            id: id,
            hashtags:[],
            title:""
        })

    }
}